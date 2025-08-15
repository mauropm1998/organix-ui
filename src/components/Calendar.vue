
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
    <div v-if="showFilters" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
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
        <CalendarGrid :days="calendarDays" :products="products" :language="language" @select="openDetail" @showAll="openContentList" />
      </div>
    </div>

    <ContentDetailModal v-if="showDetail" :show="showDetail" :content="selectedContent" :product="selectedProduct" :creator="selectedCreator" :producer="selectedProducer" :t="t" :language="language" @close="closeDetail" />
    
    <!-- Content List Modal -->
    <div v-if="showContentList" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('contentForDate', language) }}
            </h3>
            <button @click="closeContentList" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <lucide-x class="w-6 h-6" />
            </button>
          </div>
          <div class="space-y-2">
            <div 
              v-for="item in dayContent" 
              :key="item.id"
              @click="selectFromList(item)"
              :class="[
                'p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity border-l-4',
                item.status === 'POSTED' ? 'bg-green-50 border-green-500 dark:bg-green-900/20'
                : item.status === 'IN_PRODUCTION' ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
                : item.status === 'PENDING' ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20'
                : item.status === 'FINISHED' ? 'bg-purple-50 border-purple-500 dark:bg-purple-900/20'
                : 'bg-red-50 border-red-500 dark:bg-red-900/20'
              ]"
            >
              <div class="font-medium text-gray-900 dark:text-white">{{ item.name }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ products.find(p => p.id === item.productId)?.name }}</div>
              <div class="text-xs mt-1">
                <span :class="[
                  'px-2 py-1 rounded-full',
                  item.status === 'POSTED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : item.status === 'IN_PRODUCTION' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : item.status === 'FINISHED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                ]">
                  {{ t(item.status, language) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useLanguage } from '../hooks/useLanguage.js'
import { useData } from '../hooks/useData.js'
import { t } from '../translations/index.js'
import CalendarFilters from './calendar/CalendarFilters.vue'
import CalendarGrid from './calendar/CalendarGrid.vue'
import ContentDetailModal from './calendar/ContentDetailModal.vue'
import { ChevronLeft as LucideChevronLeft, ChevronRight as LucideChevronRight, Filter as LucideFilter, X as LucideX } from 'lucide-vue-next'

const { language } = useLanguage()
const {
  content,
  products,
  users,
  channels,
  fetchContent,
  fetchProducts,
  fetchUsers,
  fetchChannels
} = useData()

const statuses = ['PENDING', 'CANCELED', 'POSTED', 'IN_PRODUCTION', 'FINISHED'] // Show all content statuses in calendar

// Load data on component mount
onMounted(async () => {
  await Promise.all([
    fetchContent(), // Carrega todo conteúdo, filtragem de status será no frontend
    fetchProducts(),
    fetchUsers(),
    fetchChannels()
  ])
})

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

// Watcher para recarregar conteúdo quando filtros mudarem
watch(filters, async () => {
  await loadContentWithFilters()
}, { deep: true })

// Método para carregar conteúdo com filtros
const loadContentWithFilters = async () => {
  const apiFilters = {}
  if (filters.value.status) apiFilters.status = filters.value.status
  if (filters.value.channel) apiFilters.channelId = filters.value.channel // Agora usa channelId
  if (filters.value.product) apiFilters.productId = filters.value.product
  if (filters.value.user) apiFilters.userId = filters.value.user
  
  await fetchContent(apiFilters)
}

const filteredContent = computed(() => {
  // Com a nova API, a filtragem principal é feita no backend
  // Aqui só aplicamos filtros específicos do calendário
  return content.value.filter(c => {
    // Show all content in calendar (removed status restriction)
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
        
        // Handle both array and string date formats
        let postDateObj
        if (Array.isArray(c.postDate)) {
          // Java LocalDateTime array format: [year, month, day, hour, min, sec, nanosec]
          const [y, m, day, hour = 0, min = 0, sec = 0] = c.postDate
          postDateObj = new Date(y, m - 1, day, hour, min, sec) // month is 0-indexed in JS
        } else {
          // String format
          postDateObj = new Date(c.postDate)
        }
        
        return postDateObj.getFullYear() === year && 
               postDateObj.getMonth() === month && 
               postDateObj.getDate() === d
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

const showContentList = ref(false)
const selectedDate = ref(null)
const dayContent = ref([])

function openDetail(item) {
  selectedContent.value = item
  selectedProduct.value = products.value.find(p => p.id === item.productId)
  selectedCreator.value = users.value.find(u => u.id === item.creatorId)
  selectedProducer.value = users.value.find(u => u.id === item.producerId)
  showDetail.value = true
}

function openContentList(contentList, date) {
  dayContent.value = contentList
  selectedDate.value = date
  showContentList.value = true
}

function closeContentList() {
  showContentList.value = false
  dayContent.value = []
  selectedDate.value = null
}

function selectFromList(item) {
  closeContentList()
  openDetail(item)
}
function closeDetail() {
  showDetail.value = false
  selectedContent.value = null
  selectedProduct.value = null
  selectedCreator.value = null
  selectedProducer.value = null
}
</script>
