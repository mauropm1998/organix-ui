<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('dashboard', language) }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('welcomeBack', language) }}<span v-if="user">, {{ user.name }}</span>! {{ t('contentOverview', language) }}
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FileText class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('totalDrafts', language) }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ draftStats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <CheckCircle class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('approvedDrafts', language) }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ draftStats.approved }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <Video class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('totalContent', language) }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ contentStats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <PlayCircle class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('inProduction', language) }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ contentStats.inProduction }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Drafts -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('recentDrafts', language) }}</h3>
        </div>
        <div class="p-6">
          <div
            v-for="draft in userDrafts.slice(0, 5)"
            :key="draft.id"
            class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
          >
            <div class="flex-1">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ draft.name }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ draft.type }}</p>
            </div>
            <span :class="getStatusClass(draft.status)">
              {{ t(draft.status, language) }}
            </span>
          </div>
          <p v-if="userDrafts.length === 0" class="text-gray-500 dark:text-gray-400 text-center py-4">
            {{ t('noDraftsYet', language) }}
          </p>
        </div>
      </div>

      <!-- Recent Content -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('recentContent', language) }}</h3>
        </div>
        <div class="p-6">
          <div
            v-for="item in userContent.slice(0, 5)"
            :key="item.id"
            class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
          >
            <div class="flex-1">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.type }}</p>
            </div>
            <span :class="getContentStatusClass(item.status)">
              {{ t(item.status, language) }}
            </span>
          </div>
          <p v-if="userContent.length === 0" class="text-gray-500 dark:text-gray-400 text-center py-4">
            {{ t('noContentYet', language) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FileText, Video, CheckCircle, PlayCircle } from 'lucide-vue-next';
import { useLanguage } from '../composables/useLanguage.js';
import { t } from '../translations/index.js';


const props = defineProps({
  user: Object,
  drafts: Array,
  content: Array
});
const { language } = useLanguage();

// Filter data based on user role
const userDrafts = computed(() => 
  props.user?.adminType === 'admin' 
    ? props.drafts || []
    : props.drafts?.filter(d => d.creator === props.user?.id) || []
);

const userContent = computed(() =>
  props.user?.adminType === 'admin'
    ? props.content || []
    : props.content?.filter(c => c.creator === props.user?.id || c.producer === props.user?.id) || []
);

// Statistics
const draftStats = computed(() => ({
  total: userDrafts.value.length,
  approved: userDrafts.value.filter(d => d.status === 'approved').length,
  pending: userDrafts.value.filter(d => d.status === 'pending').length,
  rejected: userDrafts.value.filter(d => d.status === 'not approved').length
}));

const contentStats = computed(() => ({
  total: userContent.value.length,
  inProduction: userContent.value.filter(c => c.status === 'in-production').length,
  pending: userContent.value.filter(c => c.status === 'pending').length,
  posted: userContent.value.filter(c => c.status === 'posted').length,
  finished: userContent.value.filter(c => c.status === 'finished').length
}));

const getStatusClass = (status) => {
  const baseClass = 'px-2 py-1 text-xs rounded-full';
  switch (status) {
    case 'approved':
      return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
    case 'pending':
      return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
    default:
      return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
  }
};

const getContentStatusClass = (status) => {
  const baseClass = 'px-2 py-1 text-xs rounded-full';
  switch (status) {
    case 'posted':
      return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
    case 'in-production':
      return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
    case 'pending':
      return `${baseClass} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
    case 'finished':
      return `${baseClass} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
    default:
      return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
  }
};
</script>