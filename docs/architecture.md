# CoerVora AI — Architecture

## System Architecture

CoerVora AI follows a **modular monolith** architecture, designed to be simple enough for an MVP but structured for easy extraction into microservices later.

```
                    ┌─────────────────┐
                    │   CDN / Nginx   │
                    │   (Reverse Proxy)│
                    └───────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
    ┌─────────▼──┐  ┌──────▼──────┐  ┌───▼─────────┐
    │  Frontend   │  │   Backend   │  │  AI Engine   │
    │  Next.js 15 │  │   FastAPI   │  │  LangChain   │
    │  Port 3000  │  │  Port 8000  │  │  Port 8001   │
    └─────────────┘  └──────┬──────┘  └───┬─────────┘
                            │             │
                  ┌─────────┼─────────────┤
                  │         │             │
          ┌───────▼──┐  ┌───▼──────┐  ┌──▼──────────┐
          │PostgreSQL │  │ ChromaDB │  │   Ollama     │
          │ Port 5432 │  │Port 8200 │  │ Port 11434   │
          └──────────┘  └──────────┘  └──────────────┘
```

## Data Flow

### Chatbot Training Flow
1. User enters website URL in dashboard
2. Frontend → Backend: `POST /api/v1/chatbots/{id}/train`
3. Backend → AI Engine: `POST /crawl`
4. AI Engine crawls website, cleans HTML, chunks text
5. AI Engine generates embeddings via sentence-transformers
6. Embeddings stored in ChromaDB collection
7. Backend updates chatbot status to "active"

### Chat Query Flow
1. Website visitor sends message via widget
2. Widget → Backend: `POST /api/v1/widget/{token}/chat`
3. Backend → AI Engine: `POST /query`
4. AI Engine retrieves relevant chunks from ChromaDB
5. AI Engine builds prompt with context + question
6. AI Engine sends to Ollama/OpenAI for generation
7. Response streamed back through the chain

## Design Principles

### Repository-Service Pattern
```
API Route → Service → Repository → Database
```
- **API Routes**: HTTP request handling, validation, response formatting
- **Services**: Business logic, orchestration, cross-cutting concerns
- **Repositories**: Data access abstraction, query building

### Multi-Tenancy
- Shared database with `organization_id` on all tenant-specific tables
- JWT tokens carry user + organization context
- Middleware extracts and validates tenant context per request

### AI Architecture
- **Provider-agnostic**: Abstract LLM interface supports Ollama, OpenAI, DeepSeek, Qwen
- **RAG Pipeline**: Retrieval-Augmented Generation for grounded responses
- **Semantic Chunking**: Content split into meaningful chunks for better retrieval
- **Guardrails**: System prompts enforce on-topic, factual responses

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend Framework | Next.js 15 (App Router) | Server components, streaming, file-based routing |
| Backend Framework | FastAPI | Async, type-safe, auto-docs, Python AI ecosystem |
| Database | PostgreSQL | Battle-tested, JSONB flexibility, RLS support |
| Vector Store | ChromaDB | Simple setup, Python-native, upgradeable to Qdrant |
| AI Framework | LangChain | Composable chains, multi-model support, active ecosystem |
| Local LLM | Ollama | Easy setup, wide model support, OpenAI-compatible API |
| Auth | JWT | Stateless, scalable, simple to implement |
| Containerization | Docker Compose | Simple multi-service orchestration |
