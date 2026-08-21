"""CoerZ AI Agent Engine — RAG, Source Citation, Lead Extraction, and Human Handover."""
import re
import json
import time
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from app.ai.vectorstore.chroma_store import ChromaStore
from app.ai.llm.provider import LLMProvider

logger = logging.getLogger(__name__)

# Keywords that explicitly request human agent support
HANDOVER_KEYWORDS = [
    "gặp tư vấn viên", "gặp nhân viên", "gặp người thật", "nói chuyện với người",
    "chuyển người tư vấn", "gặp hỗ trợ viên", "gặp cskh", "gặp quản lý",
    "chuyển máy", "tư vấn trực tiếp", "cần người hỗ trợ", "gặp nhân viên tư vấn"
]

class AgentChatRequest(BaseModel):
    chatbot_id: str
    message: str
    history: List[Dict[str, Any]] = []
    bot_name: Optional[str] = "doanh nghiệp"
    custom_prompt: Optional[str] = None
    confidence_threshold: float = 0.35

class ExtractedLead(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    intent: Optional[str] = None

class AgentChatResponse(BaseModel):
    response: str
    sources: List[Dict[str, Any]] = []
    confidence_score: float = 0.0
    handover_required: bool = False
    handover_reason: Optional[str] = None  # "explicit_request", "low_confidence", "high_purchase_intent"
    extracted_lead: Optional[Dict[str, Any]] = None
    latency_ms: float = 0.0


class RAGChatbotAgent:
    """Intelligent RAG Agent capable of source citation, lead extraction, and human handover."""

    def __init__(self, chroma_store: ChromaStore = None):
        self.chroma_store = chroma_store or ChromaStore()

    def _extract_lead_info(self, text: str, history: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Extract lead information (email, phone, name, intent) from conversation text."""
        extracted = {}

        # Regex for Email
        email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
        if email_match:
            extracted["email"] = email_match.group(0)

        # Regex for Vietnamese Phone Number
        phone_match = re.search(r'(\+84|0)[3|5|7|8|9][0-9]{8}\b', text)
        if phone_match:
            extracted["phone"] = phone_match.group(0)

        # Basic name detection heuristics (e.g. "Tên tôi là X", "Tôi là Y")
        name_match = re.search(r'(?:tên tôi là|tôi tên là|mình tên là|tôi là)\s+([A-ZÀ-Ỹa-zà-ỹ\s]{2,20})', text, re.IGNORECASE)
        if name_match:
            extracted["name"] = name_match.group(1).strip()

        if extracted:
            extracted["source"] = "chatbot_agent"
            return extracted

        return None

    def _check_explicit_handover(self, message: str) -> bool:
        """Check if user explicitly requests human handover."""
        msg_lower = message.lower()
        return any(kw in msg_lower for kw in HANDOVER_KEYWORDS)

    def process_chat(self, req: AgentChatRequest, llm_provider_name: Optional[str] = None) -> AgentChatResponse:
        """Process chat query through the RAG Agent pipeline."""
        start_time = time.time()
        
        # 1. Check explicit handover request
        if self._check_explicit_handover(req.message):
            latency = round((time.time() - start_time) * 1000, 2)
            return AgentChatResponse(
                response="Dạ, em đã Ghi nhận yêu cầu của anh/chị. Em đang chuyển thông tin đến nhân viên tư vấn để hỗ trợ anh/chị ngay ạ!",
                sources=[],
                confidence_score=1.0,
                handover_required=True,
                handover_reason="explicit_request",
                extracted_lead=self._extract_lead_info(req.message, req.history),
                latency_ms=latency
            )

        # 2. Retrieve context & sources from Vector DB
        query_results = self.chroma_store.query(req.chatbot_id, req.message, n_results=4)
        
        sources = []
        context_chunks = []
        max_score = 0.0

        if query_results:
            seen_sources = set()
            for item in query_results:
                score = item.get("score", 0.0)
                if score > max_score:
                    max_score = score
                
                content = item.get("content", "").strip()
                if content:
                    context_chunks.append(content)
                
                meta = item.get("metadata", {})
                source_title = meta.get("filename") or meta.get("source_url") or meta.get("source") or "Tài liệu doanh nghiệp"
                if source_title not in seen_sources:
                    seen_sources.add(source_title)
                    sources.append({
                        "title": source_title,
                        "url": meta.get("source_url", ""),
                        "score": round(score, 3)
                    })

        context_str = "\n\n".join(context_chunks)
        confidence_score = round(max_score, 3)

        # 3. Check Confidence Threshold for Grounding / Handover
        handover_required = False
        handover_reason = None

        if confidence_score < req.confidence_threshold:
            handover_required = True
            handover_reason = "low_confidence"

        # 4. Construct System Prompt with Source Citation & Grounding Rules
        bot_name = req.bot_name or "doanh nghiệp"
        
        if req.custom_prompt:
            base_prompt = req.custom_prompt
        else:
            base_prompt = f"""Bạn là một trợ lý ảo thông minh (AI Agent) đại diện cho {bot_name}.
Nhiệm vụ của bạn là giải đáp thắc mắc và hỗ trợ khách hàng dựa TRÊN KHO TRI THỨC ĐƯỢC CUNG CẤP.

KHO TRI THỨC CỦA {bot_name.upper()}:
{context_str if context_str else "Chưa tìm thấy thông tin phù hợp trong kho tri thức."}

QUY TẮC BẮT BUỘC:
1. Trả lời CHÍNH XÁC, NGẮN GỌN, THÂN THIỆN dựa trên kho tri thức trên.
2. NẾU thông tin không có trong kho tri thức hoặc độ tin cậy thấp:
   - Hãy xin lỗi khéo léo và thông báo: "Thông tin này nằm ngoài kho tri thức hiện tại của em."
   - Đề xuất chuyển gặp nhân viên tư vấn hoặc xin Email/Số điện thoại để liên hệ lại.
3. Nếu phát hiện khách hàng muốn mua hàng/tư vấn sâu, hãy khéo léo gợi ý họ để lại SĐT hoặc Email.
4. Trả lời bằng văn bản thuần túy (plain text), KHÔNG dùng các định dạng markdown phức tạp như bold **, hashtag #.
"""

        llm = LLMProvider.get_llm(provider=llm_provider_name)
        messages = [SystemMessage(content=base_prompt)]

        # Add history
        history_msgs = []
        for msg in req.history[-6:]:
            role = msg.get("role")
            content = msg.get("content", "")
            if role == "user":
                history_msgs.append(HumanMessage(content=content))
            elif role in ["bot", "assistant"]:
                history_msgs.append(AIMessage(content=content))

        while history_msgs and isinstance(history_msgs[0], AIMessage):
            history_msgs.pop(0)

        messages.extend(history_msgs)
        messages.append(HumanMessage(content=req.message))

        # 5. Invoke LLM
        try:
            llm_response = llm.invoke(messages)
            response_text = llm_response.content
        except Exception as e:
            logger.error(f"LLM invocation error: {e}")
            response_text = f"Dạ, hệ thống đang bận. Quý khách vui lòng để lại thông tin để nhân viên {bot_name} hỗ trợ trực tiếp ạ!"
            handover_required = True
            handover_reason = "system_error"

        # 6. Lead Extraction
        extracted_lead = self._extract_lead_info(req.message, req.history)

        latency = round((time.time() - start_time) * 1000, 2)

        return AgentChatResponse(
            response=response_text,
            sources=sources,
            confidence_score=confidence_score,
            handover_required=handover_required,
            handover_reason=handover_reason,
            extracted_lead=extracted_lead,
            latency_ms=latency
        )
