import HomeView from '@/views/HomeView.vue'
import {createRouter, createWebHistory} from "vue-router";
import Movies from "@/views/Movies.vue";
import CurrentMovie from "@/views/CurrentMovie.vue";
import AboutView from "@/views/AboutView.vue";

const routes =
    [
      { path: '/',           component: HomeView,       name: 'Home' },
      { path: '/movies',     component: Movies,         name: 'Movies' },
      { path: '/movies/:id', component: CurrentMovie,   name: 'CurrentMovie' },
      { path: '/about',      component: AboutView,      name: 'About' },
    ]

const router = createRouter({history: createWebHistory(), routes: routes})

export default router
