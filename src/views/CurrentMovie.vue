<script setup lang="ts">
import { useSearchStore } from "./../stores/SearchStore.ts";
import { useSearchIdStore } from "./../stores/SearchIdStore.ts";
import { useSimilarStore } from "./../stores/SimilarStore.ts";
import AppButton from "@/components/AppButton.vue";
import {
  computed,
  inject,
  nextTick,
  onBeforeMount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import "@/assets/currentMovie.css";
import type { SimilarResponse, SearchResponse } from "@/interface";

const API_KEY = inject<string>("API_KEY");
const SearchStore = useSearchStore();
const SearchIdStore = useSearchIdStore();
const SimilarStore = useSimilarStore();
const route = useRoute();
const router = useRouter();

const movie = ref<SearchResponse | null>(null);
const similar = ref<SimilarResponse | null>(null);
const movieId = computed<string>(() => route.params.id);
const movieName = computed<string>(() => route.query.movieName);
const backPage = () => router.push({ name: "Home" });

watch(movieName, async (newValue, oldValue) => {
  if (newValue !== oldValue) {
    await SearchStore.setMovie(API_KEY, newValue);

    movie.value = await SearchStore.getMovie(movieId);
    similar.value = await SimilarStore.setSimilar(API_KEY, movieId.value);
  }
});

onBeforeMount(async () => {
  movie.value = SearchStore.getMovie(movieId.value);

  if (movie.value === null) {
    movie.value = await SearchIdStore.setMovieWithId(API_KEY, movieId.value);
  }
  similar.value = await SimilarStore.setSimilar(API_KEY, movieId.value);
});

onMounted(async () => {
  if (movie.value) {
    const loadScript = () => {
      // Удаляем старый скрипт если он есть
      const existingScript = document.querySelector('script[src*="kinobd"]');
      if (existingScript) {
        existingScript.remove();
      }

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      const script = document.createElement("script");
      script.src = "https://kinobd.net/js/player_.js";
      script.async = true;
      script.crossOrigin = "anonymous";

      // Таймаут для мобильных устройств
      const timeoutId = setTimeout(() => {
        console.warn("Таймаут загрузки плеера (мобильное устройство)");
        if (isMobile) {
          console.info("Плеер может работать с задержкой на мобильном");
        }
      }, isMobile ? 8000 : 5000);

      script.onload = () => {
        clearTimeout(timeoutId);
        console.log("✓ Плеер успешно загружен");
      };

      script.onerror = () => {
        clearTimeout(timeoutId);
        console.error("✗ Ошибка загрузки плеера", {
          url: script.src,
          userAgent: navigator.userAgent,
          isMobile: isMobile
        });
      };

      document.body.appendChild(script);
    };

    await nextTick(loadScript);
  }
});
</script>

<template>
  <div class="container py-5">

    <div v-if="movie" class="row justify-content-center align-items-start g-4">
      <div class="col-12 col-md-4 text-center">
        <img
          :src="movie.posterUrl"
          :alt="movie.nameRu"
          class="img-fluid rounded shadow movie-poster"
        />
      </div>

      <div class="col-12 col-md-8 text-light">
        <h2 class="fw-bold mb-3 movie-title">
          {{ movie.nameEn || movie.nameRu }}
          <span v-if="movie.nameEn" class="text-secondary small"
            >({{ movie.nameRu }})</span
          >
        </h2>

        <p class="text-secondary mb-2">
          {{ movie.year }} •
          {{
            movie?.genres?.length
              ? movie.genres.map((g) => g.genre).join(", ")
              : "Неизвестно"
          }}
        </p>

        <div class="mb-3">
          <span class="badge bg-danger fs-6 me-2">★ {{ movie.rating }}</span>
          <span class="badge bg-secondary">{{
            movie?.countries[0]?.country
          }}</span>
        </div>

        <p class="lead text-secondary mt-4">{{ movie?.description }}</p>
      </div>
    </div>

    <div v-else class="text-center text-light mt-5">
      <div class="spinner-border text-danger" role="status"></div>
      <p class="mt-3">Загружаем информацию о фильме...</p>
    </div>

    <div class="video-wrapper" v-if="movie">
      <div
        id="kinobd"
        :data-kinopoisk="movieId"
        data-player="TURBO"
        class="md-4 mt-2 video-player"
      ></div>
    </div>

    <div v-if="similar?.items?.length" class="mt-5">
      <h3 class="fw-bold text-light">Похожие фильмы:</h3>
      <div class="row g-4">
        <div
          v-for="movie in similar?.items"
          :key="movie.filmId"
          class="col-12 col-md-3"
        >
          <div class="card bg-dark text-light">
            <img
              :src="movie?.posterUrl"
              :alt="movie?.nameRu"
              class="card-img-top"
              style="object-fit: contain; width: 100%; height: auto"
            />
            <div class="card-body">
              <h5 class="card-title">{{ movie?.nameRu }}</h5>
              <p class="card-text mb-2">({{ movie?.nameEn }})</p>
              <router-link
                :to="{
                  name: 'CurrentMovie',
                  params: { id: movie?.filmId },
                  query: { movieName: movie?.nameRu },
                }"
                class="btn btn-secondary mt-2"
              >
                Подробнее
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center mt-3">
      <strong>Ничего не нашлось 🥺</strong>
    </div>
  </div>
</template>
