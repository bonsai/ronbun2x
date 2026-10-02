export interface Handoff<T = unknown> {
  schema: "ronbun2x.handoff.v1";
  arxiv_id: string;
  source_url: string;
  pdf_url: string;
  x: string;
  language: string;
  payload: T;
  next: "generation";
}

export interface ArxivMeta {
  arxiv_id: string;
  title: string;
  authors: string[];
  abstract: string;
  year: string;
  source_url: string;
  pdf_url: string;
}

export interface Env {
  AI: Ai;
}
