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

class ChatRequest(BaseModel):
    chatbot_id: str
    message: str
    history: list[dict] = []
    bot_name: Optional[str] = "doanh nghiệp"

@app.post("/api/v1/ingest/file")
async def ingest_file(
    background_tasks: BackgroundTasks,
    chatbot_id: str = Form(...),
    file: UploadFile = File(...)
):
    """Endpoint to upload a Word/PDF/TXT file and ingest into ChromaDB"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Save the uploaded file to a temporary location
    try:
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name
            
        def process_file_bg(path: str, filename: str, bot_id: str):
            try:
                # Parse and chunk
                chunks = doc_parser.parse_and_chunk(
                    file_path=path,
                    filename=filename,
                    chatbot_id=bot_id
                )
                
                # Save to vector database
                if chunks:
                    added = chroma_store.add_documents(bot_id, chunks)
                    logger.info(f"Ingested {added} chunks from {filename}")
                else:
                    logger.warning(f"No text could be extracted from {filename}")
            finally:
                # Clean up temporary file
                if os.path.exists(path):
                    os.remove(path)
                    
        # Process in background so we don't block the HTTP response
        background_tasks.add_task(process_file_bg, temp_path, file.filename, chatbot_id)
        
        return {"status": "success", "message": "File is being processed in the background", "filename": file.filename}
        
    except Exception as e:
        logger.error(f"Error handling file upload: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/ingest/url")
async def ingest_url(
    request: UrlCrawlRequest,
    background_tasks: BackgroundTasks
):
    """Endpoint to crawl a URL and ingest into ChromaDB"""
    
    def process_url_bg(url: str, bot_id: str):
        try:
            # Note: Assuming WebCrawler has a crawl_and_chunk method. 
            # Adjust according to your actual implementation.
            crawler = WebCrawler(max_pages=10)
            pages = crawler.crawl(url) # Simple example
            
            from app.ai.crawler.chunker import TextChunker
            chunker = TextChunker()
            chunks = chunker.chunk_pages(pages)
            
            if chunks:
                chroma_store.add_documents(bot_id, chunks)
                logger.info(f"Ingested URL {url}")
        except Exception as e:
            logger.error(f"Error crawling {url}: {str(e)}")

    background_tasks.add_task(process_url_bg, request.url, request.chatbot_id)
    return {"status": "success", "message": "URL is being crawled in the background"}

@app.post("/api/v1/ingest/text")
async def ingest_text(
    request: TextIngestRequest,
    background_tasks: BackgroundTasks
):
    """Endpoint to ingest plain text into ChromaDB"""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".txt", mode='w', encoding='utf-8') as temp_file:
            temp_file.write(request.text)
            temp_path = temp_file.name
            
        def process_text_bg(path: str, bot_id: str):
            try:
                chunks = doc_parser.parse_and_chunk(
                    file_path=path,
                    filename="manual_text.txt",
                    chatbot_id=bot_id
                )
                if chunks:
                    added = chroma_store.add_documents(bot_id, chunks)
                    logger.info(f"Ingested {added} chunks from manual text")
                else:
                    logger.warning("No text could be extracted from manual text")
            finally:
                if os.path.exists(path):
                    os.remove(path)
                    
        background_tasks.add_task(process_text_bg, temp_path, request.chatbot_id)
        return {"status": "success", "message": "Text is being processed in the background"}
        
    except Exception as e:
        logger.error(f"Error handling text ingest: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/v1/chat")
async def chat_endpoint(request: ChatRequest):
    """Chat endpoint that queries the vector database and generates a response using Mistral LLM"""
    try:
        results = chroma_store.query(request.chatbot_id, request.message, n_results=3)
        
        context = ""
        if results:
            context = "\n".join([r["content"] for r in results])
            
        # Auto-detect provider: Ollama locally, OpenAI-compatible (e.g. Groq) on cloud
        provider = ai_settings.auto_provider
        logger.info(f"Using LLM provider: {provider}")
        llm = LLMProvider.get_llm(provider=provider)
        
        bot_name = request.bot_name or "doanh nghiệp"
        system_prompt = f"""Bạn là một trợ lý ảo thông minh và chuyên nghiệp, được tạo ra để tư vấn và hỗ trợ khách hàng cho {bot_name}.

THÔNG TIN TỪ CƠ SỞ DỮ LIỆU CỦA {bot_name.upper()}:
{context}

HƯỚNG DẪN TRẢ LỜI:
1. Hãy đóng vai là nhân viên hỗ trợ khách hàng của {bot_name}. Dựa CHỦ YẾU vào thông tin được cung cấp để trả lời khách hàng một cách chính xác, ngắn gọn và thân thiện.
2. Tuyệt đối không bịa đặt thông tin. Nếu khách hỏi vấn đề không có trong CƠ SỞ DỮ LIỆU, hãy khéo léo từ chối hoặc xin thông tin liên hệ (số điện thoại/email) để nhân viên thật tư vấn sau.
3. QUAN TRỌNG: TUYỆT ĐỐI KHÔNG sử dụng định dạng Markdown (không dùng dấu *, không dùng dấu #, không in đậm, không in nghiêng). Hãy trả lời bằng văn bản thuần túy (plain text), có thể dùng emoji và xuống dòng cho dễ nhìn.
"""
        messages = [
            SystemMessage(content=system_prompt)
        ]
        
        # Add history
        for msg in request.history[-6:]:  # Keep last 6 messages to prevent token overflow
            if msg.get("role") == "user":
                messages.append(HumanMessage(content=msg.get("content")))
            elif msg.get("role") == "bot":
                messages.append(AIMessage(content=msg.get("content")))
                
        messages.append(HumanMessage(content=request.message))
        
        response = llm.invoke(messages)
        
        return {"response": response.content}
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Chat error: {error_msg}")
        
        if "429" in error_msg or "insufficient_quota" in error_msg:
            try:
                logger.info("OpenAI API limit reached. Falling back to Anthropic...")
                fallback_llm = LLMProvider.get_llm(provider="anthropic")
                response = fallback_llm.invoke(messages)
                return {"response": response.content}
            except Exception as anthropic_err:
                logger.error(f"Anthropic fallback failed: {str(anthropic_err)}. Falling back to Ollama...")
                try:
                    fallback_llm = LLMProvider.get_llm(provider="ollama")
                    response = fallback_llm.invoke(messages)
                    return {"response": response.content}
                except Exception as ollama_err:
                    logger.error(f"Ollama fallback failed: {str(ollama_err)}. Falling back to Dummy LLM...")
                    fallback_llm = LLMProvider.get_llm(provider="dummy")
                    response = fallback_llm.invoke(messages)
                    return {"response": response.content}
                
        return {"response": f"Đã xảy ra lỗi hệ thống: {error_msg[:100]}..."}
