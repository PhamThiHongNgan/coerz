import logging
from typing import List, Dict, Any

from langchain_text_splitters import RecursiveCharacterTextSplitter

logger = logging.getLogger(__name__)


class TextChunker:
    """Splits text into semantically meaningful chunks for embedding."""

    # Splitting hierarchy: double newlines > single newlines > sentences > words
    DEFAULT_SEPARATORS = [
        "\n\n",   # Paragraph breaks
        "\n",     # Line breaks
        ". ",     # Sentence endings
        "? ",     # Question endings
        "! ",     # Exclamation endings
        "; ",     # Semicolon breaks
        ", ",     # Comma breaks
        " ",      # Word breaks
        "",       # Character-level fallback
    ]

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
        separators: List[str] = None,
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=separators or self.DEFAULT_SEPARATORS,
            length_function=len,
            is_separator_regex=False,
        )

    def chunk(
        self,
        text: str,
        source_url: str = "",
        metadata: Dict[str, Any] = None,
    ) -> List[Dict[str, Any]]:
        """
        Split text into chunks with metadata.

        Args:
            text: The text content to chunk.
            source_url: The URL the text was crawled from.
            metadata: Additional metadata to attach to each chunk.

        Returns:
            List of dicts with keys: content, metadata
        """
        if not text or not text.strip():
            return []

        # Split text into chunks
        raw_chunks = self.splitter.split_text(text)

        # Build chunk objects with metadata
        chunks: List[Dict[str, Any]] = []
        base_metadata = metadata or {}

        for idx, chunk_text in enumerate(raw_chunks):
            chunk_metadata = {
                **base_metadata,
                "source_url": source_url,
                "chunk_index": idx,
                "total_chunks": len(raw_chunks),
                "chunk_size": len(chunk_text),
            }
            chunks.append({
                "content": chunk_text,
                "metadata": chunk_metadata,
            })

        logger.info(
            f"Split text from {source_url} into {len(chunks)} chunks "
            f"(size={self.chunk_size}, overlap={self.chunk_overlap})"
        )
        return chunks

    def chunk_pages(
        self,
        pages: List[Dict[str, str]],
    ) -> List[Dict[str, Any]]:
        """
        Chunk multiple pages at once.

        Args:
            pages: List of page dicts with keys: url, title, content

        Returns:
            List of chunk dicts with content and metadata.
        """
        all_chunks: List[Dict[str, Any]] = []

        for page in pages:
            page_chunks = self.chunk(
                text=page.get("content", ""),
                source_url=page.get("url", ""),
                metadata={
                    "title": page.get("title", ""),
                },
            )
            all_chunks.extend(page_chunks)

        logger.info(f"Total chunks from {len(pages)} pages: {len(all_chunks)}")
        return all_chunks
