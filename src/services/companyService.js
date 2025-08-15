// Company and channel management API services
import api from './api'

export const companyService = {
  // Get company info
  async getCompanyInfo() {
    const response = await api.get('/api/company')
    return response.data
  },

  // Update company
  async updateCompany(companyData) {
    const response = await api.put('/api/company', companyData)
    return response.data
  },

  // Get company stats
  async getCompanyStats() {
    const response = await api.get('/api/company/stats')
    return response.data
  }
}

export const channelService = {
  // Get all channels
  async getAllChannels() {
    const response = await api.get('/api/channels')
    return response.data
  }
}
