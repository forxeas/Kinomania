<script setup>
import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useFavoritesStore} from "@/stores/FavoritesStore.ts";

const movie  = ref('');
const router = useRouter();
const route  = useRoute()
const FavoritesStore = useFavoritesStore();

const searchMovie = () => {
  if (movie.value.length > 2) {
    router.push({ name: 'Movies', query: { movie: movie.value } });
  }
}
const isMainPath = computed(() => route.path === '/')
const favoriteCount = computed(() => FavoritesStore.favoriteCount);
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold">
        <span class="brand-icon">🎬</span>
        Kinomania
      </router-link>
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
          <li class="nav-item" >
            <router-link class="nav-link" to="/">Главная</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/movies">Фильмы</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/actors">
              <span class="nav-link-icon">🎭</span>
              Актеры
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link position-relative" to="/favorites">
              <span class="nav-link-icon">❤️</span>
              Избранное
              <span
                v-if="favoriteCount > 0"
                class="favorite-badge"
              >
                {{ favoriteCount }}
              </span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">О проекте</router-link>
          </li>
        </ul>
        <div>
          <form class="search-form" @submit.prevent="searchMovie" v-if="!isMainPath">
            <div class="search-input-wrapper">
              <input
                  class="search-input"
                  type="search"
                  placeholder="Поиск фильмов..."
                  v-model.trim="movie"
              />
              <button class="search-button" type="submit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
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
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.navbar-brand {
  color: #fff !important;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar-brand:hover {
  transform: scale(1.05);
  text-shadow: 0 0 20px rgba(220, 53, 69, 0.5);
}

.brand-icon {
  font-size: 1.8rem;
  animation: brandBounce 2s ease-in-out infinite;
}

@keyframes brandBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.nav-link {
  color: #adb5bd !important;
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #dc3545, #ff6b6b);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover {
  color: #fff !important;
  background: rgba(220, 53, 69, 0.1);
  transform: translateY(-2px);
}

.nav-link:hover::before {
  width: 80%;
}

.nav-link.router-link-active {
  color: #fff !important;
  background: rgba(220, 53, 69, 0.2);
}

.nav-link.router-link-active::before {
  width: 80%;
}

.nav-link-icon {
  margin-right: 0.3rem;
  transition: transform 0.3s ease;
}

.nav-link:hover .nav-link-icon {
  transform: scale(1.2) rotate(10deg);
}

.favorite-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #dc3545, #ff6b6b);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.5);
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.5);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.7);
  }
}

.search-form {
  margin-left: 1rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 0.3rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(220, 53, 69, 0.5);
  box-shadow: 0 0 20px rgba(220, 53, 69, 0.2);
}

.search-input {
  background: transparent;
  border: none;
  color: #fff;
  padding: 0.3rem 0.5rem;
  width: 200px;
  font-size: 0.9rem;
  outline: none;
}

.search-input::placeholder {
  color: #adb5bd;
}

.search-button {
  background: linear-gradient(135deg, #dc3545, #ff6b6b);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 0.5rem;
}

.search-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.5);
}

.search-button:active {
  transform: scale(0.95);
}

.navbar-toggler {
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.navbar-toggler:hover {
  background: rgba(220, 53, 69, 0.2);
  border-color: rgba(220, 53, 69, 0.5);
}

@media (max-width: 992px) {
  .search-input {
    width: 150px;
  }
}

@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.3rem;
  }

  .brand-icon {
    font-size: 1.5rem;
  }

  .search-input {
    width: 100%;
  }

  .search-input-wrapper {
    width: 100%;
  }
}
</style>
