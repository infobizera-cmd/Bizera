import apiRequest from './core'

/**
 * Todo API functions
 */
export const todoAPI = {
  /**
   * Get all todos for a user
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Response data with todos
   */
  getTodos: async (userId) => {
    return apiRequest(`/Todo/${userId}`, {
      method: 'GET',
    })
  },

  /**
   * Create a new todo
   * @param {string} userId - User UUID
   * @param {Object} todoData - Todo data
   * @param {string} todoData.title - Todo title
   * @param {string} todoData.date - Todo date (ISO format)
   * @param {string} todoData.startTime - Start time
   * @param {string} todoData.endTime - End time
   * @param {string} todoData.category - Todo category
   * @returns {Promise<Object>} Response data
   */
  createTodo: async (userId, todoData) => {
    return apiRequest(`/Todo/${userId}`, {
      method: 'POST',
      body: JSON.stringify(todoData),
    })
  },

  /**
   * Update a todo
   * @param {number} id - Todo ID
   * @param {string} userId - User UUID
   * @param {Object} todoData - Updated todo data
   * @param {string} todoData.title - Todo title
   * @param {boolean} todoData.isCompleted - Completion status
   * @param {string} todoData.date - Todo date (ISO format)
   * @param {string} todoData.startTime - Start time
   * @param {string} todoData.endTime - End time
   * @param {string} todoData.category - Todo category
   * @returns {Promise<Object>} Response data
   */
  updateTodo: async (id, userId, todoData) => {
    return apiRequest(`/Todo/${id}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(todoData),
    })
  },

  /**
   * Delete a todo
   * @param {number} id - Todo ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Response data
   */
  deleteTodo: async (id, userId) => {
    return apiRequest(`/Todo/${id}/${userId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Get todo statistics for a user
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Response data with statistics
   */
  getStatistics: async (userId) => {
    return apiRequest(`/Todo/statistics/${userId}`, {
      method: 'GET',
    })
  },
}

