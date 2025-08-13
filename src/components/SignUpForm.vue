

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ t('createOrganixAccount', language) }}</h1>
        <p class="text-gray-600 dark:text-gray-400">{{ step === 1 ? t('setupCompany', language) : t('createAdminAccount', language) }}</p>
      </div>
      <div class="flex items-center justify-center mb-8">
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600']">1</div>
        <div :class="['w-16 h-1 mx-2', step >= 2 ? 'bg-blue-600' : 'bg-gray-200']"></div>
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600']">2</div>
      </div>
      <form v-if="step === 1" @submit.prevent="handleCompanySubmit" class="space-y-6">
        <div>
          <label for="companyName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('companyName', language) }}
          </label>
          <input type="text" id="companyName" v-model="companyData.name" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors" :placeholder="t('enterCompanyName', language)" required />
        </div>
        <div v-if="error" class="text-red-600 dark:text-red-400 text-sm">{{ error }}</div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors">{{ t('continue', language) }}</button>
      </form>
      <form v-else @submit.prevent="handleAdminSubmit" class="space-y-6">
        <div>
          <label for="adminName" class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <!-- User (lucide) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-400 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M16 16a4 4 0 0 0-8 0"/></svg>
            {{ t('adminName', language) }}
          </label>
          <input type="text" id="adminName" v-model="adminData.name" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors" :placeholder="t('enterAdminName', language)" required />
        </div>
        <div>
          <label for="adminEmail" class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <!-- Mail (lucide) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-400 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 6-8.97 6.48a2 2 0 0 1-2.06 0L2 6"/></svg>
            {{ t('email', language) }}
          </label>
          <input type="email" id="adminEmail" v-model="adminData.email" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors" :placeholder="t('enterAdminEmail', language)" required />
        </div>
        <div>
          <label for="adminPassword" class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <!-- Lock (lucide) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-400 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            {{ t('password', language) }}
          </label>
          <input type="password" id="adminPassword" v-model="adminData.password" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors" :placeholder="t('enterPassword', language)" required />
        </div>
        <div>
          <label for="confirmPassword" class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <!-- Lock (lucide) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-400 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            {{ t('confirmPassword', language) }}
          </label>
          <input type="password" id="confirmPassword" v-model="adminData.confirmPassword" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors" :placeholder="t('confirmYourPassword', language)" required />
        </div>
        <div v-if="error" class="text-red-600 dark:text-red-400 text-sm">{{ error }}</div>
        <div class="flex space-x-3">
          <button type="button" @click="step = 1" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">{{ t('back', language) }}</button>
          <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors">{{ t('createAccount', language) }}</button>
        </div>
      </form>
      <div class="mt-6 text-center">
        <button @click="goToLogin" class="inline-flex items-center text-base text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          {{ t('backToLogin', language) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '../translations/index.js'
import { useLanguage } from '../hooks/useLanguage.js'

const { language } = useLanguage()
const router = useRouter()
const step = ref(1)
const companyData = ref({ name: '' })
const adminData = ref({ name: '', email: '', password: '', confirmPassword: '' })
const error = ref('')

function handleCompanySubmit() {
  if (!companyData.value.name.trim()) {
    error.value = t('companyNameRequired', language.value)
    return
  }
  error.value = ''
  step.value = 2
}

function handleAdminSubmit() {
  error.value = ''
  if (!adminData.value.name.trim() || !adminData.value.email.trim() || !adminData.value.password.trim()) {
    error.value = t('allFieldsRequired', language.value)
    return
  }
  if (adminData.value.password !== adminData.value.confirmPassword) {
    error.value = t('passwordsDoNotMatch', language.value)
    return
  }
  if (adminData.value.password.length < 6) {
    error.value = t('passwordMinLength', language.value)
    return
  }
  // Aqui você pode adicionar lógica de cadastro real
  // Simula sucesso
  router.push('/login')
}

function goToLogin() {
  router.push('/login')
}
</script>
