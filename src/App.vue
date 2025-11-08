<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/base.css'
import {defineComponent} from "vue";
import AppNavBar from "@/components/AppNavBar.vue";
import AppFooter from "@/components/AppFooter.vue";

export default defineComponent({
  components: {AppFooter, AppNavBar}
})

</script>

<template>
  <div class="main-container">
    <AppNavBar />
    <router-view></router-view>
    <span class="footer">
      <AppFooter/>
    </span>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.footer {
  margin-top: auto;
}
</style>
