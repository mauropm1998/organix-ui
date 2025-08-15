<template>
  <div class="animate-pulse">
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" class="bg-gray-200 dark:bg-gray-700 rounded-lg p-6">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- List Item Skeleton -->
    <div v-else-if="type === 'list-item'" class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600">
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div class="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    </div>

    <!-- Performance Table Skeleton -->
    <div v-else-if="type === 'performance-table'" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <!-- Table Header -->
      <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
      
      <!-- Table Structure -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left">
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              </th>
              <th class="px-6 py-3 text-left">
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </th>
              <th class="px-6 py-3 text-left">
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </th>
              <th class="px-6 py-3 text-left">
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
              </th>
              <th class="px-6 py-3 text-left">
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </th>
              <th class="px-6 py-3 text-left">
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </th>
              <th class="px-6 py-3 text-left">
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
              </th>
              <th class="px-6 py-3 text-left">
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Skeleton Rows -->
            <tr v-for="i in 5" :key="i" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="space-y-2">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <div class="h-6 bg-blue-100 dark:bg-blue-900 rounded w-16"></div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Table Row Skeleton -->
    <div v-else-if="type === 'table-row'" class="grid grid-cols-4 gap-4 py-4 border-b border-gray-100 dark:border-gray-600">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>

    <!-- Text Skeleton -->
    <div v-else-if="type === 'text'" class="space-y-2">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
    </div>

    <!-- Button Skeleton -->
    <div v-else-if="type === 'button'" 
         :class="[
           'bg-gray-200 dark:bg-gray-700 rounded',
           size === 'sm' ? 'h-8 w-20' : size === 'lg' ? 'h-12 w-32' : 'h-10 w-24'
         ]">
    </div>

    <!-- Avatar Skeleton -->
    <div v-else-if="type === 'avatar'" 
         :class="[
           'bg-gray-200 dark:bg-gray-700 rounded-full',
           size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'
         ]">
    </div>

    <!-- Custom Rectangle -->
    <div v-else 
         :class="[
           'bg-gray-200 dark:bg-gray-700 rounded',
           customClass || 'h-4 w-full'
         ]">
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'rectangle',
    validator: (value) => [
      'card', 'list-item', 'table-row', 'performance-table', 'text', 'button', 'avatar', 'rectangle'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  customClass: {
    type: String,
    default: ''
  }
})
</script>
