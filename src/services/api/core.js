const API_BASE_URL = 'https://bizera-app-production.up.railway.app/api'

/**
 * Generic API request function
 */
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    method: options.method || 'GET',
    ...options,
    credentials: 'include', // Include cookies in requests (for cookie-based auth)
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  // Debug: Log request details (only for login to verify cookie is sent)
  if (endpoint.includes('/Auth/login')) {
    console.log(`🔐 Login Request: ${config.method} ${endpoint}`, {
      credentials: config.credentials,
      hasBody: !!options.body
    })
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, config)
    
    // Debug: Log response status (only for login to verify cookie is set)
    if (endpoint.includes('/Auth/login')) {
      const setCookieHeader = response.headers.get('set-cookie')
      const allowCredentials = response.headers.get('access-control-allow-credentials')
      const allowOrigin = response.headers.get('access-control-allow-origin')
      
      console.log(`🔐 Login Response: ${endpoint}`, {
        status: response.status,
        ok: response.ok,
        'set-cookie': setCookieHeader ? '✅ Cookie set edildi' : '❌ Cookie set edilmədi',
        'access-control-allow-credentials': allowCredentials ? '✅' : '❌',
        'access-control-allow-origin': allowOrigin || '❌'
      })
      
      // Login zamanı cookie-nin set edildiyini yoxla
      if (response.ok) {
        if (!setCookieHeader) {
          console.warn('⚠️ WARNING: Login zamanı cookie set edilmədi!')
        } else {
          console.log('✅ Login uğurlu - cookie set edildi')
        }
      }
    }
    
    // Handle non-JSON responses (text/plain for Contacts and CountryCodes)
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
    } else if (contentType && contentType.includes('text/plain')) {
      // Handle text/plain responses (Contacts and CountryCodes)
      try {
        const text = await response.text()
        if (text) {
          try {
            // Try to parse as JSON
            data = JSON.parse(text)
          } catch (parseError) {
            // If not JSON, return as string
            data = text
          }
        }
      } catch (e) {
        console.error('Error reading text response:', e)
      }
    } else {
      // Try to get text response for debugging
      try {
        const text = await response.text()
        if (text) {
          try {
            data = JSON.parse(text)
          } catch (parseError) {
            data = text
          }
        }
      } catch (e) {
        // Ignore
      }
    }

    if (!response.ok) {
      // For 401 errors, provide more specific message
      if (response.status === 401) {
        const errorMessage = data?.message || data?.error || data?.title || 'Giriş vaxtı bitib və ya cookie yoxdur. Zəhmət olmasa yenidən daxil olun.'
        console.error('❌ 401 Unauthorized:', {
          endpoint,
          cookies: document.cookie ? 'Cookie-lər var' : 'Cookie yoxdur',
          hasCredentials: config.credentials === 'include' ? '✅' : '❌'
        })
        throw new Error(errorMessage)
      }
      
      const errorMessage = data?.message || data?.error || data?.title || `HTTP error! status: ${response.status}`
      throw new Error(errorMessage)
    }

    // Return response data (can be null if no data returned)
    return { data: data || null, status: response.status }
  } catch (error) {
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

export default apiRequest

