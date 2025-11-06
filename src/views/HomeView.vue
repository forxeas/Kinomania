<script>
import appInput   from "@/components/AppInput.vue";
import router     from "@/router/index.js";

export default {
  components: {appInput},
  data() {
    return {
      movie: '',
    }
  },
  methods: {
    searchMovie() {
      router.push({name: 'Movies', query: {movie: this.movie}})
    }
  }
}

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
      <div v-show="movie.length >= 3 ">
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
</style>