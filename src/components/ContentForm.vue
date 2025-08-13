<template>
  <div v-if="show" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ editingContent ? t('editContent', language) : t('createNewContent', language) }}</h3>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('name', language) }}</label>
          <input type="text" v-model="formData.name" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('type', language) }}</label>
          <select v-model="formData.type" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" required>
            <option value="">{{ t('type', language) }}</option>
            <option v-for="type in CONTENT_TYPES" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('product', language) }}</label>
          <select v-model="formData.product" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" required>
            <option value="">{{ t('product', language) }}</option>
            <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('postDate', language) }}</label>
          <input type="date" v-model="formData.postDate" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" required />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('creator', language) }}</label>
          <select v-model="formData.creator" :disabled="user.adminType !== 'admin'" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" required>
            <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('producer', language) }}</label>
          <select v-model="formData.producer" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" required>
            <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('status', language) }}</label>
          <select v-model="formData.status" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
            <option v-for="status in CONTENT_STATUSES" :key="status" :value="status">{{ t(status, language) }}</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('channels', language) }}</label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <label v-for="channel in CHANNELS" :key="channel" class="flex items-center">
            <input type="checkbox" :value="channel" v-model="formData.channels" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ channel }}</span>
          </label>
        </div>
      </div>
      <div class="flex space-x-3">
        <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">{{ editingContent ? t('update', language) : t('create', language) }} {{ t('content', language) }}</button>
        <button type="button" @click="$emit('cancel')" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors">{{ t('cancel', language) }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { CONTENT_STATUSES, CONTENT_TYPES, CHANNELS } from '../data/mockData'
const props = defineProps({
  show: Boolean,
  editingContent: Object,
  formData: Object,
  users: Array,
  products: Array,
  user: Object,
  t: Function,
  language: String
})
const emit = defineEmits(['submit', 'cancel'])
function onSubmit() {
  emit('submit')
}
</script>
