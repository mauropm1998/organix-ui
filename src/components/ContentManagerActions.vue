<template>
  <div class="flex space-x-3">
    <button v-if="approvedDrafts.length > 0" @click="$emit('open-transform')" class="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
      <lucide-arrow-right-circle class="w-4 h-4 mr-2" />
  {{ t('transformDraft', language) }}
    </button>
    <button @click="$emit('open-form')" class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
      <lucide-plus class="w-4 h-4 mr-2" />
  {{ t('newContent', language) }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  approvedDrafts: Array,
  t: Function,
  language: String
})
const emit = defineEmits(['open-form', 'open-transform'])
import { Plus as LucidePlus, ArrowRightCircle as LucideArrowRightCircle } from 'lucide-vue-next'
const lucidePlus = LucidePlus
const lucideArrowRightCircle = LucideArrowRightCircle
</script>
