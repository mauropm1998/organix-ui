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
    <DashboardStats :draftStats="draftStats" :contentStats="contentStats" :t="t" :language="language" />
    <DashboardRecent :userDrafts="userDrafts" :userContent="userContent" :t="t" :language="language" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DashboardStats from './DashboardStats.vue'
import DashboardRecent from './DashboardRecent.vue'
import { FileText, Video, CheckCircle, PlayCircle } from 'lucide-vue-next'

import { useLanguage } from '../hooks/useLanguage.js'
import { t } from '../translations/index.js'
import { mockUsers, mockDrafts } from '../data/mockData.js'
import { mockContent } from '../data/mockContent.js'

// Simulação de props/usuário para exemplo
const user = mockUsers[0]
const drafts = mockDrafts
const content = mockContent

const { language } = useLanguage()

const userDrafts = computed(() =>
  user.adminType === 'admin' ? drafts : drafts.filter(d => d.creator === user.id)
)
const userContent = computed(() =>
  user.adminType === 'admin' ? content : content.filter(c => c.creator === user.id || c.producer === user.id)
)
const draftStats = computed(() => ({
  total: userDrafts.value.length,
  approved: userDrafts.value.filter(d => d.status === 'approved').length,
  pending: userDrafts.value.filter(d => d.status === 'pending').length,
  rejected: userDrafts.value.filter(d => d.status === 'not approved').length
}))
const contentStats = computed(() => ({
  total: userContent.value.length,
  inProduction: userContent.value.filter(c => c.status === 'in-production').length,
  pending: userContent.value.filter(c => c.status === 'pending').length,
  posted: userContent.value.filter(c => c.status === 'posted').length,
  finished: userContent.value.filter(c => c.status === 'finished').length
}))
</script>
