from fastapi import FastAPI, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import tempfile
import os
import logging
from typing import Optional

from app.ai.crawler.document_parser import DocumentParser
from app.ai.vectorstore.chroma_store import ChromaStore
from app.ai.crawler.web_crawler import WebCrawler
from app.ai.llm.provider import LLMProvider
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from app.ai.config import ai_settings
os.environ["OPENAI_API_KEY"] = ai_settings.effective_api_key or ""

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CoerZ AI Engine API")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

chroma_store = ChromaStore()
doc_parser = DocumentParser()

class UrlCrawlRequest(BaseModel):
    chatbot_id: str
    url: str

class TextIngestRequest(BaseModel):
    chatbot_id: str
    text: str

from app.ai.agent import RAGChatbotAgent, AgentChatRequest

agent_engine = RAGChatbotAgent(chroma_store=chroma_store)

class ChatRequest(BaseModel):
    chatbot_id: str
    message: str
    history: list[dict] = []
    bot_name: Optional[str] = "doanh nghiệp"
    custom_prompt: Optional[str] = None
    confidence_threshold: Optional[float] = 0.35

@app.post("/api/v1/chat")
async def chat_endpoint(request: ChatRequest):
    """Agent Chat endpoint featuring RAG retrieval, source citations, lead extraction, and human handover."""
    try:
        provider = ai_settings.auto_provider
        agent_req = AgentChatRequest(
            chatbot_id=request.chatbot_id,
            message=request.message,
            history=request.history,
            bot_name=request.bot_name,
            custom_prompt=request.custom_prompt,
            confidence_threshold=request.confidence_threshold or 0.35
        )
        res = agent_engine.process_chat(agent_req, llm_provider_name=provider)
        return res.model_dump()
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Chat agent error: {error_msg}")
        return {
            "response": f"Đã xảy ra lỗi hệ thống: {error_msg[:100]}...",
            "sources": [],
            "confidence_score": 0.0,
            "handover_required": True,
            "handover_reason": "system_error",
            "extracted_lead": None,
            "latency_ms": 0.0
        }

