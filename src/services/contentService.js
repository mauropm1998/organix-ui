// Content management API service
import api from './api'

export const contentService = {
  // Get all content with optional filters
  async getAllContent(filters = {}) {
    const params = {}
    if (filters.status) params.status = filters.status
    if (filters.channelId) params.channelId = filters.channelId // Mudou de channel para channelId
    if (filters.productId) params.productId = filters.productId
    if (filters.userId) params.userId = filters.userId
    
    const response = await api.get('/api/content', { params })
    return response.data
  },

  // Get content by ID
  async getContentById(contentId) {
    const response = await api.get(`/api/content/${contentId}`)
    return response.data
  },

  // Get my content
  async getMyContent() {
    const response = await api.get('/api/content/my')
    return response.data
  },

  // Create content
  async createContent(contentData) {
    const response = await api.post('/api/content', contentData)
    return response.data
  },

  // Update content
  async updateContent(contentId, contentData) {
    const response = await api.put(`/api/content/${contentId}`, contentData)
    return response.data
  },

  // Update content status only
  async updateContentStatus(contentId, status) {
    const response = await api.patch(`/api/content/${contentId}/status`, { status })
    return response.data
  },

  // Update content channel metrics
  async updateContentChannelMetrics(contentId, channelMetrics) {
    const response = await api.put(`/api/content/${contentId}/channels/metrics`, { channelMetrics })
    return response.data
  },

  // Delete content
  async deleteContent(contentId) {
    await api.delete(`/api/content/${contentId}`)
  }
}
