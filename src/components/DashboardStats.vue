<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
        <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <FileText class="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('totalDrafts', language) }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ draftStats.total }}</p>
        </div>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
        <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
          <CheckCircle class="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('approvedDrafts', language) }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ draftStats.approved }}</p>
        </div>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
        <div class="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
          <Video class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('totalContent', language) }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ contentStats.total }}</p>
        </div>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
        <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <PlayCircle class="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('inProduction', language) }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ contentStats.inProduction }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'
import { FileText, Video, CheckCircle, PlayCircle } from 'lucide-vue-next'
const props = defineProps({
  draftStats: Object,
  contentStats: Object,
  t: Function,
  language: String
})
const { draftStats, contentStats, t, language } = toRefs(props)
</script>
