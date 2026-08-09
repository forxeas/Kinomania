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
footer {
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(22, 33, 62, 0.9) 100%);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}
</style>
