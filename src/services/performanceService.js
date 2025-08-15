// Performance metrics API service
import api from './api'

export const performanceService = {
  // Get performance summary with optional filters
  async getPerformanceSummary(filters = {}) {
    const response = await api.get('/api/performance/summary', { params: filters })
    return response.data
  },

  // Get top content by performance
  async getTopContent(filters = {}) {
    const response = await api.get('/api/performance/top-content', { params: filters })
    return response.data
  },

  // Get channel performance
  async getChannelPerformance(filters = {}) {
    const response = await api.get('/api/performance/channel-performance', { params: filters })
    return response.data
  }
}
