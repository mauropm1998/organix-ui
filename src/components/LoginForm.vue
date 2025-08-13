

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Organix</h1>
        <p class="text-gray-600 dark:text-gray-400">{{ t('contentProductionManagement', language) }}</p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('email', language) }}</label>
          <input type="email" id="email" v-model="email" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors" required />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('password', language) }}</label>
          <input type="password" id="password" v-model="password" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors" required />
        </div>
        <div v-if="error" class="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>
          <span class="text-sm">{{ error }}</span>
        </div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          {{ t('signIn', language) }}
        </button>
      </form>
      <div class="mt-6 text-center">
        <button @click="goToSignUp" class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          {{ t('createNewCompanyAccount', language) }}
        </button>
      </div>
  <!-- informações de usuários demo removidas para produção -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '../translations/index.js'
import { useLanguage } from '../hooks/useLanguage.js'
import { mockUsers } from '../data/mockData.js'

const { language } = useLanguage()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  const user = mockUsers.find(u => u.email === email.value && u.password === password.value)
  if (user) {
    error.value = ''
    // Aqui você pode salvar o usuário logado em um store ou localStorage
    router.push('/')
  } else {
    error.value = t('invalidCredentials', language.value) || 'E-mail ou senha inválidos'
  }
}
function goToSignUp() {
  router.push('/signup')
}
</script>
