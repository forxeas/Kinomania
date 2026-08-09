import HomeView from '@/views/HomeView.vue'
import {createRouter, createWebHistory, type RouteRecordRaw} from "vue-router";
import Movies from "@/views/Movies.vue";
import CurrentMovie from "@/views/CurrentMovie.vue";
import AboutView from "@/views/AboutView.vue";
import Favorites from "@/views/Favorites.vue";
import Actor from "@/views/Actor.vue";
import Actors from "@/views/Actors.vue";

const routes: Array<RouteRecordRaw> =
    [
      { path: '/',           component: HomeView,       name: 'Home' },
      { path: '/movies',     component: Movies,         name: 'Movies' },
      { path: '/movies/:id', component: CurrentMovie,   name: 'CurrentMovie' },
      { path: '/actors',     component: Actors,         name: 'Actors' },
      { path: '/actor/:id',  component: Actor,          name: 'Actor' },
      { path: '/favorites',  component: Favorites,      name: 'Favorites' },
      { path: '/about',      component: AboutView,      name: 'About' },
    ]

const router = createRouter({history: createWebHistory(), routes})

export default router
