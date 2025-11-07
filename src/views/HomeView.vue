<script setup>
import appInput   from "@/components/AppInput.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";

const movie  = ref('')
const router = useRouter()
const searchMovie = () => router.push({name: 'Movies', query: {movie: movie.value}})

</script>

<template>
  <div class="d-flex justify-content-center align-items-center main-wrapper">
    <div class="d-flex flex-column align-items-center w-100 px-3">
      <strong id="SiteName" class="mb-2">Kinomania</strong>

      <div id="input" class="w-100 input-wrapper">
        <app-input
            v-model.trim="movie"
            :className="'text-center'"
            placeholder="Ваш фильм"
            @enter="searchMovie"
        ></app-input>
      </div>

      <div v-show="movie.length >= 3" class="fade-in-button">
        <button class="btn btn-success mt-4" @click="searchMovie">Найти</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-wrapper {
  min-height: 80vh;
}
#SiteName {
  font-size: clamp(28px, 6vw, 55px);
  font-weight: 700;
  text-align: center;
}
.input-wrapper {
  max-width: 500px;
  width: 100%;
}
button {
  width: 150px;
}
.fade-in-button {
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
@media (max-width: 576px) {
  button {
    width: 120px;
    font-size: 14px;
  }

  #input {
    width: 100%;
  }
}
</style>