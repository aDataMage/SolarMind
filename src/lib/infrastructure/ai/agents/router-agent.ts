/**
 * Router Agent - Intent Classification and Routing
 * 
 * Classifies user intent and determines which specialist agent(s) should handle the request.
 * Uses Vercel AI SDK generateObject for structured output.
 * 
 * Simplified schema for OpenAI Structured Outputs compatibility.
 */

import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import type { Message, Intent, IntentType } from '@/lib/domain/models/message';

/** Confidence threshold below which clarification is requested */
const CONFIDENCE_THRESHOLD = 0.7;

/** Simple intent schema - compatible with OpenAI Structured Outputs */
const IntentSchema = z.object({
  intent: z.enum(['technical_sizing', 'support_inquiry', 'general']),
  confidence: z.number().min(0).max(1),
});

/** Input for the Router Agent */
export interface RouterAgentInput {
  /** The user's message to classify */
  message: string;
  /** Previous conversation history for context */
  conversationHistory: Message[];
}

/** Output from the Router Agent */
export interface RouterAgentOutput {
  /** Array of detected intents with confidence scores */
  intents: Intent[];
  /** Whether clarification is needed from the user */
  requiresClarification: boolean;
  /** Prompt to ask user for clarification */
  clarificationPrompt?: string;
}

/** System prompt for intent classification */
const ROUTER_SYSTEM_PROMPT = `You are an intent classification system for a company's customer service.

Your job is to analyze customer messages and classify their intent to route them to the appropriate specialist agent.

## Intent Types

1. **technical_sizing** - Questions about:
   - Technical specifications and calculations
   - Product sizing and recommendations
   - Capacity requirements
   - Product specifications and comparisons

2. **support_inquiry** - Questions about:
   - Shop locations and opening hours
   - Warranty policies
   - Return and refund policies
   - Installation services
   - General company information
   - FAQs

3. **general** - Messages that are:
   - Greetings ("Hello", "Hi there")
   - Thank you messages
   - Unclear or off-topic queries
   - Simple acknowledgments

## Confidence Scoring

- 0.9-1.0: Very clear intent with specific keywords
- 0.7-0.89: Clear intent but some ambiguity
- 0.5-0.69: Ambiguous, needs clarification
- Below 0.5: Very unclear`;

/**
 * Routes a user message by classifying its intent
 * 
 * @param input - The user message and conversation history
 * @returns Classification result with intents, confidence scores, and clarification needs
 */
export async function routeMessage(input: RouterAgentInput): Promise<RouterAgentOutput> {
  const { message, conversationHistory } = input;

  // Build context from conversation history (last 5 messages for context)
  const recentHistory = conversationHistory.slice(-5);
  const historyContext = recentHistory.length > 0
    ? `\n\nRecent conversation:\n${recentHistory.map(m => `${m.role}: ${m.content}`).join('\n')}`
    : '';

  try {
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: IntentSchema,
      system: ROUTER_SYSTEM_PROMPT,
      prompt: `Classify the intent of this customer message:

"${message}"${historyContext}

Return the intent type and confidence score.`,
    });

    const classification = result.object;
    const needsClarification = classification.confidence < CONFIDENCE_THRESHOLD;

    // Map to domain types
    const intents: Intent[] = [{
      type: classification.intent as IntentType,
      confidence: classification.confidence,
      extractedEntities: undefined,
    }];

    return {
      intents,
      requiresClarification: needsClarification,
      clarificationPrompt: needsClarification
        ? "I'd like to help you better. Could you please provide more details about what you're looking for?"
        : undefined,
    };
  } catch (error) {
    // Default to general on failure
    console.error('Router Agent classification failed:', error);

    return {
      intents: [{
        type: 'general',
        confidence: 0.5,
        extractedEntities: undefined,
      }],
      requiresClarification: false,
      clarificationPrompt: undefined,
    };
  }
}

/**
 * Quick intent detection using keyword matching (fallback, no LLM call)
 */
export function quickClassifyIntent(message: string): IntentType {
  const lower = message.toLowerCase();

  // Technical keywords
  const technicalKeywords = [
    'size', 'sizing', 'capacity', 'power', 'watt', 'specification', 'specs',
    'calculate', 'how many', 'what size', 'recommend', 'battery', 'inverter'
  ];

  if (technicalKeywords.some(kw => lower.includes(kw))) {
    return 'technical_sizing';
  }

  // Support keywords
  const supportKeywords = [
    'location', 'address', 'hours', 'warranty', 'return', 'refund', 'policy',
    'shop', 'store', 'installation', 'where', 'when'
  ];

  if (supportKeywords.some(kw => lower.includes(kw))) {
    return 'support_inquiry';
  }

  return 'general';
}

/**
 * Determines which agents should handle the classified intents
 * 
 * @param intents - Array of classified intents
 * @returns Array of agent identifiers to invoke
 */
export function getAgentsForIntents(intents: Intent[]): ('sales_engineer' | 'customer_success')[] {
  const agents = new Set<'sales_engineer' | 'customer_success'>();

  for (const intent of intents) {
    // Only consider intents with reasonable confidence
    if (intent.confidence >= 0.5) {
      switch (intent.type) {
        case 'technical_sizing':
          agents.add('sales_engineer');
          break;
        case 'support_inquiry':
          agents.add('customer_success');
          break;
        case 'general':
          // General queries go to customer success
          agents.add('customer_success');
          break;
      }
    }
  }

  // Default to customer success if no agents determined
  if (agents.size === 0) {
    agents.add('customer_success');
  }

  return Array.from(agents);
}
