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
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ getCreatorName(draft.creatorId) }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center space-x-2">
              <component
                :is="getStatusIcon(draft.status)"
                class="w-4 h-4"
                :class="iconStatusClass(draft.status)"
              />
              <span :class="statusClass(draft.status)">{{ t(draft.status?.toLowerCase() || 'draft', language) }}</span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(draft.createdAt) }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex items-center justify-end space-x-2">
              <!-- Transform button (only for APPROVED status) -->
              <button 
                v-if="draft.status === 'APPROVED' && canEdit(draft)" 
                @click="$emit('transform', draft)" 
                class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" 
                :title="t('transformToContent', language)"
              >
                <ArrowRight class="w-4 h-4" />
              </button>
              <!-- Edit button -->
              <button 
                v-if="canEdit(draft)" 
                @click="$emit('edit', draft)" 
                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                :title="t('editDraft', language)"
              >
                <Edit class="w-4 h-4" />
              </button>
              <!-- Delete button -->
              <button 
                v-if="canEdit(draft)" 
                @click="$emit('delete', draft)" 
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" 
                :title="t('deleteDraft', language)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!filteredDrafts.length" class="text-center py-12">
      <FileText class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ t('noDraftsFound', language) }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('createFirstDraft', language) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'
import { Edit, Trash2, ArrowRight, CheckCircle, Clock, XCircle, FileText } from 'lucide-vue-next'
const props = defineProps({
  filteredDrafts: Array,
  users: Array,
  t: Function,
  language: String,
  canEdit: Function
})

defineEmits(['edit', 'delete', 'transform'])

const { filteredDrafts, users, t, language, canEdit } = toRefs(props)

function getCreatorName(creatorId) {
  const user = users.value.find(u => u.id === creatorId)
  return user ? user.name : 'Unknown'
}
function getStatusIcon(status) {
  if (status === 'APPROVED') return CheckCircle
  if (status === 'PENDING') return Clock
  if (status === 'NOT_APPROVED') return XCircle
  return Clock
}
function statusClass(status) {
  if (status === 'APPROVED') return 'text-sm font-medium text-green-600 dark:text-green-400'
  if (status === 'PENDING') return 'text-sm font-medium text-yellow-600 dark:text-yellow-400'
  if (status === 'NOT_APPROVED') return 'text-sm font-medium text-red-600 dark:text-red-400'
  return 'text-sm font-medium text-gray-600 dark:text-gray-400'
}
function iconStatusClass(status) {
  if (status === 'APPROVED') return 'text-green-500 dark:text-green-400'
  if (status === 'PENDING') return 'text-yellow-500 dark:text-yellow-400'
  if (status === 'NOT_APPROVED') return 'text-red-500 dark:text-red-400'
  return 'text-gray-500 dark:text-gray-400'
}
function formatDate(date) {
  if (!date) return ''
  try {
    let d
    
    // Se for array (formato LocalDateTime do Java: [ano, mês, dia, hora, minuto, segundo, nanossegundos])
    if (Array.isArray(date) && date.length >= 3) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = date
      // Mês em JavaScript é 0-indexed, então subtrai 1
      d = new Date(year, month - 1, day, hour, minute, second)
    }
    // Se for string de data ISO
    else if (typeof date === 'string') {
      d = new Date(date)
    }
    // Se já for um objeto Date
    else if (date instanceof Date) {
      d = date
    }
    // Formato não reconhecido
    else {
      return 'Data inválida'
    }
    
    // Verifica se a data é válida
    if (!(d instanceof Date) || isNaN(d.getTime())) {
      return 'Data inválida'
    }
    
    return d.toLocaleDateString()
  } catch (error) {
    return 'Data inválida'
  }
}
</script>
