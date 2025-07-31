<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('createOrganixAccount', language) }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ step === 1 ? t('setupCompany', language) : t('createAdminAccount', language) }}
        </p>
      </div>

      <!-- Progress Indicator -->
      <div class="flex items-center justify-center mb-8">
        <div :class="`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
        }`">
          1
        </div>
        <div :class="`w-16 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`" />
        <div :class="`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
        }`">
          2
        </div>
      </div>

      <form v-if="step === 1" @submit="handleCompanySubmit" class="space-y-6">
        <div>
          <label for="companyName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Building2 class="w-4 h-4 inline mr-2" />
            {{ t('companyName', language) }}
          </label>
          <input
            type="text"
            id="companyName"
            v-model="companyData.name"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            :placeholder="t('enterCompanyName', language)"
            required
          />
        </div>

        <div v-if="error" class="text-red-600 dark:text-red-400 text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {{ t('continue', language) }}
        </button>
      </form>

      <form v-else @submit="handleAdminSubmit" class="space-y-6">
        <div>
          <label for="adminName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <User class="w-4 h-4 inline mr-2" />
            {{ t('adminName', language) }}
          </label>
          <input
            type="text"
            id="adminName"
            v-model="adminData.name"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            :placeholder="t('enterAdminName', language)"
            required
          />
        </div>

        <div>
          <label for="adminEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Mail class="w-4 h-4 inline mr-2" />
            {{ t('email', language) }}
          </label>
          <input
            type="email"
            id="adminEmail"
            v-model="adminData.email"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            :placeholder="t('enterAdminEmail', language)"
            required
          />
        </div>

        <div>
          <label for="adminPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Lock class="w-4 h-4 inline mr-2" />
            {{ t('password', language) }}
          </label>
          <input
            type="password"
            id="adminPassword"
            v-model="adminData.password"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            :placeholder="t('enterPassword', language)"
            required
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Lock class="w-4 h-4 inline mr-2" />
            {{ t('confirmPassword', language) }}
          </label>
          <input
            type="password"
            id="confirmPassword"
            v-model="adminData.confirmPassword"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            :placeholder="t('confirmYourPassword', language)"
            required
          />
        </div>

        <div v-if="error" class="text-red-600 dark:text-red-400 text-sm">
          {{ error }}
        </div>

        <div class="flex space-x-3">
          <button
            type="button"
            @click="step = 1"
            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {{ t('back', language) }}
          </button>
          <button
            type="submit"
            class="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {{ t('createAccount', language) }}
          </button>
        </div>
      </form>

      <div class="mt-6 text-center">
        <button
          @click="$emit('backToLogin')"
          class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft class="w-4 h-4 mr-1" />
          {{ t('backToLogin', language) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Building2, User, Mail, Lock, ArrowLeft } from 'lucide-vue-next';
import { useLanguage } from '../composables/useLanguage.js';
import { t } from '../translations/index.js';


const emit = defineEmits(['signUp', 'backToLogin']);

const { language } = useLanguage();

const step = ref(1);
const companyData = ref({
  name: ''
});
const adminData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});
const error = ref('');

const handleCompanySubmit = (e: Event) => {
  e.preventDefault();
  if (!companyData.value.name.trim()) {
    error.value = t('companyNameRequired', language.value);
    return;
  }
  error.value = '';
  step.value = 2;
};

const handleAdminSubmit = (e: Event) => {
  e.preventDefault();
  error.value = '';

  if (!adminData.value.name.trim() || !adminData.value.email.trim() || !adminData.value.password.trim()) {
    error.value = t('allFieldsRequired', language.value);
    return;
  }

  if (adminData.value.password !== adminData.value.confirmPassword) {
    error.value = t('passwordsDoNotMatch', language.value);
    return;
  }

  if (adminData.value.password.length < 6) {
    error.value = t('passwordMinLength', language.value);
    return;
  }

  emit('signUp', 
    { name: companyData.value.name, adminId: '' },
    { 
      name: adminData.value.name, 
      email: adminData.value.email, 
      password: adminData.value.password 
    }
  );
};
</script>