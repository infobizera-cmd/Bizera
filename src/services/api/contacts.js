import apiRequest from './core'

/**
 * Contacts API functions
 */
export const contactsAPI = {
  /**
   * Get all contacts
   * @returns {Promise<Object>} Response data with contacts array
   */
  getContacts: async () => {
    return apiRequest('/Contacts', {
      method: 'GET',
    })
  },

  /**
   * Get a contact by ID
   * @param {string} id - Contact UUID
   * @returns {Promise<Object>} Response data with contact
   */
  getContact: async (id) => {
    return apiRequest(`/Contacts/${id}`, {
      method: 'GET',
    })
  },

  /**
   * Create a new contact
   * @param {Object} contactData - Contact data
   * @param {string} contactData.name - Contact name
   * @param {string} contactData.countryCode - Country code
   * @param {string} contactData.phoneNumber - Phone number
   * @param {string} contactData.email - Email address
   * @param {string} contactData.status - Status (Online/Offline)
   * @returns {Promise<Object>} Response data
   */
  createContact: async (contactData) => {
    return apiRequest('/Contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    })
  },

  /**
   * Update a contact
   * @param {string} id - Contact UUID
   * @param {Object} contactData - Updated contact data
   * @param {string} contactData.name - Contact name
   * @param {string} contactData.countryCode - Country code
   * @param {string} contactData.phoneNumber - Phone number
   * @param {string} contactData.email - Email address
   * @param {string} contactData.status - Status (Online/Offline)
   * @returns {Promise<Object>} Response data
   */
  updateContact: async (id, contactData) => {
    return apiRequest(`/Contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    })
  },

  /**
   * Delete a contact
   * @param {string} id - Contact UUID
   * @returns {Promise<Object>} Response data
   */
  deleteContact: async (id) => {
    return apiRequest(`/Contacts/${id}`, {
      method: 'DELETE',
    })
  },

  /**
   * Get contacts statistics
   * @returns {Promise<Object>} Response data with totalContacts
   */
  getStats: async () => {
    return apiRequest('/Contacts/stats', {
      method: 'GET',
    })
  },
}

