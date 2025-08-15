<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {{ editingDraft ? t('editDraft', language) : t('createNewDraft', language) }}
    </h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('name', language) }}
          </label>
          <input
            type="text"
            v-model="formData.name"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('type', language) }}
          </label>
          <select
            v-model="formData.type"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">{{ t('type', language) }}</option>
            <option v-for="type in contentTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>
      <div v-if="user.adminType === 'ADMIN'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ t('status', language) }}
        </label>
        <select
          v-model="formData.status"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option v-for="status in draftStatuses" :key="status" :value="status">{{ t(status, language) }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ t('draftContent', language) }}
        </label>
        <textarea
          v-model="formData.content"
          rows="6"
          :placeholder="t('enterDraftContent', language)"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      <div class="flex space-x-3">
        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <FileText v-else class="w-4 h-4" />
          <span>{{ isSubmitting ? (editingDraft ? t('updatingDraft', language) : t('creatingDraft', language)) : (editingDraft ? t('update', language) : t('create', language)) }} {{ isSubmitting ? '' : t('draft', language) }}</span>
        </button>
        <button 
          type="button" 
          @click="handleCancel" 
          :disabled="isSubmitting"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ t('cancel', language) }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, toRefs, watch, defineProps, defineEmits } from 'vue'
import { Loader2, FileText } from 'lucide-vue-next'
const props = defineProps({
  user: Object,
  editingDraft: Object,
  t: Function,
  language: String,
  contentTypes: Array,
  draftStatuses: Array,
  show: Boolean,
  formData: Object,
  isSubmitting: Boolean
})
const emit = defineEmits(['submit', 'cancel'])
const { user, editingDraft, t, language, contentTypes, draftStatuses, show, isSubmitting } = toRefs(props)
const formData = reactive({ ...props.formData })

watch(() => props.editingDraft, (val) => {
  if (val) {
    Object.assign(formData, val)
  } else {
    Object.assign(formData, { name: '', type: '', content: '', status: 'pending' })
  }
})

function handleSubmit() {
  emit('submit', { ...formData })
}
function handleCancel() {
  emit('cancel')
}
</script>
