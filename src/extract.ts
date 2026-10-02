import type { ArxivMeta } from "./types";

export function parseArxivId(raw: string): string | null {
  const m = raw.match(/(?:arxiv\.org\/(?:abs|pdf)\/)?(\d{4,5}\.\d{4,5})/i);
  return m ? m[1] : null;
}

export async function fetchArxivMeta(arxivId: string): Promise<ArxivMeta> {
  const sourceUrl = `https://arxiv.org/abs/${arxivId}`;
  const pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;

  const res = await fetch(sourceUrl, {
    headers: { "User-Agent": "ronbun2x/0.1" },
  });
  if (!res.ok) throw new Error(`arxiv fetch failed: ${res.status}`);
  const html = await res.text();

  let title = extractTag(html, /<h1[^>]*class="title[^"]*"[^>]*>(.*?)<\/h1>/s);
  title = stripHtml(title).replace(/^Title:\s*/i, "");
  const abstract = extractTag(html, /<blockquote[^>]*class="abstract[^"]*"[^>]*>(.*?)<\/blockquote>/s)
    .replace("Abstract:", "")
    .trim();
  const authors = [...html.matchAll(/<div[^>]*class="authors[^"]*"[^>]*>.*?<a[^>]*>([^<]+)<\/a>.*?<\/div>/s)]
    .map((m) => m[1].trim());
  const yearMatch = arxivId.match(/^(\d{2})/);
  const year = yearMatch ? `20${yearMatch[1]}` : "";

  return {
    arxiv_id: arxivId,
    title,
    authors,
    abstract: stripHtml(abstract),
    year,
    source_url: sourceUrl,
    pdf_url: pdfUrl,
  };
}

function extractTag(html: string, re: RegExp): string {
  const m = html.match(re);
  return m ? m[1] : "";
}

function stripHtml(raw: string): string {
  return raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
