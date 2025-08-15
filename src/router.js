import { createRouter, createWebHistory } from 'vue-router'
import Layout from './components/Layout.vue'
import { translations } from './translations/index.js'

// Componentes públicos (sem layout)
const LoginForm = () => import('./components/LoginForm.vue')
const SignUpForm = () => import('./components/SignUpForm.vue')

// Componentes privados (com layout)
const Dashboard = () => import('./components/Dashboard.vue')
const DraftManager = () => import('./components/DraftManager.vue')
const ContentManager = () => import('./components/ContentManager.vue')
const Calendar = () => import('./components/Calendar.vue')
const Performance = () => import('./components/Performance.vue')
const ProductManager = () => import('./components/ProductManager.vue')
const UserManager = () => import('./components/UserManager.vue')

const routes = [
  // Rotas públicas (sem layout)
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginForm,
    meta: { 
      requiresAuth: false,
      titleKey: 'login'
    }
  },
  { 
    path: '/signup', 
    name: 'SignUp', 
    component: SignUpForm,
    meta: { 
      requiresAuth: false,
      titleKey: 'signup'
    }
  },
  
  // Rotas privadas (com layout)
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { 
        path: '', 
        name: 'Dashboard', 
        component: Dashboard,
        meta: { titleKey: 'dashboard' }
      },
      { 
        path: 'drafts', 
        name: 'DraftManager', 
        component: DraftManager,
        meta: { titleKey: 'drafts' }
      },
      { 
        path: 'content', 
        name: 'ContentManager', 
        component: ContentManager,
        meta: { titleKey: 'content' }
      },
      { 
        path: 'calendar', 
        name: 'Calendar', 
        component: Calendar,
        meta: { titleKey: 'calendar' }
      },
      { 
        path: 'performance', 
        name: 'Performance', 
        component: Performance,
        meta: { titleKey: 'performance' }
      },
      { 
        path: 'products', 
        name: 'ProductManager', 
        component: ProductManager,
        meta: { titleKey: 'products' }
      },
      { 
        path: 'users', 
        name: 'UserManager', 
        component: UserManager,
        meta: { titleKey: 'users' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Função para obter o idioma atual
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'pt'
}

// Função para atualizar o título da página
function updatePageTitle(titleKey) {
  const language = getCurrentLanguage()
  const title = translations[language]?.pageTitle?.[titleKey] || translations[language]?.pageTitle?.app || 'Organix'
  document.title = title
}

// Guard de autenticação e atualização de título
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)
  
  // Atualizar título da página
  const titleKey = to.meta.titleKey || to.matched.find(record => record.meta.titleKey)?.meta.titleKey
  if (titleKey) {
    updatePageTitle(titleKey)
  } else {
    updatePageTitle('app')
  }
  
  if (requiresAuth && !token) {
    // Rota protegida sem token - redirecionar para login
    next('/login')
  } else if (!requiresAuth && token && (to.name === 'Login' || to.name === 'SignUp')) {
    // Usuário logado tentando acessar login/signup - redirecionar para dashboard
    next('/')
  } else {
    next()
  }
})

export default router