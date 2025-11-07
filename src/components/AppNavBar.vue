<script setup>
import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const movie  = ref('');
const router = useRouter();
const route  = useRoute()

const searchMovie = () => {
  if (movie.value.length > 2) {
    router.push({ name: 'Movies', query: { movie: movie.value } });
  }
}
const isMainPath = computed(() => route.path === '/')
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold">Kinomania</router-link>
      <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Главная</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/movies">Фильмы</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">О проекте</router-link>
          </li>
        </ul>
        <div v-if="!isMainPath">
          <form class="d-flex ms-lg-3" @submit.prevent="searchMovie">
            <input
                class="form-control me-2"
                type="search"
                placeholder="Поиск"
                v-model.trim="movie"
            />
            <button class="btn btn-outline-light" type="submit">Найти</button>
          </form>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
}
</style>