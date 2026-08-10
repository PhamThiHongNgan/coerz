from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ChromaDB
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    CHROMA_COLLECTION_PREFIX: str = "coervora"

    # Ollama
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.1"

    # OpenAI-compatible
    COERVORA_API_KEY: Optional[str] = None
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-4o-mini"

    # Embeddings
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    # Crawler
    CRAWLER_MAX_PAGES: int = 50
    CRAWLER_REQUEST_TIMEOUT: int = 15
    CRAWLER_USER_AGENT: str = "CoerVora-Bot/1.0"

    # LLM defaults
    LLM_TEMPERATURE: float = 0.3
    LLM_MAX_TOKENS: int = 1024

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
