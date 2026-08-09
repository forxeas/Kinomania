import {createRouter, createWebHistory, type RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> =
    [
      { path: '/',           component: () => import('@/views/HomeView.vue'),       name: 'Home' },
      { path: '/movies',     component: () => import('@/views/Movies.vue'),         name: 'Movies' },
      { path: '/movies/:id', component: () => import('@/views/CurrentMovie.vue'),   name: 'CurrentMovie' },
      { path: '/actors',     component: () => import('@/views/Actors.vue'),         name: 'Actors' },
      { path: '/actor/:id',  component: () => import('@/views/Actor.vue'),          name: 'Actor' },
      { path: '/favorites',  component: () => import('@/views/Favorites.vue'),      name: 'Favorites' },
      { path: '/about',      component: () => import('@/views/AboutView.vue'),      name: 'About' },
    ]

const router = createRouter({history: createWebHistory(), routes})

export default router
