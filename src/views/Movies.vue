<script setup>
import { useSearchStore } from "./../stores/SearchStore.ts";
import { useCollectionStore } from "./../stores/CollectionStore.ts";
import router from "@/router/index.ts";
import {computed, inject, ref, watch} from "vue";
import {useRoute} from "vue-router";
import AppSpinner from "@/components/AppSpinner.vue";
import "@/assets/movie.css"

const API_KEY = inject('API_KEY')

const SearchStore     = useSearchStore()
const CollectionStore = useCollectionStore()
const route           = useRoute()

const movies          = ref([])
const error           = ref(false)
const loading         = ref(false)

const findMovie = async () =>
{
  error.value   = false
  loading.value = true

  try {
    movies.value = null
    if(!route.query.movie) {
      movies.value = await CollectionStore.setCollection(API_KEY)
      console.log(movies.value)
      return
    }
    movies.value = await SearchStore.setMovie(API_KEY, movieName.value)
  } catch(e) {
    error.value = true
    console.error(e)
  } finally {
    loading.value = false
  }
  console.log( movies.value)
}

const movieName      = computed(() => route.query.movie || '')
const filteredMovies = computed(() =>
{
  const films = movies?.value?.films || movies?.value[0]?.items || []
  console.log(movies.value)
  return films?.filter(film => film.posterUrlPreview && film.posterUrlPreview.length !== 67) || []
})
const searchCurrentMovie = (id) => router.push({name: 'CurrentMovie', params: {id: id}})

watch(movieName, (newId, oldValue) => {
  if(newId !== oldValue) {
    findMovie()
  }
}, {immediate: true})

</script>

<template>
  <div class="container py-5">
    <AppSpinner v-if="loading"/>

    <div v-else-if="filteredMovies?.length" class="row g-4 justify-content-center">
      <div
          v-for="film in filteredMovies"
          :key="film.filmId"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
          @click="searchCurrentMovie(film.filmId || film.kinopoiskId)"
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
