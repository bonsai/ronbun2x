import type { ArxivMeta } from "../types";

export function screenshot(meta: ArxivMeta) {
  const sentences = meta.abstract.split(/[。.]/).filter(Boolean);
  return {
    format: "screenshot-movie-script",
    title: meta.title,
    duration_seconds: 60,
    scenes: [
      { time: "0-5", type: "title", text: meta.title },
      { time: "5-20", type: "problem", text: sentences[0] || "" },
      { time: "20-40", type: "method", text: sentences[1] || "" },
      { time: "40-55", type: "result", text: sentences[2] || "" },
      { time: "55-60", type: "endcard", text: "詳細は論文を参照" },
    ],
    voice: "ja-JP-neutral",
  };
}
