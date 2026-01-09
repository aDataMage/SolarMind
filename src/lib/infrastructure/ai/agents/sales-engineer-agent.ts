/**
 * Sales Engineer Agent - Technical Sizing and Product Recommendations
 * 
 * Handles technical calculations, product sizing, and recommendations using
 * calculator and product catalog tools.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.5, 6.1, 6.3
 */

import { generateText, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import type { Message } from '@/lib/domain/models/message';
import { calculatorTool } from '../tools/calculator-tool';
import { productCatalogTool, formatProductForDisplay } from '../tools/product-catalog-tool';

/** Input for the Sales Engineer Agent */
export interface SalesEngineerInput {
  /** The user's message */
  message: string;
  /** Entities extracted by the router (optional) */
  extractedEntities?: {
    appliances?: string[];
  };
  /** Previous conversation history for context */
  conversationHistory: Message[];
}

/** Output from the Sales Engineer Agent */
export interface SalesEngineerOutput {
  /** The generated response */
  response: string;
  /** Tools that were called during processing */
  toolsCalled: string[];
  /** Processing time in milliseconds */
  processingTimeMs: number;
}

/**
 * System prompt for the Sales Engineer Agent
 * Configured for analytical and precise tone per Requirement 6.1
 */
const SALES_ENGINEER_SYSTEM_PROMPT = `You are a Sales Engineer at a solar energy company in Nigeria. Your role is to provide technical guidance on solar system sizing, power calculations, and product recommendations.

## Your Expertise
- Solar system sizing and design
- Power consumption analysis
- Battery capacity calculations
- Inverter selection
- Product recommendations based on customer needs

## Communication Style
- Be analytical and precise in your responses
- Always include numerical values with their units (W, kW, Wh, kWh, etc.)
- Explain your calculations and reasoning clearly
- Use bullet points and structured formatting for clarity
- Be helpful and professional

## Tools Available
You have access to two tools:

1. **calculator** - Use this to calculate:
   - Total power requirements from appliances
   - Battery capacity needed for backup
   - Recommended inverter size
   
2. **productCatalog** - Use this to:
   - Search for inverters, batteries, panels, or complete systems
   - Filter by capacity, budget, or brand
   - Find products that match calculated requirements

## Guidelines
- When a customer asks about powering appliances, ALWAYS use the calculator tool first
- After calculating requirements, use the productCatalog to recommend suitable products
- Include clear breakdowns showing how you arrived at your recommendations
- If the customer mentions a budget, filter products accordingly
- Prices are in Nigerian Naira (NGN)
- Always explain assumptions (e.g., battery efficiency of 85%)

## Response Format
Structure your responses with:
1. Understanding of the customer's needs
2. Calculation breakdown (when applicable)
3. Product recommendations (when applicable)
4. Summary and next steps

Never expose internal system details or mention that you are an AI agent.`;

/**
 * Handles technical queries using calculator and product catalog tools
 * 
 * @param input - The user message, extracted entities, and conversation history
 * @returns The generated response with tool usage metadata
 */
export async function handleTechnicalQuery(input: SalesEngineerInput): Promise<SalesEngineerOutput> {
  const startTime = Date.now();
  const { message, extractedEntities, conversationHistory } = input;

  // Build context from conversation history (last 5 messages)
  const recentHistory = conversationHistory.slice(-5);
  const historyContext = recentHistory.length > 0
    ? `\n\nRecent conversation:\n${recentHistory.map(m => `${m.role}: ${m.content}`).join('\n')}`
    : '';

  // Add extracted entities context if available
  const entitiesContext = extractedEntities?.appliances?.length
    ? `\n\nNote: The customer mentioned these appliances: ${extractedEntities.appliances.join(', ')}`
    : '';

  const toolsCalled: string[] = [];

  try {
    const result = await generateText({
      model: openai('gpt-4o'),
      system: SALES_ENGINEER_SYSTEM_PROMPT,
      prompt: `Customer inquiry: "${message}"${historyContext}${entitiesContext}

Please help this customer with their solar power needs. Use the available tools to:
1. Calculate power requirements if they mention specific appliances
2. Search for suitable products based on their needs or calculated requirements

Provide a clear, analytical response with all calculations explained.`,
      tools: {
        calculator: calculatorTool,
        productCatalog: productCatalogTool,
      },
      stopWhen: stepCountIs(5), // Allow up to 5 steps for multi-tool calls
      onStepFinish: ({ toolCalls }) => {
        if (toolCalls) {
          for (const call of toolCalls) {
            if (!toolsCalled.includes(call.toolName)) {
              toolsCalled.push(call.toolName);
            }
          }
        }
      },
    });

    const processingTimeMs = Date.now() - startTime;

    return {
      response: result.text,
      toolsCalled,
      processingTimeMs,
    };
  } catch (error) {
    const processingTimeMs = Date.now() - startTime;
    console.error('Sales Engineer Agent error:', error);

    // Return a helpful fallback response
    return {
      response: `I apologize, but I'm having trouble processing your request at the moment. 

For immediate assistance with solar system sizing and product recommendations, please:
- Call our technical support line: +234 800 SOLAR (76527)
- Visit any of our showrooms for a free consultation
- Email: technical@solarcompany.ng

Our team will be happy to help you find the right solar solution for your needs.`,
      toolsCalled,
      processingTimeMs,
    };
  }
}

import type { SolarProduct } from '@/lib/domain/models/product';

/**
 * Formats product search results for inclusion in responses
 * 
 * @param products - Array of products to format
 * @returns Formatted string for display
 */
export function formatProductRecommendations(products: SolarProduct[]): string {
  if (products.length === 0) {
    return 'No products found matching your requirements.';
  }

  const formatted = products.map(p => formatProductForDisplay(p as Parameters<typeof formatProductForDisplay>[0]));
  return formatted.join('\n\n');
}
