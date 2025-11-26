/**
 * User data storage utilities
 * Handles storing and retrieving user data from localStorage
 */

const USER_DATA_KEY = 'bizera_user_data'

/**
 * Save user data to localStorage
 * @param {Object} userData - User data object
 */
export const saveUserData = (userData) => {
  try {
    const dataToSave = {
      name: userData.name || '',
      surname: userData.surname || '',
      fullName: userData.fullName || `${userData.name || ''} ${userData.surname || ''}`.trim(),
      email: userData.email || '',
      phoneNumber: userData.phoneNumber || '',
      birthDate: userData.birthDate || '',
      businessName: userData.businessName || '',
      businessCategory: userData.businessCategory || '',
      role: userData.role || 'Admin', // Default role
      ...userData
    }
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(dataToSave))
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

/**
 * Get user data from localStorage
 * @returns {Object|null} User data object or null if not found
 */
export const getUserData = () => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY)
    if (!data) return null
    return JSON.parse(data)
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

/**
 * Clear user data from localStorage
 */
export const clearUserData = () => {
  try {
    localStorage.removeItem(USER_DATA_KEY)
  } catch (error) {
    console.error('Error clearing user data:', error)
  }
}

/**
 * Update specific user data fields
 * @param {Object} updates - Partial user data object to update
 */
export const updateUserData = (updates) => {
  try {
    const currentData = getUserData() || {}
    const updatedData = { ...currentData, ...updates }
    saveUserData(updatedData)
  } catch (error) {
    console.error('Error updating user data:', error)
  }
}

