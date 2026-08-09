<script setup lang="ts">
import { useFavoritesStore } from "./../stores/FavoritesStore.ts";
import { computed } from "vue";
import router from "@/router/index.ts";
import AppSpinner from "@/components/AppSpinner.vue";
import "@/assets/movie.css";
import type { Films } from "@/interface/films.js";
import {
  filmId,
  filmRating,
  primaryTitle,
  subtitleTitle,
  truncateText,
} from "@/utils/movieDisplay.ts";

const FavoritesStore = useFavoritesStore();

const favorites = computed(() => FavoritesStore.favorites);
const favoriteCount = computed(() => FavoritesStore.favoriteCount);

const openMovie = (film: Films) =>
  router.push({ name: "CurrentMovie", params: { id: filmId(film) } });

const removeFavorite = (film: Films, event: Event) => {
  event.stopPropagation();
  FavoritesStore.removeFavorite(film.filmId);
};

const isFavorite = (filmId: number) => {
  return FavoritesStore.isFavorite(filmId);
};

const clearAllFavorites = () => {
  if (confirm("Вы уверены, что хотите удалить все фильмы из избранного?")) {
    FavoritesStore.clearFavorites();
  }
};
</script>

<template>
  <div class="container py-5 movies-page">
    <header class="movies-page__header">
      <h1 class="movies-page__title">Избранное</h1>
      <button
        v-if="favoriteCount > 0"
        class="btn btn-outline-danger btn-sm mt-2"
        @click="clearAllFavorites"
      >
        Очистить избранное
      </button>
    </header>

    <AppSpinner v-if="false" />

    <div v-if="favorites.length === 0" class="movies-page__empty">
      <h2>В избранном пока ничего нет</h2>
      <p class="text-secondary">Добавьте фильмы, нажав на сердечко на карточке</p>
      <button class="btn btn-danger mt-3" @click="router.push({ name: 'Home' })">
        На главную
      </button>
    </div>

    <div v-else class="row g-4 justify-content-center">
      <div
        v-for="film in favorites"
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
                class="movie-card__favorite movie-card__favorite--active"
                @click="removeFavorite(film, $event)"
                aria-label="Удалить из избранного"
                style="animation: none;"
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
