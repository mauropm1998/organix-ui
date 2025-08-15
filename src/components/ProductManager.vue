<template>
  <div class="space-y-6">
    <!-- Access Restriction Check -->
    <div v-if="currentUser?.adminType !== 'ADMIN'" class="text-center py-12">
      <Package class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ t('accessRestricted', language) }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('onlyAdminsProducts', language) }}
      </p>
    </div>

    <!-- Admin Content -->
    <div v-else>
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('products', language) }}</h2>
        <button 
          @click="showForm = true" 
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus class="w-4 h-4 mr-2" />
          {{ t('newProduct', language) }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
          <!-- Skeleton Image Area -->
          <div class="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <div class="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
          <!-- Skeleton Content -->
          <div class="p-4">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div class="flex justify-end space-x-2 mt-4">
              <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <!-- Product Form -->
        <div v-if="showForm" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ editingProduct ? t('editProduct', language) : t('createNewProduct', language) }}
          </h3>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('productName', language) }}
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                :disabled="isSubmitting"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div class="flex space-x-3">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                <Package v-else class="w-4 h-4" />
                <span>{{ isSubmitting ? (editingProduct ? t('updatingProduct', language) : t('creatingProduct', language)) : (editingProduct ? t('update', language) : t('create', language)) }} {{ isSubmitting ? '' : t('product', language) }}</span>
              </button>
              <button
                type="button"
                @click="handleCancel"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ t('cancel', language) }}
              </button>
            </div>
          </form>
        </div>

        <!-- Products Grid -->
        <div v-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div class="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <Box class="w-16 h-16 text-blue-500 dark:text-blue-400" />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {{ product.name }}
              </h3>
              <div class="flex justify-end space-x-2">
                <button
                  @click="handleEdit(product)"
                  :disabled="isSubmitting || deletingId === product.id"
                  class="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button
                  @click="handleDelete(product)"
                  :disabled="isSubmitting || deletingId === product.id"
                  class="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  :title="t('deleteProduct', language)"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="products.length === 0" class="text-center py-12">
          <Package class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ t('noProductsYet', language) }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ t('getStartedProduct', language) }}
          </p>
          <button
            @click="showForm = true"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus class="w-4 h-4 mr-2" />
            {{ t('createProduct', language) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Product Modal -->
    <DeleteProductModal
      v-if="showDeleteModal"
      :product="productToDelete"
      :is-deleting="deletingId !== null"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Plus, Edit, Trash2, Package, Box, Loader2 } from 'lucide-vue-next'
import { useLanguage } from '../hooks/useLanguage.js'
import { useAuth } from '../hooks/useAuth.js'
import { useData } from '../hooks/useData.js'
import { t } from '../translations/index.js'
import SkeletonLoader from './SkeletonLoader.vue'
import DeleteProductModal from './products/DeleteProductModal.vue'

const { language } = useLanguage()
const { currentUser } = useAuth()
const { 
  products, 
  loadingProducts: loading, 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct: removeProduct 
} = useData()

const showForm = ref(false)
const editingProduct = ref(null)
const isSubmitting = ref(false)
const deletingId = ref(null)
const showDeleteModal = ref(false)
const productToDelete = ref(null)

const formData = ref({
  name: ''
})

// Load products on mount and when user changes
onMounted(async () => {
  if (currentUser.value?.adminType === 'ADMIN') {
    await fetchProducts()
  }
})

// Watch for currentUser changes to load products when user becomes available
watch(currentUser, (newUser) => {
  if (newUser && newUser.adminType === 'ADMIN') {
    fetchProducts()
  }
}, { immediate: true })

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    if (editingProduct.value) {
      await updateProduct(editingProduct.value.id, formData.value)
    } else {
      await createProduct(formData.value)
    }
    
    handleCancel()
  } catch (error) {
    console.error('Error saving product:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleEdit = (product) => {
  editingProduct.value = product
  formData.value = {
    name: product.name
  }
  showForm.value = true
}

const handleCancel = () => {
  showForm.value = false
  editingProduct.value = null
  formData.value = { name: '' }
}

const handleDelete = async (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!productToDelete.value) return
  
  deletingId.value = productToDelete.value.id
  try {
    await removeProduct(productToDelete.value.id)
    showDeleteModal.value = false
    productToDelete.value = null
  } catch (error) {
    console.error('Error deleting product:', error)
  } finally {
    deletingId.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  productToDelete.value = null
}
</script>
