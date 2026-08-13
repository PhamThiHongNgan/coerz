"""CoerZ Backend — FastAPI application entry point."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine


# ── Lifespan ─────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown events."""
    # Startup: verify DB connectivity
    try:
        async with engine.connect() as conn:
            await conn.execute(
                __import__("sqlalchemy").text("SELECT 1")
            )
        print("[OK] Ket noi Database thanh cong!")
    except Exception as e:
        print(f"[WARN] Khong the ket noi Database: {e}")

    yield

    # Shutdown: dispose engine
    await engine.dispose()
    print("[INFO] Da dong ket noi Database.")


# ── App instance ─────────────────────────────────────────────

app = FastAPI(
    title="CoerZ API",
    description="CoerZ B2B AI Chatbot Platform — Backend API",
    version="0.2.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ─────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ────────────────────────────────────────

from app.routers import auth, chatbot, lead  # noqa: E402

API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(chatbot.router, prefix=API_PREFIX)
app.include_router(lead.router, prefix=API_PREFIX)


# ── Health check ─────────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "service": "CoerZ Backend API", "version": "0.2.0"}


@app.get("/api/v1/health", tags=["Health"])
async def health():
    return {"status": "ok"}
