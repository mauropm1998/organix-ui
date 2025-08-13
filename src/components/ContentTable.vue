<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('name', language) }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('type', language) }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('product', language) }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('status', language) }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('channels', language) }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('postDate', language) }}</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('actions', language) }}</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="item in content" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">by {{ getUserName(item.creator) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ item.type }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ getProductName(item.product) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select
                v-if="canEdit(item)"
                v-model="item.status"
                @change="$emit('status-change', { id: item.id, status: item.status })"
                :class="[
                  'text-sm rounded-full px-2 py-1 border-0',
                  item.status === 'posted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : item.status === 'in-production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : item.status === 'finished' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                ]"
              >
                <option v-for="status in statuses" :key="status" :value="status">{{ t(status, language) }}</option>
              </select>
              <span v-else :class="[
                'text-sm rounded-full px-2 py-1',
                item.status === 'posted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : item.status === 'in-production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : item.status === 'finished' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              ]">{{ t(item.status, language) }}</span>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span v-for="channel in item.channels" :key="channel" class="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded">{{ channel }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(item.postDate) }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Producer: {{ getUserName(item.producer) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  v-if="item.status === 'posted' || item.status === 'finished'"
                  @click="$emit('metrics', item)"
                  class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  :title="t('updateMetrics', language)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18M9 17v-6m4 6V7m4 10v-3" /></svg>
                </button>
                <button v-if="canEdit(item)" @click="$emit('edit', item)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"><lucide-edit class="w-4 h-4" /></button>
                <button v-if="canEdit(item)" @click="$emit('delete', item.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete content"><lucide-trash-2 class="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="content.length === 0" class="text-center py-8">
        <p class="text-gray-500 dark:text-gray-400">{{ t('noContentFound', language) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Edit as LucideEdit, Trash2 as LucideTrash2 } from 'lucide-vue-next'
const props = defineProps({
  content: Array,
  t: Function,
  language: String,
  getUserName: Function,
  getProductName: Function,
  statusClass: Function,
  formatDate: Function,
  canEdit: Function,
  statuses: Array
})
const lucideEdit = LucideEdit
const lucideTrash2 = LucideTrash2
</script>
