<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ company.name }}
            </h1>
            <h2 class="ml-4 text-lg text-gray-600 dark:text-gray-400">
              Organix
            </h2>
            <span class="ml-3 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {{ t(user.adminType, language) }}
            </span>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600 dark:text-gray-300">
              {{ user.name }}
            </span>
            <button
              @click="toggleLanguage"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :title="language === 'en' ? 'Português' : 'English'"
            >
              <Languages class="w-5 h-5" />
            </button>
            <button
              @click="$emit('toggleTheme')"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Moon v-if="theme === 'light'" class="w-5 h-5" />
              <Sun v-else class="w-5 h-5" />
            </button>
            <button
              @click="$emit('logout')"
              class="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
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
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="$emit('tabChange', item.id)"
            :class="[
              'flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === item.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            <component :is="item.icon" class="w-4 h-4 mr-2" />
            {{ item.label }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Sun, Moon, LogOut, Home, FileText, Video, Package, Users, Calendar, BarChart3, Languages } from 'lucide-vue-next';
import { useLanguage } from '../composables/useLanguage.js';
import { t } from '../translations/index.js';


const props = defineProps({
  user: Object,
  company: Object,
  theme: String,
  activeTab: String
});

defineEmits(['logout', 'toggleTheme', 'tabChange']);

const { language, toggleLanguage } = useLanguage();

const navItems = computed(() => [
  { id: 'dashboard', label: t('dashboard', language.value), icon: Home },
  { id: 'drafts', label: t('drafts', language.value), icon: FileText },
  { id: 'content', label: t('content', language.value), icon: Video },
  { id: 'calendar', label: t('calendar', language.value), icon: Calendar },
  { id: 'performance', label: t('performance', language.value), icon: BarChart3 },
  { id: 'products', label: t('products', language.value), icon: Package },
  ...(props.user.adminType === 'admin' ? [{ id: 'users', label: t('users', language.value), icon: Users }] : [])
]);
</script>