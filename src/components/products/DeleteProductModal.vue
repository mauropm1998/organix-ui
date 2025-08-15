<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mr-3">
            <AlertTriangle class="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ t('confirmDeletion', language) }}
            </h3>
          </div>
        </div>

        <!-- Content -->
        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400">
            {{ t('confirmDeleteProduct', language) }}
          </p>
          <div class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div class="flex items-center">
              <Package class="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
              <span class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ product?.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3 justify-end">
          <button
            @click="$emit('cancel')"
            :disabled="isDeleting"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:disabled:bg-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('cancel', language) }}
          </button>
          <button
            @click="$emit('confirm')"
            :disabled="isDeleting"
            class="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isDeleting" class="w-4 h-4 animate-spin" />
            <Trash2 v-else class="w-4 h-4" />
            <span>{{ isDeleting ? t('deleting', language) : t('delete', language) }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle, Package, Trash2, Loader2 } from 'lucide-vue-next'
import { useLanguage } from '../../hooks/useLanguage.js'
import { t } from '../../translations/index.js'

const { language } = useLanguage()

defineProps({
  product: {
    type: Object,
    required: true
  },
  isDeleting: {
    type: Boolean,
    default: false
  }
})

defineEmits(['confirm', 'cancel'])
</script>
