/**
 * Chat API Route - Enhanced Multi-Agent System
 * 
 * Features:
 * - Hybrid keyword + LLM routing for speed and accuracy
 * - Context-aware intent classification
 * - Conversation state tracking
 * - Agent-specific tool configuration
 * - Comprehensive error handling
 * - Streaming responses with useChat compatibility
 */
import { streamText, convertToModelMessages, stepCountIs, generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import {
    knowledgeSearchTool,
    locationSearchTool,
    policySearchTool,
    productSearchTool
} from '@/lib/infrastructure/ai/tools/knowledge-tools';
import { calculatorTool } from '@/lib/infrastructure/ai/tools/calculator-tool';
import { SYSTEM_PROMPTS } from '@/lib/infrastructure/ai/prompts/system-prompts';

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 60;

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

type AgentType = 'generalist' | 'customer_service' | 'sales';

const RouterSchema = z.object({
    type: z.enum(['generalist', 'customer_service', 'sales']),
    confidence: z.enum(['high', 'medium', 'low']),
    reasoning: z.string(),
});

interface MessageContent {
    text: string;
    hasImage: boolean;
    hasBillKeywords: boolean;
}

interface RoutingDecision {
    agentType: AgentType;
    method: 'keyword' | 'llm' | 'context';
    confidence: 'high' | 'medium' | 'low';
    reasoning?: string;
}

// ============================================================================
// MESSAGE PARSING
// ============================================================================

/**
 * Extract text content and detect images from various message formats
 */
function parseMessageContent(message: any): MessageContent {
    let text = '';
    let hasImage = false;

    // Handle string content
    if (typeof message.content === 'string') {
        text = message.content;
    }
    // Handle Vercel AI SDK CoreMessage format
    else if (Array.isArray(message.content)) {
        text = message.content
            .filter((p: any) => p.type === 'text')
            .map((p: any) => p.text)
            .join(' ');
        hasImage = message.content.some((p: any) => p.type === 'image');
    }
    // Handle legacy/UI format with 'parts'
    else if (Array.isArray(message.parts)) {
        text = message.parts
            .filter((p: any) => p.type === 'text')
            .map((p: any) => p.text)
            .join(' ');
        hasImage = message.parts.some((p: any) => p.type === 'image');
    }

    // Detect electricity bill keywords
    const billKeywords = ['bill', 'invoice', 'nepa', 'phcn', 'kwh', 'electricity', 'consumption'];
    const hasBillKeywords = billKeywords.some(kw => text.toLowerCase().includes(kw));

    return { text, hasImage, hasBillKeywords };
}

// ============================================================================
// INTENT CLASSIFICATION
// ============================================================================

/**
 * Fast keyword-based intent classification
 * Catches obvious intents without LLM calls (~95% accuracy for clear cases)
 */
function classifyByKeywords(content: MessageContent): AgentType | null {
    const lower = content.text.toLowerCase();

    // PRIORITY 1: Images with bill context -> Sales (Bill Analysis)
    if (content.hasImage && content.hasBillKeywords) {
        console.log('🖼️ Image + Bill Keywords → Sales');
        return 'sales';
    }

    // PRIORITY 2: Images without bill context -> Could be sales (site photos) or CS (complaint)
    // Let LLM decide for ambiguous image cases
    if (content.hasImage && !content.hasBillKeywords) {
        console.log('🖼️ Image without bill context → LLM decision needed');
        return null;
    }

    // PRIORITY 3: Strong Sales Signals
    const strongSalesKeywords = [
        // Purchase Intent
        'buy', 'purchase', 'order', 'get me', 'i want to buy', 'i need to buy',
        // Pricing
        'how much', 'price', 'cost', 'pricing', 'quote', 'estimate', 'budget',
        // Product Requests
        'recommend', 'suggest', 'show me', 'looking for', 'need a',
        // System Sizing
        'what size', 'sizing', 'calculate', 'requirement', 'capacity',
        // Equipment Mentions
        'inverter', 'battery', 'solar panel', 'charge controller', 'solar system',
        // Technical Specs
        'kva', 'kwh', 'watt', 'amp', 'voltage', 'output',
        // Packages
        'package', 'kit', 'bundle', 'system', 'setup', 'installation cost'
    ];

    if (strongSalesKeywords.some(kw => lower.includes(kw))) {
        console.log('💰 Strong sales signal detected');
        return 'sales';
    }

    // PRIORITY 4: Strong Customer Service Signals
    const strongCSKeywords = [
        // Policies
        'warranty', 'guarantee', 'return', 'refund', 'exchange', 'policy',
        // Complaints/Issues
        'complaint', 'problem', 'issue', 'broken', 'not working', 'damaged',
        // Locations
        'location', 'address', 'where is', 'where are you', 'office', 'shop', 'showroom',
        'branch', 'visit', 'come to',
        // Contact
        'contact', 'phone', 'email', 'whatsapp', 'reach you', 'call you',
        // Hours/Availability
        'open', 'close', 'hours', 'available', 'when can',
        // Services (Company-Specific)
        'installation service', 'maintenance service', 'repair service',
        'do you offer', 'do you provide', 'do you have a service'
    ];

    if (strongCSKeywords.some(kw => lower.includes(kw))) {
        console.log('🤝 Strong customer service signal detected');
        return 'customer_service';
    }

    // PRIORITY 5: Educational/General Keywords (Pure Learning)
    const educationalKeywords = [
        'how does', 'how do', 'what is', 'what are', 'explain',
        'science', 'physics', 'work?', 'works?',
        'difference between', 'benefits of', 'advantages',
        'history of', 'who invented', 'when was',
        'why do', 'why does'
    ];

    // Only route to generalist if NO product/company mentions
    const hasProductMention = ['inverter', 'battery', 'panel', 'system'].some(p => lower.includes(p));
    const hasCompanyMention = ['your', 'you', 'solartech'].some(p => lower.includes(p));

    if (educationalKeywords.some(kw => lower.includes(kw)) && !hasProductMention && !hasCompanyMention) {
        console.log('📚 Educational query detected');
        return 'generalist';
    }

    // PRIORITY 6: Greetings (Generalist handles warm welcome)
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    const isShortGreeting = lower.split(' ').length <= 3;

    if (isShortGreeting && greetings.some(g => lower.includes(g))) {
        console.log('👋 Greeting detected');
        return 'generalist';
    }

    // Ambiguous - needs LLM
    return null;
}

/**
 * Context-aware routing based on conversation history
 * Maintains agent continuity for follow-up questions
 */
function classifyByContext(
    messages: any[],
    currentContent: MessageContent
): AgentType | null {
    if (messages.length < 2) return null;

    // Get last 3 messages for context
    const recentMessages = messages.slice(-4, -1);
    const lower = currentContent.text.toLowerCase();

    // Detect follow-up patterns
    const followUpPatterns = [
        'what about', 'how about', 'and the', 'also',
        'another', 'more', 'else', 'additionally'
    ];
    const isFollowUp = followUpPatterns.some(p => lower.includes(p)) ||
        lower.split(' ').length < 10; // Short queries likely continuations

    if (!isFollowUp) return null;

    // Count recent agent interactions (simplified - in production, track via metadata)
    let salesCount = 0;
    let csCount = 0;

    recentMessages.forEach(msg => {
        const content = typeof msg.content === 'string' ? msg.content : '';
        const msgLower = content.toLowerCase();

        // Heuristic: Detect which agent likely responded
        if (msgLower.includes('calculate') || msgLower.includes('inverter') || msgLower.includes('battery')) {
            salesCount++;
        } else if (msgLower.includes('warranty') || msgLower.includes('location') || msgLower.includes('showroom')) {
            csCount++;
        }
    });

    // If predominantly sales conversation, continue with sales
    if (salesCount > csCount && salesCount >= 2) {
        console.log('🔄 Context: Continuing sales conversation');
        return 'sales';
    }

    // If predominantly CS conversation, continue with CS
    if (csCount > salesCount && csCount >= 2) {
        console.log('🔄 Context: Continuing customer service conversation');
        return 'customer_service';
    }

    return null;
}

/**
 * LLM-based intent classification (fallback for ambiguous cases)
 */
async function classifyByLLM(
    messages: any[],
    currentContent: MessageContent
): Promise<{ type: AgentType; confidence: 'high' | 'medium' | 'low'; reasoning?: string }> {
    console.log('🤖 Using LLM for intent classification...');

    // Build context from recent messages
    const contextMessages = messages.slice(-3).map((m: any) => {
        const content = parseMessageContent(m);
        return `${m.role}: ${content.text}`;
    }).join('\n');

    const { object } = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: RouterSchema,
        system: SYSTEM_PROMPTS.ROUTER,
        prompt: `Classify the user's intent for routing to the appropriate agent.

Recent Conversation Context:
${contextMessages}

Current User Message: "${currentContent.text}"
Has Image: ${currentContent.hasImage}
Has Bill Keywords: ${currentContent.hasBillKeywords}

Analyze the intent and provide:
1. Agent type (generalist/customer_service/sales)
2. Confidence level (high/medium/low)
3. Brief reasoning

Remember the priority order:
- Sales: Product inquiries, pricing, sizing, technical specs, purchase intent
- Customer Service: Company policies, locations, services, support
- Generalist: Pure education, greetings, broad solar concepts WITHOUT purchase/company intent`,
    });

    return {
        type: object.type,
        confidence: object.confidence || 'medium',
        reasoning: object.reasoning,
    };
}

