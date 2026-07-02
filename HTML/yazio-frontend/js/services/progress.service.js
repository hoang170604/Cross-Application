/**
 * Progress Service
 * Handle progress tracking and nutrition reporting
 */

class ProgressService {
    /**
     * Get weight history
     * @param {number} userId - User ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     */
    static async getWeightHistory(userId, startDate, endDate) {
        try {
            const url = API_CONFIG.ENDPOINTS.PROGRESS.GET_WEIGHT_HISTORY;
            const params = { userId, startDate, endDate };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'ProgressService.getWeightHistory');
            throw errorData;
        }
    }

    /**
     * Get nutrition report for date range
     * @param {number} userId - User ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     */
    static async getNutritionReport(userId, startDate, endDate) {
        try {
            const url = API_CONFIG.ENDPOINTS.PROGRESS.GET_NUTRITION_REPORT;
            const params = { userId, startDate, endDate };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'ProgressService.getNutritionReport');
            throw errorData;
        }
    }

    /**
     * Get daily nutrition for specific date
     * @param {number} userId - User ID
     * @param {string} date - Date (YYYY-MM-DD)
     */
    static async getDailyNutrition(userId, date) {
        try {
            const url = API_CONFIG.ENDPOINTS.PROGRESS.GET_DAILY_NUTRITION;
            const params = { userId, date };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'ProgressService.getDailyNutrition');
            throw errorData;
        }
    }

    /**
     * Get nutrition summary
     * @param {number} userId - User ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     */
    static async getNutritionSummary(userId, startDate, endDate) {
        try {
            const url = API_CONFIG.ENDPOINTS.PROGRESS.GET_NUTRITION_SUMMARY;
            const params = { userId, startDate, endDate };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'ProgressService.getNutritionSummary');
            throw errorData;
        }
    }

    /**
     * Get latest weight
     * @param {number} userId - User ID
     */
    static async getLatestWeight(userId) {
        try {
            const url = API_CONFIG.ENDPOINTS.PROGRESS.GET_LATEST_WEIGHT;
            const params = { userId };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'ProgressService.getLatestWeight');
            // Don't throw - it's okay if no weight logged yet
            return { data: null };
        }
    }

    /**
     * Log weight
     * @param {Object} weightData - { userId, weight, date }
     */
    static async logWeight(weightData) {
        try {
            ApiErrorHandler.logRequest('POST', API_CONFIG.ENDPOINTS.PROGRESS.LOG_WEIGHT, weightData);
            
            const response = await axiosClient.post(
                API_CONFIG.ENDPOINTS.PROGRESS.LOG_WEIGHT,
                weightData
            );

            ApiErrorHandler.logResponse('POST', API_CONFIG.ENDPOINTS.PROGRESS.LOG_WEIGHT, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'ProgressService.logWeight');
            throw errorData;
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressService;
}
