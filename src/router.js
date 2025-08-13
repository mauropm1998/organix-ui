import { createRouter, createWebHistory } from 'vue-router'

// Rotas placeholder, serão atualizadas conforme os componentes forem convertidos
const routes = [
  { path: '/', name: 'Dashboard', component: () => import('./components/Dashboard.vue') },
  { path: '/drafts', name: 'DraftManager', component: () => import('./components/DraftManager.vue') },
  { path: '/content', name: 'ContentManager', component: () => import('./components/ContentManager.vue') },
  { path: '/calendar', name: 'Calendar', component: () => import('./components/Calendar.vue') },
  { path: '/performance', name: 'Performance', component: () => import('./components/Performance.vue') },
  { path: '/products', name: 'ProductManager', component: () => import('./components/ProductManager.vue') },
  { path: '/users', name: 'UserManager', component: () => import('./components/UserManager.vue') },
  { path: '/login', name: 'LoginForm', component: () => import('./components/LoginForm.vue') },
  { path: '/signup', name: 'SignUpForm', component: () => import('./components/SignUpForm.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router