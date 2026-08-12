import logging
from typing import Optional

from langchain_community.chat_models import ChatOllama
from langchain_community.chat_models import ChatOpenAI
from langchain_core.language_models import BaseChatModel

from app.ai.config import ai_settings

logger = logging.getLogger(__name__)


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
            provider: LLM provider ('ollama' or 'openai').
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
        elif provider == "openai":
            model_name = model or ai_settings.OPENAI_MODEL
            api_key = ai_settings.COERZ_API_KEY or "not-set"
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
        else:
            raise ValueError(
                f"Unsupported LLM provider: '{provider}'. "
                f"Supported providers: 'ollama', 'openai'"
            )
