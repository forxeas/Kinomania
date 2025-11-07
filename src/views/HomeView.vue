<script setup>
import appInput   from "@/components/AppInput.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";

const movie  = ref('')
const router = useRouter()
const searchMovie = () => router.push({name: 'Movies', query: {movie: movie.value}})

</script>

<template>
  <div class="d-flex justify-content-center align-items-center" style="height: 80vh">
    <div class="d-flex flex-column align-items-center">
      <strong id="SiteName">Kinomania</strong>

      <div id="input" style="width: 500px;">
        <app-input
            v-model.trim="movie"
            :className="'text-center'"
            placeholder="Ваш фильм"
            @enter="searchMovie"></app-input>
      </div>
      <div v-show="movie.length >= 3" class="fade-in-button">
        <button class="btn btn-success mt-4" @click="searchMovie">Найти</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#SiteName {
  font-size: 55px;
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
</style>
