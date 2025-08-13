
<template>
  <div class="space-y-6 w-full mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('calendar', language) }}</h2>
      <button class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-base font-semibold" @click="showFilters = !showFilters">
        <lucide-filter class="w-4 h-4 mr-2" />
        {{ t('filters', language) }}
      </button>
    </div>

    <!-- Filtros -->
    <div v-if="showFilters" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('filters', language) }}</h3>
        <button @click="clearFilters" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">{{ t('clearAll', language) }}</button>
      </div>
      <CalendarFilters :filters="filters" :products="products" :channels="channels" :statuses="statuses" :users="users" :t="t" :language="language" />
    </div>

    <!-- Calendar Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <!-- Calendar Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <button @click="prevMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" :aria-label="t('previousMonth', language)">
          <lucide-chevron-left class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ monthLabel }}</h3>
        <button @click="nextMonth" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" :aria-label="t('nextMonth', language)">
          <lucide-chevron-right class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      <!-- Calendar Grid -->
      <div class="p-6">
        <CalendarGrid :days="calendarDays" :products="products" :language="language" @select="openDetail" />
      </div>
    </div>

    <ContentDetailModal v-if="showDetail" :show="showDetail" :content="selectedContent" :product="selectedProduct" :creator="selectedCreator" :producer="selectedProducer" :t="t" :language="language" @close="closeDetail" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguage } from '../hooks/useLanguage.js'
import { t } from '../translations/index.js'
import { mockContent, mockProducts, mockUsers, CHANNELS, CONTENT_STATUSES } from '../data/mockData.js'
import CalendarFilters from './calendar/CalendarFilters.vue'
import CalendarGrid from './calendar/CalendarGrid.vue'
import ContentDetailModal from './calendar/ContentDetailModal.vue'
import { ChevronLeft as LucideChevronLeft, ChevronRight as LucideChevronRight, Filter as LucideFilter } from 'lucide-vue-next'

const { language } = useLanguage()
const content = ref([...mockContent])
const products = ref([...mockProducts])
const users = ref([...mockUsers])
const channels = CHANNELS
const statuses = CONTENT_STATUSES

const currentDate = ref(new Date())
const filters = ref({ product: '', channel: '', status: '', user: '' })
const showFilters = ref(false)

const monthLabel = computed(() => {
  return currentDate.value.toLocaleString(language.value === 'pt' ? 'pt-PT' : 'en-US', { month: 'long', year: 'numeric' })
})

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}
function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}
function clearFilters() {
  filters.value = { product: '', channel: '', status: '', user: '' }
}

const filteredContent = computed(() => {
  return content.value.filter(c => {
    if (filters.value.product && c.product !== filters.value.product) return false
    if (filters.value.channel && !(c.channels || []).includes(filters.value.channel)) return false
    if (filters.value.status && c.status !== filters.value.status) return false
    if (filters.value.user && c.creator !== filters.value.user && c.producer !== filters.value.user) return false
    return true
  })
})

function getDaysInMonth(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dayDate = new Date(year, month, d)
    days.push({
      date: dayDate.toISOString(),
      label: d,
      content: filteredContent.value.filter(c => {
        if (!c.postDate) return false
        const post = new Date(c.postDate)
        return post.getFullYear() === year && post.getMonth() === month && post.getDate() === d
      })
    })
  }
  return days
}

const calendarDays = computed(() => getDaysInMonth(currentDate.value))

const showDetail = ref(false)
const selectedContent = ref(null)
const selectedProduct = ref(null)
const selectedCreator = ref(null)
const selectedProducer = ref(null)

function openDetail(item) {
  selectedContent.value = item
  selectedProduct.value = products.value.find(p => p.id === item.product)
  selectedCreator.value = users.value.find(u => u.id === item.creator)
  selectedProducer.value = users.value.find(u => u.id === item.producer)
  showDetail.value = true
}
function closeDetail() {
  showDetail.value = false
  selectedContent.value = null
  selectedProduct.value = null
  selectedCreator.value = null
  selectedProducer.value = null
}
</script>
