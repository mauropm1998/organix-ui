<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {{ editingUser ? t('editUser', language) : t('createNewUser', language) }}
    </h3>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('name', language) }}
          </label>
          <input
            v-model="formData.name"
            type="text"
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('email', language) }}
          </label>
          <input
            v-model="formData.email"
            type="email"
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('password', language) }}
          </label>
          <input
            v-model="formData.password"
            type="password"
            :disabled="isLoading"
            :placeholder="editingUser ? 'Deixe em branco para manter a senha atual' : ''"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
            :required="!editingUser"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('role', language) }}
          </label>
          <select
            v-model="formData.adminType"
            :disabled="isLoading"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
            required
          >
            <option value="OPERATOR">{{ t('operator', language) }}</option>
            <option value="ADMIN">{{ t('admin', language) }}</option>
          </select>
        </div>
      </div>

      <div class="flex space-x-3">
        <button
          type="submit"
          :disabled="isLoading"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors space-x-2"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          <UserPlus v-else class="w-4 h-4" />
          <span>{{ editingUser ? t('update', language) : t('create', language) }} {{ t('user', language) }}</span>
        </button>
        
        <button
          type="button"
          @click="$emit('cancel')"
          :disabled="isLoading"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          {{ t('cancel', language) }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { Loader2, UserPlus } from 'lucide-vue-next'
import { useLanguage } from '@/hooks/useLanguage'
import { t } from '@/translations'

export default {
  name: 'UserForm',
  components: {
    Loader2,
    UserPlus
  },
  props: {
    editingUser: {
      type: Object,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const { language } = useLanguage()
    const formData = ref({
      name: '',
      email: '',
      password: '',
      adminType: 'OPERATOR'
    })

    const resetForm = () => {
      formData.value = {
        name: '',
        email: '',
        password: '',
        adminType: 'OPERATOR'
      }
    }

    const handleSubmit = () => {
      const submitData = { ...formData.value }
      
      // If editing and password is empty, remove it from the data
      if (props.editingUser && !submitData.password) {
        delete submitData.password
      }
      
      emit('submit', submitData)
    }

    // Watch for editing user changes
    watch(() => props.editingUser, (newUser) => {
      if (newUser) {
        formData.value = {
          name: newUser.name,
          email: newUser.email,
          password: '', // Don't pre-fill password for security
          adminType: newUser.adminType
        }
      } else {
        resetForm()
      }
    }, { immediate: true })

    return {
      formData,
      language,
      t,
      handleSubmit
    }
  }
}
</script>
