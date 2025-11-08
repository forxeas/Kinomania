<script setup>
  import {useRoute} from "vue-router";
  import {computed} from "vue";

  const route = useRoute()
  const isNotHomePage = computed(() => route.path !== '/')
</script>

<template>
  <footer class="text-light py-3 text-center" v-if="isNotHomePage">
    <p class="mb-0">© 2025 Сделано мною</p>
  </footer>
</template>

<style scoped>

</style>
