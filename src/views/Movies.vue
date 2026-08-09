<script setup lang="ts">
import { useSearchStore } from "./../stores/SearchStore.ts";
import { useCollectionStore } from "./../stores/CollectionStore.ts";
import { useFavoritesStore } from "./../stores/FavoritesStore.ts";
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
const FavoritesStore = useFavoritesStore();
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
      console.log("Loading top movies...");
      movies.value = await CollectionStore.setCollection(API_KEY!);
      console.log("Top movies loaded:", movies.value);
      return;
    }

    movies.value = await SearchStore.setMovie(API_KEY!, movieName.value);
  } catch (e) {
    error.value = true;
    console.error("Error in findMovie:", e);
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

const isFavorite = (filmId: number) => {
  return FavoritesStore.isFavorite(filmId);
};

const openMovie = (film: Films) =>
  router.push({ name: "CurrentMovie", params: { id: filmId(film) } });

const toggleFavorite = (film: Films, event: Event) => {
  event.stopPropagation();
  FavoritesStore.toggleFavorite(film);

  // Create particle effect
  const button = event.currentTarget as HTMLElement;
  createParticles(button);
};

const createParticles = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      background: #dc3545;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: ${centerX}px;
      top: ${centerY}px;
      animation: particleExplode 0.5s ease forwards;
    `;

    const angle = (i / 6) * Math.PI * 2;
    const velocity = 40 + Math.random() * 20;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 500);
  }
};

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
              <button
                class="movie-card__favorite"
                @click="toggleFavorite(film, $event)"
                :class="{ 'movie-card__favorite--active': isFavorite(film.filmId) }"
                aria-label="Добавить в избранное"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
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
