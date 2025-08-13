<template>
  <div class="space-y-6">
    <div v-if="user.adminType !== 'admin'" class="text-center py-12">
      <lucide-package class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('accessRestricted', language) }}</h3>
      <p class="text-gray-600 dark:text-gray-400">{{ t('onlyAdminsProducts', language) }}</p>
    </div>
    <template v-else>
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('products', language) }}</h2>
        <button @click="showForm = true" class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <lucide-plus class="w-4 h-4 mr-2" />
          {{ t('newProduct', language) }}
        </button>
      </div>
      <div v-if="showForm" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ editingProduct ? t('editProduct', language) : t('createNewProduct', language) }}</h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('productName', language) }}</label>
            <input type="text" v-model="formData.name" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" required />
          </div>
          <div class="flex space-x-3">
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">{{ editingProduct ? t('update', language) : t('create', language) }} {{ t('product', language) }}</button>
            <button type="button" @click="handleCancel" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors">{{ t('cancel', language) }}</button>
          </div>
        </form>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in products" :key="product.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <lucide-box class="w-16 h-16 text-blue-500 dark:text-blue-400" />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ product.name }}</h3>
            <div class="flex justify-end space-x-2">
              <button @click="handleEdit(product)" class="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <lucide-edit class="w-4 h-4" />
              </button>
              <button @click="handleDelete(product.id)" class="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete product">
                <lucide-trash-2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="products.length === 0" class="text-center py-12">
        <lucide-package class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('noProductsYet', language) }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('getStartedProduct', language) }}</p>
        <button @click="showForm = true" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <lucide-plus class="w-4 h-4 mr-2" />
          {{ t('createProduct', language) }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLanguage } from '../hooks/useLanguage'
import { t } from '../translations'
import { mockUsers, mockProducts } from '../data/mockData'
import { Plus as LucidePlus, Edit as LucideEdit, Trash2 as LucideTrash2, Package as LucidePackage, Box as LucideBox } from 'lucide-vue-next'

const user = mockUsers[0]
const { language } = useLanguage()
const products = ref([...mockProducts])
const showForm = ref(false)
const editingProduct = ref(null)
const formData = ref({ name: '' })

function handleSubmit() {
  if (editingProduct.value) {
    const idx = products.value.findIndex(p => p.id === editingProduct.value.id)
    if (idx !== -1) {
      products.value[idx] = { ...editingProduct.value, ...formData.value }
    }
    editingProduct.value = null
  } else {
    products.value.push({
      ...formData.value,
      id: Date.now().toString(),
      companyId: user.companyId
    })
  }
  formData.value = { name: '' }
  showForm.value = false
}

function handleEdit(product) {
  editingProduct.value = product
  formData.value = { name: product.name }
  showForm.value = true
}

function handleDelete(id) {
  products.value = products.value.filter(p => p.id !== id)
}

function handleCancel() {
  showForm.value = false
  editingProduct.value = null
  formData.value = { name: '' }
}

const lucidePlus = LucidePlus
const lucideEdit = LucideEdit
const lucideTrash2 = LucideTrash2
const lucidePackage = LucidePackage
const lucideBox = LucideBox
</script>
