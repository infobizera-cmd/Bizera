import apiRequest from './core'

/**
 * Product Stock API functions
 */
export const productStockAPI = {
  /**
   * Get all products
   * @returns {Promise<Object>} Response data with products array
   */
  getProducts: async () => {
    return apiRequest('/ProductStock', {
      method: 'GET',
    })
  },

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @param {string} productData.name - Product name
   * @param {string} productData.category - Product category
   * @param {number} productData.price - Product price
   * @param {number} productData.count - Product count
   * @param {string} productData.availableColors - Available colors (comma-separated or JSON string)
   * @returns {Promise<Object>} Response data
   */
  createProduct: async (productData) => {
    return apiRequest('/ProductStock', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  },

  /**
   * Update a product
   * @param {string} id - Product UUID
   * @param {Object} productData - Updated product data
   * @param {string} productData.name - Product name
   * @param {string} productData.category - Product category
   * @param {number} productData.price - Product price
   * @param {number} productData.count - Product count
   * @param {string} productData.availableColors - Available colors (comma-separated or JSON string)
   * @returns {Promise<Object>} Response data
   */
  updateProduct: async (id, productData) => {
    return apiRequest(`/ProductStock/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  },

  /**
   * Delete a product
   * @param {string} id - Product UUID
   * @returns {Promise<Object>} Response data
   */
  deleteProduct: async (id) => {
    return apiRequest(`/ProductStock/${id}`, {
      method: 'DELETE',
    })
  },
}

