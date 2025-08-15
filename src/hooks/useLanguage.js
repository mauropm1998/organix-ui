import { ref, watch } from 'vue'
import { translations } from '../translations/index.js'

// Inicializar idioma a partir do localStorage ou padrão 'pt'
const language = ref(localStorage.getItem('language') || 'pt')

export function useLanguage() {
  function setLanguage(lang) {
    language.value = lang
    localStorage.setItem('language', lang)
    // Disparar evento customizado para atualizar título
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }))
  }
  
  return { language, setLanguage }
}

// Listener global para mudanças de idioma
if (typeof window !== 'undefined') {
  window.addEventListener('languageChanged', (event) => {
    updatePageTitleFromCurrentRoute(event.detail)
  })
}

// Função para atualizar título baseado na rota atual
function updatePageTitleFromCurrentRoute(lang) {
  // Tentar obter a rota atual do hash ou pathname
  const currentPath = window.location.pathname
  let titleKey = 'app'
  
  // Mapear caminhos para chaves de título
  const pathTitleMap = {
    '/login': 'login',
    '/signup': 'signup',
    '/': 'dashboard',
    '/drafts': 'drafts',
    '/content': 'content',
    '/calendar': 'calendar',
    '/performance': 'performance',
    '/products': 'products',
    '/users': 'users'
  }
  
  titleKey = pathTitleMap[currentPath] || 'app'
  
  const title = translations[lang]?.pageTitle?.[titleKey] || translations[lang]?.pageTitle?.app || 'Organix'
  document.title = title
}
