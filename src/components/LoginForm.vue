<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Organix
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('contentProductionManagement', language) }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('email', language) }}
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('password', language) }}
          </label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            required
          />
        </div>

        <div v-if="error" class="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertCircle class="w-4 h-4" />
          <span class="text-sm">{{ error }}</span>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {{ t('signIn', language) }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <button
          @click="$emit('showSignUp')"
          class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <UserPlus class="w-4 h-4 mr-1" />
          {{ t('createNewCompanyAccount', language) }}
        </button>
      </div>

      <div class="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('demoAccounts', language) }}</h3>
        <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div>{{ t('admin', language) }}: admin@organix.com / admin123</div>
          <div>{{ t('operator', language) }}: john@organix.com / operator123</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AlertCircle, UserPlus } from 'lucide-vue-next';
import { useLanguage } from '../composables/useLanguage.js';
import { t } from '../translations/index.js';

const emit = defineEmits(['login', 'showSignUp']);

const { language } = useLanguage();
const email = ref('');
const password = ref('');
const error = ref('');

const handleSubmit = () => {
  error.value = '';
  
  const success = emit('login', email.value, password.value);
  if (!success) {
    error.value = t('invalidCredentials', language.value);
  }
};
</script>