import type { ArxivMeta } from "../types";

export function twoLine(meta: ArxivMeta) {
  const title = meta.title;
  const hook = meta.abstract.split(/[。.]/)[0] || meta.abstract.slice(0, 60);
  return {
    format: "two-line-dialogue",
    title,
    lines: [
      { speaker: "ボケ", text: `「${title}」って何？要するに…${hook}、ってこと？` },
      { speaker: "ツッコミ", text: `違う。${hook}の問題を解くために、論文で提案した新しい手法のことだ。` },
    ],
    source_abstract: meta.abstract,
  };
}
