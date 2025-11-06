import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

const API_KEY = '2ace8266-712d-4e7e-a91e-4dc27924f71e'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.provide('API_KEY', API_KEY)
app.use(router)

app.mount('#app')
