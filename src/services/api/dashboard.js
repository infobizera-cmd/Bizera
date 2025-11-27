import apiRequest from './core'

/**
 * Dashboard API functions
 */
export const dashboardAPI = {
  /**
   * Get dashboard metrics
   * @returns {Promise<Object>} Response data with metrics
   */
  getMetrics: async () => {
    return apiRequest('/Dashboard/metrics', {
      method: 'GET',
    })
  },

  /**
   * Get sales series data
   * @param {Object} params - Query parameters
   * @param {string} params.from - Start date (ISO format)
   * @param {string} params.to - End date (ISO format)
   * @param {boolean} params.userOnly - Filter by user only (default: false)
   * @returns {Promise<Object>} Response data with sales series
   */
  getSalesSeries: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.from) queryParams.append('from', params.from)
    if (params.to) queryParams.append('to', params.to)
    if (params.userOnly !== undefined) queryParams.append('userOnly', params.userOnly.toString())
    
    const queryString = queryParams.toString()
    const endpoint = `/Dashboard/sales-series${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint, {
      method: 'GET',
    })
  },

  /**
   * Get dashboard accounts
   * @returns {Promise<Object>} Response data with accounts
   */
  getAccounts: async () => {
    return apiRequest('/Dashboard/accounts', {
      method: 'GET',
    })
  },

  /**
   * Get all dashboard accounts
   * @returns {Promise<Object>} Response data with all accounts
   */
  getAllAccounts: async () => {
    return apiRequest('/Dashboard/accounts/all', {
      method: 'GET',
    })
  },
}

