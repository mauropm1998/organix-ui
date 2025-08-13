<template>
  <div class="w-full">
    <div class="grid grid-cols-7 gap-1 mb-4">
      <div v-for="weekday in weekDays" :key="weekday" class="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {{ weekday }}
      </div>
    </div>
    <div class="grid grid-cols-7 gap-1">
      <template v-for="cell in calendarCells" :key="cell.key">
        <div :class="[
          'min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col',
          cell.isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900',
          isToday(cell.date) ? 'ring-2 ring-blue-500' : ''
        ]">
          <div :class="[
            'text-sm font-medium mb-2',
            cell.isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600',
            isToday(cell.date) ? 'text-blue-600 dark:text-blue-400' : ''
          ]">{{ cell.label }}</div>
          <div class="space-y-1">
            <template v-for="(item, idx) in cell.content.slice(0, 3)" :key="item.id">
              <div
                @click="$emit('select', item)"
                :class="[
                  'text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate font-medium',
                  item.status === 'posted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : item.status === 'in-production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : item.status === 'finished' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                ]"
                :title="item.name + ' - ' + getProductName(item.product)"
              >
                <div class="truncate font-medium">{{ item.name }}</div>
                <div class="truncate opacity-75">{{ getProductName(item.product) }}</div>
                <div class="truncate opacity-60">{{ t(item.status, props.language) }}</div>
              </div>
            </template>
            <div v-if="cell.content.length > 3" class="text-xs text-gray-500 dark:text-gray-400 text-center">
              +{{ cell.content.length - 3 }} {{ t('more', props.language) }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { t } from '../../translations/index.js'
const props = defineProps({
  days: Array,
  products: Array,
  language: String
})
const emit = defineEmits(['select'])
const weekDays = computed(() => [
  t('sun', props.language),
  t('mon', props.language),
  t('tue', props.language),
  t('wed', props.language),
  t('thu', props.language),
  t('fri', props.language),
  t('sat', props.language)
])

// Calcula células do calendário com dias vazios no início/fim
const calendarCells = computed(() => {
  if (!props.days || props.days.length === 0) return []
  const firstDay = new Date(props.days[0].date)
  const lastDay = new Date(props.days[props.days.length - 1].date)
  const startWeekDay = firstDay.getDay()
  const endWeekDay = lastDay.getDay()
  const cells = []
  // Dias vazios antes do mês
  for (let i = 0; i < startWeekDay; i++) {
    cells.push({ key: 'empty-start-' + i, label: '', content: [], isCurrentMonth: false, date: null })
  }
  // Dias do mês
  for (const d of props.days) {
    cells.push({ key: d.date, label: d.label, content: d.content, isCurrentMonth: true, date: d.date })
  }
  // Dias vazios após o mês
  for (let i = endWeekDay + 1; i < 7; i++) {
    cells.push({ key: 'empty-end-' + i, label: '', content: [], isCurrentMonth: false, date: null })
  }
  return cells
})

function isToday(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

// Busca nome do produto para exibir no card
function getProductName(productId) {
  const p = props.products.find(p => p.id === productId)
  return p ? p.name : ''
}
</script>
