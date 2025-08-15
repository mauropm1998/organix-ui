// Authentication API service
import api from './api'

export const authService = {
  // Login
  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials)
    return response.data
  },

  // Sign up
  async signup(signupData) {
    const response = await api.post('/api/auth/signup', signupData)
    return response.data
  },

  // Refresh token
  async refreshToken() {
    const response = await api.post('/api/auth/refresh')
    return response.data
  }
}
