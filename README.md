<div align="center">

# 🚀 CoerVora AI

### Turn Any Website Into an AI Sales Assistant

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3-blue)](https://langchain.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**CoerVora AI** is a production-ready AI SaaS platform that enables businesses to create intelligent chatbots trained on their website content. Boost conversions, capture leads, and provide 24/7 AI-powered customer support.

[Getting Started](#-getting-started) · [Features](#-features) · [Architecture](#-architecture) · [Docs](./docs/)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌐 **Website Crawling** | Automatically crawl and understand any website's content |
| 🤖 **AI Chatbot** | RAG-powered chatbot trained on your specific content |
| 📊 **Analytics Dashboard** | Track conversations, leads, and conversion metrics |
| 🎨 **Embeddable Widget** | One-line integration for any website |
| 🔌 **Multi-Model AI** | Support for Ollama, DeepSeek, Qwen, and OpenAI-compatible models |
| 📱 **Lead Capture** | Automatically capture and qualify leads from conversations |
| 🏢 **Multi-Tenant** | Full organization/team support with role-based access |
| 🎯 **Customizable** | Theme, branding, and behavior customization |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CoerVora AI Platform                   │
├─────────────┬──────────────┬───────────┬────────────────┤
│  Frontend   │   Backend    │ AI Engine │   Data Layer   │
│  Next.js 15 │   FastAPI    │ LangChain │  PostgreSQL    │
│  TypeScript │   Python     │  Ollama   │  ChromaDB      │
│  TailwindCSS│   JWT Auth   │  RAG      │                │
│  shadcn/ui  │   REST API   │  Crawlers │                │
└─────────────┴──────────────┴───────────┴────────────────┘
```

### Project Structure

```
coervora-ai/
├── frontend/          → Next.js 15 + TypeScript + TailwindCSS
├── backend/           → FastAPI + SQLAlchemy + JWT Auth
├── ai-engine/         → LangChain + ChromaDB + Crawlers
├── docker/            → Docker configs and init scripts
├── docs/              → Architecture & API documentation
├── docker-compose.yml → Full-stack orchestration
├── .env.example       → Environment template
└── README.md          → This file
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js](https://nodejs.org/) 20+ (for local frontend dev)
- [Python](https://python.org/) 3.11+ (for local backend dev)
- [Ollama](https://ollama.ai/) (for local AI models)

### Quick Start with Docker

```bash
# 1. Clone the repository
git clone https://github.com/your-org/coervora-ai.git
cd coervora-ai

# 2. Copy environment config
cp .env.example .env

# 3. Start all services
docker compose up -d

# 4. Open the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
# AI Engine: http://localhost:8001/docs
```

### Local Development

#### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

#### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000/docs
```

#### AI Engine
```bash
cd ai-engine
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
# → http://localhost:8001/docs
```

#### Database (Docker)
```bash
# Start just PostgreSQL + ChromaDB
docker compose up db chromadb -d
```

#### Ollama (Local AI)
```bash
# Install Ollama, then pull a model
ollama pull qwen2:7b
# Ollama runs at http://localhost:11434
```

---

## 🔧 Configuration

All configuration is via environment variables. See [.env.example](.env.example) for all options.

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://...` |
| `SECRET_KEY` | JWT signing key | *(required)* |
| `OLLAMA_BASE_URL` | Ollama API endpoint | `http://localhost:11434` |
| `OLLAMA_MODEL` | Default Ollama model | `qwen2:7b` |
| `CHROMA_HOST` | ChromaDB host | `chromadb` |
| `NEXT_PUBLIC_API_URL` | Frontend → Backend API URL | `http://localhost:8000/api/v1` |

---

## 📡 API Overview

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Login, get JWT |
| GET | `/api/v1/auth/me` | Get current user |

### Chatbots
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/chatbots` | List chatbots |
| POST | `/api/v1/chatbots` | Create chatbot |
| POST | `/api/v1/chatbots/{id}/train` | Train on website |
| DELETE | `/api/v1/chatbots/{id}` | Delete chatbot |

### Widget (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/widget/{token}/config` | Get widget config |
| POST | `/api/v1/widget/{token}/chat` | Send chat message |

Full API documentation available at `http://localhost:8000/docs` (Swagger UI).

---

## 🎨 Widget Integration

Add CoerVora AI chatbot to any website with one line:

```html
<script
  async
  src="https://your-domain.com/widget/v1/loader.js"
  data-chatbot-id="your-chatbot-embed-token"
  data-theme="dark"
  data-position="bottom-right">
</script>
```

---

## 🗺 Roadmap

### ✅ v0.1 — Foundation (Current)
- [x] Project architecture
- [x] FastAPI backend with auth
- [x] Database schema & models
- [x] AI engine with RAG pipeline
- [x] Landing page & dashboard UI
- [x] Docker Compose setup

### 🔜 v0.2 — Core Features
- [ ] Full chatbot training pipeline
- [ ] Live widget embedding
- [ ] WebSocket streaming responses
- [ ] Analytics dashboards with real data

### 🔮 v0.3 — Growth
- [ ] CRM integrations
- [ ] WhatsApp / Messenger channels
- [ ] AI voice assistant
- [ ] Workflow automation
- [ ] Payment system (Stripe)
- [ ] White-label SaaS support

---

## 🤝 Contributing

We welcome contributions! Please see [docs/development-guide.md](docs/development-guide.md) for guidelines.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">
<strong>Built with ❤️ by CoerVora AI Team</strong>
<br/>
<sub>Powered by Next.js · FastAPI · LangChain · Ollama</sub>
</div>
