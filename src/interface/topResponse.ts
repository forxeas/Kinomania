import type { Films } from "./films";

export interface TopResponse {
  pagesCount: number;
  films: Films[];
}
