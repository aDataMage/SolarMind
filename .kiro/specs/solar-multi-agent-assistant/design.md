# Design Document: Solar Multi-Agent Assistant

## Overview

This design implements a multi-agent AI assistant for a solar energy company using the existing Clean Architecture foundation. The system employs a Router-Specialist pattern where a lightweight Router Agent classifies user intent and delegates to specialized agents (Sales Engineer or Customer Success). The architecture leverages Vercel AI SDK for LLM orchestration, LangGraph for agent state management, and Qdrant for RAG-based knowledge retrieval.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Presentation Layer                           │
│  ┌─────────────────┐    ┌─────────────────────────────────┐    │
│  │  Chat Interface │───▶│  POST /api/chat                 │    │
│  │  (React + AI SDK)│    │  (Streaming Response Handler)   │    │
│  └─────────────────┘    └─────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Agent Orchestrator (Use Case)               │   │
│  │  - Receives user message                                 │   │
│  │  - Invokes Router Agent                                  │   │
│  │  - Dispatches to specialist agents                       │   │
│  │  - Merges multi-agent responses                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                          │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │ Router Agent  │  │ Sales Engineer│  │ Customer Success  │   │
│  │ (Intent       │  │ Agent         │  │ Agent             │   │
│  │  Classifier)  │  │ (Calculator,  │  │ (RAG Knowledge    │   │
│  │               │  │  Catalog API) │  │  Base)            │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
│           │                  │                   │              │
│           ▼                  ▼                   ▼              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    AI Provider (OpenAI)                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Vector Database (Qdrant)                      │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Router Agent (`src/lib/infrastructure/ai/agents/router-agent.ts`)

Classifies user intent and determines which specialist agent(s) should handle the request.

```typescript
// Intent classification schema
const IntentSchema = z.object({
  intents: z.array(z.object({
    type: z.enum(['technical_sizing', 'support_inquiry', 'general']),
    confidence: z.number().min(0).max(1),
    extractedEntities: z.object({
      appliances: z.array(z.string()).optional(),
      location: z.string().optional(),
      topic: z.string().optional(),
    }).optional(),
  })),
  requiresClarification: z.boolean(),
  clarificationPrompt: z.string().optional(),
});

interface RouterAgentInput {
  message: string;
  conversationHistory: Message[];
}

interface RouterAgentOutput {
  intents: Intent[];
  requiresClarification: boolean;
  clarificationPrompt?: string;
}

async function routeMessage(input: RouterAgentInput): Promise<RouterAgentOutput>
```

### 2. Sales Engineer Agent (`src/lib/infrastructure/ai/agents/sales-engineer-agent.ts`)

Handles technical calculations, product sizing, and recommendations.

```typescript
// Tools available to Sales Engineer
const calculatorTool = tool({
  description: 'Calculate power requirements and battery sizing',
  parameters: z.object({
    appliances: z.array(z.object({
      name: z.string(),
      wattage: z.number(),
      hoursPerDay: z.number(),
    })),
    backupHours: z.number(),
    batteryEfficiency: z.number().default(0.85),
  }),
  execute: async (params) => calculatePowerRequirements(params),
});

const productCatalogTool = tool({
  description: 'Search product catalog for matching solar equipment',
  parameters: z.object({
    category: z.enum(['inverter', 'battery', 'panel', 'complete_system']),
    minCapacity: z.number().optional(),
    maxBudget: z.number().optional(),
  }),
  execute: async (params) => searchProductCatalog(params),
});

interface SalesEngineerInput {
  message: string;
  extractedEntities?: {
    appliances?: string[];
  };
  conversationHistory: Message[];
}

async function handleTechnicalQuery(input: SalesEngineerInput): Promise<string>
```

### 3. Customer Success Agent (`src/lib/infrastructure/ai/agents/customer-success-agent.ts`)

Handles support queries using RAG-based knowledge retrieval.

```typescript
interface CustomerSuccessInput {
  message: string;
  extractedEntities?: {
    location?: string;
    topic?: string;
  };
  conversationHistory: Message[];
}

async function handleSupportQuery(input: CustomerSuccessInput): Promise<string>

// Internal RAG flow
async function retrieveKnowledge(query: string): Promise<KnowledgeChunk[]>
async function generateResponse(query: string, context: KnowledgeChunk[]): Promise<string>
```

### 4. Agent Orchestrator (`src/lib/use-cases/chat-orchestrator.usecase.ts`)

Coordinates the multi-agent workflow and merges responses.

```typescript
interface OrchestratorInput {
  message: string;
  conversationHistory: Message[];
  sessionId: string;
}

interface OrchestratorOutput {
  response: string;
  agentsInvoked: string[];
  processingTimeMs: number;
}

class ChatOrchestrator {
  async processMessage(input: OrchestratorInput): Promise<OrchestratorOutput>
  private async mergeResponses(responses: AgentResponse[]): Promise<string>
}
```

### 5. Chat API Route (`src/app/api/chat/route.ts`)

Streaming endpoint that connects the frontend to the orchestrator.

```typescript
export async function POST(request: Request): Promise<Response> {
  // Parse request body
  // Initialize orchestrator
  // Stream response using Vercel AI SDK
}
```

## Data Models

