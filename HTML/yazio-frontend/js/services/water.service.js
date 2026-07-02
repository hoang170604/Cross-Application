/**
 * Water Service
 * Handle water intake logging
 */

class WaterService {
    /**
     * Log water intake
     * @param {Object} waterData - { userId, amountMl, timestamp, source, externalId }
     */
    static async logWater(waterData) {
        try {
            ApiErrorHandler.logRequest('POST', API_CONFIG.ENDPOINTS.WATER.LOG, waterData);
            
            const response = await axiosClient.post(
                API_CONFIG.ENDPOINTS.WATER.LOG,
                waterData
            );

            ApiErrorHandler.logResponse('POST', API_CONFIG.ENDPOINTS.WATER.LOG, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'WaterService.logWater');
            throw errorData;
        }
    }

    /**
     * Get daily water total
     * @param {number} userId - User ID
     * @param {string} date - Date (YYYY-MM-DD)
     */
    static async getDailyTotal(userId, date) {
        try {
            const url = API_CONFIG.ENDPOINTS.WATER.GET_DAILY_TOTAL;
            const params = { userId, date };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'WaterService.getDailyTotal');
            throw errorData;
        }
    }

    /**
     * Get water logs within date range
     * @param {number} userId - User ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     */
    static async getLogsBetween(userId, startDate, endDate) {
        try {
            const url = API_CONFIG.ENDPOINTS.WATER.GET_LOGS;
            const params = { userId, startDate, endDate };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'WaterService.getLogsBetween');
            throw errorData;
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WaterService;
}
