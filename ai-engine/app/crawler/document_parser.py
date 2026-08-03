import logging
import tempfile
import os
from typing import List, Dict, Any

from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from app.crawler.chunker import TextChunker

logger = logging.getLogger(__name__)

class DocumentParser:
    """Parses PDF, Word, and TXT files for knowledge ingestion."""

    def __init__(self, chunker: TextChunker = None):
        self.chunker = chunker or TextChunker()

    def parse_and_chunk(
        self,
        file_path: str,
        filename: str,
        chatbot_id: str,
        metadata: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """
        Parse a document and split it into chunks.

        Args:
            file_path: Temporary path to the uploaded file.
            filename: Original filename.
            chatbot_id: Unique identifier for the chatbot.
            metadata: Additional metadata.

        Returns:
            List of chunk dicts ready for ChromaDB.
        """
        base_metadata = metadata or {}
        base_metadata.update({"source_type": "file", "filename": filename})

        text_content = ""
        extension = filename.split(".")[-1].lower() if "." in filename else ""

        try:
            if extension == "pdf":
                loader = PyPDFLoader(file_path)
                pages = loader.load()
                text_content = "\n\n".join([page.page_content for page in pages])
            elif extension in ["docx", "doc"]:
                loader = Docx2txtLoader(file_path)
                docs = loader.load()
                text_content = "\n\n".join([doc.page_content for doc in docs])
            elif extension == "txt":
                with open(file_path, "r", encoding="utf-8") as f:
                    text_content = f.read()
            else:
                logger.warning(f"Unsupported file type: {extension}")
                return []

            logger.info(f"Successfully extracted {len(text_content)} characters from {filename}")

            if not text_content.strip():
                return []

            # Chunk the extracted text
            chunks = self.chunker.chunk(
                text=text_content,
                source_url=filename,  # Treat filename as source
                metadata=base_metadata
            )
            return chunks

        except Exception as e:
            logger.error(f"Error parsing document {filename}: {str(e)}")
            return []
