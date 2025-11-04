import HomeView from '@/views/HomeView.vue'
import {createRouter, createWebHistory} from "vue-router";
import Movies from "@/views/Movies.vue";

const routes =
    [
      { path: '/',           component: HomeView, name: 'Home' },
      { path: '/movies',     component: Movies,   name: 'Movies' },
    ]

const router = createRouter({history: createWebHistory(), routes: routes})

export default router