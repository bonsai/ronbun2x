# ronbun2x

arXiv 論文を **任意の生成 PL（Generation Pipeline）** へ渡せる研究素材に変換する。

`ronbun2rakugo` を一般化し、以下の出力形式（X）をサポートする。

| X | 用途 | 出力例 |
|---|---|---|
| `rakugo` | SF 落語生成 | 約 800 字要約 + 登場人物・台詞 |
| `yonkoma` | 4 コマ漫画原稿 | 4 コマ分のキャラ・吹き出し・演出 |
| `two_line` | 2 行会話 | ボケとツッコミの研究解説 |
| `screenshot` | スクリーンショットムービー | シーン・字幕・音声指示 |

## API

```
GET /api?url=https://arxiv.org/abs/2209.05161&x=rakugo
GET /api?url=https://arxiv.org/abs/2209.05161&x=yonkoma
GET /api?url=https://arxiv.org/abs/2209.05161&x=two_line
GET /api?url=https://arxiv.org/abs/2209.05161&x=screenshot
```

JSON:

```json
{
  "schema": "ronbun2x.handoff.v1",
  "arxiv_id": "2209.05161",
  "source_url": "https://arxiv.org/abs/2209.05161",
  "pdf_url": "https://arxiv.org/pdf/2209.05161.pdf",
  "x": "yonkoma",
  "language": "ja",
  "payload": { ... },
  "next": "generation"
}
```

## Boundary

```
research-rakugo / yonkoma / etc.
      │ arXiv URL
      ▼
  ronbun2x
      │ structured handoff
      ▼
  Generation PL
      │
      ▼
  SF落語 / 4コマ / 動画 / audio
```

## Stack

- Cloudflare Workers: public API
- Cloudflare Workers AI: PDF text extraction + LLM
- Python CLI: ローカルでの 2-line 会話生成・検証
- GitHub Actions: deploy

## Local Python CLI

```bash
cd py
pip install -r requirements.txt
python -m ronbun2x.cli https://arxiv.org/abs/2209.05161 --x two_line
```

## Deploy

GitHub Actions Secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

`main` への push で Worker を deploy する。
