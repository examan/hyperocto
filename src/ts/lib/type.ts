import type { ArrayElement } from "type-fest";
import { MODE_VALUES } from "./constant";

export type MODE = ArrayElement<typeof MODE_VALUES>;

export interface MessageOpenlinks {
  type: "OPEN-LINKS";
  urls: string[];
}

export interface MessageGetlinks {
  type: "GET-LINKS";
  mode: MODE;
}
