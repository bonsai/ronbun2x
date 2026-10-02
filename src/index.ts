import type { Env, Handoff } from "./types";
import { fetchArxivMeta, parseArxivId } from "./extract";
import { converters } from "./converters";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const rawUrl = url.searchParams.get("url");
    const x = url.searchParams.get("x") || "rakugo";
    const format = url.searchParams.get("format");

    if (!rawUrl) {
      return json({ error: "missing ?url=" }, 400);
    }

    const arxivId = parseArxivId(rawUrl);
    if (!arxivId) {
      return json({ error: "invalid arXiv URL" }, 400);
    }

    const converter = converters[x];
    if (!converter) {
      return json({ error: `unknown x=${x}. supported: ${Object.keys(converters).join(", ")}` }, 400);
    }

    try {
      const meta = await fetchArxivMeta(arxivId);
      const payload = await converter(meta, env);
      const handoff: Handoff<unknown> = {
        schema: "ronbun2x.handoff.v1",
        arxiv_id: arxivId,
        source_url: meta.source_url,
        pdf_url: meta.pdf_url,
        x,
        language: "ja",
        payload,
        next: "generation",
      };

      if (format === "txt") {
        return new Response(JSON.stringify(payload, null, 2), {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
      return json(handoff);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return json({ error: msg }, 500);
    }
  },
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
