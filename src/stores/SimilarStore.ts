import { ref } from "vue";
import { fetchData } from "./../use/FetchData.ts";
import { defineStore } from "pinia";
import type { MovieSimilar, SimilarResponse } from "@/interface";
import { useSearchIdStore } from "./SearchIdStore.ts";

interface SimilarCacheEntry {
  movieId: string;
  data: SimilarResponse;
}

const ENRICH_LIMIT = 8;

export const useSimilarStore = defineStore(
  "useSimilarStore",
  () => {
    const similarStore = ref<SimilarCacheEntry[]>([]);

    const enrichSimilarItems = async (
      apiKey: string,
      items: MovieSimilar[],
    ): Promise<MovieSimilar[]> => {
      const SearchIdStore = useSearchIdStore();

      const enriched = await Promise.all(
        items.slice(0, ENRICH_LIMIT).map(async (item) => {
          try {
            const details = await SearchIdStore.setMovieWithId(
              apiKey,
              String(item.filmId),
            );

            return {
              ...item,
              shortDescription:
                details.shortDescription ||
                details.description?.slice(0, 120) ||
                "",
            };
          } catch {
            return { ...item, shortDescription: "" };
          }
        }),
      );

      return [...enriched, ...items.slice(ENRICH_LIMIT)];
    };

    const setSimilar = async (apiKey: string, movieId: string) => {
      const cached = similarStore.value.find(
        (entry) => entry.movieId === movieId,
      );

      if (cached) {
        return cached.data;
      }

      const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${movieId}/similars`;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      };

      const res = await fetchData<SimilarResponse>(url, headers);
      const items = await enrichSimilarItems(apiKey, res.items ?? []);

      const data: SimilarResponse = { ...res, items };
      similarStore.value.push({ movieId, data });

      return data;
    };

    return { similarStore, setSimilar };
  },
  { persist: true },
);
