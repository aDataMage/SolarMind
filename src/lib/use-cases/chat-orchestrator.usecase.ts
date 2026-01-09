/**
 * Chat Orchestrator Use Case
 * 
 * Coordinates the multi-agent workflow by:
 * 1. Invoking the Router Agent to classify user intent
 * 2. Dispatching to appropriate specialist agents
 * 3. Merging responses from multiple agents
 * 4. Handling errors with retry logic and fallbacks
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 7.1, 7.2, 7.3, 7.4
 */

import type { Message, Intent, AgentSource } from '@/lib/domain/models/message';
import { routeMessage, getAgentsForIntents, type RouterAgentOutput } from '@/lib/infrastructure/ai/agents/router-agent';
import { handleTechnicalQuery, type SalesEngineerOutput } from '@/lib/infrastructure/ai/agents/sales-engineer-agent';
import { handleSupportQuery, type CustomerSuccessOutput } from '@/lib/infrastructure/ai/agents/customer-success-agent';

/** Input for the Chat Orchestrator */
export interface OrchestratorInput {
  /** The user's message */
  message: string;
  /** Previous conversation history */
  conversationHistory: Message[];
  /** Session identifier for tracking */
  sessionId: string;
}

/** Output from the Chat Orchestrator */
export interface OrchestratorOutput {
  /** The merged response from all invoked agents */
  response: string;
  /** List of agents that were invoked */
  agentsInvoked: AgentSource[];
  /** Total processing time in milliseconds */
  processingTimeMs: number;
  /** The classified intents */
  intents?: Intent[];
  /** Whether clarification was requested */
  requiresClarification?: boolean;
}

/** Response from an individual agent */
interface AgentResponse {
  agent: AgentSource;
  response: string;
  success: boolean;
  processingTimeMs: number;
}

/** Configuration for retry behavior */
interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

/** Error types for categorization */
type ErrorType = 'rate_limit' | 'timeout' | 'unavailable' | 'invalid_response' | 'unknown';

/** Categorized error with additional context */
interface CategorizedError {
  type: ErrorType;
  message: string;
  retryable: boolean;
  originalError: Error;
}

/** Default retry configuration */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 1,
  baseDelayMs: 500,
  maxDelayMs: 2000,
};

/** Fallback contact information */
const FALLBACK_CONTACT_INFO = `
For immediate assistance, please contact us:
📞 Phone: +234 800 SOLAR (76527)
📧 Email: support@solarcompany.ng
💬 WhatsApp: +234 800 123 4567
🏪 Visit: solarcompany.ng/locations
`;

/** Fallback response when all agents fail */
const FALLBACK_RESPONSE = `I apologize, but I'm experiencing some technical difficulties at the moment. Our team is working to resolve this.

${FALLBACK_CONTACT_INFO}
We appreciate your patience and look forward to assisting you soon.`;

/** Response when LLM provider is unavailable (Requirement 7.3) */
const PROVIDER_UNAVAILABLE_RESPONSE = `I apologize, but our AI service is temporarily unavailable. Your message has been noted and we'll process it as soon as possible.

In the meantime, you can reach us directly:
${FALLBACK_CONTACT_INFO}
We typically resolve these issues within a few minutes. Thank you for your patience!`;

/** Response for rate limiting */
const RATE_LIMIT_RESPONSE = `We're experiencing high demand right now. Please wait a moment and try again.

If you need immediate assistance:
${FALLBACK_CONTACT_INFO}
Thank you for your understanding!`;

/**
 * Chat Orchestrator class that coordinates multi-agent interactions
 */
export class ChatOrchestrator {
  private retryConfig: RetryConfig;

  constructor(retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG) {
    this.retryConfig = retryConfig;
  }

  /**
   * Processes a user message through the multi-agent system
   * 
   * @param input - The user message, conversation history, and session ID
   * @returns The orchestrated response with metadata
   */
  async processMessage(input: OrchestratorInput): Promise<OrchestratorOutput> {
    const startTime = Date.now();
    const { message, conversationHistory, sessionId } = input;

    try {
      // Step 1: Route the message to classify intents
      const routerResult = await this.invokeRouterWithRetry(message, conversationHistory);

      // If clarification is needed, return the clarification prompt
      if (routerResult.requiresClarification && routerResult.clarificationPrompt) {
        return {
          response: routerResult.clarificationPrompt,
          agentsInvoked: ['router'],
          processingTimeMs: Date.now() - startTime,
          intents: routerResult.intents,
          requiresClarification: true,
        };
      }

      // Step 2: Determine which agents to invoke
      const agentsToInvoke = getAgentsForIntents(routerResult.intents);

      // Step 3: Invoke specialist agents in parallel
      const agentResponses = await this.invokeSpecialistAgents(
        agentsToInvoke,
        message,
        routerResult.intents,
        conversationHistory
      );

      // Step 4: Merge responses from multiple agents
      const mergedResponse = await this.mergeResponses(agentResponses, routerResult.intents);

      const agentsInvoked: AgentSource[] = ['router', ...agentResponses.map(r => r.agent)];

      return {
        response: mergedResponse,
        agentsInvoked,
        processingTimeMs: Date.now() - startTime,
        intents: routerResult.intents,
        requiresClarification: false,
      };
    } catch (error) {
      // Categorize the error for appropriate handling
      const categorizedError = this.categorizeError(error);

      // Log error with context for debugging (Requirement 7.4)
      console.error('Chat Orchestrator error:', {
        sessionId,
        message: message.substring(0, 100),
        errorType: categorizedError.type,
        errorMessage: categorizedError.message,
        retryable: categorizedError.retryable,
        timestamp: new Date().toISOString(),
        stack: categorizedError.originalError.stack,
      });

      // Return appropriate fallback response based on error type (Requirement 7.2, 7.3)
      return {
        response: this.getFallbackResponseForError(categorizedError),
        agentsInvoked: [],
        processingTimeMs: Date.now() - startTime,
        requiresClarification: false,
      };
    }
  }

