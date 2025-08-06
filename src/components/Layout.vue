<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
                Organix
              </h1>
              <nav class="hidden md:flex space-x-6">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                  :class="activeTab === tab.id 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                    : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'"
                >
                  <component :is="tab.icon" class="w-4 h-4 inline mr-2" />
                  {{ t(tab.label) }}
                </button>
              </nav>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- Language Toggle -->
            <button
              @click="toggleLanguage"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              :title="t('common.language')"
            >
              <Globe class="w-5 h-5" />
            </button>
            
            <!-- Theme Toggle -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              :title="t('common.theme')"
            >
              <Sun v-if="isDark" class="w-5 h-5" />
              <Moon v-else class="w-5 h-5" />
            </button>
            
            <!-- User Menu -->
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {{ user?.name }}
              </span>
              <button
                @click="logout"
                class="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors"
                :title="t('auth.logout')"
              >
                <LogOut class="w-5 h-5" />
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation -->
    <div class="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="px-4 py-2">
        <select
          v-model="activeTab"
          class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
            {{ t(tab.label) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <component :is="currentComponent" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  Package, 
  Users, 
  Calendar as CalendarIcon, 
  BarChart3,
  Globe,
  Sun,
  Moon,
  LogOut
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth.js'
import { useLanguage } from '../composables/useLanguage.js'
import { useTheme } from '../composables/useTheme.js'
import Dashboard from './Dashboard.vue'
import DraftManager from './DraftManager.vue'
import ContentManager from './ContentManager.vue'
import ProductManager from './ProductManager.vue'
import UserManager from './UserManager.vue'
import Calendar from './Calendar.vue'
import Performance from './Performance.vue'

const { user, logout } = useAuth()
const { t, toggleLanguage } = useLanguage()
const { isDark, toggleTheme } = useTheme()

const activeTab = ref('dashboard')

const tabs = computed(() => {
  const allTabs = [
    { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard, component: Dashboard },
    { id: 'drafts', label: 'drafts', icon: FileText, component: DraftManager },
    { id: 'content', label: 'content', icon: Video, component: ContentManager },
    { id: 'calendar', label: 'calendar', icon: CalendarIcon, component: Calendar },
    { id: 'performance', label: 'performance', icon: BarChart3, component: Performance }
  ]

  // Add admin-only tabs
  if (user.value?.adminType === 'admin') {
    allTabs.push(
      { id: 'products', label: 'products', icon: Package, component: ProductManager },
      { id: 'users', label: 'users', icon: Users, component: UserManager }
    )
  }

  return allTabs
})

const currentComponent = computed(() => {
  const tab = tabs.value.find(t => t.id === activeTab.value)
  return tab?.component || Dashboard
})

</script>

<style scoped>
/* Component styles */
</style>