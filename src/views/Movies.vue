<script setup lang="ts">
import { useSearchStore } from "./../stores/SearchStore.ts";
import { useCollectionStore } from "./../stores/CollectionStore.ts";
import router from "@/router/index.ts";
import { computed, type ComputedRef, inject, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AppSpinner from "@/components/AppSpinner.vue";
import "@/assets/movie.css";
import type { Films } from "@/interface/films.js";
import type { SearchResponse, TopResponse } from "@/interface";
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

const movies = ref<SearchResponse | TopResponse | null>(null);
const error = ref<boolean>(false);
const loading = ref<boolean>(false);

const isTopList = computed(() => !route.query.movie);

const pageTitle = computed(() =>
  isTopList.value ? "Топ-250 Кинопоиска" : `Результаты: «${movieName.value}»`,
);

const findMovie = async () => {
  error.value = false;
  loading.value = true;

  try {
    movies.value = null;

    if (!route.query.movie) {
      movies.value = await CollectionStore.setCollection(API_KEY!);
      return;
    }

    movies.value = await SearchStore.setMovie(API_KEY!, movieName.value);
  } catch (e) {
    error.value = true;
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const movieName: ComputedRef<string> = computed(() => route.query.movie || "");

const filteredMovies: ComputedRef<Films[]> = computed(() => {
  if (!movies.value?.films?.length) {
    return [];
  }

  return movies.value.films.filter((film) => Boolean(film.posterUrlPreview));
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
  <div class="container py-5 movies-page">
    <header v-if="!loading && filteredMovies.length" class="movies-page__header">
      <h1 class="movies-page__title">{{ pageTitle }}</h1>
      <p v-if="isTopList" class="movies-page__subtitle">
        Лучшие фильмы по версии Кинопоиска
      </p>
    </header>

    <AppSpinner v-if="loading" />

    <div v-else-if="error" class="movies-page__empty">
      <h2>Не удалось загрузить фильмы</h2>
      <p class="text-secondary">Попробуйте обновить страницу</p>
    </div>

    <div v-else-if="filteredMovies.length" class="row g-4 justify-content-center">
      <div
        v-for="film in filteredMovies"
        :key="filmId(film)"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <article
          class="card movie-card bg-dark text-light border-0 h-100"
          tabindex="0"
          @click="openMovie(film)"
          @keyup.enter="openMovie(film)"
        >
          <div class="movie-card__poster">
            <img
              :src="film.posterUrlPreview"
              class="movie-card__image"
              :alt="primaryTitle(film)"
              loading="lazy"
            />
            <div class="movie-card__overlay">
              <span v-if="filmRating(film)" class="movie-card__rating">
                ★ {{ filmRating(film) }}
              </span>
              <span class="movie-card__watch">Смотреть</span>
            </div>
          </div>

          <div class="card-body movie-card__body">
            <h2 class="card-title movie-card__title">
              {{ primaryTitle(film) }}
              <span v-if="subtitleTitle(film)" class="movie-subtitle">
                ({{ subtitleTitle(film) }})
              </span>
            </h2>

            <p class="movie-card__meta">
              {{ film.year }}<span v-if="film.genres?.[0]?.genre"> • {{ film.genres[0].genre }}</span>
            </p>

            <p
              v-if="film.description"
              class="movie-card__description"
            >
              {{ truncateText(film.description, 120) }}
            </p>

            <div class="movie-card__footer">
              <span v-if="film.countries?.[0]?.country" class="badge movie-card__country">
                {{ film.countries[0].country }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div v-else class="movies-page__empty">
      <h2>Ничего не найдено</h2>
      <p class="text-secondary">Попробуйте изменить запрос</p>
    </div>
  </div>
</template>

<style scoped>
.movies-page__header {
  margin-bottom: 2rem;
  text-align: center;
}

.movies-page__title {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.movies-page__subtitle {
  color: #adb5bd;
  margin: 0;
}

.movies-page__empty {
  text-align: center;
  color: #fff;
  margin-top: 3rem;
}

.movie-subtitle {
  color: #adb5bd;
  font-weight: 400;
}
</style>
