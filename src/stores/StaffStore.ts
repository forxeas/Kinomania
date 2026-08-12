import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchData } from "../use/FetchData.ts";
import type { StaffResponse } from "@/interface";

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 минут

interface StaffCache {
  data: StaffResponse;
  fetchedAt: number;
}

export const useStaffStore = defineStore(
  "useStaffStore",
  () => {
    const cache = ref<Map<number, StaffCache>>(new Map());

    const getStaff = async (apiKey: string, filmId: number) => {
      // Ensure cache is a Map (in case it was serialized from storage)
      if (!(cache.value instanceof Map)) {
        cache.value = new Map();
      }

      const cached = cache.value.get(filmId);
      const isFresh =
        cached &&
        Date.now() - cached.fetchedAt < CACHE_TTL_MS;

      if (isFresh) {
        return cached.data;
      }

      const url = `https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${filmId}`;
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      };

      const res = await fetchData<StaffResponse>(url, headers);

      cache.value.set(filmId, {
        data: res,
        fetchedAt: Date.now(),
      });

      return res;
    };

    const invalidateCache = (filmId?: number) => {
      // Ensure cache is a Map
      if (!(cache.value instanceof Map)) {
        cache.value = new Map();
      }

      if (filmId) {
        cache.value.delete(filmId);
      } else {
        cache.value.clear();
      }
    };

    return { cache, getStaff, invalidateCache };
  },
  { persist: true },
);
