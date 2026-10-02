import type { ArxivMeta } from "../types";

export function rakugo(meta: ArxivMeta) {
  const summary = meta.abstract.slice(0, 800);
  return {
    format: "sf-rakugo-handoff",
    title: meta.title,
    authors: meta.authors,
    summary,
    summary_chars: summary.length,
    characters: ["学者", "聞き手"],
    tone: "comedic-but-accurate",
  };
}
