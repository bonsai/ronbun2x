"""arXiv metadata extraction."""

from __future__ import annotations

import re
from dataclasses import dataclass

import requests


@dataclass
class ArxivMeta:
    arxiv_id: str
    title: str
    authors: list[str]
    abstract: str
    year: str
    source_url: str
    pdf_url: str


def parse_arxiv_id(raw: str) -> str | None:
    m = re.search(r"(?:arxiv\.org/(?:abs|pdf)/)?(\d{4,5}\.\d{4,5})", raw, re.I)
    return m.group(1) if m else None


def fetch_arxiv_meta(arxiv_id: str) -> ArxivMeta:
    source_url = f"https://arxiv.org/abs/{arxiv_id}"
    pdf_url = f"https://arxiv.org/pdf/{arxiv_id}.pdf"
    res = requests.get(source_url, headers={"User-Agent": "ronbun2x/0.1"}, timeout=30)
    res.raise_for_status()
    html = res.text

    title = _extract(html, r'<h1[^>]*class="title[^"]*"[^>]*>(.*?)</h1>', "")
    title = _strip_html(title)
    title = re.sub(r"^Title:\s*", "", title, flags=re.I).strip()

    abstract = _extract(html, r'<blockquote[^>]*class="abstract[^"]*"[^>]*>(.*?)</blockquote>', "")
    abstract = _strip_html(abstract).replace("Abstract:", "").strip()

    authors_block = _extract(html, r'<div[^>]*class="authors[^"]*"[^>]*>(.*?)</div>', "")
    authors = re.findall(r'<a[^>]*>([^<]+)</a>', authors_block)

    year_match = re.search(r"^(\d{2})", arxiv_id)
    year = f"20{year_match.group(1)}" if year_match else ""

    return ArxivMeta(
        arxiv_id=arxiv_id,
        title=title,
        authors=[a.strip() for a in authors],
        abstract=abstract,
        year=year,
        source_url=source_url,
        pdf_url=pdf_url,
    )


def _extract(html: str, pattern: str, default: str) -> str:
    m = re.search(pattern, html, re.S)
    return m.group(1).strip() if m else default


def _strip_html(raw: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", raw)).strip()
