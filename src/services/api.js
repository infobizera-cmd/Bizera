const API_BASE_URL = 'https://bizera-app-production.up.railway.app/api'

/**
 * Generic API request function
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('bizera_token')
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, config)
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    let data = null
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError)
        const text = await response.text()
        console.error('Response text:', text)
      }
    } else {
      // Try to get text response for debugging
      try {
        const text = await response.text()
        if (text) {
          console.error('Non-JSON response:', text)
        }
      } catch (e) {
        // Ignore
      }
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || data?.title || `HTTP error! status: ${response.status}`
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        data,
        endpoint,
        url
      })
      throw new Error(errorMessage)
    }

    // Return response data (can be null if no data returned)
    return { data: data || null, status: response.status }
  } catch (error) {
    console.error('API Request Error:', {
      error,
      message: error.message,
      endpoint,
      url: `${API_BASE_URL}${endpoint}`
    })
    
    if (error instanceof TypeError) {
      // Network error or CORS issue
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Şəbəkə xətası. Zəhmət olmasa internet bağlantınızı yoxlayın və ya bir az sonra yenidən cəhd edin.')
      }
      throw new Error('Şəbəkə xətası. Zəhmət olmasa bağlantınızı yoxlayın.')
    }
    
    // Re-throw with original message if it's already an Error
    throw error
  }
}

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
}

export default { authAPI }

