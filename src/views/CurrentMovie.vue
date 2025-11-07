<script setup>
import {useMovieStore} from "@/stores/MovieStore.js";
import AppButton from "@/components/AppButton.vue";
import {computed, inject, nextTick, onBeforeMount, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import "@/assets/currentMovie.css"

const API_KEY    = inject('API_KEY')
const movieStore = useMovieStore()
const route      = useRoute()
const router     = useRouter()

const movie      = ref([])
const similar    = ref([])
const movieId    = computed(() => route.params.id)

const backPage   = () => router.push({name: 'Home'})

onBeforeMount(() => {
  movie.value = movieStore.getMessage(movieId.value)
  if(movie.value) {

    const res = fetch('https://kinopoiskapiunofficial.tech/api/v2.2/films/5273/similar', {
      headers: {
        Accept: 'application/json',
        'X-API-KEY': API_KEY
      }
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err))
    console.log(res)
  }
})

onMounted(() => {
  if (movie.value) {
    nextTick(() => {
      const script = document.createElement("script");
      script.src = "//kinobd.net/js/player_.js";
      script.async = true;
      document.body.appendChild(script);
    })
  }
})
console.log(movie.value)
</script>

<template>
  <div class="container py-5">
    <app-button class="btn btn-danger mb-4" @click="backPage">Назад</app-button>

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
          {{ movie.nameRu }}
          <span v-if="movie.nameEn" class="text-secondary small">({{ movie.nameEn }})</span>
        </h2>

        <p class="text-secondary mb-2">
          {{ movie.year }} • {{ movie.genres.map(g => g.genre).join(', ') }}
        </p>

        <div class="mb-3">
          <span class="badge bg-danger fs-6 me-2">★ {{ movie.rating }}</span>
          <span class="badge bg-secondary">{{ movie.countries[0]?.country }}</span>
        </div>

        <p class="lead text-secondary mt-4">{{ movie.description }}</p>
      </div>
    </div>

    <div v-else class="text-center text-light mt-5">
      <div class="spinner-border text-danger" role="status"></div>
      <p class="mt-3">Загружаем информацию о фильме...</p>
    </div>

    <div id="kinobd" :data-kinopoisk="movieId" class="md-4 mt-5 video-player"></div>
  </div>
</template>
