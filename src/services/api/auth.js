import apiRequest from './core'

/**
 * Auth API functions
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Response data
   */
  register: async (userData) => {
    // Convert date to ISO format if it exists
    const payload = {
      ...userData,
      birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString() : null,
    }
    
    return apiRequest('/Auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Response data with token
   */
  login: async (email, password) => {
    return apiRequest('/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  /**
   * Logout user
   * @returns {Promise<Object>} Response data
   */
  logout: async () => {
    return apiRequest('/Auth/logout', {
      method: 'POST',
    })
  },

  /**
   * Check authentication status
   * @returns {Promise<Object>} Response data with authentication status
   */
  check: async () => {
    return apiRequest('/Auth/check', {
      method: 'GET',
    })
  },
}

