import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchData } from "../use/FetchData.ts";
import type { Staff } from "@/interface";

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 минут

interface ActorCache {
  data: Staff;
  fetchedAt: number;
}

export const useActorStore = defineStore(
  "useActorStore",
  () => {
    const cache = ref<Map<number, ActorCache>>(new Map());

    const getActor = async (apiKey: string, staffId: number) => {
      const cached = cache.value.get(staffId);
      const isFresh =
        cached &&
        Date.now() - cached.fetchedAt < CACHE_TTL_MS;

      if (isFresh) {
        return cached.data;
      }

      const url = `https://kinopoiskapiunofficial.tech/api/v1/staff/${staffId}`;
      const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      };

      const res = await fetchData<Staff>(url, headers);

      cache.value.set(staffId, {
        data: res,
        fetchedAt: Date.now(),
      });

      return res;
    };

    const invalidateCache = (staffId?: number) => {
      if (staffId) {
        cache.value.delete(staffId);
      } else {
        cache.value.clear();
      }
    };

    return { cache, getActor, invalidateCache };
  },
  { persist: true },
);