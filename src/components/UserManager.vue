
<template>
  <div class="space-y-6">
    <div v-if="user.adminType !== 'admin'" class="text-center py-12">
      <lucide-users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('accessRestricted', language) }}</h3>
      <p class="text-gray-600 dark:text-gray-400">{{ t('onlyAdminsUsers', language) }}</p>
    </div>
    <template v-else>
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('users', language) }}</h2>
        <button @click="showForm = true" class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <lucide-plus class="w-4 h-4 mr-2" />
          {{ t('newUser', language) }}
        </button>
      </div>
      <div v-if="showForm" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ editingUser ? t('editUser', language) : t('createNewUser', language) }}</h3>
        <UserForm :formData="formData" :t="t" :language="language" :submitLabel="(editingUser ? t('update', language) : t('create', language)) + ' ' + t('user', language)" @submit="handleSubmit" @cancel="handleCancel" />
      </div>
  <UserTable :users="users" :t="t" :language="language" :currentUserId="user.id" @edit="handleEdit" @delete="handleDelete" />
      <div v-if="users.length === 0" class="text-center py-12">
        <lucide-users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('noUsersYet', language) }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('getStartedUser', language) }}</p>
        <button @click="showForm = true" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <lucide-plus class="w-4 h-4 mr-2" />
          {{ t('createUser', language) }}
        </button>
      </div>
    </template>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useLanguage } from '../hooks/useLanguage.js'
import { t } from '../translations/index.js'
import { mockUsers } from '../data/mockData.js'
import UserForm from './users/UserForm.vue'
import UserTable from './users/UserTable.vue'
import { Plus as LucidePlus, Users as LucideUsers } from 'lucide-vue-next'

const user = mockUsers[0]
const { language } = useLanguage()
const users = ref([...mockUsers])
const showForm = ref(false)
const editingUser = ref(null)
const formData = ref({ name: '', email: '', password: '', adminType: 'operator' })

function handleSubmit() {
  if (editingUser.value) {
    const idx = users.value.findIndex(u => u.id === editingUser.value.id)
    if (idx !== -1) {
      users.value[idx] = { ...editingUser.value, ...formData.value }
    }
    editingUser.value = null
  } else {
    users.value.push({
      ...formData.value,
      id: Date.now().toString(),
      companyId: user.companyId
    })
  }
  formData.value = { name: '', email: '', password: '', adminType: 'operator' }
  showForm.value = false
}

function handleEdit(userToEdit) {
  editingUser.value = userToEdit
  formData.value = { name: userToEdit.name, email: userToEdit.email, password: userToEdit.password, adminType: userToEdit.adminType }
  showForm.value = true
}

function handleDelete(id) {
  users.value = users.value.filter(u => u.id !== id)
}

function handleCancel() {
  showForm.value = false
  editingUser.value = null
  formData.value = { name: '', email: '', password: '', adminType: 'operator' }
}
</script>
