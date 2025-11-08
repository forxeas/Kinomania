<script setup>
import {useMovieStore} from "@/stores/MovieStore.js";
import AppButton from "@/components/AppButton.vue";
import {computed, inject, nextTick, onBeforeMount, onMounted, ref, watch} from "vue";
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

watch(movieId, async (newValue, oldValue) => {
  if(newValue !== oldValue) {
    await movieStore.setMovie(API_KEY, newValue)
    movie.value   = await movieStore.getMovie(movieId.value)
    similar.value =  await movieStore.setSimilar(API_KEY, movieId.value)
    console.log(movie.value)
  }
})

onBeforeMount(async () => {
  movie.value   = movieStore.getMovie(movieId.value)
  similar.value = await movieStore.setSimilar(API_KEY, movieId.value)
  console.log(movie.value)
})

onMounted(async () => {
  if (movie.value) {
    await nextTick(() => {
      const script = document.createElement("script");
      script.src = "//kinobd.net/js/player_.js";
      script.async = true;
      document.body.appendChild(script);
    })
  }
})
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

    <div v-if="similar.length" class="mt-5">
      <h3 class="fw-bold text-light">Похожие фильмы: </h3>
      <div class="row g-4">
        <div v-for="movie in similar" :key="movie.filmId" class="col-12 col-md-3">
          <div class="card bg-dark text-light">
            <img :src="movie?.posterUrl"
                 :alt="movie?.nameRu"
                 class="card-img-top"
                 style="object-fit: contain; width: 100%; height: auto;" />
            <div class="card-body">
              <h5 class="card-title">{{ movie?.nameRu }}</h5>
              <p class="card-text">{{ movie?.nameEn }}</p>
              <router-link
                :to="
                {
                  name: 'CurrentMovie',
                  params: { id: movie?.filmId },
                  query: {movieName: movie?.nameRu}
                }"
                class="btn btn-secondary"
              >
                Подробнее
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class=" text-center mt-3">
      <strong>Ничего не нашлось 🥺</strong>
    </div>
  </div>
</template>
