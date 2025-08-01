<template>
  <div class="calendar-container">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ t('calendar.title') }}</h2>
      <div class="flex gap-2">
        <button
          @click="previousMonth"
          class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <button
          @click="nextMonth"
          class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ currentMonthYear }}
        </h3>
      </div>

      <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-600">
        <div
          v-for="day in weekDays"
          :key="day"
          class="bg-gray-50 dark:bg-gray-700 p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-300"
        >
          {{ day }}
        </div>

        <div
          v-for="date in calendarDates"
          :key="`${date.date}-${date.month}`"
          class="bg-white dark:bg-gray-800 min-h-[120px] p-2 relative"
          :class="{
            'opacity-50': !date.isCurrentMonth,
            'bg-blue-50 dark:bg-blue-900/20': date.isToday
          }"
        >
          <div class="text-sm font-medium text-gray-800 dark:text-white mb-2">
            {{ date.date }}
          </div>
          
          <div class="space-y-1">
            <div
              v-for="content in getContentForDate(date.fullDate)"
              :key="content.id"
              class="text-xs p-1 rounded truncate"
              :class="getContentStatusClass(content.status)"
              :title="content.name"
            >
              {{ content.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useLanguage } from '../composables/useLanguage.js'
import { useData } from '../composables/useData.js'

const { t } = useLanguage()
const { content } = useData()

const currentDate = ref(new Date())

const weekDays = computed(() => [
  t('calendar.days.sun'),
  t('calendar.days.mon'),
  t('calendar.days.tue'),
  t('calendar.days.wed'),
  t('calendar.days.thu'),
  t('calendar.days.fri'),
  t('calendar.days.sat')
])

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  })
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const dates = []
  const today = new Date()
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    dates.push({
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      fullDate: date.toISOString().split('T')[0],
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString()
    })
  }
  
  return dates
})

const getContentForDate = (date) => {
  return content.value.filter(item => {
    if (!item.postDate) return false
    const postDate = new Date(item.postDate).toISOString().split('T')[0]
    return postDate === date
  })
}

const getContentStatusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'in-production': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'posted': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'canceled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    'finished': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
}

const previousMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

onMounted(() => {
  // Component mounted
})
</script>

<style scoped>
.calendar-container {
  @apply p-6;
}
</style>