/**
 * Customer Success Agent - Support and Knowledge Base Queries
 * 
 * Handles support queries using RAG-based knowledge retrieval for
 * policies, shop locations, FAQs, and general information.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.2
 */

import { generateText, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import type { Message } from '@/lib/domain/models/message';
import {
  knowledgeSearchTool,
  locationSearchTool,
  policySearchTool,
} from '../tools/knowledge-tools';

/** Input for the Customer Success Agent */
export interface CustomerSuccessInput {
  /** The user's message */
  message: string;
  /** Entities extracted by the router (optional) */
  extractedEntities?: {
    location?: string;
    topic?: string;
  };
  /** Previous conversation history for context */
  conversationHistory: Message[];
}

/** Output from the Customer Success Agent */
export interface CustomerSuccessOutput {
  /** The generated response */
  response: string;
  /** Tools that were called during processing */
  toolsCalled: string[];
  /** Processing time in milliseconds */
  processingTimeMs: number;
  /** Whether knowledge was found for the query */
  knowledgeFound: boolean;
}

/**
 * System prompt for the Customer Success Agent
 * Configured for empathetic and polite tone per Requirement 6.2
 */
const CUSTOMER_SUCCESS_SYSTEM_PROMPT = `You are a Customer Success Representative at a solar energy company in Nigeria. Your role is to provide helpful, friendly support to customers with questions about our company, policies, shop locations, and general information.

## Your Expertise
- Company policies (warranty, returns, service agreements)
- Shop locations and opening hours
- Product information and FAQs
- General customer support

## Communication Style
- Be warm, empathetic, and polite in all interactions
- Use a friendly, conversational tone
- Show understanding of customer concerns
- Be patient and thorough in your explanations
- Express gratitude for customer inquiries

## Tools Available
You have access to three tools:

1. **knowledgeSearch** - Use this to search the knowledge base for:
   - General information and FAQs
   - Product details
   - Any topic not covered by specific tools
   
2. **locationSearch** - Use this when customers ask about:
   - Shop locations and addresses
   - Opening hours
   - Directions or how to visit

3. **policySearch** - Use this when customers ask about:
   - Warranty terms and coverage
   - Return and refund policies
   - Service agreements
   - Terms and conditions

## Guidelines
- ALWAYS use the appropriate tool to search for information before responding
- If you find relevant information, present it clearly and helpfully
- If no information is found, acknowledge this honestly and offer alternatives
- Never make up information - only use what you find in the knowledge base
- For technical questions about solar sizing or calculations, politely redirect to our technical team
- Prices are in Nigerian Naira (NGN)

## Response Format
Structure your responses to be:
1. Warm and welcoming
2. Clear and informative
3. Helpful with next steps when appropriate

## When Information is Not Found
If you cannot find the information the customer needs:
- Acknowledge that you don't have that specific information
- Offer to connect them with human support
- Provide contact information:
  - Phone: +234 800 SOLAR (76527)
  - Email: support@solarcompany.ng
  - WhatsApp: +234 800 123 4567

Never expose internal system details or mention that you are an AI agent.`;

/**
 * Fallback response when knowledge base is unavailable or no results found
 */
const FALLBACK_RESPONSE = `I appreciate you reaching out! While I wasn't able to find specific information about your question in our knowledge base, I'd love to help you get the answers you need.

Here are some ways to get assistance:

📞 **Phone Support**: +234 800 SOLAR (76527)
   Available Monday-Saturday, 8am-6pm

📧 **Email**: support@solarcompany.ng
   We typically respond within 24 hours

💬 **WhatsApp**: +234 800 123 4567
   For quick questions and updates

🏪 **Visit Us**: Find your nearest showroom at solarcompany.ng/locations

Our team will be happy to assist you with any questions about our products, services, or policies. Is there anything else I can help you with in the meantime?`;

/**
 * Handles support queries using RAG retrieval from the knowledge base
 * 
 * @param input - The user message, extracted entities, and conversation history
 * @returns The generated response with tool usage metadata
 */
export async function handleSupportQuery(input: CustomerSuccessInput): Promise<CustomerSuccessOutput> {
  const startTime = Date.now();
  const { message, extractedEntities, conversationHistory } = input;

  // Build context from conversation history (last 5 messages)
  const recentHistory = conversationHistory.slice(-5);
  const historyContext = recentHistory.length > 0
    ? `\n\nRecent conversation:\n${recentHistory.map(m => `${m.role}: ${m.content}`).join('\n')}`
    : '';

  // Add extracted entities context if available
  let entitiesContext = '';
  if (extractedEntities?.location) {
    entitiesContext += `\nNote: The customer mentioned location: ${extractedEntities.location}`;
  }
  if (extractedEntities?.topic) {
    entitiesContext += `\nNote: The customer is asking about: ${extractedEntities.topic}`;
  }

  const toolsCalled: string[] = [];
  let knowledgeFound = false;

  try {
    const result = await generateText({
      model: openai('gpt-4o'),
      system: CUSTOMER_SUCCESS_SYSTEM_PROMPT,
      prompt: `Customer inquiry: "${message}"${historyContext}${entitiesContext}

Please help this customer with their question. Use the available tools to:
1. Search for relevant information in our knowledge base
2. Find shop locations if they're asking about where to visit
3. Look up policies if they're asking about warranties, returns, etc.

Provide a warm, helpful response based on what you find.`,
      tools: {
        knowledgeSearch: knowledgeSearchTool,
        locationSearch: locationSearchTool,
        policySearch: policySearchTool,
      },
      stopWhen: stepCountIs(5), // Allow up to 5 steps for multi-tool calls
      onStepFinish: ({ toolCalls, toolResults }) => {
        if (toolCalls) {
          for (const call of toolCalls) {
            if (!toolsCalled.includes(call.toolName)) {
              toolsCalled.push(call.toolName);
            }
          }
        }
        // Check if any tool found results
        if (toolResults) {
          for (const toolResult of toolResults) {
            // Access the result property safely
            const resultValue = 'result' in toolResult ? toolResult.result : undefined;
            if (typeof resultValue === 'object' && resultValue !== null) {
              const resultObj = resultValue as { found?: boolean };
              if (resultObj.found === true) {
                knowledgeFound = true;
              }
            }
          }
        }
      },
    });

    const processingTimeMs = Date.now() - startTime;

    // If no knowledge was found and the response seems generic, use fallback
    const response = !knowledgeFound && toolsCalled.length > 0 && result.text.length < 100
      ? FALLBACK_RESPONSE
      : result.text;

    return {
      response,
      toolsCalled,
      processingTimeMs,
      knowledgeFound,
    };
  } catch (error) {
    const processingTimeMs = Date.now() - startTime;
    console.error('Customer Success Agent error:', error);

    // Return a helpful fallback response
    return {
      response: FALLBACK_RESPONSE,
      toolsCalled,
      processingTimeMs,
      knowledgeFound: false,
    };
  }
}

/**
 * Checks if a query is likely a technical question that should be
 * redirected to the Sales Engineer Agent
 * 
 * @param message - The user's message
 * @returns True if the message appears to be technical
 */
export function isTechnicalQuery(message: string): boolean {
  const technicalKeywords = [
    'watt', 'kw', 'kwh', 'battery', 'inverter', 'panel',
    'calculate', 'sizing', 'power', 'capacity', 'backup',
    'appliance', 'load', 'consumption', 'solar system'
  ];
  
  const lowerMessage = message.toLowerCase();
  return technicalKeywords.some(keyword => lowerMessage.includes(keyword));
}
