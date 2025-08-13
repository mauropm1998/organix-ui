<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Organix Demo Company
            </h1>
            <h2 class="ml-4 text-lg text-gray-600 dark:text-gray-400">
              Organix
            </h2>
            <span class="ml-3 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              Admin
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">
              Admin User
            </span>
            <button @click="toggleLanguage" class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" :title="language === 'en' ? 'Português' : 'English'">
              <Languages class="w-5 h-5" />
            </button>
            <button @click="toggleTheme" class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <component :is="theme === 'light' ? Moon : Sun" class="w-5 h-5" />
            </button>
            <button @click="logout" class="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <LogOut class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <router-link v-for="item in navItems" :key="item.id" :to="item.route" class="flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors" :class="isActive(item.route)">
            <component :is="item.icon" class="w-4 h-4 mr-2" />
            {{ item.label() }}
          </router-link>
        </div>
      </div>
    </nav>
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
 </template>

<script setup>
import { useRoute } from 'vue-router'
import { Home, FileText, Video, Calendar, BarChart3, Package, Users, Languages, Moon, Sun, LogOut } from 'lucide-vue-next'
import { t } from '../translations/index.js'
import { useLanguage } from '../hooks/useLanguage.js'
const { language, setLanguage } = useLanguage()
import { useTheme } from '../hooks/useTheme.js'
const navItems = [
  { id: 'dashboard', label: () => t('dashboard', language.value), icon: Home, route: '/' },
  { id: 'drafts', label: () => t('drafts', language.value), icon: FileText, route: '/drafts' },
  { id: 'content', label: () => t('content', language.value), icon: Video, route: '/content' },
  { id: 'calendar', label: () => t('calendar', language.value), icon: Calendar, route: '/calendar' },
  { id: 'performance', label: () => t('performance', language.value), icon: BarChart3, route: '/performance' },
  { id: 'products', label: () => t('products', language.value), icon: Package, route: '/products' },
  { id: 'users', label: () => t('users', language.value), icon: Users, route: '/users' },
]
const route = useRoute()
function isActive(path) {
  return route.path === path
    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
}
const { theme, toggleTheme } = useTheme()
function toggleLanguage() {
  setLanguage(language.value === 'en' ? 'pt' : 'en')
}
function logout() {
  // Aqui você pode implementar a lógica real de logout
  alert('Logout!')
}
</script>
