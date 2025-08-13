
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('performance', language) }}</h2>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('filters', language) }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('startDate', language) || 'Start Date' }}
          </label>
          <input
            type="date"
            v-model="dateRange.start"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('endDate', language) || 'End Date' }}
          </label>
          <input
            type="date"
            v-model="dateRange.end"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('channels', language) }}
          </label>
          <select
            v-model="selectedChannel"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ t('allChannels', language) }}</option>
            <option v-for="channel in CHANNELS" :key="channel" :value="channel">{{ channel }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('product', language) }}
          </label>
          <select
            v-model="selectedProduct"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">{{ t('allTypes', language) }}</option>
            <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabela de Performance -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('content', language) }} {{ t('performance', language) }}</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('name', language) }}
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
                  {{ item.type }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span v-for="channel in item.channels" :key="channel" class="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    {{ channel }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-900 dark:text-white">
                    {{ getProductName(item.product) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ (item.metrics?.likes || 0).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ (item.metrics?.comments || 0).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ (item.metrics?.shares || 0).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ (item.metrics?.postClicks || 0).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(item.postDate) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredContent.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">{{ t('noPerformanceData', language) || 'No performance data available for the selected period' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguage } from '../hooks/useLanguage'
import { t } from '../translations'
import { mockUsers, mockProducts } from '../data/mockData'
import { mockContent } from '../data/mockContent'
import { CHANNELS } from '../data/mockData'

const { language } = useLanguage()

// Filtros
const dateRange = ref({
  start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})
const selectedChannel = ref('')
const selectedProduct = ref('')

const products = mockProducts
const users = mockUsers
const content = mockContent

function getProductName(productId) {
  const product = products.find(p => p.id === productId)
  return product ? product.name : 'Unknown'
}

function formatDate(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}

const filteredContent = computed(() => {
  // Simula usuário admin para exibir todos os conteúdos
  const user = users[0] // Admin User
  const userContent = user.adminType === 'admin'
    ? content
    : content.filter(c => c.creator === user.id || c.producer === user.id)

  return userContent.filter(item => {
    const postDate = new Date(item.postDate)
    const startDate = new Date(dateRange.value.start)
    const endDate = new Date(dateRange.value.end)
    if (postDate < startDate || postDate > endDate) return false
    if (selectedChannel.value && !item.channels.includes(selectedChannel.value)) return false
    if (selectedProduct.value && item.product !== selectedProduct.value) return false
    if (item.status !== 'posted' && item.status !== 'finished') return false
    return true
  })
})
</script>
