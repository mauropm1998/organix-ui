<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('performance', language) }}</h2>
      <div class="flex space-x-3">
        <select 
          v-model="selectedPeriod" 
          @change="loadPerformanceData"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="7">{{ t('last7Days', language) }}</option>
          <option value="30">{{ t('last30Days', language) }}</option>
          <option value="90">{{ t('last90Days', language) }}</option>
        </select>
        <button 
          @click="loadPerformanceData" 
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <BarChart3 class="w-4 h-4 mr-2" />
          {{ t('refresh', language) }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-6">
      <!-- Stats skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonLoader type="card" v-for="i in 4" :key="i" />
      </div>
      
      <!-- Charts skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonLoader type="rectangle" />
        <SkeletonLoader type="rectangle" />
      </div>
    </div>

    <!-- Content when loaded -->
    <div v-else>
      <!-- Performance Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Eye class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {{ t('totalViews', language) }}
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ formatNumber(performanceData?.totalViews || 0) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <TrendingUp class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {{ t('engagement', language) }}
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ formatPercentage(performanceData?.engagementRate || 0) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Share class="h-8 w-8 text-purple-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {{ t('shares', language) }}
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ formatNumber(performanceData?.totalShares || 0) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Users class="h-8 w-8 text-orange-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {{ t('reach', language) }}
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ formatNumber(performanceData?.reach || 0) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Channel Performance -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('channelPerformance', language) }}
          </h3>
          <div class="space-y-4">
            <div v-for="channel in channelData" :key="channel.name" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: channel.color }"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ channel.name }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatNumber(channel.views) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatPercentage(channel.percentage) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Types Performance -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ t('contentTypesPerformance', language) }}
          </h3>
          <div class="space-y-4">
            <div v-for="type in contentTypeData" :key="type.name" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: type.color }"></div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ type.name }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatNumber(type.views) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatPercentage(type.percentage) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('recentActivity', language) }}
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('content', language) }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('channel', language) }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('views', language) }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('engagement', language) }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('date', language) }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="activity in recentActivities" :key="activity.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ activity.contentName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ activity.channel }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ formatNumber(activity.views) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ formatPercentage(activity.engagement) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ formatDate(activity.date) }}
                </td>
              </tr>
              <tr v-if="recentActivities.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  {{ t('noActivityData', language) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { BarChart3, Eye, TrendingUp, Share, Users } from 'lucide-vue-next'
import { useLanguage } from '../hooks/useLanguage.js'
import { useData } from '../hooks/useData.js'
import { t } from '../translations/index.js'
import SkeletonLoader from './SkeletonLoader.vue'

const { language } = useLanguage()
const { 
  performanceData, 
  loading, 
  fetchPerformanceData 
} = useData()

const selectedPeriod = ref('30')

// Mock data for demonstration
const channelData = computed(() => [
  { name: 'Website', views: 15420, percentage: 35, color: '#3B82F6' },
  { name: 'Social Media', views: 12300, percentage: 28, color: '#10B981' },
  { name: 'Email', views: 8900, percentage: 20, color: '#F59E0B' },
  { name: 'Blog', views: 7500, percentage: 17, color: '#8B5CF6' }
])

const contentTypeData = computed(() => [
  { name: 'Articles', views: 18200, percentage: 42, color: '#EF4444' },
  { name: 'Videos', views: 14500, percentage: 33, color: '#06B6D4' },
  { name: 'Images', views: 7800, percentage: 18, color: '#84CC16' },
  { name: 'Social Posts', views: 3100, percentage: 7, color: '#F97316' }
])

const recentActivities = computed(() => [
  {
    id: 1,
    contentName: 'Product Launch Campaign',
    channel: 'Social Media',
    views: 2450,
    engagement: 8.5,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
  },
  {
    id: 2,
    contentName: 'How-to Blog Post',
    channel: 'Website',
    views: 1890,
    engagement: 12.3,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: 3,
    contentName: 'Newsletter Campaign',
    channel: 'Email',
    views: 3200,
    engagement: 6.7,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
  },
  {
    id: 4,
    contentName: 'Feature Demo Video',
    channel: 'YouTube',
    views: 5600,
    engagement: 15.2,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4)
  }
])

onMounted(async () => {
  await loadPerformanceData()
})

async function loadPerformanceData() {
  try {
    await fetchPerformanceData(selectedPeriod.value)
  } catch (error) {
    console.error('Error loading performance data:', error)
  }
}

function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K'
  }
  return number.toString()
}

function formatPercentage(number) {
  return number.toFixed(1) + '%'
}

function formatDate(date) {
  if (!date) return 'N/A'
  if (typeof date === 'string') return new Date(date).toLocaleDateString()
  return date.toLocaleDateString()
}
</script>
