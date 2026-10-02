"""CLI: python -m ronbun2x.cli <arxiv-url> --x two_line"""

from __future__ import annotations

import argparse
import json
import sys

import yaml

from .converters import CONVERTERS
from .extract import fetch_arxiv_meta, parse_arxiv_id


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="ronbun2x CLI")
    parser.add_argument("url", help="arXiv URL or ID")
    parser.add_argument("--x", default="two_line", choices=list(CONVERTERS.keys()), help="output format")
    parser.add_argument("--format", default="yaml", choices=["yaml", "json"], help="output format")
    args = parser.parse_args(argv)

    arxiv_id = parse_arxiv_id(args.url)
    if not arxiv_id:
        print("error: invalid arXiv URL", file=sys.stderr)
        return 1

    meta = fetch_arxiv_meta(arxiv_id)
    payload = CONVERTERS[args.x](meta)

    if args.format == "json":
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        print(yaml.dump(payload, allow_unicode=True, sort_keys=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
