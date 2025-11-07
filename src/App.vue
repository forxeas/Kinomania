<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/base.css'
import {defineComponent} from "vue";
import AppNavBar from "@/components/AppNavBar.vue";

export default defineComponent({
  components: {AppNavBar}
})

</script>

<template>
  <AppNavBar />
<router-view ></router-view>
</template>

<style scoped>

</style>
