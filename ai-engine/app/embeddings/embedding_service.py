import logging
from typing import List

from langchain_core.embeddings import Embeddings

from app.config import settings

logger = logging.getLogger(__name__)


class DummyEmbeddings:
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        # Dummy vector of 384 dimensions to mock embedding
        return [[0.1] * 384 for _ in texts]
        
    def embed_query(self, text: str) -> List[float]:
        return [0.1] * 384

class EmbeddingService:
    """Manages text embeddings using sentence-transformers via LangChain."""

    def __init__(self, model_name: str = None):
        self.model_name = model_name or settings.EMBEDDING_MODEL
        logger.info(f"Initializing embedding model: {self.model_name}")
        try:
            from langchain_community.embeddings import HuggingFaceEmbeddings
            self._embeddings = HuggingFaceEmbeddings(
                model_name=self.model_name,
                model_kwargs={"device": "cpu"},
                encode_kwargs={
                    "normalize_embeddings": True,
                    "batch_size": 64,
                },
            )
            logger.info(f"Embedding model '{self.model_name}' loaded successfully")
        except Exception as e:
            logger.warning(f"Failed to load HuggingFaceEmbeddings: {e}. Using DummyEmbeddings fallback for demo to prevent crash.")
            self._embeddings = DummyEmbeddings()

    @property
    def langchain_embeddings(self) -> Embeddings:
        """Return the underlying LangChain embeddings object."""
        return self._embeddings

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of documents.

        Args:
            texts: List of text strings to embed.

        Returns:
            List of embedding vectors.
        """
        if not texts:
            return []
        logger.info(f"Embedding {len(texts)} documents")
        embeddings = self._embeddings.embed_documents(texts)
        logger.info(f"Generated {len(embeddings)} embeddings (dim={len(embeddings[0])})")
        return embeddings

    def embed_query(self, text: str) -> List[float]:
        """
        Generate embedding for a single query text.

        Args:
            text: Query text to embed.

        Returns:
            Embedding vector.
        """
        return self._embeddings.embed_query(text)
