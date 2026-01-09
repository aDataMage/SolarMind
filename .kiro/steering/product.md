# Product Overview

This is a **Multi-Agent AI System Template** designed for building AI-integrated applications with conversational interfaces. The system serves as a production-ready foundation for creating industry-specific AI assistants (hotels, real estate, healthcare, e-commerce, etc.).

## Core Capabilities

- **Conversational AI**: Multi-agent system with intent classification and specialized agents
- **Knowledge Base**: RAG implementation using vector search for FAQ and document retrieval
- **Business Logic**: Clean architecture with domain-driven design for industry adaptation
- **Multi-Channel**: Support for web chat, Telegram, and WhatsApp integrations
- **Admin Dashboard**: Management interface for monitoring and configuration

## Architecture Philosophy

The system follows **Clean Architecture** principles with clear separation between:
- **Domain Layer**: Pure business logic and entities
- **Infrastructure Layer**: AI agents, database, and external service adapters  
- **Presentation Layer**: Next.js App Router for web interface and API endpoints

This template is designed to be easily adapted to different industries by modifying the domain models, knowledge base content, and agent prompts while keeping the core AI orchestration intact.