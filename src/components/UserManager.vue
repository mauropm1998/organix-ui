<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('users', language) }}</h2>
      <button
        @click="showForm = true"
        class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <Plus class="w-4 h-4 mr-2" />
        {{ t('newUser', language) }}
      </button>
    </div>

    <!-- User Form -->
    <div v-if="showForm" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
              type="text"
              v-model="formData.name"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('email', language) }}
            </label>
            <input
              type="email"
              v-model="formData.email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
              type="password"
              v-model="formData.password"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('role', language) }}
            </label>
            <select
              v-model="formData.adminType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="operator">{{ t('operator', language) }}</option>
              <option value="admin">{{ t('admin', language) }}</option>
            </select>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {{ editingUser ? t('update', language) : t('create', language) }} {{ t('user', language) }}
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
          >
            {{ t('cancel', language) }}
          </button>
        </div>
      </form>
    </div>

    <!-- Access Restricted Message -->
    <div v-if="user.adminType !== 'admin'" class="text-center py-12">
      <Users class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ t('accessRestricted', language) }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('onlyAdminsUsers', language) }}
      </p>
    </div>

    <!-- Users List -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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
            <tr v-for="userItem in users" :key="userItem.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <Shield v-if="userItem.adminType === 'admin'" class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      <UserIcon v-else class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ userItem.name }}
                    </div>
                    <div v-if="userItem.id === user.id" class="text-xs text-blue-600 dark:text-blue-400">
                      ({{ t('you', language) }})
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ userItem.email }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  userItem.adminType === 'admin'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`">
                  {{ t(userItem.adminType, language) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="handleEdit(userItem)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    v-if="userItem.id !== user.id"
                    @click="$emit('deleteUser', userItem.id)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete user"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Edit, Trash2, Users, Shield, User as UserIcon } from 'lucide-vue-next';
import { useLanguage } from '../composables/useLanguage.js';
import { t } from '../translations/index.js';


const props = defineProps({
  user: Object,
  users: Array
});

const emit = defineEmits(['addUser', 'updateUser', 'deleteUser']);

const { language } = useLanguage();

const showForm = ref(false);
const editingUser = ref<User | null>(null);
const formData = ref({
  name: '',
  email: '',
  password: '',
  adminType: 'operator'
});

const handleSubmit = () => {
  if (editingUser.value) {
    emit('updateUser', editingUser.value.id, formData.value);
    editingUser.value = null;
  } else {
    emit('addUser', formData.value);
  }
  
  formData.value = { name: '', email: '', password: '', adminType: 'operator' };
  showForm.value = false;
};

const handleEdit = (userToEdit) => {
  editingUser.value = userToEdit;
  formData.value = {
    name: userToEdit.name,
    email: userToEdit.email,
    password: userToEdit.password,
    adminType: userToEdit.adminType
  };
  showForm.value = true;
};

const handleCancel = () => {
  showForm.value = false;
  editingUser.value = null;
  formData.value = { name: '', email: '', password: '', adminType: 'operator' };
};
</script>