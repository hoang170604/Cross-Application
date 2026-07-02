/**
 * Activity Service
 * Handle activity-related API calls (exercises, workouts, calories burned)
 */

class ActivityService {
    /**
     * Get supported activity types
     */
    static async getActivityTypes() {
        try {
            ApiErrorHandler.logRequest('GET', API_CONFIG.ENDPOINTS.ACTIVITIES.GET_TYPES);
            
            const response = await axiosClient.get(
                API_CONFIG.ENDPOINTS.ACTIVITIES.GET_TYPES
            );

            ApiErrorHandler.logResponse('GET', API_CONFIG.ENDPOINTS.ACTIVITIES.GET_TYPES, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'ActivityService.getActivityTypes');
            throw errorData;
        }
    }

    /**
     * Get activity history for a date range
     * @param {number} userId - User ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     */
    static async getActivityHistory(userId, startDate, endDate) {
        try {
            const url = API_CONFIG.ENDPOINTS.ACTIVITIES.GET_HISTORY
                .replace(':userId', userId);
            
            const params = {
                startDate: startDate,
                endDate: endDate
            };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'ActivityService.getActivityHistory');
            throw errorData;
        }
    }

    /**
     * Get daily calories burned
     * @param {number} userId - User ID
     * @param {string} date - Date (YYYY-MM-DD)
     */
    static async getDailyCaloriesBurned(userId, date) {
        try {
            const url = API_CONFIG.ENDPOINTS.ACTIVITIES.GET_DAILY_CALORIES
                .replace(':userId', userId);
            
            const params = { date };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'ActivityService.getDailyCaloriesBurned');
            throw errorData;
        }
    }

    /**
     * Add new activity
     * @param {number} userId - User ID
     * @param {Object} activityData - Activity data
     */
    static async addActivity(userId, activityData) {
        try {
            const url = API_CONFIG.ENDPOINTS.ACTIVITIES.ADD
                .replace(':userId', userId);

            ApiErrorHandler.logRequest('POST', url, activityData);
            
            const response = await axiosClient.post(url, activityData);

            ApiErrorHandler.logResponse('POST', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'ActivityService.addActivity');
            throw errorData;
        }
    }

    /**
     * Update activity
     * @param {number} activityId - Activity ID
     * @param {Object} updates - Data to update
     */
    static async updateActivity(activityId, updates) {
        try {
            const url = API_CONFIG.ENDPOINTS.ACTIVITIES.UPDATE
                .replace(':id', activityId);

            ApiErrorHandler.logRequest('PUT', url, updates);
            
            const response = await axiosClient.put(url, updates);

            ApiErrorHandler.logResponse('PUT', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'ActivityService.updateActivity');
            throw errorData;
        }
    }

    /**
     * Delete activity
     * @param {number} activityId - Activity ID
     */
    static async deleteActivity(activityId) {
        try {
            const url = API_CONFIG.ENDPOINTS.ACTIVITIES.DELETE
                .replace(':id', activityId);

            ApiErrorHandler.logRequest('DELETE', url);
            
            const response = await axiosClient.delete(url);

            ApiErrorHandler.logResponse('DELETE', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'ActivityService.deleteActivity');
            throw errorData;
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ActivityService;
}