  /**
   * Invokes the Router Agent with retry logic
   */
  private async invokeRouterWithRetry(
    message: string,
    conversationHistory: Message[]
  ): Promise<RouterAgentOutput> {
    return this.withRetry(
      () => routeMessage({ message, conversationHistory }),
      'Router Agent'
    );
  }

  /**
   * Invokes specialist agents based on classified intents
   */
  private async invokeSpecialistAgents(
    agents: ('sales_engineer' | 'customer_success')[],
    message: string,
    intents: Intent[],
    conversationHistory: Message[]
  ): Promise<AgentResponse[]> {
    const agentPromises = agents.map(async (agent): Promise<AgentResponse> => {
      const startTime = Date.now();

      try {
        if (agent === 'sales_engineer') {
          // Extract entities for technical queries
          const technicalIntent = intents.find(i => i.type === 'technical_sizing');
          const extractedEntities = technicalIntent?.extractedEntities;

          const result = await this.withRetry(
            () => handleTechnicalQuery({
              message,
              extractedEntities: extractedEntities ? { appliances: extractedEntities.appliances } : undefined,
              conversationHistory,
            }),
            'Sales Engineer Agent'
          );

          return {
            agent: 'sales_engineer',
            response: result.response,
            success: true,
            processingTimeMs: Date.now() - startTime,
          };
        } else {
          // Extract entities for support queries
          const supportIntent = intents.find(i => i.type === 'support_inquiry' || i.type === 'general');
          const extractedEntities = supportIntent?.extractedEntities;

          const result = await this.withRetry(
            () => handleSupportQuery({
              message,
              extractedEntities: extractedEntities ? {
                location: extractedEntities.location,
                topic: extractedEntities.topic,
              } : undefined,
              conversationHistory,
            }),
            'Customer Success Agent'
          );

          return {
            agent: 'customer_success',
            response: result.response,
            success: true,
            processingTimeMs: Date.now() - startTime,
          };
        }
      } catch (error) {
        console.error(`${agent} agent failed:`, error);

        return {
          agent: agent === 'sales_engineer' ? 'sales_engineer' : 'customer_success',
          response: '',
          success: false,
          processingTimeMs: Date.now() - startTime,
        };
      }
    });

    return Promise.all(agentPromises);
  }

  /**
   * Merges responses from multiple agents into a cohesive reply
   * Requirement 4.2, 4.3: Merge responses maintaining logical flow without redundancy
   */
  private async mergeResponses(
    responses: AgentResponse[],
    intents: Intent[]
  ): Promise<string> {
    // Filter successful responses
    const successfulResponses = responses.filter(r => r.success && r.response.trim());

    // If no successful responses, return fallback
    if (successfulResponses.length === 0) {
      return FALLBACK_RESPONSE;
    }

    // If only one response, return it directly
    if (successfulResponses.length === 1) {
      return successfulResponses[0].response;
    }

    // Multiple responses need merging
    return this.combineMultipleResponses(successfulResponses, intents);
  }

  /**
   * Combines multiple agent responses into a single coherent message
   */
  private combineMultipleResponses(
    responses: AgentResponse[],
    intents: Intent[]
  ): string {
    // Sort responses: technical first, then support
    const sortedResponses = [...responses].sort((a, b) => {
      if (a.agent === 'sales_engineer' && b.agent === 'customer_success') return -1;
      if (a.agent === 'customer_success' && b.agent === 'sales_engineer') return 1;
      return 0;
    });

    // Clean and combine responses
    const cleanedResponses = sortedResponses.map((r, index) => {
      let response = r.response;

      // Remove duplicate greetings from subsequent responses
      if (index > 0) {
        response = this.removeGreetings(response);
      }

      // Remove duplicate sign-offs from non-final responses
      if (index < sortedResponses.length - 1) {
        response = this.removeSignOffs(response);
      }

      return response.trim();
    });

    // Join with a transition
    const hasTechnical = sortedResponses.some(r => r.agent === 'sales_engineer');
    const hasSupport = sortedResponses.some(r => r.agent === 'customer_success');

    if (hasTechnical && hasSupport) {
      // Add a transition between technical and support content
      const technicalResponse = cleanedResponses.find((_, i) => sortedResponses[i].agent === 'sales_engineer') || '';
      const supportResponse = cleanedResponses.find((_, i) => sortedResponses[i].agent === 'customer_success') || '';

      return `${technicalResponse}\n\n---\n\n${supportResponse}`;
    }

    return cleanedResponses.join('\n\n');
  }

