<template>
  <div class="space-y-6">
    <!-- Access Restriction Check -->
    <div v-if="currentUser?.adminType !== 'ADMIN'" class="text-center py-12">
      <Users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ t('accessRestricted', language) }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('onlyAdminsUsers', language) }}
      </p>
    </div>

    <!-- Admin Content -->
    <div v-else>
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('users', language) }}
        </h2>
        <button
          @click="showForm = true"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus class="w-4 h-4 mr-2" />
          {{ t('newUser', language) }}
        </button>
      </div>

      <!-- User Form -->
      <UserForm
        v-if="showForm"
        :editing-user="editingUser"
        :is-loading="isFormLoading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />

      <!-- Users Table -->
      <div class="mt-6">
        <UserTable
          :users="users"
          :current-user="currentUser"
          :is-loading="isLoading"
          @edit="handleEdit"
          @user-deleted="handleUserDeleted"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { Plus, Users } from 'lucide-vue-next'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { userService } from '@/services'
import { t } from '@/translations'
import UserForm from './users/UserForm.vue'
import UserTable from './users/UserTable.vue'

export default {
  name: 'UserManager',
  components: {
    UserForm,
    UserTable,
    Plus,
    Users
  },
  setup() {
    const { currentUser } = useAuth()
    const { language } = useLanguage()
    
    const users = ref([])
    const showForm = ref(false)
    const editingUser = ref(null)
    const isLoading = ref(false)
    const isFormLoading = ref(false)

    // Check if current user is admin
    const isAdmin = computed(() => currentUser.value?.adminType === 'ADMIN')

    const loadUsers = async () => {
      if (!currentUser.value || !isAdmin.value) return
      
      try {
        isLoading.value = true
        users.value = await userService.getAllUsers()
      } catch (error) {
        console.error('Error loading users:', error)
        alert('Erro ao carregar usuários: ' + (error.response?.data?.message || error.message))
      } finally {
        isLoading.value = false
      }
    }

    const handleSubmit = async (formData) => {
      try {
        isFormLoading.value = true
        
        if (editingUser.value) {
          // Update user
          const updatedUser = await userService.updateUser(editingUser.value.id, formData)
          const index = users.value.findIndex(u => u.id === editingUser.value.id)
          if (index !== -1) {
            users.value[index] = updatedUser
          }
        } else {
          // Create user
          const newUser = await userService.createUser(formData)
          users.value.push(newUser)
        }
        
        handleCancel()
      } catch (error) {
        console.error('Error saving user:', error)
        const message = editingUser.value ? 'Erro ao atualizar usuário' : 'Erro ao criar usuário'
        alert(message)
      } finally {
        isFormLoading.value = false
      }
    }

    const handleEdit = (user) => {
      editingUser.value = user
      showForm.value = true
    }

    const handleUserDeleted = (userId) => {
      users.value = users.value.filter(u => u.id !== userId)
    }

    const handleCancel = () => {
      showForm.value = false
      editingUser.value = null
    }

    // Watch for currentUser changes to load users when user is available
    watch(currentUser, (newUser) => {
      if (newUser && newUser.adminType === 'ADMIN') {
        loadUsers()
      }
    }, { immediate: true })

    return {
      currentUser,
      users,
      showForm,
      editingUser,
      isLoading,
      isFormLoading,
      isAdmin,
      language,
      t,
      handleSubmit,
      handleEdit,
      handleUserDeleted,
      handleCancel
    }
  }
}
</script>
