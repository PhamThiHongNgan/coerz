import logging
import uuid
from typing import List, Dict, Any, Optional

import chromadb
from chromadb.config import Settings as ChromaSettings

from app.ai.config import ai_settings as settings
from app.ai.embeddings.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)


class ChromaStore:
    """Manages vector storage and retrieval using ChromaDB in client-server mode."""

    def __init__(self, embedding_service: EmbeddingService = None):
        self.embedding_service = embedding_service or EmbeddingService()
        self.prefix = settings.CHROMA_COLLECTION_PREFIX
        self.client = chromadb.PersistentClient(
            path="./chroma_db",
            settings=ChromaSettings(
                anonymized_telemetry=False,
            ),
        )
        logger.info(
            f"Connected to ChromaDB at {settings.CHROMA_HOST}:{settings.CHROMA_PORT}"
        )

    def _collection_name(self, chatbot_id: str) -> str:
        """Generate a namespaced collection name."""
        return f"{self.prefix}_{chatbot_id}"

    def create_collection(self, chatbot_id: str):
        """
        Get or create a ChromaDB collection for a chatbot.

        Args:
            chatbot_id: Unique identifier for the chatbot.

        Returns:
            ChromaDB collection object.
        """
        name = self._collection_name(chatbot_id)
        collection = self.client.get_or_create_collection(
            name=name,
            metadata={"hnsw:space": "cosine"},
        )
        logger.info(f"Collection '{name}' ready (count={collection.count()})")
        return collection

    def add_documents(
        self,
        chatbot_id: str,
        chunks: List[Dict[str, Any]],
    ) -> int:
        """
        Add document chunks to the vector store.

        Args:
            chatbot_id: Unique identifier for the chatbot.
            chunks: List of chunk dicts with 'content' and 'metadata' keys.

        Returns:
            Number of chunks added.
        """
        if not chunks:
            return 0

        collection = self.create_collection(chatbot_id)

        # Prepare data for ChromaDB
        documents = [chunk["content"] for chunk in chunks]
        metadatas = [chunk.get("metadata", {}) for chunk in chunks]

        # Ensure all metadata values are strings (ChromaDB requirement)
        sanitized_metadatas = []
        for meta in metadatas:
            sanitized = {}
            for key, value in meta.items():
                if isinstance(value, (str, int, float, bool)):
                    sanitized[key] = value
                else:
                    sanitized[key] = str(value)
            sanitized_metadatas.append(sanitized)

        # Generate unique IDs
        ids = [str(uuid.uuid4()) for _ in chunks]

        # Generate embeddings
        embeddings = self.embedding_service.embed_documents(documents)

        # Add to collection in batches (ChromaDB has limits on batch size)
        batch_size = 100
        total_added = 0

        for i in range(0, len(documents), batch_size):
            end = min(i + batch_size, len(documents))
            collection.add(
                ids=ids[i:end],
                documents=documents[i:end],
                embeddings=embeddings[i:end],
                metadatas=sanitized_metadatas[i:end],
            )
            total_added += end - i
            logger.debug(f"Added batch {i // batch_size + 1}: {end - i} chunks")

        logger.info(
            f"Added {total_added} chunks to collection '{self._collection_name(chatbot_id)}'"
        )
        return total_added

    def query(
        self,
        chatbot_id: str,
        query_text: str,
        n_results: int = 5,
    ) -> List[Dict[str, Any]]:
        """
        Query the vector store for relevant chunks.

        Args:
            chatbot_id: Unique identifier for the chatbot.
            query_text: The query string to search for.
            n_results: Number of results to return.

        Returns:
            List of dicts with 'content', 'metadata', and 'score' keys.
        """
        collection_name = self._collection_name(chatbot_id)

        try:
            collection = self.client.get_collection(name=collection_name)
        except Exception:
            logger.warning(f"Collection '{collection_name}' not found")
            return []

        if collection.count() == 0:
            return []

        # Embed the query
        query_embedding = self.embedding_service.embed_query(query_text)

        # Query ChromaDB
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=min(n_results, collection.count()),
            include=["documents", "metadatas", "distances"],
        )

        # Format results
        formatted: List[Dict[str, Any]] = []
        if results and results["documents"]:
            for doc, meta, distance in zip(
                results["documents"][0],
                results["metadatas"][0],
                results["distances"][0],
            ):
                formatted.append({
                    "content": doc,
                    "metadata": meta,
                    "score": 1 - distance,  # Convert distance to similarity score
                })

        logger.info(
            f"Query returned {len(formatted)} results from '{collection_name}'"
        )
        return formatted

    def delete_collection(self, chatbot_id: str) -> bool:
        """
        Delete a chatbot's vector collection.

        Args:
            chatbot_id: Unique identifier for the chatbot.

        Returns:
            True if deleted, False if not found.
        """
        collection_name = self._collection_name(chatbot_id)
        try:
            self.client.delete_collection(name=collection_name)
            logger.info(f"Deleted collection '{collection_name}'")
            return True
        except Exception as e:
            logger.warning(f"Could not delete collection '{collection_name}': {e}")
            return False

    def get_collection_stats(self, chatbot_id: str) -> Optional[Dict[str, Any]]:
        """
        Get statistics about a chatbot's collection.

        Args:
            chatbot_id: Unique identifier for the chatbot.

        Returns:
            Dict with collection stats, or None if not found.
        """
        collection_name = self._collection_name(chatbot_id)
        try:
            collection = self.client.get_collection(name=collection_name)
            return {
                "name": collection_name,
                "count": collection.count(),
            }
        except Exception:
            return None
