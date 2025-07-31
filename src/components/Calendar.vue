<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('contentCalendar', language) }}</h2>
      <button
        @click="showFilters = !showFilters"
        class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <Filter class="w-4 h-4 mr-2" />
        {{ t('filters', language) }}
      </button>
    </div>

    <!-- Filters -->
    <div v-if="showFilters" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('filters', language) }}</h3>
        <button
          @click="clearFilters"
          class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {{ t('clearAll', language) }}
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('product', language) }}
          </label>
          <select
            v-model="filters.product"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ t('allProducts', language) }}</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('channel', language) }}
          </label>
          <select
            v-model="filters.channel"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ t('allChannels', language) }}</option>
            <option v-for="channel in CHANNELS" :key="channel" :value="channel">
              {{ channel }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('status', language) }}
          </label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ t('allStatuses', language) }}</option>
            <option v-for="status in CONTENT_STATUSES" :key="status" :value="status">
              {{ t(status, language) }}
            </option>
          </select>
        </div>
        <div v-if="user.adminType === 'admin'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('user', language) }}
          </label>
          <select
            v-model="filters.user"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ t('allUsers', language) }}</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Calendar Header -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <button
          @click="navigateMonth(-1)"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}
        </h3>
        <button
          @click="navigateMonth(1)"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <!-- Calendar Grid -->
      <div class="p-6">
        <!-- Day Headers -->
        <div class="grid grid-cols-7 gap-1 mb-4">
          <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" class="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ day }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="(day, index) in days"
            :key="index"
            :class="[
              'min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 rounded-lg',
              isCurrentMonth(day) 
                ? 'bg-white dark:bg-gray-800' 
                : 'bg-gray-50 dark:bg-gray-900',
              isToday(day) ? 'ring-2 ring-blue-500' : ''
            ]"
          >
            <div :class="[
              'text-sm font-medium mb-2',
              isCurrentMonth(day) 
                ? 'text-gray-900 dark:text-white' 
                : 'text-gray-400 dark:text-gray-600',
              isToday(day) ? 'text-blue-600 dark:text-blue-400' : ''
            ]">
              {{ day.getDate() }}
            </div>
            
            <div class="space-y-1">
              <div
                v-for="item in getContentForDate(day).slice(0, 3)"
                :key="item.id"
                @click="setSelectedContent(item)"
                :class="[
                  'text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity',
                  getStatusClass(item.status)
                ]"
                :title="`${item.name} - ${getProductName(item.product)}`"
              >
                <div class="truncate font-medium">{{ item.name }}</div>
                <div class="truncate opacity-75">{{ getProductName(item.product) }}</div>
              </div>
              <div v-if="getContentForDate(day).length > 3" class="text-xs text-gray-500 dark:text-gray-400 text-center">
                +{{ getContentForDate(day).length - 3 }} more
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Detail Modal -->
    <div v-if="selectedContent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ selectedContent.name }}
            </h3>
            <button
              @click="selectedContent = null"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('type', language) }}
                </label>
                <p class="text-gray-900 dark:text-white">{{ selectedContent.type }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('product', language) }}
                </label>
                <div class="flex items-center space-x-3">
                  <Box class="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  <p class="text-gray-900 dark:text-white">{{ getProductName(selectedContent.product) }}</p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('status', language) }}
                </label>
                <span :class="getStatusClass(selectedContent.status)">
                  {{ t(selectedContent.status, language) }}
                </span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('channels', language) }}
                </label>
                <div class="flex flex-wrap gap-2">
                  <span v-for="channel in selectedContent.channels" :key="channel" class="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded">
                    {{ channel }}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('creator', language) }}
                </label>
                <p class="text-gray-900 dark:text-white">{{ getUserName(selectedContent.creator) }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('producer', language) }}
                </label>
                <p class="text-gray-900 dark:text-white">{{ getUserName(selectedContent.producer) }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Creation Date
                </label>
                <p class="text-gray-900 dark:text-white">{{ selectedContent.creationDate.toLocaleDateString() }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Post Date
                </label>
                <p class="text-gray-900 dark:text-white">{{ selectedContent.postDate.toLocaleDateString() }}</p>
              </div>
            </div>
          </div>

          <div v-if="selectedContent.metrics" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="text-center">
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ selectedContent.metrics.views.toLocaleString() }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('views', language) }}</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ selectedContent.metrics.likes.toLocaleString() }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('likes', language) }}</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ selectedContent.metrics.reach.toLocaleString() }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('reach', language) }}</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ selectedContent.metrics.engagement.toLocaleString() }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('engagement', language) }}</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ selectedContent.metrics.comments.toLocaleString() }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('comments', language) }}</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-pink-600 dark:text-pink-400">{{ selectedContent.metrics.shares.toLocaleString() }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('shares', language) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight, Filter, X, Box } from 'lucide-vue-next';
import { CHANNELS, CONTENT_STATUSES } from '../data/mockData';
import { useLanguage } from '../composables/useLanguage';
import { t } from '../translations';
import type { User, Content, Product } from '../types';

interface Props {
  user: User;
  content: Content[];
  products: Product[];
  users: User[];
}

const props = defineProps<Props>();
const { language } = useLanguage();

const currentDate = ref(new Date());
const showFilters = ref(false);
const selectedContent = ref<Content | null>(null);
const filters = ref({
  product: '',
  channel: '',
  status: '',
  user: ''
});

// Filter content based on user role and filters
const userContent = computed(() => 
  props.user.adminType === 'admin' 
    ? props.content 
    : props.content.filter(c => c.creator === props.user.id || c.producer === props.user.id)
);

const filteredContent = computed(() => 
  userContent.value.filter(item => {
    if (filters.value.product && item.product !== filters.value.product) return false;
    if (filters.value.channel && !item.channels.includes(filters.value.channel)) return false;
    if (filters.value.status && item.status !== filters.value.status) return false;
    if (filters.value.user && item.creator !== filters.value.user && item.producer !== filters.value.user) return false;
    return true;
  })
);

// Get calendar data
const days = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const calendarDays = [];
  const currentDay = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }
  
  return calendarDays;
});

const getContentForDate = (date: Date) => {
  return filteredContent.value.filter(item => {
    const postDate = new Date(item.postDate);
    return postDate.toDateString() === date.toDateString();
  });
};

const navigateMonth = (direction: number) => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  currentDate.value = new Date(year, month + direction, 1);
};

const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isCurrentMonth = (date: Date) => {
  return date.getMonth() === currentDate.value.getMonth();
};

const clearFilters = () => {
  filters.value = { product: '', channel: '', status: '', user: '' };
};

const setSelectedContent = (content: Content) => {
  selectedContent.value = content;
};

const getProductName = (productId: string) => {
  return props.products.find(p => p.id === productId)?.name || 'Unknown';
};

const getUserName = (userId: string) => {
  return props.users.find(u => u.id === userId)?.name || 'Unknown';
};

const getStatusClass = (status: string) => {
  const baseClass = 'inline-block px-3 py-1 text-sm rounded-full';
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