<script setup>
import { useMovieStore } from "@/stores/MovieStore.js";
import router from "@/router/index.js";
import {computed, inject, ref, watch} from "vue";
import {useRoute} from "vue-router";

const API_KEY = inject('API_KEY')

const movieStore = useMovieStore()
const route      = useRoute()

const movies  = ref([])
const error   = ref(false)
const loading = ref(false)

const movieName      = computed(() => route.query.movie || '')
const filteredMovies = computed(() =>
{
   return movies.value?.films?.filter(film => film.posterUrlPreview && film.posterUrlPreview.length !== 67) || []
})

const findMovie = async () =>
{
  error.value   = false
  loading.value = false

  try {
    movies.value = await movieStore.setMovie(API_KEY, movieName.value)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const closeError         = () => error.value = false
const searchCurrentMovie = (id) => router.push({name: 'CurrentMovie', params: {id: id}})

watch(movieName.value, (newId) => findMovie(newId), {immediate: true})

</script>

<template>
  <div class="container py-5">
    <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="filteredMovies?.length" class="row g-4 justify-content-center">
      <div
          v-for="film in filteredMovies"
          :key="film.filmId"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
          @click="searchCurrentMovie(film.filmId)"
      >
        <div class="card movie-card bg-dark text-light border-0 shadow-sm h-100">
          <img
              :src="film.posterUrlPreview"
              class="card-img-top object-fit-cover"
              :alt="film.nameRu"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-truncate mb-2">
              {{ film.nameRu || film.nameEn }}
            </h5>
            <p class="card-text small text-muted mb-2">
              {{ film.year }} • {{ film.genres[0]?.genre }}
            </p>
            <p class="card-text small text-secondary flex-grow-1">
              {{ film.description?.slice(0, 120) + '...' }}
            </p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="badge bg-danger">★ {{ film.rating }}</span>
              <span class="badge bg-secondary text-uppercase">
                {{ film.countries[0]?.country }}
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
.movie-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.movie-card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 25px rgba(220, 53, 69, 0.3);
}
.card-img-top {
  height: clamp(220px, 35vh, 380px);
  object-fit: cover;
}
@media (max-width: 768px) {
  .movie-card {
    border-radius: 10px;
  }
  .card-body {
    padding: 0.75rem;
  }
  .card-title {
    font-size: 1rem;
  }
  .card-text {
    font-size: 0.85rem;
  }
  .badge {
    font-size: 0.75rem;
  }
}
@media (max-width: 480px) {
  .card-img-top {
    height: 240px;
  }
  h2 {
    font-size: 1.25rem;
  }
  p.text-secondary {
    font-size: 0.9rem;
  }
}
</style>