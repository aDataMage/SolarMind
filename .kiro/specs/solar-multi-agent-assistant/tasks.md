# Implementation Plan: Solar Multi-Agent Assistant

## Overview

This implementation plan builds the multi-agent solar assistant system incrementally, starting with domain models, then infrastructure agents, followed by the orchestration layer, and finally the chat interface. Each task builds on previous work, ensuring no orphaned code.

## Tasks

- [x] 1. Set up domain models and types
  - [x] 1.1 Create Message and Intent domain models
    - Create `src/lib/domain/models/message.ts` with Message and Intent interfaces
    - Define role types, metadata structure, and intent types
    - _Requirements: 1.1, 1.2, 4.1_

  - [x] 1.2 Create KnowledgeChunk and SolarProduct models
    - Create `src/lib/domain/models/knowledge.ts` with KnowledgeChunk interface
    - Create `src/lib/domain/models/product.ts` with SolarProduct interface
    - Define category enums and specification types
    - _Requirements: 2.3, 3.1, 3.2_

  - [x] 1.3 Create shared types and Zod schemas
    - Create `src/lib/domain/types/agent-types.ts` with shared agent types
    - Define Zod schemas for intent classification, agent inputs/outputs
    - _Requirements: 1.1, 1.2, 1.4_

- [x] 2. Implement Router Agent
  - [x] 2.1 Create Router Agent with intent classification
    - Create `src/lib/infrastructure/ai/agents/router-agent.ts`
    - Implement `routeMessage()` function using Vercel AI SDK `generateObject`
    - Define IntentSchema with multi-intent support
    - Add confidence scoring and clarification logic
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 2.2 Write property test for intent classification completeness
    - **Property 1: Intent Classification Completeness**
    - **Validates: Requirements 1.1, 1.2**

  - [ ]* 2.3 Write property test for confidence threshold behavior
    - **Property 2: Confidence Threshold Behavior**
    - **Validates: Requirements 1.3**

- [-] 3. Implement Sales Engineer Agent
  - [x] 3.1 Create power calculation tool
    - Create `src/lib/infrastructure/ai/tools/calculator-tool.ts`
    - Implement wattage calculation: sum of (appliance_wattage × hours_per_day)
    - Implement battery sizing: (total_wattage × backup_hours) / efficiency
    - Return structured calculation breakdown
    - _Requirements: 2.1, 2.2, 2.5_

  - [ ]* 3.2 Write property test for power calculation correctness
    - **Property 4: Power Calculation Correctness**
    - **Validates: Requirements 2.1, 2.2**

  - [x] 3.3 Create product catalog tool
    - Create `src/lib/infrastructure/ai/tools/product-catalog-tool.ts`
    - Implement mock product catalog with sample solar products
    - Add search by category, capacity, and budget filters
    - _Requirements: 2.3_

  - [x] 3.4 Create Sales Engineer Agent
    - Create `src/lib/infrastructure/ai/agents/sales-engineer-agent.ts`
    - Implement `handleTechnicalQuery()` with tool calling
    - Configure analytical/precise system prompt
    - Wire calculator and product catalog tools
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 6.1, 6.3_

- [x] 4. Implement Customer Success Agent
  - [x] 4.1 Enhance knowledge base tools for solar domain
    - Update `src/lib/infrastructure/ai/tools/knowledge-tools.ts`
    - Add category-aware search (policy, location, product, faq)
    - Implement embedding generation using OpenAI
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 4.2 Create Customer Success Agent
    - Create `src/lib/infrastructure/ai/agents/customer-success-agent.ts`
    - Implement `handleSupportQuery()` with RAG retrieval
    - Configure empathetic/polite system prompt
    - Add fallback for missing knowledge
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.2_

  - [ ]* 4.3 Write property test for knowledge retrieval relevance
    - **Property 6: Knowledge Retrieval Relevance**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 5. Checkpoint - Verify individual agents work
  - Ensure all agent tests pass
  - Verify each agent can be invoked independently
  - Ask the user if questions arise

- [x] 6. Implement Agent Orchestrator
  - [x] 6.1 Create Chat Orchestrator use case
    - Create `src/lib/use-cases/chat-orchestrator.usecase.ts`
    - Implement `processMessage()` that invokes Router then specialists
    - Add multi-agent dispatch for multi-intent messages
    - Implement response merging logic
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 6.2 Write property test for multi-intent detection
    - **Property 3: Multi-Intent Detection Consistency**
    - **Validates: Requirements 1.4, 4.1**

  - [ ]* 6.3 Write property test for response merging coherence
    - **Property 5: Response Merging Coherence**
    - **Validates: Requirements 4.2, 4.3**

  - [x] 6.4 Implement error handling and fallbacks
    - Add retry logic with exponential backoff
    - Implement fallback responses with contact information
    - Add error logging with context
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 6.5 Write property test for fallback behavior
    - **Property 7: Fallback Behavior on Agent Failure**
    - **Validates: Requirements 7.1, 7.2**

- [x] 7. Checkpoint - Verify orchestration works
  - Ensure orchestrator correctly routes to agents
  - Verify multi-intent handling works
  - Verify error handling and fallbacks
  - Ask the user if questions arise

- [x] 8. Implement Chat API and Interface
  - [x] 8.1 Create streaming chat API route
    - Create `src/app/api/chat/route.ts`
    - Implement POST handler with streaming response
    - Wire to ChatOrchestrator
    - Add error handling and logging
    - _Requirements: 5.4, 5.5_

  - [x] 8.2 Enhance chat interface component
    - Update `src/app/chat/page.tsx` with improved UI
    - Add loading indicator during processing
    - Style user/assistant messages distinctly
    - Add error display component
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [ ]* 8.3 Write property test for response format consistency
    - **Property 8: Response Tone Consistency**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 9. Seed knowledge base and test data
  - [x] 9.1 Create solar knowledge base seed script
    - Update `scripts/seed-qdrant.ts` for solar domain
    - Add sample policies (warranty, returns)
    - Add shop locations with hours
    - Add product FAQs
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 9.2 Create sample product catalog data
    - Create `src/lib/infrastructure/data/products.ts`
    - Add sample inverters, batteries, panels
    - Include realistic specifications and prices
    - _Requirements: 2.3_

- [x] 10. Final checkpoint - End-to-end verification
  - [x] 10.1 Verify agent switching logic in browser
  - [x] 10.2 Verify RAG retrieval accuracy with seeded data
  - [x] 10.3 Verify product recommendations with catalog data
  - [x] 10.4 Confirm UI responsiveness and error handling
  - Run all property tests and unit tests
  - Test complete chat flow manually
  - Verify multi-intent messages work correctly
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript with Vercel AI SDK and fast-check for property testing
