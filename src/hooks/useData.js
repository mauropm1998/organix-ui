import { ref, reactive, computed } from 'vue'
import { 
  userService, 
  productService, 
  draftService, 
  contentService, 
  performanceService,
  companyService,
  channelService 
} from '../services'

// Reactive data stores
const users = ref([])
const products = ref([])
const drafts = ref([])
const content = ref([])
const channels = ref([])
const companyStats = ref(null)
const performanceData = ref(null)

// Loading states
const loading = reactive({
  users: false,
  products: false,
  drafts: false,
  content: false,
  channels: false,
  companyStats: false,
  performance: false
})

// Error states
const errors = reactive({
  users: null,
  products: null,
  drafts: null,
  content: null,
  channels: null,
  companyStats: null,
  performance: null
})

export function useData() {
  // User operations
  const fetchUsers = async () => {
    loading.users = true
    errors.users = null
    try {
      users.value = await userService.getAllUsers()
    } catch (error) {
      errors.users = error.response?.data?.message || 'Erro ao carregar usuários'
      console.error('Error fetching users:', error)
    } finally {
      loading.users = false
    }
  }

  const createUser = async (userData) => {
    try {
      const newUser = await userService.createUser(userData)
      users.value.push(newUser)
      return { success: true, data: newUser }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar usuário'
      return { success: false, error: errorMessage }
    }
  }

  const updateUser = async (userId, userData) => {
    try {
      const updatedUser = await userService.updateUser(userId, userData)
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      return { success: true, data: updatedUser }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar usuário'
      return { success: false, error: errorMessage }
    }
  }

  const deleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId)
      users.value = users.value.filter(u => u.id !== userId)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir usuário'
      return { success: false, error: errorMessage }
    }
  }

  // Product operations
  const fetchProducts = async () => {
    loading.products = true
    errors.products = null
    try {
      products.value = await productService.getAllProducts()
    } catch (error) {
      errors.products = error.response?.data?.message || 'Erro ao carregar produtos'
      console.error('Error fetching products:', error)
    } finally {
      loading.products = false
    }
  }

  const createProduct = async (productData) => {
    try {
      const newProduct = await productService.createProduct(productData)
      products.value.push(newProduct)
      return { success: true, data: newProduct }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar produto'
      return { success: false, error: errorMessage }
    }
  }

  const updateProduct = async (productId, productData) => {
    try {
      const updatedProduct = await productService.updateProduct(productId, productData)
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
      return { success: true, data: updatedProduct }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar produto'
      return { success: false, error: errorMessage }
    }
  }

  const deleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId)
      products.value = products.value.filter(p => p.id !== productId)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir produto'
      return { success: false, error: errorMessage }
    }
  }

  // Draft operations
  const fetchDrafts = async (status = null) => {
    loading.drafts = true
    errors.drafts = null
    try {
      drafts.value = await draftService.getAllDrafts(status)
    } catch (error) {
      errors.drafts = error.response?.data?.message || 'Erro ao carregar rascunhos'
      console.error('Error fetching drafts:', error)
    } finally {
      loading.drafts = false
    }
  }

  const createDraft = async (draftData) => {
    try {
      const newDraft = await draftService.createDraft(draftData)
      drafts.value.push(newDraft)
      return { success: true, data: newDraft }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar rascunho'
      return { success: false, error: errorMessage }
    }
  }

  const updateDraft = async (draftId, draftData) => {
    try {
      const updatedDraft = await draftService.updateDraft(draftId, draftData)
      const index = drafts.value.findIndex(d => d.id === draftId)
      if (index !== -1) {
        drafts.value[index] = updatedDraft
      }
      return { success: true, data: updatedDraft }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar rascunho'
      return { success: false, error: errorMessage }
    }
  }

  const deleteDraft = async (draftId) => {
    try {
      await draftService.deleteDraft(draftId)
      drafts.value = drafts.value.filter(d => d.id !== draftId)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir rascunho'
      return { success: false, error: errorMessage }
    }
  }

  const transformDraftToContent = async (draftId, transformData) => {
    try {
      const newContent = await draftService.transformDraftToContent(draftId, transformData)
      // Remove the draft from the drafts list since it was transformed
      drafts.value = drafts.value.filter(d => d.id !== draftId)
      // Add the new content to the content list if it exists
      if (content.value && Array.isArray(content.value)) {
        content.value.push(newContent)
      }
      return { success: true, data: newContent }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao transformar rascunho em conteúdo'
      return { success: false, error: errorMessage }
    }
  }

  // Content operations
  const fetchContent = async (filters = {}) => {
    loading.content = true
    errors.content = null
    try {
      content.value = await contentService.getAllContent(filters)
    } catch (error) {
      errors.content = error.response?.data?.message || 'Erro ao carregar conteúdo'
      console.error('Error fetching content:', error)
    } finally {
      loading.content = false
    }
  }

  const fetchMyContent = async () => {
    loading.content = true
    errors.content = null
    try {
      content.value = await contentService.getMyContent()
    } catch (error) {
      errors.content = error.response?.data?.message || 'Erro ao carregar meu conteúdo'
      console.error('Error fetching my content:', error)
    } finally {
      loading.content = false
    }
  }

  const getContentById = async (contentId) => {
    try {
      const contentItem = await contentService.getContentById(contentId)
      return { success: true, data: contentItem }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao buscar conteúdo'
      return { success: false, error: errorMessage }
    }
  }

  const createContent = async (contentData) => {
    try {
      const newContent = await contentService.createContent(contentData)
      content.value.push(newContent)
      return { success: true, data: newContent }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar conteúdo'
      return { success: false, error: errorMessage }
    }
  }

  const updateContent = async (contentId, contentData) => {
    try {
      const updatedContent = await contentService.updateContent(contentId, contentData)
      const index = content.value.findIndex(c => c.id === contentId)
      if (index !== -1) {
        content.value[index] = updatedContent
      }
      return { success: true, data: updatedContent }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar conteúdo'
      return { success: false, error: errorMessage }
    }
  }

  const updateContentStatus = async (contentId, status) => {
    try {
      const updatedContent = await contentService.updateContentStatus(contentId, status)
      const index = content.value.findIndex(c => c.id === contentId)
      if (index !== -1) {
        content.value[index] = updatedContent
      }
      return { success: true, data: updatedContent }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar status do conteúdo'
      return { success: false, error: errorMessage }
    }
  }

  const updateContentChannelMetrics = async (contentId, channelMetrics) => {
    try {
      const updatedContent = await contentService.updateContentChannelMetrics(contentId, channelMetrics)
      const index = content.value.findIndex(c => c.id === contentId)
      if (index !== -1) {
        content.value[index] = updatedContent
      }
      return { success: true, data: updatedContent }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar métricas do conteúdo'
      return { success: false, error: errorMessage }
    }
  }

  const deleteContent = async (contentId) => {
    try {
      await contentService.deleteContent(contentId)
      content.value = content.value.filter(c => c.id !== contentId)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir conteúdo'
      return { success: false, error: errorMessage }
    }
  }

  // Performance operations
  const fetchPerformanceData = async (filters = {}) => {
    loading.performance = true
    errors.performance = null
    
    try {
      // Formatear as datas e limpar parâmetros vazios
      const cleanFilters = {}
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate)
        cleanFilters.startDate = startDate.toISOString().split('T')[0]
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate)
        cleanFilters.endDate = endDate.toISOString().split('T')[0]
      }
      
      // Só incluir channel se tiver valor
      if (filters.channel && filters.channel.trim() !== '') {
        cleanFilters.channel = filters.channel.trim()
      }
      
      // Só incluir productId se tiver valor
      if (filters.productId && filters.productId.trim() !== '') {
        cleanFilters.productId = filters.productId.trim()
      }
      
      const topContent = await performanceService.getTopContent(cleanFilters)
      
      // Transformar os dados para o formato esperado pelo componente
      const transformedData = topContent.map(item => ({
        id: item.contentId,
        name: item.contentName,
        type: item.contentType,
        channels: [item.channel],
        productName: item.productName || 'N/A',
        metrics: {
          likes: item.totalLikes,
          comments: item.totalComments,
          shares: item.totalShares,
          clicks: item.totalViews,
          views: item.totalViews
        },
        postDate: item.publishDate,
        performanceScore: item.performanceScore
      }))
      
      performanceData.value = transformedData
      
    } catch (error) {
      performanceData.value = []
      errors.performance = error.response?.data?.message || 'Erro ao carregar dados de performance'
    } finally {
      loading.performance = false
    }
  }

  // Company operations
  const fetchCompanyStats = async () => {
    loading.companyStats = true
    errors.companyStats = null
    try {
      companyStats.value = await companyService.getCompanyStats()
    } catch (error) {
      errors.companyStats = error.response?.data?.message || 'Erro ao carregar estatísticas da empresa'
      console.error('Error fetching company stats:', error)
    } finally {
      loading.companyStats = false
    }
  }

  // Channel operations
  const fetchChannels = async () => {
    loading.channels = true
    errors.channels = null
    try {
      channels.value = await channelService.getAllChannels()
    } catch (error) {
      errors.channels = error.response?.data?.message || 'Erro ao carregar canais'
      console.error('Error fetching channels:', error)
    } finally {
      loading.channels = false
    }
  }

  // Computed values
  const pendingDrafts = computed(() => 
    drafts.value.filter(draft => draft.status === 'PENDING')
  )
  
  const publishedContent = computed(() => 
    content.value.filter(item => item.status === 'POSTED')
  )

  const totalUsers = computed(() => users.value.length)
  const totalProducts = computed(() => products.value.length)
  const totalDrafts = computed(() => drafts.value.length)
  const totalContent = computed(() => content.value.length)

  return {
    // Data
    users,
    products,
    drafts,
    content,
    channels,
    companyStats,
    performanceData,
    
    // Loading states
    loading,
    loadingUsers: computed(() => loading.users),
    loadingProducts: computed(() => loading.products),
    loadingDrafts: computed(() => loading.drafts),
    loadingContent: computed(() => loading.content),
    loadingChannels: computed(() => loading.channels),
    loadingCompanyStats: computed(() => loading.companyStats),
    loadingPerformance: computed(() => loading.performance),
    
    // Error states
    errors,
    
    // User operations
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    
    // Product operations
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Draft operations
    fetchDrafts,
    createDraft,
    updateDraft,
    deleteDraft,
    transformDraftToContent,
    
    // Content operations
    fetchContent,
    fetchMyContent,
    getContentById,
    createContent,
    updateContent,
    updateContentStatus,
    updateContentChannelMetrics,
    deleteContent,
    
    // Performance operations
    fetchPerformanceData,
    
    // Company operations
    fetchCompanyStats,
    
    // Channel operations
    fetchChannels,
    
    // Computed values
    pendingDrafts,
    publishedContent,
    totalUsers,
    totalProducts,
    totalDrafts,
    totalContent
  }
}
