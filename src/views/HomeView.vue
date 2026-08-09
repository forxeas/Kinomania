<script setup lang="ts">
import appInput   from "@/components/AppInput.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";

const movie  = ref<string>('')
const router = useRouter()
const searchMovie = () => router.push({name: 'Movies', query: {movie: movie.value}})

</script>

<template>
  <div class="main-wrapper">
    <div class="background-effects">
      <div class="effect-circle effect-1"></div>
      <div class="effect-circle effect-2"></div>
      <div class="effect-circle effect-3"></div>
    </div>

    <div class="content-wrapper">
      <div class="logo-section">
        <div class="logo-icon">🎬</div>
        <h1 class="site-name">Kinomania</h1>
        <p class="site-tagline">Откройте мир кино</p>
      </div>

      <div class="search-section">
        <div class="input-wrapper">
          <app-input
              v-model.trim="movie"
              :className="'search-input text-center'"
              placeholder="Поиск фильмов..."
              @enter="searchMovie"
          ></app-input>
        </div>

        <div v-show="movie.length >= 3" class="fade-in-button">
          <button class="search-button" @click="searchMovie">
            <span class="button-text">Найти</span>
            <svg class="button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-wrapper {
  min-height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
  overflow: hidden;
}

.background-effects {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.effect-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(220, 53, 69, 0.1) 0%, transparent 70%);
  animation: float 20s ease-in-out infinite;
}

.effect-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.effect-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  right: -50px;
  animation-delay: -5s;
}

.effect-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(50px, 50px) scale(1.1);
  }
  50% {
    transform: translate(0, 100px) scale(1);
  }
  75% {
    transform: translate(-50px, 50px) scale(0.9);
  }
}

.content-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  padding: 2rem;
}

.logo-section {
  text-align: center;
  margin-bottom: 3rem;
  animation: slideDown 1s ease;
}

.logo-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: logoBounce 2s ease-in-out infinite;
}

@keyframes logoBounce {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(5deg);
  }
  75% {
    transform: translateY(-5px) rotate(-5deg);
  }
}

.site-name {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, #e0e0e0 50%, #fff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.05em;
  text-shadow: 0 0 40px rgba(220, 53, 69, 0.3);
  animation: textGlow 3s ease-in-out infinite;
}

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 40px rgba(220, 53, 69, 0.3);
  }
  50% {
    text-shadow: 0 0 60px rgba(220, 53, 69, 0.5);
  }
}

.site-tagline {
  font-size: 1.2rem;
  color: #adb5bd;
  margin-top: 0.5rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  animation: fadeIn 1.5s ease 0.5s both;
}

.search-section {
  width: 100%;
  max-width: 500px;
  animation: fadeIn 1s ease 0.3s both;
}

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.fade-in-button {
  display: flex;
  justify-content: center;
  animation: slideUp 0.5s ease;
}

.search-button {
  background: linear-gradient(135deg, #dc3545, #ff6b6b);
  border: none;
  color: #fff;
  padding: 1rem 2.5rem;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
  position: relative;
  overflow: hidden;
}

.search-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.search-button:hover::before {
  width: 300px;
  height: 300px;
}

.search-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(220, 53, 69, 0.5);
}

.search-button:active {
  transform: translateY(-1px) scale(0.98);
}

.button-icon {
  transition: transform 0.3s ease;
}

.search-button:hover .button-icon {
  transform: scale(1.2) rotate(10deg);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }

  .logo-icon {
    font-size: 3rem;
  }

  .site-name {
    font-size: 2.5rem;
  }

  .site-tagline {
    font-size: 1rem;
  }

  .search-input {
    font-size: 1rem;
    padding: 0.8rem 1.2rem;
  }

  .search-button {
    padding: 0.8rem 2rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .effect-circle {
    opacity: 0.5;
  }
}
</style>
