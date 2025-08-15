<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full transform transition-all max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mr-3">
            <ArrowRight class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ t('transformDraft', language) }}
            </h3>
          </div>
        </div>

        <!-- Content -->
        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ t('transformDraftDescription', language) }}
          </p>
          
          <!-- Draft Info -->
          <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
            <div class="flex items-center">
              <FileText class="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
              <div class="min-w-0 flex-1">
                <span class="text-sm font-medium text-gray-900 dark:text-white block truncate">
                  {{ draft?.name }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ getContentTypeLabel(draft?.type) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="$emit('confirm', getFormattedFormData())" class="space-y-4">
            <!-- First Row: Product and Producer -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Product Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('product', language) }}
                </label>
                <select
                  v-model="formData.productId"
                  :disabled="isTransforming"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="">{{ t('selectProduct', language) }}</option>
                  <option v-for="product in products" :key="product.id" :value="product.id">
                    {{ product.name }}
                  </option>
                </select>
              </div>

              <!-- Producer Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('producer', language) }}
                </label>
                <select
                  v-model="formData.producerId"
                  :disabled="isTransforming"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="">{{ t('selectProducer', language) }}</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Second Row: Post Date and Status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Post Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('postDate', language) }}
                </label>
                <input
                  v-model="formData.postDate"
                  type="datetime-local"
                  :disabled="isTransforming"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
                />
              </div>

              <!-- Status Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('status', language) }}
                </label>
                <select
                  v-model="formData.status"
                  required
                  :disabled="isTransforming"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="PENDING">{{ t('pending', language) }}</option>
                  <option value="IN_PRODUCTION">{{ t('in_production', language) }}</option>
                  <option value="POSTED">{{ t('posted', language) }}</option>
                  <option value="FINISHED">{{ t('finished', language) }}</option>
                  <option value="CANCELED">{{ t('canceled', language) }}</option>
                </select>
              </div>
            </div>

            <!-- Third Row: Channels (full width) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('channels', language) }} *
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <div 
                  v-for="channel in channels" 
                  :key="channel.id"
                  class="flex items-center"
                >
                  <input
                    :id="`channel-${channel.id}`"
                    type="checkbox"
                    :value="channel.id"
                    v-model="formData.channelIds"
                    :disabled="isTransforming"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                  />
                  <label 
                    :for="`channel-${channel.id}`"
                    class="ml-2 text-sm text-gray-900 dark:text-gray-300 cursor-pointer truncate"
                  >
                    {{ channel.name }}
                  </label>
                </div>
              </div>
              <p v-if="formData.channelIds.length === 0" class="text-xs text-red-500 mt-1">
                {{ t('selectAtLeastOneChannel', language) }}
              </p>
            </div>
          </form>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            @click="$emit('cancel')"
            :disabled="isTransforming"
            class="w-full sm:w-auto px-6 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:disabled:bg-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('cancel', language) }}
          </button>
          <button
            @click="$emit('confirm', getFormattedFormData())"
            :disabled="isTransforming || formData.channelIds.length === 0"
            class="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isTransforming" class="w-4 h-4 animate-spin" />
            <ArrowRight v-else class="w-4 h-4" />
            <span>{{ isTransforming ? t('transforming', language) : t('transform', language) }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ArrowRight, FileText, Loader2 } from 'lucide-vue-next'
import { useLanguage } from '../../hooks/useLanguage.js'
import { useData } from '../../hooks/useData.js'
import { t } from '../../translations/index.js'

const { language } = useLanguage()
const { channels, products, users, fetchChannels, fetchProducts, fetchUsers } = useData()

const props = defineProps({
  draft: {
    type: Object,
    required: true
  },
  isTransforming: {
    type: Boolean,
    default: false
  }
})

defineEmits(['confirm', 'cancel'])

const formData = reactive({
  status: 'PENDING',
  channelIds: [],
  productId: '',
  producerId: '',
  postDate: ''
})

// Load data when component mounts
onMounted(async () => {
  await Promise.all([
    channels.value && channels.value.length > 0 ? Promise.resolve() : fetchChannels(),
    products.value && products.value.length > 0 ? Promise.resolve() : fetchProducts(),
    users.value && users.value.length > 0 ? Promise.resolve() : fetchUsers()
  ])
})

// Reset form when draft changes
watch(() => props.draft, () => {
  formData.status = 'PENDING'
  formData.channelIds = []
  formData.productId = ''
  formData.producerId = ''
  formData.postDate = ''
}, { immediate: true })

// Helper function for content type labels
const getContentTypeLabel = (type) => {
  if (!type) return ''
  // Try to get translated content type, fallback to original type
  const translatedType = t(`contentTypes.${type}`, language.value)
  // If translation returns the key itself (not found), return the original type
  return translatedType.startsWith('contentTypes.') ? type : translatedType
}

// Format date for backend (format: yyyy-MM-dd'T'HH:mm:ss)
const formatDateForBackend = (dateValue) => {
  if (!dateValue) return undefined
  
  const dateObj = new Date(dateValue)
  
  // Exact format expected by backend: yyyy-MM-dd'T'HH:mm:ss
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  const seconds = String(dateObj.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

// Prepare form data for submission
const getFormattedFormData = () => {
  return {
    status: formData.status,
    channelIds: formData.channelIds,
    productId: formData.productId || undefined,
    producerId: formData.producerId || undefined,
    postDate: formatDateForBackend(formData.postDate)
  }
}
</script>
