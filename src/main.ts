import {createApp, type InjectionKey} from 'vue'
import {createPinia, type Pinia} from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

const app: App<Element> = createApp(App)

const pinia: Pinia = createPinia()
pinia.use(piniaPluginPersistedState)

app.use(pinia)
app.provide('API_KEY', '46aef643-c66a-4c28-8e22-810547b9e997')
app.use(router)

app.mount('#app')
