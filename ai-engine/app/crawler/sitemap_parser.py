import logging
from typing import List
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from app.config import settings

logger = logging.getLogger(__name__)


class SitemapParser:
    """Parses sitemap.xml and sitemap index files to extract page URLs."""

    def __init__(self, timeout: int = None, user_agent: str = None):
        self.timeout = timeout or settings.CRAWLER_REQUEST_TIMEOUT
        self.user_agent = user_agent or settings.CRAWLER_USER_AGENT

    def _fetch_xml(self, url: str) -> str | None:
        """Fetch XML content from a URL."""
        try:
            response = requests.get(
                url,
                timeout=self.timeout,
                headers={"User-Agent": self.user_agent},
            )
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            logger.warning(f"Failed to fetch sitemap from {url}: {e}")
            return None

    def _parse_sitemap_index(self, xml_content: str, base_url: str) -> List[str]:
        """Parse a sitemap index file and recursively fetch all child sitemaps."""
        soup = BeautifulSoup(xml_content, "lxml-xml")
        sitemap_tags = soup.find_all("sitemap")

        all_urls: List[str] = []
        for sitemap in sitemap_tags:
            loc = sitemap.find("loc")
            if loc and loc.text:
                child_url = loc.text.strip()
                logger.info(f"Found child sitemap: {child_url}")
                child_urls = self.parse(child_url)
                all_urls.extend(child_urls)

        return all_urls

    def _parse_urlset(self, xml_content: str) -> List[str]:
        """Parse a standard sitemap urlset and extract URLs."""
        soup = BeautifulSoup(xml_content, "lxml-xml")
        url_tags = soup.find_all("url")

        urls: List[str] = []
        for url_tag in url_tags:
            loc = url_tag.find("loc")
            if loc and loc.text:
                page_url = loc.text.strip()
                urls.append(page_url)

        return urls

    def parse(self, url: str) -> List[str]:
        """
        Parse a sitemap URL and return all page URLs.

        Handles both sitemap index files and regular sitemap files.

        Args:
            url: URL of the sitemap (e.g., https://example.com/sitemap.xml)

        Returns:
            List of page URLs found in the sitemap.
        """
        xml_content = self._fetch_xml(url)
        if xml_content is None:
            return []

        # Detect if it's a sitemap index or a regular sitemap
        if "<sitemapindex" in xml_content:
            logger.info(f"Detected sitemap index at {url}")
            return self._parse_sitemap_index(xml_content, url)
        elif "<urlset" in xml_content:
            logger.info(f"Detected sitemap urlset at {url}")
            return self._parse_urlset(xml_content)
        else:
            logger.warning(f"Unknown sitemap format at {url}")
            return []

    def discover_sitemap(self, base_url: str) -> List[str]:
        """
        Try to discover and parse sitemap from common locations.

        Args:
            base_url: The base URL of the website (e.g., https://example.com)

        Returns:
            List of page URLs found.
        """
        common_paths = [
            "/sitemap.xml",
            "/sitemap_index.xml",
            "/sitemap/sitemap.xml",
            "/wp-sitemap.xml",
        ]

        for path in common_paths:
            sitemap_url = urljoin(base_url, path)
            logger.info(f"Trying sitemap at: {sitemap_url}")
            urls = self.parse(sitemap_url)
            if urls:
                logger.info(f"Found {len(urls)} URLs in sitemap at {sitemap_url}")
                return urls

        logger.info(f"No sitemap found for {base_url}")
        return []
