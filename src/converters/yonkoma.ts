import type { ArxivMeta } from "../types";

export function yonkoma(meta: ArxivMeta) {
  const sentences = meta.abstract.split(/[。.]/).filter(Boolean);
  const [problem, method, result] = [sentences[0] || "", sentences[1] || "", sentences[2] || ""];
  return {
    format: "yonkoma-manuscript",
    title: meta.title,
    panels: [
      { label: "1. 課題", text: problem },
      { label: "2. 提案", text: method },
      { label: "3. 検証", text: result },
      { label: "4. 結論", text: "この論文が示した新規性を次の生成 PL に引き継ぐ。" },
    ],
    characters: ["研究者", "聞き手"],
  };
}
