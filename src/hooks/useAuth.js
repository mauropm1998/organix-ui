import { ref, reactive, computed } from 'vue'
import { authService } from '../services'

const currentUser = ref(null)
const isAuthenticated = computed(() => !!currentUser.value)

// Load user from localStorage on app start
const storedUser = localStorage.getItem('user_data')
if (storedUser) {
  try {
    currentUser.value = JSON.parse(storedUser)
  } catch (e) {
    localStorage.removeItem('user_data')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }
}

export function useAuth() {
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      
      // Store tokens
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('refresh_token', response.refreshToken)
      
      // Store user data
      const userData = {
        ...response.user,
        companyName: response.company.name
      }
      
      currentUser.value = userData
      localStorage.setItem('user_data', JSON.stringify(userData))
      
      return { success: true, user: userData }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login'
      return { success: false, error: errorMessage }
    }
  }

  const signup = async (signupData) => {
    try {
      const response = await authService.signup(signupData)
      
      // Store tokens
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('refresh_token', response.refreshToken)
      
      // Store user data
      const userData = {
        ...response.user,
        companyName: response.company.name
      }
      
      currentUser.value = userData
      localStorage.setItem('user_data', JSON.stringify(userData))
      
      return { success: true, user: userData }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar conta'
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('user_data')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    signup,
    logout
  }
}
