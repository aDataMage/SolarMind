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

## Project Structure

This project follows a Clean Architecture following the `src` directory pattern:

- **`src/app`**: Presentation Layer (Next.js App Router). Contains pages, layouts, and API routes.
- **`src/components`**: UI Components. Subdivided into `ui` (generic/shadcn) and feature-specific folders (e.g., `blog`).
- **`src/lib`**: Core Application Logic.
    - **`domain`**: Entities and business rules.
    - **`infrastructure`**: Implementation of external services (AI agents, DB adapters).
    - **`utils`**: Helper functions.
- **`src/types`**: TypeScript type definitions.

## Key Features

- **AI Integration**: Vercel AI SDK Core 6.0
- **Database**: Drizzle ORM + Neon (Postgres)
- **Vector DB**: Qdrant
- **UI**: Tailwind CSS + Shadcn
- **Testing**: Vitest
