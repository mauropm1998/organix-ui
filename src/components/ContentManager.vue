<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('content', language) }}</h2>
      <div class="flex space-x-3">
        <button
          v-if="approvedDrafts.length > 0"
          @click="showTransformModal = true"
          class="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <ArrowRightCircle class="w-4 h-4 mr-2" />
          {{ t('transformDraft', language) }}
        </button>
        <button
          @click="showForm = true"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus class="w-4 h-4 mr-2" />
          {{ t('newContent', language) }}
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex space-x-4">
      <select
        v-model="filterStatus"
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">{{ t('allStatuses', language) }}</option>
        <option v-for="status in CONTENT_STATUSES" :key="status" :value="status">
          {{ t(status, language) }}
        </option>
      </select>
      <select
        v-model="filterChannel"
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">{{ t('allChannels', language) }}</option>
        <option v-for="channel in CHANNELS" :key="channel" :value="channel">
          {{ channel }}
        </option>
      </select>
    </div>

    <!-- Transform Draft Modal -->
    <div v-if="showTransformModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('transformDraftToContent', language) }}
          </h3>
          <form @submit.prevent="handleTransform" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('selectDraft', language) }}
              </label>
              <select
                v-model="selectedDraft"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option :value="null">{{ t('selectApprovedDraft', language) }}</option>
                <option v-for="draft in approvedDrafts" :key="draft.id" :value="draft">
                  {{ draft.name }} - {{ draft.type }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('product', language) }}
                </label>
                <select
                  v-model="formData.product"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">{{ t('product', language) }}</option>
                  <option v-for="product in products" :key="product.id" :value="product.id">
                    {{ product.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('postDate', language) }}
                </label>
                <input
                  type="date"
                  v-model="formData.postDate"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('producer', language) }}
                </label>
                <select
                  v-model="formData.producer"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('status', language) }}
                </label>
                <select
                  v-model="formData.status"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option v-for="status in CONTENT_STATUSES" :key="status" :value="status">
                    {{ t(status, language) }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('channels', language) }}
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label v-for="channel in CHANNELS" :key="channel" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="channel"
                    v-model="formData.channels"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ channel }}</span>
                </label>
              </div>
            </div>

            <div class="flex space-x-3">
              <button
                type="submit"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                {{ t('transformToContent', language) }}
              </button>
              <button
                type="button"
                @click="closeTransformModal"
                class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
              >
                {{ t('cancel', language) }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Content Form -->
    <div v-if="showForm" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ editingContent ? t('editContent', language) : t('createNewContent', language) }}
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
              <option v-for="type in CONTENT_TYPES" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('product', language) }}
            </label>
            <select
              v-model="formData.product"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">{{ t('product', language) }}</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('postDate', language) }}
            </label>
            <input
              type="date"
              v-model="formData.postDate"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('creator', language) }}
            </label>
            <select
              v-model="formData.creator"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
              :disabled="user.adminType !== 'admin'"
            >
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('producer', language) }}
            </label>
            <select
              v-model="formData.producer"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('status', language) }}
            </label>
            <select
              v-model="formData.status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option v-for="status in CONTENT_STATUSES" :key="status" :value="status">
                {{ t(status, language) }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('channels', language) }}
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <label v-for="channel in CHANNELS" :key="channel" class="flex items-center">
              <input
                type="checkbox"
                :value="channel"
                v-model="formData.channels"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ channel }}</span>
            </label>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {{ editingContent ? t('update', language) : t('create', language) }} {{ t('content', language) }}
          </button>
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
          >
            {{ t('cancel', language) }}
          </button>
        </div>
      </form>
    </div>

    <!-- Channel Metrics Modal -->
    <div v-if="showMetricsModal && selectedContentForMetrics" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Update Channel Metrics - {{ selectedContentForMetrics.name }}
          </h3>
          
          <div class="space-y-6">
            <div v-for="channel in selectedContentForMetrics.channels" :key="channel" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">
                {{ channel }} Metrics
              </h4>
              
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Likes
                  </label>
                  <input
                    type="number"
                    min="0"
                    :value="channelMetrics[channel]?.likes || 0"
                    @input="updateChannelMetric(channel, 'likes', parseInt($event.target.value) || 0)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Comments
                  </label>
                  <input
                    type="number"
                    min="0"
                    :value="channelMetrics[channel]?.comments || 0"
                    @input="updateChannelMetric(channel, 'comments', parseInt($event.target.value) || 0)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Shares
                  </label>
                  <input
                    type="number"
                    min="0"
                    :value="channelMetrics[channel]?.shares || 0"
                    @input="updateChannelMetric(channel, 'shares', parseInt($event.target.value) || 0)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Site Visits
                  </label>
                  <input
                    type="number"
                    min="0"
                    :value="channelMetrics[channel]?.siteVisits || 0"
                    @input="updateChannelMetric(channel, 'siteVisits', parseInt($event.target.value) || 0)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Accounts
                  </label>
                  <input
                    type="number"
                    min="0"
                    :value="channelMetrics[channel]?.newAccounts || 0"
                    @input="updateChannelMetric(channel, 'newAccounts', parseInt($event.target.value) || 0)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Post Clicks
                  </label>
                  <input
                    type="number"
                    min="0"
                    :value="channelMetrics[channel]?.postClicks || 0"
                    @input="updateChannelMetric(channel, 'postClicks', parseInt($event.target.value) || 0)"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              @click="handleSaveChannelMetrics"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Save Metrics
            </button>
            <button
              @click="closeMetricsModal"
              class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('name', language) }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('type', language) }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('product', language) }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('status', language) }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('channels', language) }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('postDate', language) }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('actions', language) }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in filteredContent" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ item.name }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  by {{ getCreatorName(item.creator) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ item.type }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ getProductName(item.product) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  v-if="canUpdateStatus(item)"
                  :value="item.status"
                  @change="$emit('updateContent', item.id, { status: $event.target.value })"
                  :class="getStatusClass(item.status)"
                >
                  <option v-for="status in CONTENT_STATUSES" :key="status" :value="status">
                    {{ status }}
                  </option>
                </select>
                <span v-else :class="getStatusClass(item.status)">
                  {{ t(item.status, language) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span v-for="channel in item.channels" :key="channel" class="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded">
                    {{ channel }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(item.postDate) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Producer: {{ getProducerName(item.producer) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    v-if="item.status === 'posted' || item.status === 'finished'"
                    @click="handleOpenMetricsModal(item)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    title="Update channel metrics"
                  >
                    <BarChart3 class="w-4 h-4" />
                  </button>
                  <button
                    v-if="canEdit(item)"
                    @click="handleEdit(item)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    v-if="canEdit(item)"
                    @click="$emit('deleteContent', item.id)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete content"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredContent.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">{{ t('noContentFound', language) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Edit, Trash2, ArrowRightCircle, BarChart3 } from 'lucide-vue-next'
import { CONTENT_TYPES, CONTENT_STATUSES, CHANNELS } from '../data/mockData.js'
import { useLanguage } from '../composables/useLanguage.js'
import { t } from '../translations/index.js'


const props = defineProps({
  user: Object,
  content: Array,
  products: Array,
  users: Array,
  drafts: Array
})

const emit = defineEmits(['addContent', 'updateContent', 'deleteContent', 'transformDraft'])

const { language } = useLanguage()

const showForm = ref(false)
const editingContent = ref<Content | null>(null)
const showMetricsModal = ref(false)
const selectedContentForMetrics = ref<Content | null>(null)
const showTransformModal = ref(false)
const selectedDraft = ref<Draft | null>(null)
const filterStatus = ref('')
const filterChannel = ref('')

const formData = ref({
  name: '',
  type: '',
  product: '',
  creator: props.user.id,
  postDate: '',
  producer: props.user.id,
  status: 'pending',
  channels: []
})

const channelMetrics = ref({})

// Filter content based on user role
const userContent = computed(() => {
  return props.user.adminType === 'admin'
    ? props.content
    : props.content.filter(c => c.creator === props.user.id || c.producer === props.user.id)
})

// Get approved drafts for transformation
const approvedDrafts = computed(() => {
  return props.user.adminType === 'admin'
    ? props.drafts.filter(d => d.status === 'approved')
    : props.drafts.filter(d => d.status === 'approved' && d.creator === props.user.id)
})

// Apply filters
const filteredContent = computed(() => {
  return userContent.value.filter(item => {
    if (filterStatus.value && item.status !== filterStatus.value) return false
    if (filterChannel.value && !item.channels.includes(filterChannel.value)) return false
    return true
  })
})

const handleSubmit = () => {
  const contentData = {
    ...formData.value,
    postDate: new Date(formData.value.postDate)
  }
  
  if (editingContent.value) {
    emit('updateContent', editingContent.value.id, contentData)
    editingContent.value = null
  } else {
    emit('addContent', contentData)
  }
  
  resetForm()
}

const handleTransform = () => {
  if (!selectedDraft.value) return

  const contentData = {
    product: formData.value.product,
    creator: formData.value.creator,
    postDate: new Date(formData.value.postDate),
    producer: formData.value.producer,
    status: formData.value.status,
    channels: formData.value.channels
  }

  emit('transformDraft', selectedDraft.value.id, contentData)
  closeTransformModal()
}

const resetForm = () => {
  formData.value = {
    name: '',
    type: '',
    product: '',
    creator: props.user.id,
    postDate: '',
    producer: props.user.id,
    status: 'pending',
    channels: []
  }
  showForm.value = false
}

const closeTransformModal = () => {
  showTransformModal.value = false
  selectedDraft.value = null
  resetForm()
}

const handleEdit = (item) => {
  editingContent.value = item
  formData.value = {
    name: item.name,
    type: item.type,
    product: item.product,
    creator: item.creator,
    postDate: item.postDate.toISOString().split('T')[0],
    producer: item.producer,
    status: item.status,
    channels: [...item.channels]
  }
  showForm.value = true
}

const canEdit = (item) => {
  return props.user.adminType === 'admin' || item.creator === props.user.id || item.producer === props.user.id
}

const canUpdateStatus = (item) => {
  return props.user.adminType === 'admin' || item.producer === props.user.id
}

const handleOpenMetricsModal = (item) => {
  selectedContentForMetrics.value = item
  const initialMetrics = {}
  
  item.channels.forEach(channel => {
    initialMetrics[channel] = item.metrics?.channelMetrics?.[channel] || {
      likes: 0,
      comments: 0,
      shares: 0,
      siteVisits: 0,
      newAccounts: 0,
      postClicks: 0
    }
  })
  
  channelMetrics.value = initialMetrics
  showMetricsModal.value = true
}

const handleSaveChannelMetrics = () => {
  if (!selectedContentForMetrics.value) return

  const updatedMetrics = {
    ...selectedContentForMetrics.value.metrics,
    channelMetrics: channelMetrics.value
  }

  emit('updateContent', selectedContentForMetrics.value.id, { metrics: updatedMetrics })
  closeMetricsModal()
}

const closeMetricsModal = () => {
  showMetricsModal.value = false
  selectedContentForMetrics.value = null
  channelMetrics.value = {}
}

const updateChannelMetric = (channel, metric, value) => {
  if (!channelMetrics.value[channel]) {
    channelMetrics.value[channel] = {
      likes: 0,
      comments: 0,
      shares: 0,
      siteVisits: 0,
      newAccounts: 0,
      postClicks: 0
    }
  }
  channelMetrics.value[channel][metric] = value
}

const getCreatorName = (creatorId) => {
  return props.users.find(u => u.id === creatorId)?.name || 'Unknown'
}

const getProductName = (productId) => {
  return props.products.find(p => p.id === productId)?.name || 'Unknown'
}

const getProducerName = (producerId) => {
  return props.users.find(u => u.id === producerId)?.name || 'Unknown'
}

const formatDate = (date) => {
  return date.toLocaleDateString()
}

const getStatusClass = (status) => {
  const baseClass = 'text-sm rounded-full px-2 py-1'
  switch (status) {
    case 'posted':
      return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
    case 'in-production':
      return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`
    case 'pending':
      return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`
    case 'finished':
      return `${baseClass} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`
    default:
      return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`
  }
}
</script>