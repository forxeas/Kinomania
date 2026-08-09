import { defineStore } from "pinia";
import { fetchData } from "../use/FetchData.ts";
import { ref } from "vue";
import type { CollectionResponse } from "@/interface";

const CACHE_TTL_MS = 30 * 60 * 1000;
const TOP_PAGES = 12;

interface CollectionCache {
  data: CollectionResponse;
  fetchedAt: number;
}

export const useCollectionStore = defineStore(
  "useCollectionStore",
  () => {
    const cache = ref<CollectionCache | null>(null);

    const setCollection = async (apiKey: string) => {
      const isFresh =
        cache.value && Date.now() - cache.value.fetchedAt < CACHE_TTL_MS;

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

      const res = await fetchData<CollectionResponse>(url, headers);
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
