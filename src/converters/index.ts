import type { ArxivMeta, Env } from "../types";
import { rakugo } from "./rakugo";
import { yonkoma } from "./yonkoma";
import { twoLine } from "./two_line";
import { screenshot } from "./screenshot";

export type Converter = (meta: ArxivMeta, env: Env) => Promise<unknown> | unknown;

export const converters: Record<string, Converter> = {
  rakugo,
  yonkoma,
  two_line,
  screenshot,
};
