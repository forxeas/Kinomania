<script setup lang="ts">
import { useSearchStore } from "./../stores/SearchStore.ts";
import { useCollectionStore } from "./../stores/CollectionStore.ts";
import router from "@/router/index.ts";
import { computed, type ComputedRef, inject, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AppSpinner from "@/components/AppSpinner.vue";
import "@/assets/movie.css";
import type { Films } from "@/interface/films.js";
import type { SearchResponse, CollectionResponse } from "@/interface";
import {
  filmId,
  filmRating,
  primaryTitle,
  subtitleTitle,
  truncateText,
} from "@/utils/movieDisplay.ts";

const API_KEY = inject<string>("API_KEY");

const SearchStore = useSearchStore();
const CollectionStore = useCollectionStore();
const route = useRoute();

const movies = ref<SearchResponse | CollectionResponse | null>(null);
const error = ref<boolean>(false);
const loading = ref<boolean>(false);

const findMovie = async () => {
  error.value = false;
  loading.value = true;

  try {
    movies.value = null;

    if (!route.query.movie) {
      movies.value = await CollectionStore.setCollection(API_KEY);
      return;
    }

    movies.value = await SearchStore.setMovie(API_KEY, movieName.value);
  } catch (e) {
    error.value = true;
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const movieName: ComputedRef<string> = computed(() => route.query.movie || "");

const filteredMovies: ComputedRef<Films[]> = computed(() => {
  let films: Films[] = [];

  if (!movies.value) return [];

  if ("films" in movies.value) {
    films = movies.value.films;
  } else if ("items" in movies.value) {
    films = movies.value.items as unknown as Films[];
  }

  return films?.filter((film) => film.posterUrlPreview?.length !== 67);
});

const openMovie = (film: Films) =>
  router.push({ name: "CurrentMovie", params: { id: filmId(film) } });

watch(movieName, (newId, oldValue) => {
  if (newId !== oldValue) {
    findMovie();
  }
}, { immediate: true });
</script>

<template>
  <div class="container py-5">
    <AppSpinner v-if="loading" />

    <div v-else-if="filteredMovies?.length" class="row g-4 justify-content-center">
      <div
        v-for="film in filteredMovies"
        :key="filmId(film)"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        @click="openMovie(film)"
      >
        <div class="card movie-card bg-dark text-light border-0 shadow-sm h-100">
          <img
            :src="film.posterUrlPreview"
            class="card-img-top object-fit-cover"
            :alt="primaryTitle(film)"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-truncate mb-2">
              {{ primaryTitle(film) }}
              <span v-if="subtitleTitle(film)" class="movie-subtitle">
                ({{ subtitleTitle(film) }})
              </span>
            </h5>
            <p class="card-text small text-muted mb-2">
              {{ film.year }} • {{ film.genres?.[0]?.genre }}
            </p>
            <p
              v-if="film.description"
              class="card-text small text-secondary flex-grow-1"
            >
              {{ truncateText(film.description, 120) }}
            </p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span v-if="filmRating(film)" class="badge bg-danger">
                ★ {{ filmRating(film) }}
              </span>
              <span class="badge bg-secondary text-uppercase">
                {{ film.countries?.[0]?.country }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-light mt-5">
      <h2>Ничего не найдено 😔</h2>
      <p class="text-secondary">Попробуйте изменить запрос</p>
    </div>
  </div>
</template>

<style scoped>
.movie-subtitle {
  color: #adb5bd;
  font-weight: 400;
}
</style>
