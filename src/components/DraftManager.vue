<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('drafts', language) }}</h2>
      <button @click="showForm = true" class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
        <Plus class="w-4 h-4 mr-2" />
        {{ t('newDraft', language) }}
      </button>
    </div>
    <!-- Filters -->
    <div class="flex space-x-4">
      <select v-model="filterStatus" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        <option value="">{{ t('allStatuses', language) }}</option>
        <option v-for="status in draftStatuses" :key="status" :value="status">{{ t(status, language) }}</option>
      </select>
      <select v-model="filterType" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        <option value="">{{ t('allTypes', language) }}</option>
        <option v-for="type in contentTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>
    <!-- Draft Form -->
    <DraftForm
      v-if="showForm"
      :user="user"
      :editingDraft="editingDraft"
      :t="t"
      :language="language"
      :contentTypes="contentTypes"
      :draftStatuses="draftStatuses"
      :show="showForm"
      :formData="formData"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
    <!-- Drafts List -->
    <DraftTable
      :filteredDrafts="filteredDrafts"
      :users="users"
      :t="t"
      :language="language"
      :canEdit="canEdit"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Plus } from 'lucide-vue-next'
import DraftForm from './DraftForm.vue'
import DraftTable from './DraftTable.vue'
import { mockUsers, mockDrafts, CONTENT_TYPES, DRAFT_STATUSES } from '../data/mockData.js'
import { useLanguage } from '../hooks/useLanguage.js'
import { t as translate } from '../translations/index.js'

const user = mockUsers[0]
const drafts = ref([...mockDrafts])
const users = mockUsers
const { language } = useLanguage()
const t = (key) => translate(key, language.value)

const showForm = ref(false)
const editingDraft = ref(null)
const filterStatus = ref('')
const filterType = ref('')
const formData = reactive({ name: '', type: '', richtext: '', status: 'pending' })
const contentTypes = CONTENT_TYPES
const draftStatuses = DRAFT_STATUSES

const userDrafts = computed(() =>
  user.adminType === 'admin' ? drafts.value : drafts.value.filter(d => d.creator === user.id)
)
const filteredDrafts = computed(() =>
  userDrafts.value.filter(draft => {
    if (filterStatus.value && draft.status !== filterStatus.value) return false
    if (filterType.value && draft.type !== filterType.value) return false
    return true
  })
)

function handleSubmit(data) {
  if (editingDraft.value) {
    // update
    const idx = drafts.value.findIndex(d => d.id === editingDraft.value.id)
    if (idx !== -1) drafts.value[idx] = { ...drafts.value[idx], ...data }
    editingDraft.value = null
  } else {
    // add
    drafts.value.push({
      ...data,
      id: Date.now().toString(),
      creator: user.id,
      createdAt: new Date()
    })
  }
  Object.assign(formData, { name: '', type: '', richtext: '', status: 'pending' })
  showForm.value = false
}
function handleEdit(draft) {
  editingDraft.value = draft
  Object.assign(formData, {
    name: draft.name,
    type: draft.type,
    richtext: draft.richtext,
    status: draft.status
  })
  showForm.value = true
}
function handleCancel() {
  showForm.value = false
  editingDraft.value = null
  Object.assign(formData, { name: '', type: '', richtext: '', status: 'pending' })
}
function handleDelete(id) {
  drafts.value = drafts.value.filter(d => d.id !== id)
}
function canEdit(draft) {
  return user.adminType === 'admin' || draft.creator === user.id
}
</script>