### Message Types

```typescript
// src/lib/domain/models/message.ts
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    agentSource?: 'router' | 'sales_engineer' | 'customer_success';
    intents?: Intent[];
    processingTimeMs?: number;
  };
}

export interface Intent {
  type: 'technical_sizing' | 'support_inquiry' | 'general';
  confidence: number;
  extractedEntities?: {
    appliances?: string[];
    location?: string;
    topic?: string;
  };
}
```

### Knowledge Base Schema

```typescript
// src/lib/domain/models/knowledge.ts
export interface KnowledgeChunk {
  id: string;
  content: string;
  category: 'policy' | 'location' | 'product' | 'faq';
  metadata: {
    source: string;
    lastUpdated: Date;
  };
  embedding?: number[];
}
```

### Product Catalog Schema

```typescript
// src/lib/domain/models/product.ts
export interface SolarProduct {
  id: string;
  name: string;
  category: 'inverter' | 'battery' | 'panel' | 'complete_system';
  specifications: {
    capacity: number;
    capacityUnit: 'W' | 'kW' | 'Wh' | 'kWh';
    voltage?: number;
    efficiency?: number;
  };
  price: number;
  currency: string;
  inStock: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Intent Classification Completeness

*For any* user message, the Router Agent SHALL return at least one intent classification with a confidence score between 0 and 1.

**Validates: Requirements 1.1, 1.2**

### Property 2: Confidence Threshold Behavior

*For any* intent classification with confidence below 0.7, the Router Agent SHALL set `requiresClarification` to true and provide a non-empty `clarificationPrompt`.

**Validates: Requirements 1.3**

### Property 3: Multi-Intent Detection Consistency

*For any* message containing N distinct intent keywords (from a predefined set), the Router Agent SHALL detect at least N intents when N > 1.

**Validates: Requirements 1.4, 4.1**

### Property 4: Power Calculation Correctness

*For any* set of appliances with known wattages and backup hours, the Sales Engineer Agent's calculator tool SHALL return a total wattage equal to the sum of (appliance_wattage × hours_per_day) for all appliances, and battery capacity equal to (total_wattage × backup_hours) / battery_efficiency.

**Validates: Requirements 2.1, 2.2**

### Property 5: Response Merging Coherence

*For any* multi-intent message invoking multiple agents, the merged response SHALL contain information addressing each detected intent without duplication of greetings or sign-offs.

**Validates: Requirements 4.2, 4.3**

### Property 6: Knowledge Retrieval Relevance

*For any* support query about a topic present in the knowledge base, the Customer Success Agent SHALL return a response containing information semantically related to the query topic.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 7: Fallback Behavior on Agent Failure

*For any* agent invocation that fails, the system SHALL retry exactly once before returning a fallback response, and the fallback response SHALL contain alternative contact information.

**Validates: Requirements 7.1, 7.2**

### Property 8: Response Tone Consistency

*For any* response from the Sales Engineer Agent, the response SHALL contain numerical values with units when discussing calculations. *For any* response from the Customer Success Agent, the response SHALL not contain technical calculations.

**Validates: Requirements 6.1, 6.2, 6.3**

## Error Handling

### Agent-Level Errors

| Error Type | Handling Strategy |
|------------|-------------------|
| LLM Timeout | Retry once with exponential backoff, then return cached/default response |
| LLM Rate Limit | Queue request, notify user of delay |
| Invalid LLM Response | Log error, retry with simplified prompt |
| Tool Execution Failure | Return partial response with explanation |

### System-Level Errors

| Error Type | Handling Strategy |
|------------|-------------------|
| Vector DB Unavailable | Use cached embeddings or return "knowledge unavailable" message |
| Product Catalog API Down | Return "catalog temporarily unavailable" with manual contact info |
| Session State Lost | Gracefully restart conversation with apology |

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    userFriendlyMessage: string;
    retryable: boolean;
  };
  fallbackResponse?: string;
}
```

## Testing Strategy

### Unit Tests

- Test intent classification with various message types
- Test power calculation formulas with known inputs/outputs
- Test response merging logic with mock agent responses
- Test error handling paths with simulated failures

### Property-Based Tests

Property-based testing validates universal properties across many generated inputs. Each property test will use `fast-check` for TypeScript.

**Configuration:**
- Minimum 100 iterations per property test
- Tag format: `Feature: solar-multi-agent-assistant, Property N: [property_text]`

**Property Tests to Implement:**

1. **Intent Classification Completeness** - Generate random messages, verify always returns valid intent structure
2. **Confidence Threshold Behavior** - Generate low-confidence scenarios, verify clarification is requested
3. **Power Calculation Correctness** - Generate random appliance sets, verify mathematical correctness
4. **Response Merging Coherence** - Generate multi-agent response sets, verify no duplicate greetings
5. **Fallback Behavior** - Simulate failures, verify retry and fallback behavior

### Integration Tests

- End-to-end chat flow with real LLM calls (limited, expensive)
- RAG retrieval accuracy with seeded knowledge base
- Multi-agent orchestration timing and response quality

### Test Data

- Curated set of 50+ representative user messages covering all intent types
- Mock product catalog with 20+ products across categories
- Seeded knowledge base with policies, locations, and FAQs
