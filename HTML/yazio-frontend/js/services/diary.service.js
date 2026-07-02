/**
 * Diary & Meal Service
 * Handle meal logging and diary operations
 */

class DiaryService {
    /**
     * Get diary for specific date
     * @param {number} userId - User ID
     * @param {string} date - Date (YYYY-MM-DD)
     */
    static async getDiary(userId, date) {
        try {
            const url = API_CONFIG.ENDPOINTS.DIARY.GET_DIARY
                .replace(':userId', userId);
            
            const params = { date };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'DiaryService.getDiary');
            throw errorData;
        }
    }

    /**
     * Get meals within date range
     * @param {number} userId - User ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     */
    static async getMeals(userId, startDate, endDate) {
        try {
            const url = API_CONFIG.ENDPOINTS.DIARY.GET_MEALS
                .replace(':userId', userId);
            
            const params = { startDate, endDate };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'DiaryService.getMeals');
            throw errorData;
        }
    }

    /**
     * Get meal logs within date range
     * @param {number} userId - User ID
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     */
    static async getMealLogs(userId, startDate, endDate) {
        try {
            const url = API_CONFIG.ENDPOINTS.DIARY.GET_MEAL_LOGS
                .replace(':userId', userId);
            
            const params = { startDate, endDate };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'DiaryService.getMealLogs');
            throw errorData;
        }
    }

    /**
     * Add food to meal
     * @param {number} userId - User ID
     * @param {string} mealType - Meal type (breakfast, lunch, dinner, snack)
     * @param {Object} mealLogData - Meal log data
     * @param {string} date - Date (optional, defaults to today)
     */
    static async addFoodToMeal(userId, mealType, mealLogData, date = null) {
        try {
            const url = API_CONFIG.ENDPOINTS.DIARY.ADD_MEAL
                .replace(':userId', userId)
                .replace(':mealType', mealType);
            
            const params = date ? { date } : {};

            ApiErrorHandler.logRequest('POST', url, mealLogData);
            
            const response = await axiosClient.post(url, mealLogData, { params });

            ApiErrorHandler.logResponse('POST', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'DiaryService.addFoodToMeal');
            throw errorData;
        }
    }

    /**
     * Update meal log
     * @param {number} mealLogId - Meal log ID
     * @param {Object} updates - Update data
     */
    static async updateMealLog(mealLogId, updates) {
        try {
            const url = API_CONFIG.ENDPOINTS.DIARY.UPDATE_MEAL_LOG
                .replace(':id', mealLogId);

            ApiErrorHandler.logRequest('PUT', url, updates);
            
            const response = await axiosClient.put(url, updates);

            ApiErrorHandler.logResponse('PUT', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'DiaryService.updateMealLog');
            throw errorData;
        }
    }

    /**
     * Delete meal log
     * @param {number} mealLogId - Meal log ID
     */
    static async deleteMealLog(mealLogId) {
        try {
            const url = API_CONFIG.ENDPOINTS.DIARY.DELETE_MEAL_LOG
                .replace(':id', mealLogId);

            ApiErrorHandler.logRequest('DELETE', url);
            
            const response = await axiosClient.delete(url);

            ApiErrorHandler.logResponse('DELETE', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'DiaryService.deleteMealLog');
            throw errorData;
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiaryService;
}