/**
 * Main routing logic combining all classification methods
 */
async function routeToAgent(messages: any[]): Promise<RoutingDecision> {
    const lastMessage = messages[messages.length - 1];
    const content = parseMessageContent(lastMessage);

    // Method 1: Fast keyword classification
    const keywordResult = classifyByKeywords(content);
    if (keywordResult) {
        return {
            agentType: keywordResult,
            method: 'keyword',
            confidence: 'high',
        };
    }

    // Method 2: Context-based classification
    const contextResult = classifyByContext(messages, content);
    if (contextResult) {
        return {
            agentType: contextResult,
            method: 'context',
            confidence: 'medium',
        };
    }

    // Method 3: LLM classification (fallback)
    const llmResult = await classifyByLLM(messages, content);
    return {
        agentType: llmResult.type,
        method: 'llm',
        confidence: llmResult.confidence,
        reasoning: llmResult.reasoning,
    };
}

// ============================================================================
// AGENT CONFIGURATION
// ============================================================================

interface AgentConfig {
    systemPrompt: string;
    tools: Record<string, any>;
    temperature: number;
    maxSteps: number;
}

function getAgentConfig(agentType: AgentType): AgentConfig {
    switch (agentType) {
        case 'sales':
            return {
                systemPrompt: SYSTEM_PROMPTS.SALES_ENGINEER,
                tools: {
                    searchProducts: productSearchTool,
                    calculatePowerNeeds: calculatorTool,
                },
                temperature: 0.7,
                maxSteps: 5,
            };

        case 'customer_service':
            return {
                systemPrompt: SYSTEM_PROMPTS.CUSTOMER_SUCCESS,
                tools: {
                    searchKnowledge: knowledgeSearchTool,
                    searchLocation: locationSearchTool,
                    searchPolicy: policySearchTool,
                },
                temperature: 0.7,
                maxSteps: 5,
            };

        case 'generalist':
        default:
            return {
                systemPrompt: SYSTEM_PROMPTS.GENERALIST,
                tools: {}, // No tools - uses internal knowledge
                temperature: 0.8, // Slightly more creative for educational content
                maxSteps: 3, // Simpler queries
            };
    }
}

