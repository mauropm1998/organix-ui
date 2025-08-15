// Product management API service
import api from './api'

export const productService = {
  // Get all products
  async getAllProducts() {
    const response = await api.get('/api/products')
    return response.data
  },

  // Create product (admin only)
  async createProduct(productData) {
    const response = await api.post('/api/products', productData)
    return response.data
  },

  // Update product
  async updateProduct(productId, productData) {
    const response = await api.put(`/api/products/${productId}`, productData)
    return response.data
  },

  // Delete product
  async deleteProduct(productId) {
    await api.delete(`/api/products/${productId}`)
  }
}
