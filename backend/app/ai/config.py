from pydantic_settings import BaseSettings
from typing import Optional, Literal


class AISettings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ChromaDB
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    CHROMA_COLLECTION_PREFIX: str = "coerz"

    # Ollama
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.1"

    # Google Gemini
    GOOGLE_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.7-flash"

    # OpenAI-compatible
    COERZ_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-4o-mini"

    @property
    def effective_api_key(self) -> Optional[str]:
        """Return COERZ_API_KEY if set, otherwise fall back to OPENAI_API_KEY."""
        return self.COERZ_API_KEY or self.OPENAI_API_KEY

    # Embeddings
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    # Crawler
    CRAWLER_MAX_PAGES: int = 50
    CRAWLER_REQUEST_TIMEOUT: int = 15
    CRAWLER_USER_AGENT: str = "CoerZ-Bot/1.0"

    # LLM defaults
    LLM_PROVIDER: Optional[str] = None  # "ollama", "gemini", "openai", "anthropic". None = auto-detect.
    LLM_TEMPERATURE: float = 0.3
    LLM_MAX_TOKENS: int = 1024

    @property
    def auto_provider(self) -> str:
        """Auto-detect LLM provider: use explicit setting, or infer from API key presence."""
        if self.LLM_PROVIDER:
            return self.LLM_PROVIDER
        # Priority: Gemini (free) > OpenAI-compatible > Ollama (local)
        if self.GOOGLE_API_KEY:
            return "gemini"
        if self.effective_api_key:
            return "openai"
        # Default to local Ollama
        return "ollama"

    model_config = {
        "env_file": (".env", "../.env"),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


ai_settings = AISettings()