// ============================================================================
// MESSAGE CONVERSION
// ============================================================================

/**
 * Convert various message formats to Vercel AI SDK CoreMessage format
 */
function normalizeMessages(messages: any[]): any[] {
    return messages.map((m: any) => {
        let content: any = m.content;

        // Handle array content (Vercel SDK or Custom)
        if (Array.isArray(m.content)) {
            content = m.content.map((p: any) => {
                if (p.type === 'image') {
                    return {
                        type: 'image',
                        image: p.image || p.url || p.base64
                    };
                }
                return {
                    type: 'text',
                    text: p.text || ''
                };
            });
        }
        // Handle legacy 'parts' structure
        else if (Array.isArray(m.parts)) {
            content = m.parts.map((p: any) => {
                if (p.type === 'image') {
                    return {
                        type: 'image',
                        image: p.image || p.url || p.base64
                    };
                }
                return {
                    type: 'text',
                    text: p.text || ''
                };
            });
        }

        return {
            role: m.role,
            content: content,
        };
    });
}

// ============================================================================
// MAIN ROUTE HANDLER
// ============================================================================

export async function POST(req: Request) {
    const startTime = Date.now();

    try {
        const { messages } = await req.json();

        if (!messages || messages.length === 0) {
            return Response.json(
                { error: 'No messages provided' },
                { status: 400 }
            );
        }

        // ========================================================================
        // STEP 1: ROUTE TO APPROPRIATE AGENT
        // ========================================================================
        const routing = await routeToAgent(messages);

        console.log('🔀 Routing Decision:', {
            agent: routing.agentType,
            method: routing.method,
            confidence: routing.confidence,
            reasoning: routing.reasoning,
            latency: `${Date.now() - startTime}ms`,
        });

        // ========================================================================
        // STEP 2: GET AGENT CONFIGURATION
        // ========================================================================
        const agentConfig = getAgentConfig(routing.agentType);

        // ========================================================================
        // STEP 3: NORMALIZE MESSAGES
        // ========================================================================
        const normalizedMessages = normalizeMessages(messages);

        // ========================================================================
        // STEP 4: GENERATE STREAMING RESPONSE
        // ========================================================================
        const result = streamText({
            model: openai('gpt-4o'),
            messages: normalizedMessages,
            system: agentConfig.systemPrompt,
            tools: agentConfig.tools,
            toolChoice: 'auto',
            temperature: agentConfig.temperature,
            stopWhen: stepCountIs(agentConfig.maxSteps || 5),


            // Add metadata for debugging
            onFinish: async ({ text, finishReason, usage }) => {
                console.log('✅ Generation Complete:', {
                    agent: routing.agentType,
                    finishReason,
                    tokens: usage?.totalTokens,
                    totalLatency: `${Date.now() - startTime}ms`,
                });
            },
        });

        // Return streaming response compatible with useChat
        return result.toUIMessageStreamResponse({
            // Optionally include metadata in headers
            headers: {
                'X-Agent-Type': routing.agentType,
                'X-Routing-Method': routing.method,
                'X-Confidence': routing.confidence,
            },
        });

    } catch (error) {
        console.error('❌ Chat API Error:', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        return Response.json(
            {
                error: 'Failed to process chat request',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================

export async function GET() {
    return Response.json({
        status: 'healthy',
        agents: ['generalist', 'customer_service', 'sales'],
        timestamp: new Date().toISOString(),
    });
}