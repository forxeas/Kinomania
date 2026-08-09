<script setup lang="ts">
import { useSearchStore } from "./../stores/SearchStore.ts";
import { useSearchIdStore } from "./../stores/SearchIdStore.ts";
import { useSimilarStore } from "./../stores/SimilarStore.ts";
import { useFavoritesStore } from "./../stores/FavoritesStore.ts";
import { useStaffStore } from "./../stores/StaffStore.ts";
import {
  computed,
  inject,
  nextTick,
  ref,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import "@/assets/currentMovie.css";
import "@/assets/movie.css";
import type { SimilarResponse, SearchResponse, StaffResponse } from "@/interface";
import {
  filmRating,
  primaryTitle,
  subtitleTitle,
  truncateText,
} from "@/utils/movieDisplay.ts";

const PLAYER_SCRIPT_URL = "https://kinobd.net/js/player_.js";
const PLAYER_LOAD_TIMEOUT_MS = 5000;

const API_KEY = inject<string>("API_KEY");
const SearchStore = useSearchStore();
const SearchIdStore = useSearchIdStore();
const SimilarStore = useSimilarStore();
const FavoritesStore = useFavoritesStore();
const StaffStore = useStaffStore();
const route = useRoute();

const movie = ref<SearchResponse | null>(null);
const similar = ref<SimilarResponse | null>(null);
const staff = ref<StaffResponse | null>(null);
const isPageLoading = ref(false);
const isPlayerLoading = ref(false);
const playerError = ref(false);

const movieId = computed(() => String(route.params.id));
const movieRating = computed(() => (movie.value ? filmRating(movie.value) : null));

const isFavorite = computed(() => {
  if (!movie.value) return false;
  return FavoritesStore.isFavorite(Number(movieId.value)).value;
});

const toggleFavorite = (event: Event) => {
  if (movie.value) {
    FavoritesStore.toggleFavorite(movie.value);

    // Create particle effect
    const button = event.currentTarget as HTMLElement;
    createParticles(button);
  }
};

const createParticles = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: #dc3545;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: ${centerX}px;
      top: ${centerY}px;
      animation: particleExplode 0.6s ease forwards;
    `;

    const angle = (i / 8) * Math.PI * 2;
    const velocity = 50 + Math.random() * 30;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 600);
  }
};

const resetPlayerContainer = () => {
  const container = document.getElementById("kinobd");
  if (container) {
    container.innerHTML = '';
  }
};

const removePlayerScript = () => {
  const script = document.querySelector('script[src*="kinobd"]');
  if (script) {
    script.remove();
  }
};

const loadPlayerScript = async () => {
  if (!movie.value || isPlayerLoading.value) {
    return;
  }

  isPlayerLoading.value = true;
  playerError.value = false;

  await nextTick();
  resetPlayerContainer();
  removePlayerScript();

  // Small delay to ensure DOM is ready
  await new Promise(resolve => setTimeout(resolve, 50));

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PLAYER_SCRIPT_URL;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.charset = "UTF-8";

    const timeoutId = window.setTimeout(() => {
      reject(new Error("Player script load timeout"));
    }, PLAYER_LOAD_TIMEOUT_MS);

    script.onload = () => {
      clearTimeout(timeoutId);
      // Give the script time to initialize and find the container
      setTimeout(() => {
        resolve();
      }, 300);
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error("Player script failed to load"));
    };

    document.body.appendChild(script);
  })
    .catch((error) => {
      console.error("Player loading error:", error);
      playerError.value = true;
    })
    .finally(() => {
      isPlayerLoading.value = false;
    });
};

const loadPageData = async () => {
  isPageLoading.value = true;
  playerError.value = false;
  resetPlayerContainer();
  removePlayerScript();

  try {
    let loadedMovie = SearchStore.getMovie(movieId.value);

    if (!loadedMovie) {
      loadedMovie = await SearchIdStore.setMovieWithId(API_KEY, movieId.value);
    }

    movie.value = loadedMovie;
    similar.value = await SimilarStore.setSimilar(API_KEY, movieId.value);
    staff.value = await StaffStore.getStaff(API_KEY, Number(movieId.value));
  } finally {
    isPageLoading.value = false;
  }
};

watch(movieId, loadPageData, { immediate: true });

watch(movie, (newValue) => {
  if (newValue) {
    loadPlayerScript();
  }
});
</script>

<template>
  <div :key="movieId" class="container py-5">
    <div v-if="isPageLoading" class="text-center text-light mt-5">
      <div class="spinner-border text-danger" role="status" />
      <p class="mt-3">Загружаем информацию о фильме...</p>
    </div>

    <div v-else-if="movie" class="row justify-content-center align-items-start g-4">
      <div class="col-12 col-md-4 text-center">
        <img
          :src="movie.posterUrl"
          :alt="movie.nameRu"
          class="img-fluid rounded shadow movie-poster"
        />
      </div>

      <div class="col-12 col-md-8 text-light">
        <h2 class="fw-bold mb-3 movie-title">
          {{ primaryTitle(movie) }}
          <span v-if="subtitleTitle(movie)" class="text-secondary small">
            ({{ subtitleTitle(movie) }})
          </span>
        </h2>

        <div class="movie-meta-info mb-3">
          <p class="text-secondary mb-2">
            {{ movie.year }} •
            {{
              movie.genres?.length
                ? movie.genres.map((g) => g.genre).join(", ")
                : "Неизвестно"
            }}
          </p>

          <div class="mb-3 d-flex flex-wrap gap-2 align-items-center">
            <span v-if="movieRating" class="badge bg-danger fs-6">
              ★ {{ movieRating }}
            </span>
            <span class="badge bg-secondary">
              {{ movie.countries?.[0]?.country }}
            </span>
            <span v-if="movie.filmLength" class="badge bg-info text-dark">
              {{ Math.floor(movie.filmLength / 60) }}ч {{ movie.filmLength % 60 }}м
            </span>
            <button
              class="btn btn-outline-danger favorite-btn"
              @click="toggleFavorite($event)"
              :class="{ 'favorite-btn--active': isFavorite }"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span class="favorite-text">{{ isFavorite ? 'В избранном ✓' : 'В избранное' }}</span>
            </button>
          </div>
        </div>

        <p class="lead text-secondary mt-4 movie-description">{{ movie.description }}</p>
      </div>
    </div>

    <div v-if="movie && !isPageLoading" class="video-wrapper">
      <div
        v-if="isPlayerLoading"
        class="player-loading"
        aria-live="polite"
      >
        <div class="spinner-border text-danger" role="status" />
        <span>Загружаем плеер...</span>
      </div>

      <div v-else-if="playerError" class="player-error">
        <p class="mb-0">Не удалось загрузить плеер</p>
        <button
          type="button"
          class="btn btn-outline-danger btn-sm"
          @click="loadPlayerScript"
        >
          Попробовать снова
        </button>
      </div>

      <div
        id="kinobd"
        :data-kinopoisk="movieId"
        data-player="TURBO"
        class="video-player"
      />
    </div>

    <section v-if="staff?.items?.length && !isPageLoading" class="mt-5 staff-section">
      <h3 class="fw-bold text-light mb-4 section-title">Актеры</h3>
      <div class="row g-4 justify-content-center">
        <div
          v-for="actor in staff.items.filter(item => item.professionKey === 'ACTOR').slice(0, 10)"
          :key="actor.staffId"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <router-link
            :to="{ name: 'Actor', params: { id: actor.staffId } }"
            class="actor-card-link"
          >
            <div class="card actor-card bg-dark text-light border-0 shadow-sm h-100">
              <div class="actor-poster-wrapper">
                <img
                  :src="actor.posterUrl || 'https://via.placeholder.com/200x300?text=No+Image'"
                  :alt="actor.nameRu"
                  class="card-img-top object-fit-cover"
                />
                <div class="actor-overlay">
                  <span class="actor-watch-btn">Фильмы</span>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold text-truncate mb-2">
                  {{ actor.nameRu }}
                </h5>
                <p v-if="actor.nameEn" class="card-text actor-subtitle mb-2">
                  {{ actor.nameEn }}
                </p>
                <p v-if="actor.description" class="card-text actor-description flex-grow-1">
                  {{ truncateText(actor.description, 80) }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <section v-if="similar?.items?.length && !isPageLoading" class="mt-5 similar-section">
      <h3 class="fw-bold text-light mb-4 section-title">Похожие фильмы</h3>
      <div class="row g-4 justify-content-center">
        <div
          v-for="(item, index) in similar.items"
          :key="item.filmId"
          class="col-12 col-sm-6 col-md-4 col-lg-3 similar-card-item"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <router-link
            :to="{ name: 'CurrentMovie', params: { id: item.filmId } }"
            class="similar-card-link"
          >
            <div class="card movie-card bg-dark text-light border-0 shadow-sm h-100 similar-card">
              <div class="similar-poster-wrapper">
                <img
                  :src="item.posterUrl"
                  :alt="item.nameRu"
                  class="card-img-top object-fit-cover"
                />
                <div class="similar-overlay">
                  <span class="similar-watch-btn">Смотреть</span>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold text-truncate mb-2">
                  {{ primaryTitle(item) }}
                </h5>
                <p v-if="subtitleTitle(item)" class="card-text similar-subtitle mb-2">
                  {{ subtitleTitle(item) }}
                </p>
                <p
                  v-if="item.shortDescription"
                  class="card-text similar-description flex-grow-1"
                >
                  {{ truncateText(item.shortDescription, 100) }}
                </p>
                <span class="btn btn-secondary btn-sm mt-auto align-self-start similar-btn">
                  Подробнее
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <div
      v-else-if="similar && !similar.items?.length && !isPageLoading"
      class="text-center text-light mt-5"
    >
      <p class="mb-0">Похожих фильмов не найдено</p>
    </div>
  </div>
</template>
