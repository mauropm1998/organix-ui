<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
    <div class="w-full">
  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('product', language) }}</label>
      <select v-model="filters.product" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
        <option value="">{{ t('allTypes', language) }}</option>
        <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
      </select>
    </div>
    <div class="w-full">
  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('channels', language) }}</label>
      <select v-model="filters.channel" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
        <option value="">{{ t('allChannels', language) }}</option>
        <option v-for="channel in channels" :key="channel.id" :value="channel.id">{{ channel.name }}</option>
      </select>
    </div>
    <div class="w-full">
  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('status', language) }}</label>
      <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
        <option value="">{{ t('allStatuses', language) }}</option>
        <option v-for="status in statuses" :key="status" :value="status">{{ t(status, language) }}</option>
      </select>
    </div>
    <div class="w-full">
  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('user', language) }}</label>
      <select v-model="filters.user" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
        <option value="">{{ t('allTypes', language) }}</option>
        <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
      </select>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  filters: Object,
  products: Array,
  channels: Array,
  statuses: Array,
  users: Array,
  t: Function,
  language: String
})
</script>
