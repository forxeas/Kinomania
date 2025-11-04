import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'

const API_KEY = 'A1KC3VM-KEHMWFK-Q7VC4EK-0KMVDVV'

const app = createApp(App)

app.use(createPinia())
app.provide('API_KEY', API_KEY)
app.use(router)

app.mount('#app')