  /**
   * Removes common greeting patterns from a response
   */
  private removeGreetings(response: string): string {
    const greetingPatterns = [
      /^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening))[\s,!.]*\n*/i,
      /^(thank you for (reaching out|contacting us|your (question|inquiry)))[\s,!.]*\n*/i,
      /^(i('d| would) be happy to help)[\s,!.]*\n*/i,
      /^(great question!)[\s,!.]*\n*/i,
    ];

    let cleaned = response;
    for (const pattern of greetingPatterns) {
      cleaned = cleaned.replace(pattern, '');
    }

    return cleaned.trim();
  }

  /**
   * Removes common sign-off patterns from a response
   */
  private removeSignOffs(response: string): string {
    const signOffPatterns = [
      /\n*(is there anything else (i can help (you )?with|you('d| would) like to know))\?*[\s!.]*$/i,
      /\n*(let me know if you (have|need) (any )?(more |other )?questions)[\s!.]*$/i,
      /\n*(feel free to (ask|reach out) if you need (anything|more help))[\s!.]*$/i,
      /\n*(i('m| am) here (to help|if you need anything))[\s!.]*$/i,
    ];

    let cleaned = response;
    for (const pattern of signOffPatterns) {
      cleaned = cleaned.replace(pattern, '');
    }

    return cleaned.trim();
  }

  /**
   * Executes a function with retry logic and exponential backoff
   * Requirement 7.1: Retry once before falling back
   */
  private async withRetry<T>(
    fn: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        console.warn(`${operationName} attempt ${attempt + 1} failed:`, lastError.message);

        if (attempt < this.retryConfig.maxRetries) {
          // Calculate delay with exponential backoff
          const delay = Math.min(
            this.retryConfig.baseDelayMs * Math.pow(2, attempt),
            this.retryConfig.maxDelayMs
          );

          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error(`${operationName} failed after ${this.retryConfig.maxRetries + 1} attempts`);
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Categorizes an error to determine appropriate handling
   * Requirement 7.3, 7.4: Proper error categorization for logging and response
   */
  private categorizeError(error: unknown): CategorizedError {
    const err = error instanceof Error ? error : new Error(String(error));
    const message = err.message.toLowerCase();

    // Rate limit errors
    if (message.includes('rate limit') || message.includes('429') || message.includes('too many requests')) {
      return {
        type: 'rate_limit',
        message: 'Rate limit exceeded',
        retryable: true,
        originalError: err,
      };
    }

    // Timeout errors
    if (message.includes('timeout') || message.includes('timed out') || message.includes('etimedout')) {
      return {
        type: 'timeout',
        message: 'Request timed out',
        retryable: true,
        originalError: err,
      };
    }

    // Service unavailable errors
    if (
      message.includes('unavailable') ||
      message.includes('503') ||
      message.includes('502') ||
      message.includes('connection') ||
      message.includes('econnrefused') ||
      message.includes('network')
    ) {
      return {
        type: 'unavailable',
        message: 'Service unavailable',
        retryable: true,
        originalError: err,
      };
    }

    // Invalid response errors
    if (message.includes('invalid') || message.includes('parse') || message.includes('json')) {
      return {
        type: 'invalid_response',
        message: 'Invalid response from service',
        retryable: true,
        originalError: err,
      };
    }

    // Unknown errors
    return {
      type: 'unknown',
      message: err.message,
      retryable: false,
      originalError: err,
    };
  }

  /**
   * Gets the appropriate fallback response based on error type
   * Requirement 7.2, 7.3: Context-appropriate fallback responses
   */
  private getFallbackResponseForError(categorizedError: CategorizedError): string {
    switch (categorizedError.type) {
      case 'rate_limit':
        return RATE_LIMIT_RESPONSE;
      case 'unavailable':
      case 'timeout':
        return PROVIDER_UNAVAILABLE_RESPONSE;
      default:
        return FALLBACK_RESPONSE;
    }
  }
}

/**
 * Creates a new Message object
 */
export function createMessage(
  role: Message['role'],
  content: string,
  metadata?: Message['metadata']
): Message {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    role,
    content,
    timestamp: new Date(),
    metadata,
  };
}

/**
 * Default orchestrator instance
 */
export const chatOrchestrator = new ChatOrchestrator();
