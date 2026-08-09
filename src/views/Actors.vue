<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import "@/assets/currentMovie.css";
import "@/assets/movie.css";

const router = useRouter();

const popularActors = ref([
  { id: 1, name: "Роберт Де Ниро", nameEn: "Robert De Niro", poster: "https://via.placeholder.com/200x300?text=De+Niro" },
  { id: 2, name: "Аль Пачино", nameEn: "Al Pacino", poster: "https://via.placeholder.com/200x300?text=Pacino" },
  { id: 3, name: "Том Хэнкс", nameEn: "Tom Hanks", poster: "https://via.placeholder.com/200x300?text=Hanks" },
  { id: 4, name: "Леонардо Ди Каприо", nameEn: "Leonardo DiCaprio", poster: "https://via.placeholder.com/200x300?text=DiCaprio" },
  { id: 5, name: "Брэд Питт", nameEn: "Brad Pitt", poster: "https://via.placeholder.com/200x300?text=Pitt" },
  { id: 6, name: "Анджелина Джоли", nameEn: "Angelina Jolie", poster: "https://via.placeholder.com/200x300?text=Jolie" },
  { id: 7, name: "Джонни Депп", nameEn: "Johnny Depp", poster: "https://via.placeholder.com/200x300?text=Depp" },
  { id: 8, name: "Скарлетт Йоханссон", nameEn: "Scarlett Johansson", poster: "https://via.placeholder.com/200x300?text=Johansson" },
]);

const openActor = (actorId: number) => {
  router.push({ name: "Actor", params: { id: actorId } });
};
</script>

<template>
  <div class="container py-5 actors-page">
    <header class="actors-page__header">
      <h1 class="actors-page__title">Актеры</h1>
      <p class="actors-page__subtitle">
        Популярные актеры мирового кино
      </p>
    </header>

    <div class="row g-4 justify-content-center">
      <div
        v-for="actor in popularActors"
        :key="actor.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <article
          class="card actor-card bg-dark text-light border-0 h-100"
          @click="openActor(actor.id)"
          style="cursor: pointer"
        >
          <div class="actor-poster-wrapper">
            <img
              :src="actor.poster"
              :alt="actor.name"
              class="card-img-top object-fit-cover"
            />
            <div class="actor-overlay">
              <span class="actor-watch-btn">Фильмы</span>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-truncate mb-2">
              {{ actor.name }}
            </h5>
            <p class="card-text actor-subtitle mb-2">
              {{ actor.nameEn }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.actors-page__header {
  margin-bottom: 2rem;
  text-align: center;
}

.actors-page__title {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.actors-page__subtitle {
  color: #adb5bd;
  margin: 0;
}

.actor-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.actor-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 35px rgba(220, 53, 69, 0.25);
  border-color: rgba(220, 53, 69, 0.3);
}

.actor-poster-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 2 / 3;
}

.actor-poster-wrapper .card-img-top {
  transition: transform 0.4s ease, filter 0.3s ease;
}

.actor-card:hover .actor-poster-wrapper .card-img-top {
  transform: scale(1.08);
  filter: brightness(0.85);
}

.actor-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(30, 30, 47, 0) 40%, rgba(30, 30, 47, 0.8) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.actor-card:hover .actor-overlay {
  opacity: 1;
}

.actor-watch-btn {
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: rgba(220, 53, 69, 0.9);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.actor-card:hover .actor-watch-btn {
  transform: translateY(0);
}

.actor-subtitle {
  color: #adb5bd !important;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>