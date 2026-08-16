import logging
from typing import List, Dict, Set, Optional
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup

from app.ai.config import ai_settings as settings
from app.ai.crawler.html_cleaner import HTMLCleaner

logger = logging.getLogger(__name__)


class WebCrawler:
    """Crawls a website and extracts page content for RAG ingestion."""

    def __init__(
        self,
        max_pages: int = None,
        timeout: int = None,
        user_agent: str = None,
    ):
        self.max_pages = max_pages or settings.CRAWLER_MAX_PAGES
        self.timeout = timeout or settings.CRAWLER_REQUEST_TIMEOUT
        self.user_agent = user_agent or settings.CRAWLER_USER_AGENT
        self.cleaner = HTMLCleaner()
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": self.user_agent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        })

    def _get_robots_parser(self, base_url: str) -> Optional[RobotFileParser]:
        """Fetch and parse robots.txt for the given base URL."""
        robots_url = urljoin(base_url, "/robots.txt")
        parser = RobotFileParser()
        try:
            parser.set_url(robots_url)
            parser.read()
            return parser
        except Exception as e:
            logger.warning(f"Could not fetch robots.txt from {robots_url}: {e}")
            return None

    def _is_allowed(self, url: str, robots_parser: Optional[RobotFileParser]) -> bool:
        """Check if crawling the URL is allowed by robots.txt."""
        if robots_parser is None:
            return True
        return robots_parser.can_fetch(self.user_agent, url)

    def _is_same_domain(self, url: str, base_domain: str) -> bool:
        """Check if the URL belongs to the same domain."""
        parsed = urlparse(url)
        return parsed.netloc == base_domain or parsed.netloc == ""

    def _is_valid_page_url(self, url: str) -> bool:
        """Filter out non-page URLs (images, scripts, stylesheets, etc.)."""
        skip_extensions = {
            ".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".ico",
            ".pdf", ".doc", ".docx", ".xls", ".xlsx",
            ".css", ".js", ".json", ".xml",
            ".zip", ".tar", ".gz", ".rar",
            ".mp3", ".mp4", ".avi", ".mov", ".wmv",
            ".woff", ".woff2", ".ttf", ".eot",
        }
        parsed = urlparse(url)
        path = parsed.path.lower()
        return not any(path.endswith(ext) for ext in skip_extensions)

    def _normalize_url(self, url: str) -> str:
        """Normalize URL by removing fragments and trailing slashes."""
        parsed = urlparse(url)
        # Remove fragment, keep scheme/netloc/path/query
        normalized = parsed._replace(fragment="")
        result = normalized.geturl()
        # Remove trailing slash for consistency (except root)
        if result.endswith("/") and parsed.path != "/":
            result = result.rstrip("/")
        return result

    def _extract_links(self, soup: BeautifulSoup, current_url: str, base_domain: str) -> List[str]:
        """Extract all valid internal links from a page."""
        links = []
        for anchor in soup.find_all("a", href=True):
            href = anchor["href"].strip()
            # Skip javascript: and mailto: links
            if href.startswith(("javascript:", "mailto:", "tel:", "#")):
                continue
            # Resolve relative URLs
            absolute_url = urljoin(current_url, href)
            absolute_url = self._normalize_url(absolute_url)
            # Only keep same-domain, valid page URLs
            if self._is_same_domain(absolute_url, base_domain) and self._is_valid_page_url(absolute_url):
                links.append(absolute_url)
        return links

    def _fetch_page(self, url: str) -> Optional[str]:
        """Fetch a single page and return its HTML content."""
        try:
            response = self.session.get(url, timeout=self.timeout, allow_redirects=True)
            response.raise_for_status()
            content_type = response.headers.get("Content-Type", "")
            if "text/html" not in content_type:
                logger.debug(f"Skipping non-HTML content at {url}: {content_type}")
                return None
            return response.text
        except requests.RequestException as e:
            logger.warning(f"Failed to fetch {url}: {e}")
            return None

    def crawl(self, url: str) -> List[Dict[str, str]]:
        """
        Crawl a website starting from the given URL.

        Args:
            url: The starting URL to crawl.

        Returns:
            List of dicts with keys: url, title, content
        """
        start_url = self._normalize_url(url)
        parsed_start = urlparse(start_url)
        base_domain = parsed_start.netloc

        # Fetch robots.txt
        base_url = f"{parsed_start.scheme}://{parsed_start.netloc}"
        robots_parser = self._get_robots_parser(base_url)

        visited: Set[str] = set()
        queue: List[str] = [start_url]
        pages: List[Dict[str, str]] = []

        logger.info(f"Starting crawl of {start_url} (max_pages={self.max_pages})")

        while queue and len(pages) < self.max_pages:
            current_url = queue.pop(0)

            if current_url in visited:
                continue
            visited.add(current_url)

            # Respect robots.txt
            if not self._is_allowed(current_url, robots_parser):
                logger.debug(f"Blocked by robots.txt: {current_url}")
                continue

            # Fetch the page
            html = self._fetch_page(current_url)
            if html is None:
                continue

            # Parse and extract content
            soup = BeautifulSoup(html, "lxml")

            # Extract title
            title_tag = soup.find("title")
            title = title_tag.get_text(strip=True) if title_tag else ""

            # Clean and extract body text
            content = self.cleaner.clean(html)

            # Only add pages with meaningful content
            if content and len(content.strip()) > 50:
                pages.append({
                    "url": current_url,
                    "title": title,
                    "content": content,
                })
                logger.info(f"Crawled ({len(pages)}/{self.max_pages}): {current_url}")

            # Extract and queue internal links
            links = self._extract_links(soup, current_url, base_domain)
            for link in links:
                if link not in visited:
                    queue.append(link)

        logger.info(f"Crawl complete. Collected {len(pages)} pages from {base_domain}")
        return pages
