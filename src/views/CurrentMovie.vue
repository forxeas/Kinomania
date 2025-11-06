<script>
import {useMovieStore} from "@/stores/MovieStore.js";
import AppButton from "@/components/AppButton.vue";

export default {
  name: "CurrentMovie",
  components: {AppButton},
  data() {
    return {
      movieStore: useMovieStore(),
      movie: []
    }
  },
  methods: {
    backPage() {
      this.$router.push({name: 'Home'})
    }
  },

  computed: {
    movieId () {
      return this.$route.params.id
    }
  },
  beforeMount() {
    this.movie = this.movieStore.getMessage(this.movieId);
  },
  mounted() {
    if (this.movie) {
      this.$nextTick(() => {
        const script = document.createElement("script");
        script.src = "//kinobd.net/js/player_.js";
        script.async = true;
        document.body.appendChild(script);
      });
    }
  }
}
</script>

<template>
  <div class="container py-5">
    <app-button class="btn btn-danger mb-4" @click="backPage">Назад</app-button>
    <div v-if="movie" class="row justify-content-center align-items-start g-4">
      <div class="col-md-4 text-center">
        <img
            :src="movie.posterUrl"
            :alt="movie.nameRu"
            class="img-fluid rounded shadow movie-poster"
        />
      </div>

      <div class="col-md-8 text-light">
        <h2 class="fw-bold mb-3">
          {{ movie.nameRu }}
          <span v-if="movie.nameEn" class="text-secondary small">({{ movie.nameEn }})</span>
        </h2>

        <p class="text-muted mb-2">
          {{ movie.year }} • {{ movie.genres.map(g => g.genre).join(', ') }}
        </p>

        <div class="mb-3">
          <span class="badge bg-danger fs-6 me-2">★ {{ movie.rating }}</span>
          <span class="badge bg-secondary">{{ movie.countries[0]?.country }}</span>
        </div>

        <p class="lead mt-4">{{ movie.description }}</p>
      </div>
    </div>

    <div v-else class="text-center text-light mt-5">
      <div class="spinner-border text-danger" role="status"></div>
      <p class="mt-3">Загружаем информацию о фильме...</p>
    </div>
    <div id="kinobd" :data-kinopoisk="movieId" class="mt-5"></div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
}

.movie-poster {
  max-height: 500px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.movie-poster:hover {
  transform: scale(1.02);
}

h2 {
  border-bottom: 2px solid #dc3545;
  padding-bottom: 10px;
}

.lead {
  line-height: 1.6;
  color: #ccc;
}
</style>
