<template>
  <div class="overflow-x-auto">
  <table class="w-full border border-gray-200 dark:border-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('user', language) }}</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('email', language) }}</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('role', language) }}</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ t('actions', language) }}</th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="userItem in users" :key="userItem.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <lucide-shield v-if="userItem.adminType === 'admin'" class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <lucide-user v-else class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ userItem.name }}</div>
                <div v-if="userItem.id === currentUserId" class="text-xs text-blue-600 dark:text-blue-400">({{ t('you', language) }})</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ userItem.email }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="['inline-flex px-2 py-1 text-xs font-semibold rounded-full', userItem.adminType === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200']">
              {{ t(userItem.adminType, language) }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex items-center justify-end space-x-2">
              <button @click="$emit('edit', userItem)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                <lucide-edit class="w-4 h-4" />
              </button>
              <button v-if="userItem.id !== currentUserId" @click="$emit('delete', userItem.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" :title="t('deleteUser', language)">
                <lucide-trash-2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { Edit as LucideEdit, Trash2 as LucideTrash2, Shield as LucideShield, User as LucideUser } from 'lucide-vue-next'
const props = defineProps({
  users: Array,
  t: Function,
  language: String,
  currentUserId: String
})
const emit = defineEmits(['edit', 'delete'])
</script>
