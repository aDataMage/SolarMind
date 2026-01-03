# Multi-Agent AI System Template

This is a production-ready template for building AI-integrated applications using Next.js 16, Vercel AI SDK, and Clean Architecture.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Copy `.env.local.example` to `.env.local` and fill in your keys.

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Architecture

- **Domain Layer**: `src/lib/domain` (Entities, Business logic)
- **Infrastructure Layer**: `src/lib/infrastructure` (AI Agents, DB, 3rd party adapters)
- **Presentation Layer**: `src/app` (Next.js App Router)

## Key Features

- **AI Integration**: Vercel AI SDK Core 6.0
- **Database**: Drizzle ORM + Neon (Postgres)
- **Vector DB**: Qdrant
- **UI**: Tailwind CSS + Shadcn
