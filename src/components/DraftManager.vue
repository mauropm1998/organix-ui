<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('drafts', language) }}</h2>
      <button
        @click="showForm = true"
        class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <Plus class="w-4 h-4 mr-2" />
        {{ t('newDraft', language) }}
      </button>
    </div>

    <!-- Filters -->
    <div class="flex space-x-4">
      <select
        v-model="filterStatus"
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">{{ t('allStatuses', language) }}</option>
        <option v-for="status in DRAFT_STATUSES" :key="status" :value="status">
          {{ t(status, language) }}
        </option>
      </select>
      <select
        v-model="filterType"
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">{{ t('allTypes', language) }}</option>
        <option v-for="type in CONTENT_TYPES" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>

    <!-- Draft Form -->
    <div v-if="showForm" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ editingDraft ? t('editDraft', language) : t('createNewDraft', language) }}
      </h3>
      <form @submit="handleSubmit" class="space-y-4">
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
        
        <div v-if="user.adminType === 'admin'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('status', language) }}
          </label>
          <select
            v-model="formData.status"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option v-for="status in DRAFT_STATUSES" :key="status" :value="status">
              {{ t(status, language) }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('draftContent', language) }}
          </label>
          <textarea
            v-model="formData.richtext"
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            :placeholder="t('enterDraftContent', language)"
            required
          />
        </div>

        <div class="flex space-x-3">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {{ editingDraft ? t('update', language) : t('create', language) }} {{ t('drafts', language) }}
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

    <!-- Drafts List -->
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
                {{ t('creator', language) }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('status', language) }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('created', language) }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('actions', language) }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="draft in filteredDrafts" :key="draft.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ draft.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ draft.type }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ getUserName(draft.creator) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <component :is="getStatusIcon(draft.status)" />
                  <span :class="`text-sm font-medium ${getStatusColor(draft.status)}`">
                    {{ t(draft.status, language) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ draft.createdAt.toLocaleDateString() }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    v-if="canEdit(draft)"
                    @click="handleEdit(draft)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    v-if="canEdit(draft)"
                    @click="$emit('delete-draft', draft.id)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete draft"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredDrafts.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">{{ t('noDraftsFound', language) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, Edit, Trash2, CheckCircle, Clock, XCircle } from 'lucide-vue-next';
import { CONTENT_TYPES, DRAFT_STATUSES } from '../data/mockData';
import { useLanguage } from '../composables/useLanguage';
import { t } from '../translations';
import type { User, Draft } from '../types';

interface Props {
  user: User;
  drafts: Draft[];
  users: User[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'add-draft': [draft: Omit<Draft, 'id' | 'createdAt'>];
  'update-draft': [id: string, updates: Partial<Draft>];
  'delete-draft': [id: string];
}>();

const { language } = useLanguage();

const showForm = ref(false);
const editingDraft = ref<Draft | null>(null);
const filterStatus = ref('');
const filterType = ref('');
const formData = ref({
  name: '',
  type: '',
  richtext: '',
  status: 'pending' as const
});

// Filter drafts based on user role
const userDrafts = computed(() => 
  props.user.adminType === 'admin' 
    ? props.drafts 
    : props.drafts.filter(d => d.creator === props.user.id)
);

// Apply filters
const filteredDrafts = computed(() => 
  userDrafts.value.filter(draft => {
    if (filterStatus.value && draft.status !== filterStatus.value) return false;
    if (filterType.value && draft.type !== filterType.value) return false;
    return true;
  })
);

const handleSubmit = (e: Event) => {
  e.preventDefault();
  
  if (editingDraft.value) {
    emit('update-draft', editingDraft.value.id, formData.value);
    editingDraft.value = null;
  } else {
    emit('add-draft', {
      ...formData.value,
      creator: props.user.id
    });
  }
  
  formData.value = { name: '', type: '', richtext: '', status: 'pending' };
  showForm.value = false;
};

const handleEdit = (draft: Draft) => {
  editingDraft.value = draft;
  formData.value = {
    name: draft.name,
    type: draft.type,
    richtext: draft.richtext,
    status: draft.status
  };
  showForm.value = true;
};

const handleCancel = () => {
  showForm.value = false;
  editingDraft.value = null;
  formData.value = { name: '', type: '', richtext: '', status: 'pending' };
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return CheckCircle;
    case 'pending':
      return Clock;
    case 'not approved':
      return XCircle;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'text-green-600 dark:text-green-400';
    case 'pending':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'not approved':
      return 'text-red-600 dark:text-red-400';
    default:
      return '';
  }
};

const canEdit = (draft: Draft) => {
  return props.user.adminType === 'admin' || draft.creator === props.user.id;
};

const getUserName = (userId: string) => {
  const user = props.users.find(u => u.id === userId);
  return user?.name || 'Unknown';
};
</script>