/**
 * API Services - Centralized export
 * 
 * This file exports all API services for easy importing throughout the application.
 * Each API service is organized by feature/page.
 */

// Auth API (Login, Register, Logout, Check)
export { authAPI } from './auth'

// Contacts API (Customers page)
export { contactsAPI } from './contacts'

// Dashboard API (Dashboard page)
export { dashboardAPI } from './dashboard'

// Product Stock API (Products page)
export { productStockAPI } from './productStock'

// Todo API (Tasks page)
export { todoAPI } from './todo'

// Country Codes API (Customers page - phone number dropdown)
export { countryCodesAPI } from './countryCodes'

// Import all APIs for default export
import { authAPI } from './auth'
import { contactsAPI } from './contacts'
import { dashboardAPI } from './dashboard'
import { productStockAPI } from './productStock'
import { todoAPI } from './todo'
import { countryCodesAPI } from './countryCodes'

// Default export with all APIs
export default {
  authAPI,
  contactsAPI,
  dashboardAPI,
  productStockAPI,
  todoAPI,
  countryCodesAPI,
}

