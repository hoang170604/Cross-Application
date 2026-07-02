/**
 * Fasting Service
 * Handle fasting session management
 */

class FastingService {
    /**
     * Start fasting session
     * @param {number} userId - User ID
     * @param {string} startTime - Start time (ISO 8601)
     * @param {number} fastingGoalHours - Goal fasting hours (optional)
     */
    static async startFasting(userId, startTime, fastingGoalHours = null) {
        try {
            const payload = {
                userId,
                startTime,
                fastingGoalHours
            };

            ApiErrorHandler.logRequest('POST', API_CONFIG.ENDPOINTS.FASTING.START, payload);
            
            const response = await axiosClient.post(
                API_CONFIG.ENDPOINTS.FASTING.START,
                payload
            );

            ApiErrorHandler.logResponse('POST', API_CONFIG.ENDPOINTS.FASTING.START, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'FastingService.startFasting');
            throw errorData;
        }
    }

    /**
     * Stop fasting session
     * @param {number} userId - User ID
     * @param {string} endTime - End time (ISO 8601)
     */
    static async stopFasting(userId, endTime) {
        try {
            const payload = {
                userId,
                endTime
            };

            ApiErrorHandler.logRequest('POST', API_CONFIG.ENDPOINTS.FASTING.STOP, payload);
            
            const response = await axiosClient.post(
                API_CONFIG.ENDPOINTS.FASTING.STOP,
                payload
            );

            ApiErrorHandler.logResponse('POST', API_CONFIG.ENDPOINTS.FASTING.STOP, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'FastingService.stopFasting');
            throw errorData;
        }
    }

    /**
     * Get all fasting sessions for user
     * @param {number} userId - User ID
     */
    static async getFastingSessions(userId) {
        try {
            const url = API_CONFIG.ENDPOINTS.FASTING.GET_SESSIONS
                .replace(':userId', userId);

            ApiErrorHandler.logRequest('GET', url);
            
            const response = await axiosClient.get(url);

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'FastingService.getFastingSessions');
            throw errorData;
        }
    }

    /**
     * Get open fasting session
     * @param {number} userId - User ID
     */
    static async getOpenSession(userId) {
        try {
            const url = API_CONFIG.ENDPOINTS.FASTING.GET_OPEN_SESSION
                .replace(':userId', userId);

            ApiErrorHandler.logRequest('GET', url);
            
            const response = await axiosClient.get(url);

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'FastingService.getOpenSession');
            // Don't throw - it's okay if there's no open session
            return { data: null };
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FastingService;
}
