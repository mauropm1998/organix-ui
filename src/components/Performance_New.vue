<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('performance', language) }}</h2>
      <button 
        @click="loadPerformanceData" 
        :disabled="loading"
        class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
      >
        <BarChart3 class="w-4 h-4 mr-2" />
        {{ loading ? t('loading', language) : t('refresh', language) }}
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('filters', language) }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('startDate', language) }}
          </label>
          <input
            type="date"
            v-model="filters.startDate"
            @change="loadPerformanceData"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('endDate', language) }}
          </label>
          <input
            type="date"
            v-model="filters.endDate"
            @change="loadPerformanceData"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('channel', language) }}
          </label>
          <select
            v-model="filters.channel"
            @change="loadPerformanceData"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ t('allChannels', language) }}</option>
            <option v-for="channel in channels" :key="channel.id" :value="channel.name">
              {{ channel.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('product', language) }}
          </label>
          <select
            v-model="filters.productId"
            @change="loadPerformanceData"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ t('allProducts', language) }}</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-6">
      <!-- Stats skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonLoader type="card" v-for="i in 4" :key="i" />
      </div>
      
      <!-- Table skeleton -->
      <SkeletonLoader type="rectangle" />
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
                  {{ t('totalLikes', language) }}
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ formatNumber(performanceData?.totalLikes || 0) }}
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
                  {{ t('totalShares', language) }}
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
                  {{ t('totalReach', language) }}
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ formatNumber(performanceData?.totalReach || 0) }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Performance Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('contentPerformance', language) }}</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('contentName', language) }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('channels', language) }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('product', language) }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('likes', language) }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('comments', language) }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('shares', language) }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('clicks', language) }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('postDate', language) }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in filteredContent" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ item.name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ t(`contentTypes.${item.type}`, language) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="channel in item.channels" :key="channel.id" 
                          class="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      {{ channel.name }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <Box class="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span class="text-sm text-gray-900 dark:text-white">
                      {{ getProductName(item.productIds) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatNumber(calculateTotalMetric(item, 'likes')) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatNumber(calculateTotalMetric(item, 'comments')) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatNumber(calculateTotalMetric(item, 'shares')) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatNumber(calculateTotalMetric(item, 'postClicks')) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(item.postDate) }}
                </td>
              </tr>
              <tr v-if="filteredContent.length === 0">
                <td colspan="8" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  {{ t('noPerformanceData', language) }}
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
import { ref, onMounted, computed, reactive } from 'vue'
import { BarChart3, Eye, TrendingUp, Share, Users, Box } from 'lucide-vue-next'
import { useLanguage } from '../hooks/useLanguage.js'
import { useAuth } from '../hooks/useAuth.js'
import { useData } from '../hooks/useData.js'
import { t } from '../translations/index.js'
import SkeletonLoader from './SkeletonLoader.vue'

const { language } = useLanguage()
const { currentUser: user } = useAuth()
const { 
  content,
  products,
  channels,
  performanceData, 
  loading, 
  fetchPerformanceData,
  fetchContent,
  fetchProducts,
  fetchChannels
} = useData()

// Filters
const filters = reactive({
  startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  channel: '',
  productId: ''
})

// Computed filtered content
const filteredContent = computed(() => {
  if (!content.value) return []
  
  return content.value.filter(item => {
    // Filter by user permissions
    if (user.value?.adminType !== 'admin') {
      if (!item.assignedUserIds?.includes(user.value?.id) && 
          item.creator !== user.value?.id && 
          item.producer !== user.value?.id) {
        return false
      }
    }
    
    // Filter by date range
    if (item.postDate) {
      const postDate = new Date(item.postDate)
      const startDate = new Date(filters.startDate)
      const endDate = new Date(filters.endDate)
      
      if (postDate < startDate || postDate > endDate) return false
    }
    
    // Filter by channel
    if (filters.channel && !item.channels?.some(channel => channel.name === filters.channel)) {
      return false
    }
    
    // Filter by product
    if (filters.productId && !item.productIds?.includes(filters.productId)) {
      return false
    }
    
    // Only show published content
    return item.status === 'PUBLISHED' || item.status === 'POSTED'
  })
})

onMounted(async () => {
  await Promise.all([
    fetchContent(),
    fetchProducts(),
    fetchChannels(),
    loadPerformanceData()
  ])
})

async function loadPerformanceData() {
  try {
    const apiFilters = {
      startDate: filters.startDate,
      endDate: filters.endDate
    }
    
    if (filters.channel) {
      apiFilters.channel = filters.channel
    }
    
    if (filters.productId) {
      apiFilters.productId = filters.productId
    }
    
    await fetchPerformanceData(apiFilters)
  } catch (error) {
    console.error('Error loading performance data:', error)
  }
}

function calculateTotalMetric(item, metric) {
  if (!item.metrics?.channelMetrics) return 0
  
  return item.metrics.channelMetrics.reduce((total, channelMetric) => {
    return total + (channelMetric[metric] || 0)
  }, 0)
}

function getProductName(productIds) {
  if (!productIds || productIds.length === 0) return t('noProduct', language.value)
  
  const productNames = productIds.map(id => {
    const product = products.value?.find(p => p.id === id)
    return product?.name || t('unknownProduct', language.value)
  })
  
  return productNames.join(', ')
}

function formatNumber(number) {
  if (typeof number !== 'number') return '0'
  
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K'
  }
  return number.toLocaleString()
}

function formatDate(date) {
  if (!date) return 'N/A'
  if (typeof date === 'string') return new Date(date).toLocaleDateString()
  return date.toLocaleDateString()
}
</script>
