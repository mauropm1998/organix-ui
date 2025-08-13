<template>
  <div class="space-y-6">

    <div class="flex justify-between items-center">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('content', language) }}</h2>
      <ContentManagerActions :approvedDrafts="approvedDrafts" :t="t" :language="language" @open-form="showForm = true" @open-transform="showTransformModal = true" />
    </div>

    <ContentManagerFilters v-model="filters" :t="t" :language="language" />

    <!-- Modal de Transformação de Rascunho -->
    <TransformDraftModal
      :show="showTransformModal"
      :approvedDrafts="approvedDrafts"
      :selectedDraftId="selectedDraftId"
      :formData="formData"
      :products="products"
      :users="users"
      :t="t"
      :language="language"
      @transform="handleTransform"
      @close="closeTransformModal"
    />

    <!-- Formulário de Conteúdo -->
  <ContentForm :show="showForm" :editingContent="editingContent" :formData="formData" :users="users" :products="products" :user="user" :t="t" :language="language" @submit="handleSubmit" @cancel="resetForm" />

    <!-- Tabela de Conteúdo -->
  <ContentTable
    :content="filteredContent"
    :t="t"
    :language="language"
    :getUserName="getUserName"
    :getProductName="getProductName"
    :statusClass="statusClass"
    :formatDate="formatDate"
    :canEdit="canEdit"
    :statuses="['pending', 'canceled', 'posted', 'in-production', 'finished']"
    @edit="editContent"
    @delete="onDeleteContent"
    @status-change="onStatusChange"
  />
  </div>
</template>

<script setup>
function onStatusChange({ id, status }) {
  const idx = content.value.findIndex(c => c.id === id)
  if (idx !== -1) {
    content.value[idx].status = status
  }
}
import { ref, computed } from 'vue'
import { useLanguage } from '../hooks/useLanguage'
import { t } from '../translations'
import { mockUsers, mockProducts, mockContent, mockDrafts } from '../data/mockData'
import ContentManagerActions from './ContentManagerActions.vue'
import ContentManagerFilters from './ContentManagerFilters.vue'
import ContentForm from './ContentForm.vue'
import ContentTable from './ContentTable.vue'
import TransformDraftModal from './TransformDraftModal.vue'

const user = mockUsers[0]
const users = mockUsers
const products = mockProducts
const drafts = mockDrafts
const content = ref([...mockContent])

const { language } = useLanguage()

const showForm = ref(false)
const editingContent = ref(null)
const showTransformModal = ref(false)
const selectedDraftId = ref('')
const filters = ref({ status: '', channel: '' })

const formData = ref({
  name: '',
  type: '',
  product: '',
  creator: user.id,
  postDate: '',
  producer: user.id,
  status: 'pending',
  channels: []
})

const approvedDrafts = computed(() => user.adminType === 'admin' ? drafts.filter(d => d.status === 'approved') : drafts.filter(d => d.status === 'approved' && d.creator === user.id))

const userContent = computed(() => user.adminType === 'admin' ? content.value : content.value.filter(c => c.creator === user.id || c.producer === user.id))

const filteredContent = computed(() => userContent.value.filter(item => {
  if (filters.value.status && item.status !== filters.value.status) return false
  if (filters.value.channel && !item.channels.includes(filters.value.channel)) return false
  return true
}))

function handleSubmit() {
  if (editingContent.value) {
    const idx = content.value.findIndex(c => c.id === editingContent.value.id)
    if (idx !== -1) {
      content.value[idx] = { ...editingContent.value, ...formData.value, postDate: new Date(formData.value.postDate) }
    }
    editingContent.value = null
  } else {
    content.value.push({
      ...formData.value,
      id: Date.now().toString(),
      creationDate: new Date(),
      postDate: new Date(formData.value.postDate),
      companyId: user.companyId,
      metrics: {}
    })
  }
  resetForm()
}

function resetForm() {
  formData.value = {
    name: '',
    type: '',
    product: '',
    creator: user.id,
    postDate: '',
    producer: user.id,
    status: 'pending',
    channels: []
  }
  showForm.value = false
  editingContent.value = null
}

function editContent(item) {
  editingContent.value = item
  formData.value = {
    name: item.name,
    type: item.type,
    product: item.product,
    creator: item.creator,
    postDate: item.postDate instanceof Date ? item.postDate.toISOString().split('T')[0] : item.postDate,
    producer: item.producer,
    status: item.status,
    channels: [...item.channels]
  }
  showForm.value = true
}

function onDeleteContent(id) {
  content.value = content.value.filter(item => item.id !== id)
}

function canEdit(item) {
  return user.adminType === 'admin' || item.creator === user.id || item.producer === user.id
}

function getUserName(id) {
  const u = users.find(u => u.id === id)
  return u ? u.name : 'Unknown'
}

function getProductName(id) {
  const p = products.find(p => p.id === id)
  return p ? p.name : 'Unknown'
}

function statusClass(status) {
  return [
    'text-sm rounded-full px-2 py-1',
    status === 'posted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : status === 'in-production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      : status === 'finished' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  ].join(' ')
}

function formatDate(date) {
  if (!date) return ''
  if (typeof date === 'string') return date
  return date.toLocaleDateString()
}

function handleTransform() {
  const draft = approvedDrafts.value.find(d => d.id === selectedDraftId.value)
  if (!draft) return
  content.value.push({
    name: draft.name,
    type: draft.type,
    product: formData.value.product,
    creator: draft.creator,
    creationDate: draft.createdAt,
    postDate: new Date(formData.value.postDate),
    producer: formData.value.producer,
    status: formData.value.status,
    channels: [...formData.value.channels],
    companyId: draft.companyId,
    id: Date.now().toString(),
    metrics: {}
  })
  closeTransformModal()
  resetForm()
}

function closeTransformModal() {
  showTransformModal.value = false
  selectedDraftId.value = ''
}
</script>
