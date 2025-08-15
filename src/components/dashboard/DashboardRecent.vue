<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Recent Drafts -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('recentDrafts', language) }}</h3>
      </div>
      <div class="p-6">
        <template v-if="userDrafts.length">
          <div v-for="draft in userDrafts.slice(0, 5)" :key="draft.id" class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
            <div class="flex-1">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ draft.name }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ t(`contentTypes.${draft.type}`, language) || draft.type }}</p>
            </div>
            <span :class="statusClass(draft.status)">
              {{ t(draft.status, language) }}
            </span>
          </div>
        </template>
        <p v-else class="text-gray-500 dark:text-gray-400 text-center py-4">{{ t('noDraftsYet', language) }}</p>
      </div>
    </div>
    <!-- Recent Content -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('recentContent', language) }}</h3>
      </div>
      <div class="p-6">
        <template v-if="userContent.length">
          <div v-for="item in userContent.slice(0, 5)" :key="item.id" class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
            <div class="flex-1">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatContentType(item.type) }}</p>
            </div>
            <span :class="contentStatusClass(item.status)">
              {{ t(item.status, language) }}
            </span>
          </div>
        </template>
        <p v-else class="text-gray-500 dark:text-gray-400 text-center py-4">{{ t('noContentYet', language) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'
const props = defineProps({
  userDrafts: Array,
  userContent: Array,
  t: Function,
  language: String
})
const { userDrafts, userContent, t, language } = toRefs(props)

function statusClass(status) {
  if (status === 'APPROVED') return 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  if (status === 'PENDING') return 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  if (status === 'NOT_APPROVED') return 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  return 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

function contentStatusClass(status) {
  if (status === 'POSTED') return 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  if (status === 'IN_PRODUCTION') return 'px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  if (status === 'PENDING') return 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  if (status === 'FINISHED') return 'px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  if (status === 'CANCELED') return 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  return 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

function formatContentType(type) {
  if (!type) return 'N/A'
  const key = `contentTypes.${type.toLowerCase()}`
  const translated = t.value(key, language.value)
  return translated !== key ? translated : type
}
</script>
