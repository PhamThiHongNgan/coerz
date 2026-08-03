# CoerVora AI — Development Guide

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Docker | 24+ | Container orchestration |
| Node.js | 20+ | Frontend development |
| Python | 3.11+ | Backend + AI development |
| Ollama | Latest | Local AI models |
| Git | Latest | Version control |

## First-Time Setup

### 1. Clone & Configure
```bash
git clone https://github.com/your-org/coervora-ai.git
cd coervora-ai
cp .env.example .env
# Edit .env with your configuration
```

### 2. Start Infrastructure
```bash
# Start PostgreSQL + ChromaDB
docker compose up db chromadb -d

# Wait for healthy state
docker compose ps
```

### 3. Setup Ollama
```bash
# Install Ollama from https://ollama.ai
# Pull recommended model
ollama pull qwen2:7b
```

### 4. Start Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 5. Start AI Engine
```bash
cd ai-engine
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### 6. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 7. Open the App
- Frontend: http://localhost:3000
- Backend Swagger: http://localhost:8000/docs
- AI Engine Swagger: http://localhost:8001/docs

## Project Structure

### Frontend (`/frontend`)
```
src/
├── app/                 # Next.js App Router pages
│   ├── (marketing)/     # Public pages (landing, pricing)
│   ├── (auth)/          # Login, register
│   └── (dashboard)/     # Protected dashboard
├── components/
│   ├── ui/              # Reusable UI primitives
│   ├── shared/          # Navbar, footer, etc.
│   ├── dashboard/       # Dashboard-specific components
│   └── chatbot/         # Chatbot-related components
├── lib/                 # Utilities (cn, api client)
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── services/            # API service functions
```

### Backend (`/backend`)
```
app/
├── api/v1/              # API route handlers
├── core/                # Config, database, security
├── models/              # SQLAlchemy ORM models
├── schemas/             # Pydantic request/response schemas
├── services/            # Business logic layer
└── repositories/        # Data access layer
```

### AI Engine (`/ai-engine`)
```
app/
├── crawler/             # Web crawling & HTML cleaning
├── embeddings/          # Embedding generation
├── vectorstore/         # ChromaDB integration
├── rag/                 # RAG pipeline & prompts
└── llm/                 # LLM provider abstraction
```

## Coding Guidelines

### TypeScript (Frontend)
- Use TypeScript strict mode
- Define interfaces in `types/`
- Use `cn()` utility for conditional class names
- Prefer Server Components; use `'use client'` only when needed

### Python (Backend + AI)
- Use async/await for all I/O operations
- Follow repository → service → API layering
- Use Pydantic v2 for all schemas
- Type-hint all function parameters and returns

### Git Workflow
```bash
git checkout -b feature/my-feature
# Make changes
git add .
git commit -m "feat: description of change"
git push origin feature/my-feature
# Create pull request
```

## Common Tasks

### Add a New API Endpoint
1. Create/update schema in `backend/app/schemas/`
2. Add repository method in `backend/app/repositories/`
3. Add service method in `backend/app/services/`
4. Create route in `backend/app/api/v1/`
5. Register route in `backend/app/api/v1/router.py`

### Add a New Dashboard Page
1. Create page in `frontend/src/app/(dashboard)/your-page/page.tsx`
2. Add nav link in `frontend/src/components/dashboard/sidebar.tsx`
3. Create any needed components in `frontend/src/components/`

### Add a New AI Model Provider
1. Create provider in `ai-engine/app/llm/`
2. Register in `ai-engine/app/llm/provider.py`
