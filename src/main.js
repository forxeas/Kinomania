import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

const API_KEY = '46aef643-c66a-4c28-8e22-810547b9e997'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.provide('API_KEY', API_KEY)
app.use(router)

app.mount('#app')
