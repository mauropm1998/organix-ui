// Draft management API service
import api from './api'

export const draftService = {
  // Get all drafts with optional status filter
  async getAllDrafts(status = null) {
    const params = status ? { status } : {}
    const response = await api.get('/api/drafts', { params })
    return response.data
  },

  // Get draft by ID
  async getDraftById(draftId) {
    const response = await api.get(`/api/drafts/${draftId}`)
    return response.data
  },

  // Create draft
  async createDraft(draftData) {
    const response = await api.post('/api/drafts', draftData)
    return response.data
  },

  // Update draft
  async updateDraft(draftId, draftData) {
    const response = await api.put(`/api/drafts/${draftId}`, draftData)
    return response.data
  },

  // Delete draft
  async deleteDraft(draftId) {
    await api.delete(`/api/drafts/${draftId}`)
  },

  // Transform draft to content
  async transformDraftToContent(draftId, transformData) {
    const response = await api.post(`/api/content/transform-draft/${draftId}`, transformData)
    return response.data
  }
}
