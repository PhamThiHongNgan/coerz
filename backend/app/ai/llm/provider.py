import logging
from typing import Optional

from langchain_community.chat_models import ChatOllama
from langchain_community.chat_models import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import BaseMessage, AIMessage
from langchain_core.outputs import ChatResult, ChatGeneration
from typing import List, Optional, Any

from app.ai.config import ai_settings

logger = logging.getLogger(__name__)


class DummyLLM(BaseChatModel):
    """A dummy LLM that returns a friendly hardcoded response for testing."""
    
    def _generate(self, messages: List[BaseMessage], stop: Optional[List[str]] = None, run_manager: Optional[Any] = None, **kwargs: Any) -> ChatResult:
        response_text = "Dạ, hiện tại hệ thống AI đang được bảo trì (API Key hết hạn mức). Đây là tin nhắn phản hồi tự động. Khi nào hệ thống được cấp API Key mới, tôi sẽ trả lời bạn đầy đủ nhé!"
        message = AIMessage(content=response_text)
        generation = ChatGeneration(message=message)
        return ChatResult(generations=[generation])
        
    @property
    def _llm_type(self) -> str:
        return "dummy"


class LLMProvider:
    """Factory for creating LangChain LLM instances."""

    @staticmethod
    def get_llm(
        provider: str = "ollama",
        model: str = None,
        temperature: float = None,
        max_tokens: int = None,
        streaming: bool = False,
    ) -> BaseChatModel:
        """
        Create and return a LangChain chat model.

        Args:
            provider: LLM provider ('ollama', 'gemini', 'openai', 'anthropic', or 'dummy').
            model: Model name override.
            temperature: Temperature for generation.
            max_tokens: Maximum tokens to generate.
            streaming: Whether to enable streaming.

        Returns:
            A LangChain BaseChatModel instance.
        """
        temperature = temperature if temperature is not None else ai_settings.LLM_TEMPERATURE
        max_tokens = max_tokens or ai_settings.LLM_MAX_TOKENS

        if provider == "ollama":
            model_name = model or ai_settings.OLLAMA_MODEL
            logger.info(f"Creating Ollama LLM: model={model_name}, base_url={ai_settings.OLLAMA_BASE_URL}")
            return ChatOllama(
                base_url=ai_settings.OLLAMA_BASE_URL,
                model=model_name,
                temperature=temperature,
                num_predict=max_tokens,
                streaming=streaming,
            )
        elif provider == "gemini":
            model_name = model or ai_settings.GEMINI_MODEL
            api_key = ai_settings.GOOGLE_API_KEY
            if not api_key:
                raise ValueError("GOOGLE_API_KEY is required for Gemini provider")
            logger.info(f"Creating Gemini LLM: model={model_name}")
            return ChatGoogleGenerativeAI(
                model=model_name,
                google_api_key=api_key,
                temperature=temperature,
                max_output_tokens=max_tokens,
                convert_system_message_to_human=True,
            )
        elif provider == "openai":
            model_name = model or ai_settings.OPENAI_MODEL
            api_key = ai_settings.effective_api_key or "not-set"
            logger.info(
                f"Creating OpenAI-compatible LLM: model={model_name}, "
                f"base_url={ai_settings.OPENAI_BASE_URL}"
            )
            return ChatOpenAI(
                model=model_name,
                openai_api_key=api_key,
                openai_api_base=ai_settings.OPENAI_BASE_URL,
                temperature=temperature,
                max_tokens=max_tokens,
                streaming=streaming,
            )
        elif provider == "anthropic":
            model_name = model or "claude-3-haiku-20240307"
            logger.info(f"Creating Anthropic LLM: model={model_name}")
            return ChatAnthropic(
                model_name=model_name,
                temperature=temperature,
                max_tokens_to_sample=max_tokens,
                streaming=streaming,
            )
        elif provider == "dummy":
            logger.info("Creating Dummy LLM (Fallback mode)")
            return DummyLLM()
        else:
            raise ValueError(
                f"Unsupported LLM provider: '{provider}'. "
                f"Supported providers: 'ollama', 'gemini', 'openai', 'anthropic', 'dummy'"
            )
