<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click.self="closeModal"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('confirmDelete', language) }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            :disabled="isDeleting"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="px-6 py-4">
        <div class="flex items-center space-x-3 mb-4">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle class="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div class="flex-1">
            <p class="text-sm text-gray-900 dark:text-white">
              {{ t('deleteUserConfirmation', language) }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ t('deleteUserWarning', language) }}
            </p>
          </div>
        </div>

        <!-- User Info -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User class="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ user?.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ user?.email }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
        <button
          @click="closeModal"
          :disabled="isDeleting"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ t('cancel', language) }}
        </button>
        <button
          @click="confirmDelete"
          :disabled="isDeleting"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <Loader2 v-if="isDeleting" class="w-4 h-4 animate-spin" />
          <Trash2 v-else class="w-4 h-4" />
          <span>{{ isDeleting ? t('deleting', language) : t('delete', language) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { X, AlertTriangle, User, Trash2, Loader2 } from 'lucide-vue-next'
import { useLanguage } from '@/hooks/useLanguage'
import { t } from '@/translations'
import { userService } from '@/services'

const { language } = useLanguage()

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'deleted'])

const isDeleting = ref(false)

const closeModal = () => {
  if (!isDeleting.value) {
    emit('close')
  }
}

const confirmDelete = async () => {
  if (!props.user || isDeleting.value) return

  isDeleting.value = true
  
  try {
    await userService.deleteUser(props.user.id)
    emit('deleted', props.user.id)
    emit('close')
  } catch (error) {
    console.error('Error deleting user:', error)
    // Aqui você pode adicionar um toast ou notificação de erro
  } finally {
    isDeleting.value = false
  }
}
</script>
