import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Films } from "@/interface/films.js";

const FAVORITES_KEY = "kinomania_favorites";

export const useFavoritesStore = defineStore(
  "useFavoritesStore",
  () => {
    const favorites = ref<Films[]>([]);

    // Load favorites from localStorage on initialization
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
          favorites.value = JSON.parse(stored);
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
        favorites.value = [];
      }
    };

    // Save favorites to localStorage
    const saveFavorites = () => {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value));
      } catch (error) {
        console.error("Failed to save favorites:", error);
      }
    };

    // Add film to favorites
    const addFavorite = (film: Films) => {
      const exists = favorites.value.some((f) => f.filmId === film.filmId);
      if (!exists) {
        favorites.value.push(film);
        saveFavorites();
      }
    };

    // Remove film from favorites
    const removeFavorite = (filmId: number) => {
      favorites.value = favorites.value.filter((f) => f.filmId !== filmId);
      saveFavorites();
    };

    // Check if film is in favorites
    const isFavorite = (filmId: number) => {
      return favorites.value.some((f) => f.filmId === filmId);
    };

    // Toggle favorite status
    const toggleFavorite = (film: Films) => {
      const exists = favorites.value.some((f) => f.filmId === film.filmId);
      if (exists) {
        removeFavorite(film.filmId);
      } else {
        addFavorite(film);
      }
    };

    // Get favorite count
    const favoriteCount = computed(() => favorites.value.length);

    // Clear all favorites
    const clearFavorites = () => {
      favorites.value = [];
      saveFavorites();
    };

    // Initialize on store creation
    loadFavorites();

    return {
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      toggleFavorite,
      favoriteCount,
      clearFavorites,
    };
  },
  { persist: false }, // We handle persistence manually with localStorage
);
