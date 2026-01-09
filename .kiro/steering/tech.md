# Technology Stack

## Core Framework
- **Next.js 16** with App Router for full-stack development
- **TypeScript** for type safety throughout the application
- **React 19** for UI components

## AI & Data Stack
- **Vercel AI SDK Core 6.0+** for AI orchestration and streaming
- **LangChain** for complex agent workflows and state management
- **OpenAI GPT-4o** and **Google Gemini 1.5 Pro** as LLM providers
- **Qdrant** vector database for RAG and knowledge base
- **PostgreSQL** via Neon (serverless) for primary data storage
- **Drizzle ORM** for database operations and migrations

## UI & Styling
- **Tailwind CSS v4** for styling
- **Shadcn/ui** component library
- **Framer Motion** for animations
- **Lucide React** for icons

## Development Tools
- **ESLint** with Next.js configuration
- **Zod** for runtime validation and type safety
- **TypeScript** strict mode enabled

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Operations
```bash
npx drizzle-kit push        # Push schema changes to database
npx drizzle-kit generate    # Generate migration files
npx drizzle-kit migrate     # Run migrations
```

### Seeding & Setup
```bash
npm run seed                    # Seed database with initial data
tsx scripts/seed-qdrant.ts      # Populate vector database
tsx scripts/seed-knowledge-base.ts  # Load knowledge base content
```

## Environment Variables Required
- `OPENAI_API_KEY` - OpenAI API access
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google AI access
- `DATABASE_URL` - PostgreSQL connection string
- `QDRANT_URL` and `QDRANT_API_KEY` - Vector database access