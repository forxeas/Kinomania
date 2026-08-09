<script setup lang="ts">
import { useSearchStore } from "./../stores/SearchStore.ts";
import { useSearchIdStore } from "./../stores/SearchIdStore.ts";
import { useSimilarStore } from "./../stores/SimilarStore.ts";
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
import type { SimilarResponse, SearchResponse } from "@/interface";
import {
  filmRating,
  primaryTitle,
  subtitleTitle,
  truncateText,
} from "@/utils/movieDisplay.ts";

const PLAYER_SCRIPT_URL = "https://kinobd.net/js/player_.js";
const PLAYER_LOAD_TIMEOUT_MS = 10000;

const API_KEY = inject<string>("API_KEY");
const SearchStore = useSearchStore();
const SearchIdStore = useSearchIdStore();
const SimilarStore = useSimilarStore();
const route = useRoute();

const movie = ref<SearchResponse | null>(null);
const similar = ref<SimilarResponse | null>(null);
const isPageLoading = ref(false);
const isPlayerLoading = ref(false);
const playerError = ref(false);

const movieId = computed(() => String(route.params.id));
const movieRating = computed(() => (movie.value ? filmRating(movie.value) : null));

const resetPlayerContainer = () => {
  document.getElementById("kinobd")?.replaceChildren();
};

const removePlayerScript = () => {
  document.querySelector('script[src*="kinobd"]')?.remove();
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

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PLAYER_SCRIPT_URL;
    script.async = true;
    script.crossOrigin = "anonymous";

    const timeoutId = window.setTimeout(() => {
      reject(new Error("Player script load timeout"));
    }, PLAYER_LOAD_TIMEOUT_MS);

    script.onload = () => {
      clearTimeout(timeoutId);
      resolve();
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error("Player script failed to load"));
    };

    document.body.appendChild(script);
  })
    .catch(() => {
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

        <p class="text-secondary mb-2">
          {{ movie.year }} •
          {{
            movie.genres?.length
              ? movie.genres.map((g) => g.genre).join(", ")
              : "Неизвестно"
          }}
        </p>

        <div class="mb-3">
          <span v-if="movieRating" class="badge bg-danger fs-6 me-2">
            ★ {{ movieRating }}
          </span>
          <span class="badge bg-secondary">
            {{ movie.countries?.[0]?.country }}
          </span>
        </div>

        <p class="lead text-secondary mt-4">{{ movie.description }}</p>
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

    <section v-if="similar?.items?.length && !isPageLoading" class="mt-5">
      <h3 class="fw-bold text-light mb-4">Похожие фильмы</h3>
      <div class="row g-4 justify-content-center">
        <div
          v-for="item in similar.items"
          :key="item.filmId"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <router-link
            :to="{ name: 'CurrentMovie', params: { id: item.filmId } }"
            class="similar-card-link"
          >
            <div class="card movie-card bg-dark text-light border-0 shadow-sm h-100">
              <img
                :src="item.posterUrl"
                :alt="item.nameRu"
                class="card-img-top object-fit-cover"
              />
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
                <span class="btn btn-secondary btn-sm mt-auto align-self-start">
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
