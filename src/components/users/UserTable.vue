<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('user', language) }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('email', language) }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('role', language) }}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('actions', language) }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="i in 3" :key="i" class="animate-pulse">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                </div>
                <div class="ml-4">
                  <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="flex items-center justify-end space-x-2">
                <div class="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div class="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Users Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('user', language) }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('email', language) }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('role', language) }}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {{ t('actions', language) }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <Shield v-if="user.adminType === 'ADMIN'" class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <UserIcon v-else class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ user.name }}
                  </div>
                  <div v-if="user.id === currentUser?.id" class="text-xs text-blue-600 dark:text-blue-400">
                    ({{ t('you', language) }})
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ user.email }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                user.adminType === 'ADMIN'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              ]">
                {{ t(user.adminType.toLowerCase(), language) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="$emit('edit', user)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  :title="t('edit', language)"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button
                  v-if="user.id !== currentUser?.id"
                  @click="handleDeleteClick(user)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  :title="t('delete', language)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Empty State -->
      <div v-if="users.length === 0" class="text-center py-12">
        <Users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ t('noUsers', language) }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('noUsersFound', language) }}
        </p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteUserModal
      :isOpen="showDeleteModal"
      :user="userToDelete"
      @close="closeDeleteModal"
      @deleted="handleUserDeleted"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { Users, Shield, User as UserIcon, Edit, Trash2 } from 'lucide-vue-next'
import { useLanguage } from '@/hooks/useLanguage'
import { t } from '@/translations'
import DeleteUserModal from './DeleteUserModal.vue'

export default {
  name: 'UserTable',
  components: {
    Users,
    Shield,
    UserIcon,
    Edit,
    Trash2,
    DeleteUserModal
  },
  props: {
    users: {
      type: Array,
      default: () => []
    },
    currentUser: {
      type: Object,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete', 'user-deleted'],
  setup(props, { emit }) {
    const { language } = useLanguage()
    
    const showDeleteModal = ref(false)
    const userToDelete = ref(null)
    
    const handleDeleteClick = (user) => {
      userToDelete.value = user
      showDeleteModal.value = true
    }
    
    const closeDeleteModal = () => {
      showDeleteModal.value = false
      userToDelete.value = null
    }
    
    const handleUserDeleted = (userId) => {
      emit('user-deleted', userId)
    }
    
    return {
      language,
      t,
      showDeleteModal,
      userToDelete,
      handleDeleteClick,
      closeDeleteModal,
      handleUserDeleted
    }
  }
}
</script>
