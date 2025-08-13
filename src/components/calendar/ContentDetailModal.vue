<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ content?.name }}</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <lucide-x class="w-6 h-6" />
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('type', language) }}</label>
              <p class="text-gray-900 dark:text-white">{{ content?.type }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('product', language) }}</label>
              <div class="flex items-center space-x-3">
                <lucide-box class="w-8 h-8 text-blue-500 dark:text-blue-400" />
                <p class="text-gray-900 dark:text-white">{{ product?.name || 'Unknown' }}</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('status', language) }}</label>
              <span class="inline-block px-3 py-1 text-sm rounded-full" :class="statusClass(content?.status)">{{ t(content?.status, language) }}</span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('channels', language) }}</label>
              <div class="flex flex-wrap gap-2">
                <span v-for="channel in content?.channels || []" :key="channel" class="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded">
                  {{ channel }}
                </span>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('creator', language) }}</label>
              <p class="text-gray-900 dark:text-white">{{ creator?.name || 'Unknown' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('producer', language) }}</label>
              <p class="text-gray-900 dark:text-white">{{ producer?.name || 'Unknown' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('created', language) }}</label>
              <p class="text-gray-900 dark:text-white">{{ content?.creationDate }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('postDate', language) }}</label>
              <p class="text-gray-900 dark:text-white">{{ content?.postDate }}</p>
            </div>
          </div>
        </div>
        <div v-if="content?.metrics" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('performance', language) }}</h4>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ content.metrics.views }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Views</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ content.metrics.likes }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Likes</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ content.metrics.reach }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Reach</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ content.metrics.engagement }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Engagement</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ content.metrics.comments }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Comments</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-pink-600 dark:text-pink-400">{{ content.metrics.shares }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Shares</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { X as LucideX, Box as LucideBox } from 'lucide-vue-next'
const props = defineProps({
  show: Boolean,
  content: Object,
  product: Object,
  creator: Object,
  producer: Object,
  t: Function,
  language: String
})
const emit = defineEmits(['close'])
function statusClass(status) {
  if (status === 'posted') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  if (status === 'in-production') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  if (status === 'pending') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  if (status === 'finished') return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}
</script>
