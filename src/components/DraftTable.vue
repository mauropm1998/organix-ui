<template>
  <div class="overflow-x-auto">
    <table class="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('name', language) }}</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('type', language) }}</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('creator', language) }}</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('status', language) }}</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('created', language) }}</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('actions', language) }}</th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="draft in filteredDrafts" :key="draft.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ draft.name }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ draft.type }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ getCreatorName(draft.creator) }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center space-x-2">
              <component
                :is="getStatusIcon(draft.status)"
                class="w-4 h-4"
                :class="iconStatusClass(draft.status)"
              />
              <span :class="statusClass(draft.status)">{{ t(draft.status, language) }}</span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(draft.createdAt) }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex items-center justify-end space-x-2">
              <button v-if="canEdit(draft)" @click="$emit('edit', draft)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                <Edit class="w-4 h-4" />
              </button>
              <button v-if="canEdit(draft)" @click="$emit('delete', draft.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete draft">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!filteredDrafts.length" class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400">{{ t('noDraftsFound', language) }}</p>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'
import { Edit, Trash2, CheckCircle, Clock, XCircle } from 'lucide-vue-next'
const props = defineProps({
  filteredDrafts: Array,
  users: Array,
  t: Function,
  language: String,
  canEdit: Function
})
const { filteredDrafts, users, t, language, canEdit } = toRefs(props)

function getCreatorName(creatorId) {
  const user = users.value.find(u => u.id === creatorId)
  return user ? user.name : 'Unknown'
}
function getStatusIcon(status) {
  if (status === 'approved') return CheckCircle
  if (status === 'pending') return Clock
  if (status === 'not approved') return XCircle
  return null
}
function statusClass(status) {
  if (status === 'approved') return 'text-sm font-medium text-green-600 dark:text-green-400'
  if (status === 'pending') return 'text-sm font-medium text-yellow-600 dark:text-yellow-400'
  return 'text-sm font-medium text-red-600 dark:text-red-400'
}
function iconStatusClass(status) {
  if (status === 'approved') return 'text-green-500 dark:text-green-400'
  if (status === 'pending') return 'text-yellow-500 dark:text-yellow-400'
  return 'text-red-500 dark:text-red-400'
}
function formatDate(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}
</script>
