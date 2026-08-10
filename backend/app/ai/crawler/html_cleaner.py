import re
from typing import List

from bs4 import BeautifulSoup, NavigableString


class HTMLCleaner:
    """Cleans HTML content and extracts meaningful text."""

    # Tags to remove entirely (including their content)
    REMOVE_TAGS: List[str] = [
        "script", "style", "noscript", "iframe", "object", "embed",
        "applet", "form", "input", "button", "select", "textarea",
        "svg", "canvas", "video", "audio", "source", "map", "area",
    ]

    # Structural tags to remove (navigation, headers, footers, ads)
    STRUCTURAL_REMOVE_TAGS: List[str] = [
        "nav", "footer", "header",
    ]

    # Roles/classes/ids that indicate non-content areas
    NON_CONTENT_PATTERNS: List[str] = [
        "nav", "navbar", "navigation", "menu", "sidebar",
        "footer", "header", "banner",
        "ad", "ads", "advert", "advertisement", "sponsor",
        "cookie", "popup", "modal", "overlay",
        "social", "share", "sharing",
        "comment", "comments",
        "breadcrumb",
    ]

    # Heading tags to preserve for structure
    HEADING_TAGS: List[str] = ["h1", "h2", "h3", "h4", "h5", "h6"]

    def _matches_non_content_pattern(self, tag) -> bool:
        """Check if a tag matches non-content patterns via class, id, or role."""
        patterns = self.NON_CONTENT_PATTERNS

        # Check class attribute
        classes = tag.get("class", [])
        if isinstance(classes, str):
            classes = classes.split()
        for cls in classes:
            cls_lower = cls.lower()
            if any(pattern in cls_lower for pattern in patterns):
                return True

        # Check id attribute
        tag_id = tag.get("id", "")
        if tag_id:
            tag_id_lower = tag_id.lower()
            if any(pattern in tag_id_lower for pattern in patterns):
                return True

        # Check role attribute
        role = tag.get("role", "")
        if role:
            role_lower = role.lower()
            if role_lower in ("navigation", "banner", "contentinfo", "complementary"):
                return True

        return False

    def _normalize_whitespace(self, text: str) -> str:
        """Normalize whitespace while preserving paragraph breaks."""
        # Replace multiple newlines with double newline
        text = re.sub(r"\n\s*\n", "\n\n", text)
        # Replace multiple spaces with single space
        text = re.sub(r"[ \t]+", " ", text)
        # Clean up lines
        lines = []
        for line in text.split("\n"):
            stripped = line.strip()
            if stripped:
                lines.append(stripped)
            elif lines and lines[-1] != "":
                lines.append("")
        return "\n".join(lines).strip()

    def clean(self, html: str) -> str:
        """
        Clean HTML and extract meaningful text content.

        Args:
            html: Raw HTML string.

        Returns:
            Cleaned text with preserved heading structure.
        """
        if not html or not html.strip():
            return ""

        soup = BeautifulSoup(html, "lxml")

        # Remove unwanted tags entirely
        for tag_name in self.REMOVE_TAGS:
            for tag in soup.find_all(tag_name):
                tag.decompose()

        # Remove structural non-content tags
        for tag_name in self.STRUCTURAL_REMOVE_TAGS:
            for tag in soup.find_all(tag_name):
                tag.decompose()

        # Remove elements matching non-content patterns
        for tag in soup.find_all(True):
            if self._matches_non_content_pattern(tag):
                tag.decompose()

        # Try to find the main content area
        main_content = (
            soup.find("main")
            or soup.find("article")
            or soup.find(attrs={"role": "main"})
            or soup.find("div", class_=re.compile(r"(content|main|article|post|entry)", re.I))
            or soup.find("body")
        )

        if main_content is None:
            main_content = soup

        # Extract text with heading structure
        parts = []
        for element in main_content.descendants:
            if isinstance(element, NavigableString):
                text = element.strip()
                if text and element.parent.name not in self.REMOVE_TAGS:
                    parts.append(text)
            elif element.name in self.HEADING_TAGS:
                # Add heading markers for structure preservation
                heading_text = element.get_text(strip=True)
                if heading_text:
                    level = int(element.name[1])
                    prefix = "#" * level
                    parts.append(f"\n{prefix} {heading_text}\n")

        # Build final text — deduplicate headings that appear twice
        # (once from descendant traversal, once from heading extraction)
        raw_text = " ".join(parts)

        return self._normalize_whitespace(raw_text)
