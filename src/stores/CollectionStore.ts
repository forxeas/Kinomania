import { defineStore } from "pinia";
import { fetchData } from "../use/FetchData.ts";
import { ref } from "vue";
import type { TopResponse } from "@/interface";

const CACHE_TTL_MS = 30 * 60 * 1000;
const TOP_PAGES = 13;

interface TopCache {
  data: TopResponse;
  fetchedAt: number;
}

const isTopResponse = (data: unknown): data is TopResponse =>
  Boolean(
    data &&
      typeof data === "object" &&
      "films" in data &&
      Array.isArray((data as TopResponse).films),
  );

export const useCollectionStore = defineStore(
  "useCollectionStore",
  () => {
    const cache = ref<TopCache | null>(null);

    const setCollection = async (apiKey: string) => {
      const isFresh =
        cache.value &&
        Date.now() - cache.value.fetchedAt < CACHE_TTL_MS &&
        isTopResponse(cache.value.data);

      if (isFresh) {
        return cache.value!.data;
      }

      const page = Math.floor(Math.random() * TOP_PAGES) + 1;
      const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=${page}`;
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      };

      const res = await fetchData<TopResponse>(url, headers);

      if (!isTopResponse(res)) {
        throw new Error("Некорректный ответ API топ-250");
      }

      cache.value = { data: res, fetchedAt: Date.now() };

      return res;
    };

    const invalidateCache = () => {
      cache.value = null;
    };

    return { cache, setCollection, invalidateCache };
  },
  { persist: true },
);
