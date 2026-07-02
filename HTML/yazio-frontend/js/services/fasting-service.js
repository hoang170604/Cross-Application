// Fasting Service
// Handles fasting-related API operations (fasting sessions, timers, etc.)

class FastingService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.endpoint = '/fasting';
  }

  /**
   * Get current fasting session
   * @returns {Promise} Current fasting session data
   */
  async getCurrentSession() {
    try {
      return await this.apiClient.get(`${this.endpoint}/current`);
    } catch (error) {
      console.error('Failed to fetch current fasting session:', error);
      throw error;
    }
  }

  /**
   * Start a new fasting session
   * @param {object} sessionData - Fasting session configuration
   * @returns {Promise} Created fasting session
   */
  async startSession(sessionData) {
    try {
      return await this.apiClient.post(`${this.endpoint}/start`, sessionData);
    } catch (error) {
      console.error('Failed to start fasting session:', error);
      throw error;
    }
  }

  /**
   * End current fasting session
   * @returns {Promise} Completed fasting session data
   */
  async endSession() {
    try {
      return await this.apiClient.post(`${this.endpoint}/end`);
    } catch (error) {
      console.error('Failed to end fasting session:', error);
      throw error;
    }
  }

  /**
   * Get fasting history
   * @param {object} params - Query parameters (page, limit, startDate, endDate)
   * @returns {Promise} Paginated fasting sessions
   */
  async getHistory(params = {}) {
    try {
      return await this.apiClient.get(`${this.endpoint}/history`, { params });
    } catch (error) {
      console.error('Failed to fetch fasting history:', error);
      throw error;
    }
  }

  /**
   * Get fasting statistics
   * @param {string} period - Time period (day, week, month, year)
   * @returns {Promise} Fasting statistics
   */
  async getStatistics(period = 'week') {
    try {
      return await this.apiClient.get(`${this.endpoint}/statistics/${period}`);
    } catch (error) {
      console.error('Failed to fetch fasting statistics:', error);
      throw error;
    }
  }

  /**
   * Get fasting windows/schedules
   * @returns {Promise} User's fasting windows
   */
  async getFastingWindows() {
    try {
      return await this.apiClient.get(`${this.endpoint}/windows`);
    } catch (error) {
      console.error('Failed to fetch fasting windows:', error);
      throw error;
    }
  }

  /**
   * Create or update fasting window
   * @param {object} windowData - Fasting window configuration
   * @returns {Promise} Created/updated fasting window
   */
  async saveFastingWindow(windowData) {
    try {
      return await this.apiClient.post(`${this.endpoint}/windows`, windowData);
    } catch (error) {
      console.error('Failed to save fasting window:', error);
      throw error;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FastingService;
}
