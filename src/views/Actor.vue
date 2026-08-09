<script setup lang="ts">
import { useActorStore } from "./../stores/ActorStore.ts";
import { computed, inject, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import "@/assets/currentMovie.css";
import "@/assets/movie.css";
import type { Staff } from "@/interface";
import { truncateText } from "@/utils/movieDisplay.ts";

const API_KEY = inject<string>("API_KEY");
const ActorStore = useActorStore();
const route = useRoute();
const router = useRouter();

const actor = ref<Staff | null>(null);
const isLoading = ref(false);
const error = ref(false);

const actorId = computed(() => Number(route.params.id));

const loadActor = async () => {
  isLoading.value = true;
  error.value = false;

  try {
    actor.value = await ActorStore.getActor(API_KEY!, actorId.value);
  } catch (e) {
    error.value = true;
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const openMovie = (filmId: number) => {
  router.push({ name: "CurrentMovie", params: { id: filmId } });
};

watch(actorId, loadActor, { immediate: true });
</script>

<template>
  <div class="container py-5">
    <div v-if="isLoading" class="text-center text-light mt-5">
      <div class="spinner-border text-danger" role="status" />
      <p class="mt-3">Загружаем информацию об актере...</p>
    </div>

    <div v-else-if="error" class="text-center text-light mt-5">
      <h2>Не удалось загрузить информацию об актере</h2>
      <p class="text-secondary">Попробуйте обновить страницу</p>
    </div>

    <div v-else-if="actor" class="row justify-content-center align-items-start g-4">
      <div class="col-12 col-md-4 text-center">
        <img
          :src="actor.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'"
          :alt="actor.nameRu"
          class="img-fluid rounded shadow actor-poster"
        />
      </div>

      <div class="col-12 col-md-8 text-light">
        <h2 class="fw-bold mb-3 actor-title">
          {{ actor.nameRu }}
          <span v-if="actor.nameEn" class="text-secondary small">
            ({{ actor.nameEn }})
          </span>
        </h2>

        <p class="text-secondary mb-2">
          {{ actor.professionText }}
        </p>

        <div class="mb-3">
          <span class="badge bg-secondary">
            {{ actor.description || 'Актер' }}
          </span>
        </div>

        <div v-if="actor.films && actor.films.length" class="mt-4">
          <h3 class="fw-bold mb-4">Фильмография</h3>
          <div class="row g-4 justify-content-center">
            <div
              v-for="film in actor.films.slice(0, 20)"
              :key="film.filmId"
              class="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div
                class="card film-card bg-dark text-light border-0 shadow-sm h-100"
                @click="openMovie(film.filmId)"
                style="cursor: pointer"
              >
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title fw-bold text-truncate mb-2">
                    {{ film.nameRu || film.nameEn || 'Неизвестный фильм' }}
                  </h5>
                  <p v-if="film.nameEn" class="card-text film-subtitle mb-2">
                    {{ film.nameEn }}
                  </p>
                  <p v-if="film.description" class="card-text film-description flex-grow-1">
                    {{ truncateText(film.description, 100) }}
                  </p>
                  <p class="card-text film-role mt-auto">
                    <span class="badge bg-info text-dark">
                      {{ film.professionKey || 'Актёр' }}
                    </span>
                    <span v-if="film.rating" class="badge bg-danger ms-2">
                      ★ {{ film.rating }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="mt-4">
          <p class="text-secondary">Фильмография недоступна</p>
          <button class="btn btn-outline-danger mt-2" @click="router.push({ name: 'Home' })">
            На главную
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.actor-poster {
  max-height: 500px;
  width: 100%;
  height: auto;
  object-fit: contain;
  object-position: center;
  transition: transform 0.3s ease;
  display: block;
  border-radius: 12px;
}

.actor-poster:hover {
  transform: scale(1.02);
}

.actor-title {
  border-bottom: 3px solid #dc3545;
  padding-bottom: 12px;
  margin-top: 0;
  margin-bottom: 0.5rem;
  position: relative;
  background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(220, 53, 69, 0.2);
}

.actor-title::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #dc3545, #ff6b6b);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
}

.film-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.film-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 35px rgba(220, 53, 69, 0.25);
  border-color: rgba(220, 53, 69, 0.3);
}

.film-subtitle,
.film-description {
  color: #adb5bd !important;
  font-size: 0.9rem;
  line-height: 1.4;
  white-space: normal;
}

.film-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.film-role {
  margin-top: auto;
}

@media (max-width: 992px) {
  .actor-poster {
    max-height: 380px;
  }

  .actor-title {
    font-size: 1.4rem;
  }
}

@media (max-width: 600px) {
  .actor-poster {
    max-height: 220px;
  }

  h2 {
    text-align: center;
  }

  .actor-title {
    font-size: 1.1rem;
  }
}
</style>
