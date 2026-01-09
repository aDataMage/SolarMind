# Project Structure & Organization

This project follows **Clean Architecture** with strict layer separation. Each layer has specific responsibilities and dependencies flow inward.

## Directory Structure

```
src/
├── app/                    # Presentation Layer (Next.js App Router)
│   ├── api/               # Backend API endpoints
│   │   ├── admin/         # Admin-only routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── bookings/      # Business entity endpoints
│   │   └── integrations/  # External service webhooks (Telegram, WhatsApp)
│   ├── (dashboard)/       # Protected admin pages
│   ├── (marketing)/       # Public pages
│   └── chat/              # Chat interface pages
├── components/            # React Components
│   ├── ui/               # Reusable UI primitives (shadcn/ui)
│   ├── features/         # Feature-specific components
│   └── layout/           # Layout components
├── lib/                  # Core Application Logic
│   ├── domain/           # Domain Layer (Pure Business Logic)
│   │   ├── models/       # Entity definitions
│   │   ├── repositories/ # Data access interfaces
│   │   ├── services/     # Domain services
│   │   ├── value-objects/ # Immutable domain objects
│   │   └── errors/       # Domain-specific errors
│   ├── infrastructure/   # Infrastructure Layer
│   │   ├── ai/          # AI agents, tools, and prompts
│   │   ├── database/    # Database implementation (Drizzle)
│   │   └── vector/      # Vector database client (Qdrant)
│   ├── use-cases/       # Application Business Rules
│   └── utils/           # Shared utilities
└── types/               # Global TypeScript definitions
```

## Architecture Layers

### Domain Layer (`src/lib/domain/`)
- **Pure business logic** - no external dependencies
- **Entities**: Core business objects with identity
- **Value Objects**: Immutable objects without identity (Money, DateRange)
- **Domain Services**: Business logic that doesn't belong to a single entity
- **Repository Interfaces**: Contracts for data access (implemented in infrastructure)

### Infrastructure Layer (`src/lib/infrastructure/`)
- **AI Integration**: Agent orchestration, LLM calls, tool definitions
- **Database**: Drizzle ORM schemas and connection management
- **Vector Database**: Qdrant client for RAG operations
- **External Services**: Third-party API integrations

### Application Layer (`src/lib/use-cases/`)
- **Use Cases**: Application-specific business rules
- **Orchestrates** domain objects and infrastructure services
- **Transaction boundaries** and error handling

### Presentation Layer (`src/app/`)
- **Next.js App Router** for routing and server components
- **API Routes** for backend endpoints
- **Page Components** for UI rendering

## Naming Conventions

### Files & Directories
- **kebab-case** for directories and files: `chat-window.tsx`, `booking-service.ts`
- **PascalCase** for React components: `ChatWindow`, `BookingForm`
- **camelCase** for functions and variables: `classifyIntent`, `bookingService`

### Domain Models
- **Entities** end with the entity name: `Booking`, `Room`, `User`
- **Value Objects** describe what they represent: `Money`, `DateRange`, `EmailAddress`
- **Services** end with `.service.ts`: `pricing.service.ts`
- **Repositories** end with `.repository.ts`: `booking.repository.ts`

### Infrastructure
- **Clients** end with `.client.ts`: `qdrant.client.ts`, `openai.client.ts`
- **Schemas** use `schema.ts` for database definitions
- **Agents** end with descriptive names: `intent-classifier.ts`, `booking-agent.ts`

## Import Patterns

### Path Aliases
- Use `@/` for all src imports: `import { Button } from '@/components/ui/button'`
- Relative imports only within the same feature/module

### Layer Dependencies
- **Domain** → No external dependencies
- **Infrastructure** → Can import from Domain
- **Use Cases** → Can import from Domain and Infrastructure
- **Presentation** → Can import from all layers

### Barrel Exports
- Use `index.ts` files to create clean public APIs for modules
- Export domain models from `src/lib/domain/models.ts`
- Export use cases from `src/lib/use-cases/index.ts`