// Channel management API service
import api from './api'

export const channelService = {
  // Get all channels
  async getAllChannels() {
    const response = await api.get('/api/channels')
    return response.data
  }
}
