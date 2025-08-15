<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('dashboard', language) }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('welcomeBack', language) }}, {{ user.name }}! {{ t('contentOverview', language) }}
      </p>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading.companyStats || loading.drafts || loading.content" class="space-y-8">
      <!-- Stats skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonLoader type="card" v-for="i in 4" :key="i" />
      </div>
      
      <!-- Recent content skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <SkeletonLoader customClass="h-6 w-32" />
          </div>
          <div class="p-6 space-y-4">
            <SkeletonLoader type="list-item" v-for="i in 5" :key="i" />
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <SkeletonLoader customClass="h-6 w-32" />
          </div>
          <div class="p-6 space-y-4">
            <SkeletonLoader type="list-item" v-for="i in 5" :key="i" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="errors.companyStats || errors.drafts || errors.content" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">{{ t('errorLoadingData', language) }}</p>
    </div>
    
    <!-- Dashboard content -->
    <div v-else class="space-y-8">
      <DashboardStats :draftStats="draftStats" :contentStats="contentStats" :t="t" :language="language" />
      <DashboardRecent :userDrafts="userDrafts" :userContent="userContent" :t="t" :language="language" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import DashboardStats from './dashboard/DashboardStats.vue'
import DashboardRecent from './dashboard/DashboardRecent.vue'
import SkeletonLoader from './SkeletonLoader.vue'

import { useLanguage } from '../hooks/useLanguage.js'
import { useAuth } from '../hooks/useAuth.js'
import { useData } from '../hooks/useData.js'
import { t } from '../translations/index.js'

const { language } = useLanguage()
const { currentUser: user } = useAuth()
const { 
  drafts, 
  content, 
  companyStats, 
  loading, 
  errors,
  fetchDrafts, 
  fetchContent, 
  fetchCompanyStats 
} = useData()

// Load data on component mount
onMounted(async () => {
  await Promise.all([
    fetchDrafts(),
    fetchContent(),
    fetchCompanyStats()
  ])
})

// Computed values for user-specific data
const userDrafts = computed(() => {
  if (!drafts.value || !user.value) return []
  
  // Admins see all drafts, operators see only their own
  if (user.value.adminType === 'ADMIN') {
    return drafts.value
  } else {
    return drafts.value.filter(d => d.creatorId === user.value.id)
  }
})

const userContent = computed(() => {
  if (!content.value || !user.value) return []
  
  // Admins see all content, operators see only their own
  if (user.value.adminType === 'ADMIN') {
    return content.value
  } else {
    return content.value.filter(c => 
      c.creatorId === user.value.id || c.producerId === user.value.id
    )
  }
})

const draftStats = computed(() => ({
  total: userDrafts.value.length,
  approved: userDrafts.value.filter(d => d.status === 'APPROVED').length,
  pending: userDrafts.value.filter(d => d.status === 'PENDING').length,
  rejected: userDrafts.value.filter(d => d.status === 'NOT_APPROVED').length
}))

const contentStats = computed(() => ({
  total: userContent.value.length,
  inProduction: userContent.value.filter(c => c.status === 'IN_PRODUCTION').length,
  pending: userContent.value.filter(c => c.status === 'PENDING').length,
  posted: userContent.value.filter(c => c.status === 'POSTED').length,
  finished: userContent.value.filter(c => c.status === 'FINISHED').length
}))
</script>
