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
  <div class="container-fluid py-5">
    <div v-if="loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>


    <div class="row justify-content-center" v-if="movies">
      <div
          v-for="film in filteredMovies"
          :key="film.filmId"
          class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center"
          @click="searchCurrentMovie(film.filmId)"
      >
        <div class="card movie-card bg-dark text-light shadow-lg border-0">
          <img
              :src="film.posterUrlPreview"
              class="card-img"
              :alt="film.nameRu"
          />
          <div class="card-body">
            <h5 class="card-title text-truncate fw-bold">{{ film.nameRu + '|' + film.nameEn }}</h5>
            <p class="card-text small text-muted mb-2">
              {{ film.year }} • {{ film.genres[0]?.genre }}
            </p>
            <p class="card-text small text-secondary">
              {{ film.description?.slice(0, 150) + '...' }}
            </p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="badge bg-danger mr">★ {{ film.rating }}</span>
              <span class="small text bg-danger badge">{{ film.countries[0].country }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else><h2 class="text-center">Ничего не найдено 😔</h2></div>
  </div>
</template>

<style scoped>
.movie-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 10px;
  overflow: hidden;
}

.movie-card:hover {
  transform: scale(1.04);
  box-shadow: 0 10px 25px rgba(255, 0, 0, 0.3);
}

h2 {
  letter-spacing: 1px;
  text-transform: uppercase;
}
</style>
