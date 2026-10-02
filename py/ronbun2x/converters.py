"""ronbun2x converters."""

from __future__ import annotations

from .extract import ArxivMeta


def two_line(meta: ArxivMeta) -> dict:
    sentences = [s for s in meta.abstract.replace("。", ".").split(".") if s]
    hook = sentences[0][:80] if sentences else meta.abstract[:80]
    return {
        "format": "two-line-dialogue",
        "title": meta.title,
        "lines": [
            {"speaker": "ボケ", "text": f"「{meta.title}」って何？要するに…{hook}、ってこと？"},
            {"speaker": "ツッコミ", "text": f"違う。{hook}の問題を解くために、論文で提案した新しい手法のことだ。"},
        ],
    }


def yonkoma(meta: ArxivMeta) -> dict:
    sentences = [s for s in meta.abstract.replace("。", ".").split(".") if s]
    problem = sentences[0] if len(sentences) > 0 else ""
    method = sentences[1] if len(sentences) > 1 else ""
    result = sentences[2] if len(sentences) > 2 else ""
    return {
        "format": "yonkoma-manuscript",
        "title": meta.title,
        "panels": [
            {"label": "1. 課題", "text": problem},
            {"label": "2. 提案", "text": method},
            {"label": "3. 検証", "text": result},
            {"label": "4. 結論", "text": "この論文が示した新規性を次の生成 PL に引き継ぐ。"},
        ],
        "characters": ["研究者", "聞き手"],
    }


def screenshot(meta: ArxivMeta) -> dict:
    sentences = [s for s in meta.abstract.replace("。", ".").split(".") if s]
    return {
        "format": "screenshot-movie-script",
        "title": meta.title,
        "duration_seconds": 60,
        "scenes": [
            {"time": "0-5", "type": "title", "text": meta.title},
            {"time": "5-20", "type": "problem", "text": sentences[0] if sentences else ""},
            {"time": "20-40", "type": "method", "text": sentences[1] if len(sentences) > 1 else ""},
            {"time": "40-55", "type": "result", "text": sentences[2] if len(sentences) > 2 else ""},
            {"time": "55-60", "type": "endcard", "text": "詳細は論文を参照"},
        ],
        "voice": "ja-JP-neutral",
    }


CONVERTERS: dict[str, callable] = {
    "two_line": two_line,
    "yonkoma": yonkoma,
    "screenshot": screenshot,
}
