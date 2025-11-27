import apiRequest from './core'

/**
 * Country Codes API functions
 */
export const countryCodesAPI = {
  /**
   * Get all country codes
   * @returns {Promise<Object>} Response data with country codes array
   */
  getCountryCodes: async () => {
    try {
      const response = await apiRequest('/CountryCodes', {
        method: 'GET',
      })
      
      // Handle text/plain response type
      if (typeof response === 'string') {
        try {
          return { data: JSON.parse(response) }
        } catch (e) {
          console.error('Failed to parse country codes as JSON:', e)
          return { data: [] }
        }
      }
      
      // Handle array response directly
      if (Array.isArray(response)) {
        return { data: response }
      }
      
      // Handle object with data property
      if (response?.data) {
        return response
      }
      
      return { data: [] }
    } catch (error) {
      console.error('Error in getCountryCodes:', error)
      throw error
    }
  },
}

