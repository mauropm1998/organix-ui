
import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import router from './router'
import { translations } from './translations/index.js'

// Definir título inicial
const language = localStorage.getItem('language') || 'pt'
document.title = translations[language]?.pageTitle?.app || 'Organix'

createApp(App).use(router).mount('#app')
