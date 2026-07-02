// Diary Service
// Handles diary-related API operations (food entries, daily logs, etc.)

class DiaryService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/diary';
  }

  /**
   * Get diary entries for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} Array of diary entries
   */
  async getEntriesByDate(date) {
    try {
      return await this.apiClient.get(`${this.endpoint}/date/${date}`);
    } catch (error) {
      console.error('Failed to fetch diary entries:', error);
      throw error;
    }
  }

  /**
   * Get all diary entries for a user
   * @param {object} params - Query parameters (page, limit, startDate, endDate)
   * @returns {Promise} Paginated diary entries
   */
  async getAllEntries(params = {}) {
    try {
      return await this.apiClient.get(this.endpoint, { params });
    } catch (error) {
      console.error('Failed to fetch all diary entries:', error);
      throw error;
    }
  }

  /**
   * Create a new diary entry
   * @param {object} entryData - Diary entry data
   * @returns {Promise} Created diary entry
   */
  async createEntry(entryData) {
    try {
      return await this.apiClient.post(this.endpoint, entryData);
    } catch (error) {
      console.error('Failed to create diary entry:', error);
      throw error;
    }
  }

  /**
   * Update a diary entry
   * @param {string} entryId - Diary entry ID
   * @param {object} entryData - Updated entry data
   * @returns {Promise} Updated diary entry
   */
  async updateEntry(entryId, entryData) {
    try {
      return await this.apiClient.put(`${this.endpoint}/${entryId}`, entryData);
    } catch (error) {
      console.error('Failed to update diary entry:', error);
      throw error;
    }
  }

  /**
   * Delete a diary entry
   * @param {string} entryId - Diary entry ID
   * @returns {Promise} Deletion confirmation
   */
  async deleteEntry(entryId) {
    try {
      return await this.apiClient.delete(`${this.endpoint}/${entryId}`);
    } catch (error) {
      console.error('Failed to delete diary entry:', error);
      throw error;
    }
  }

  /**
   * Get daily summary statistics
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} Daily statistics (calories, macros, etc.)
   */
  async getDailySummary(date) {
    try {
      return await this.apiClient.get(`${this.endpoint}/summary/${date}`);
    } catch (error) {
      console.error('Failed to fetch daily summary:', error);
      throw error;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DiaryService;
}
