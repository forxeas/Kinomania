<script>
import axios from "axios";
import AppButton from "@/components/AppButton.vue";

export default {
  name: "CurrentMovies",
  components: {AppButton},
  data() {
    return {
      movies: null,
      error: false
    }
  },
  inject: ['API_KEY'],

  async mounted() {
    const movie =this.movieName
    const url = `https://api.kinopoisk.dev/v1.4/movie/search?query=${movie}`
    const options =
        {
          headers: {'X-API-KEY': this.API_KEY, Accept: 'application/json'}
        }

    try {
      // const response = await axios.get(url, options)
      this.movies = response.data.docs
    } catch (error) {
      this.error = true
      console.error(error)

      setTimeout(() => {
        this.error = false
      }, 3000)
    }
  },

  methods: {
    closeError() {
      this.error = false
    },
    findFromStorage() {
      if(this.movieName)
    }
  },

  computed: {
    movieName() {
      return this.$route.query.movie
    }
  }
}
</script>

<template>
  <div v-if="error" class="d-flex alert alert-danger justify-content-between">
    <span>Произошла ошибка, скоро решу</span>
    <app-button @click="closeError">X</app-button>
  </div>

  <div v-if="movies && movies.length" class="row g-4">
    <div v-for="movie in movies" :key="movie.id" class="col-md-4 col-lg-3">
      <div class="card h-100 shadow-sm">
        <img v-if="movie.poster?.url" :src="movie.poster.url" class="card-img-top" alt="Poster">

        <div class="card-body d-flex flex-column"><h5 class="card-title">{{ movie.name }}</h5>
          <p class="card-text text-truncate">{{ movie.description }}</p>
          <div class="mt-auto"><small class="text-muted">Год: {{ movie.year }}</small></div>
        </div>

      </div>
    </div>
  </div>

  <div v-if="movies && movies.length === 0" class="text-center my-5"> Фильмы не найдены 😔.</div>
</template>

<style scoped>

</style>
