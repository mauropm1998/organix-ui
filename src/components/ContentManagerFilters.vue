<template>
  <div class="flex space-x-4">
    <select v-model="modelValue.status" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
      <option value="">{{ t('allStatuses', language).charAt(0).toUpperCase() + t('allStatuses', language).slice(1) }}</option>
      <option v-for="status in CONTENT_STATUSES" :key="status" :value="status">{{ t(status, language) }}</option>
    </select>
    <select v-model="modelValue.channel" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
  <option value="">{{ t('allChannels', language) }}</option>
  <option v-for="channel in CHANNELS" :key="channel" :value="channel">{{ t(channel, language) || channel }}</option>
    </select>
  </div>
</template>

<script setup>
import { CONTENT_STATUSES, CHANNELS } from '../data/mockData'
const props = defineProps({
  modelValue: Object,
  t: Function,
  language: String
})
const emit = defineEmits(['update:modelValue'])
</script>
