<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('drafts', language) }}</h2>
      <button @click="showForm = true" class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
        <Plus class="w-4 h-4 mr-2" />
        {{ t('newDraft', language) }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loadingDrafts" class="space-y-6">
      <!-- Filters skeleton -->
      <div class="flex space-x-4">
        <SkeletonLoader customClass="h-10 w-32" />
        <SkeletonLoader customClass="h-10 w-32" />
      </div>
      
      <!-- Table skeleton -->
      <div class="overflow-x-auto">
        <table class="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left">
                <SkeletonLoader customClass="h-4 w-16" />
              </th>
              <th class="px-6 py-3 text-left">
                <SkeletonLoader customClass="h-4 w-12" />
              </th>
              <th class="px-6 py-3 text-left">
                <SkeletonLoader customClass="h-4 w-20" />
              </th>
              <th class="px-6 py-3 text-left">
                <SkeletonLoader customClass="h-4 w-16" />
              </th>
              <th class="px-6 py-3 text-left">
                <SkeletonLoader customClass="h-4 w-20" />
              </th>
              <th class="px-6 py-3 text-right">
                <SkeletonLoader customClass="h-4 w-16" />
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="i in 5" :key="i" class="animate-pulse">
              <td class="px-6 py-4">
                <SkeletonLoader customClass="h-4 w-32" />
              </td>
              <td class="px-6 py-4">
                <SkeletonLoader customClass="h-4 w-16" />
              </td>
              <td class="px-6 py-4">
                <SkeletonLoader customClass="h-4 w-24" />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <SkeletonLoader customClass="h-4 w-4 rounded-full" />
                  <SkeletonLoader customClass="h-4 w-20" />
                </div>
              </td>
              <td class="px-6 py-4">
                <SkeletonLoader customClass="h-4 w-24" />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end space-x-2">
                  <SkeletonLoader customClass="h-8 w-8 rounded" />
                  <SkeletonLoader customClass="h-8 w-8 rounded" />
                  <SkeletonLoader customClass="h-8 w-8 rounded" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="errors.drafts" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">{{ errors.drafts }}</p>
    </div>

    <!-- Success message -->
    <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <p class="text-green-600">{{ successMessage }}</p>
    </div>

    <!-- Filters -->
    <div v-if="!loadingDrafts" class="flex space-x-4">
      <select v-model="filterStatus" @change="applyFilters" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        <option value="">{{ t('allStatuses', language) }}</option>
        <option v-for="status in draftStatuses" :key="status" :value="status">{{ t(status.toLowerCase(), language) }}</option>
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
      :isSubmitting="isSubmitting"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <!-- Drafts List -->
    <div v-if="!loadingDrafts">
      <DraftTable
        :filteredDrafts="filteredDrafts"
        :users="users"
        :t="t"
        :language="language"
        :canEdit="canEdit"
        @edit="handleEdit"
        @delete="handleDelete"
        @transform="handleTransform"
      />
    </div>

    <!-- Delete Draft Modal -->
    <DeleteDraftModal
      v-if="showDeleteModal"
      :draft="draftToDelete"
      :is-deleting="isDeleting"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Transform Draft Modal -->
    <TransformDraftModal
      v-if="showTransformModal"
      :draft="draftToTransform"
      :is-transforming="isTransforming"
      @confirm="confirmTransform"
      @cancel="cancelTransform"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { Plus, Edit, Trash2, ArrowRight, FileText } from 'lucide-vue-next'
import { useLanguage } from '../hooks/useLanguage.js'
import { useAuth } from '../hooks/useAuth.js'
import { useData } from '../hooks/useData.js'
import { t as translate } from '../translations/index.js'
import SkeletonLoader from './SkeletonLoader.vue'
import DraftForm from './drafts/DraftForm.vue'
import DraftTable from './drafts/DraftTable.vue'
import DeleteDraftModal from './drafts/DeleteDraftModal.vue'
import TransformDraftModal from './drafts/TransformDraftModal.vue'

const { language } = useLanguage()
const { currentUser: user } = useAuth()
const { 
  drafts,
  users,
  channels,
  loadingDrafts, 
  errors, 
  fetchDrafts, 
  fetchUsers,
  fetchChannels,
  createDraft, 
  updateDraft, 
  deleteDraft,
  transformDraftToContent
} = useData()
const t = (key) => translate(key, language.value)

// Constantes para tipos e status
const contentTypes = ['Post', 'Story', 'Reels', 'Video', 'Artigo']
const draftStatuses = ['PENDING', 'APPROVED', 'NOT_APPROVED']

const showForm = ref(false)
const editingDraft = ref(null)
const filterStatus = ref('')
const filterType = ref('')
const formData = reactive({ name: '', type: '', content: '', status: 'PENDING' })
const isSubmitting = ref(false)
const successMessage = ref('')

// Modal states
const showDeleteModal = ref(false)
const showTransformModal = ref(false)
const draftToDelete = ref(null)
const draftToTransform = ref(null)
const isDeleting = ref(false)
const isTransforming = ref(false)

// Load data on component mount
onMounted(async () => {
  // Limpar dados para forçar estado de loading
  drafts.value = []
  
  // Force loading state to show skeleton
  const fetchPromises = [
    fetchUsers(),
    fetchChannels()
  ]
  
  // Always fetch drafts to show loading
  fetchPromises.push(fetchDrafts())
  
  await Promise.all(fetchPromises)
})

// Computed values
const userDrafts = computed(() => {
  if (!drafts.value || !user.value) return []
  
  // Admins see all drafts, operators see only their own
  if (user.value.adminType === 'ADMIN') {
    return drafts.value
  } else {
    return drafts.value.filter(d => d.creatorId === user.value.id)
  }
})

const filteredDrafts = computed(() =>
  userDrafts.value.filter(draft => {
    if (filterStatus.value && draft.status !== filterStatus.value) return false
    if (filterType.value && draft.type !== filterType.value) return false
    return true
  })
)

// Filter function to refetch with status filter
async function applyFilters() {
  await fetchDrafts(filterStatus.value || null)
}

async function handleSubmit(data) {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  successMessage.value = ''
  
  try {
    let result
    if (editingDraft.value) {
      result = await updateDraft(editingDraft.value.id, data)
    } else {
      // Add creatorId for new drafts
      const draftData = {
        ...data,
        creatorId: user.value.id,
        // Use status from form if provided, otherwise default to PENDING
        status: data.status || 'PENDING'
      }
      result = await createDraft(draftData)
    }
    
    if (result.success) {
      successMessage.value = editingDraft.value 
        ? t('draftUpdatedSuccessfully')
        : t('draftCreatedSuccessfully')
      handleCancel()
      // Refresh drafts list
      await fetchDrafts(filterStatus.value || null)
    } else {
      console.error('Error:', result.error)
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  } finally {
    isSubmitting.value = false
  }
}

function handleEdit(draft) {
  editingDraft.value = draft
  Object.assign(formData, {
    name: draft.name,
    type: draft.type,
    content: draft.content || '',
    status: draft.status
  })
  showForm.value = true
}

function handleCancel() {
  showForm.value = false
  editingDraft.value = null
  Object.assign(formData, { name: '', type: '', content: '', status: 'PENDING' })
  successMessage.value = ''
}

async function handleDelete(draft) {
  draftToDelete.value = draft
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!draftToDelete.value) return
  
  isDeleting.value = true
  try {
    const result = await deleteDraft(draftToDelete.value.id)
    if (result.success) {
      successMessage.value = t('draftDeletedSuccessfully')
      showDeleteModal.value = false
      draftToDelete.value = null
    } else {
      console.error('Error:', result.error)
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  } finally {
    isDeleting.value = false
  }
}

function cancelDelete() {
  showDeleteModal.value = false
  draftToDelete.value = null
}

async function handleTransform(draft) {
  draftToTransform.value = draft
  showTransformModal.value = true
}

async function confirmTransform(transformData) {
  if (!draftToTransform.value) return
  
  isTransforming.value = true
  try {
    const result = await transformDraftToContent(draftToTransform.value.id, transformData)
    if (result.success) {
      successMessage.value = t('draftTransformed')
      showTransformModal.value = false
      draftToTransform.value = null
      // Refresh the drafts list
      await fetchDrafts(filterStatus.value || null)
    } else {
      console.error('Error:', result.error)
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  } finally {
    isTransforming.value = false
  }
}

function cancelTransform() {
  showTransformModal.value = false
  draftToTransform.value = null
}

function canEdit(draft) {
  if (!user.value) return false
  return user.value.adminType === 'ADMIN' || draft.creatorId === user.value.id
}
</script>
