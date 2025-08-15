// User management API service
import api from './api'

export const userService = {
  // Get all users (admin only)
  async getAllUsers() {
    const response = await api.get('/api/users')
    return response.data
  },

  // Create user (admin only)
  async createUser(userData) {
    const response = await api.post('/api/users', userData)
    return response.data
  },

  // Update user
  async updateUser(userId, userData) {
    const response = await api.put(`/api/users/${userId}`, userData)
    return response.data
  },

  // Delete user
  async deleteUser(userId) {
    await api.delete(`/api/users/${userId}`)
  }
}
