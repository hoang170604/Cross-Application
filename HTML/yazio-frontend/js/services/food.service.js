/**
 * Food Service
 * Handle food database operations and meal management
 */

class FoodService {
    /**
     * Get all foods from database
     */
    static async getAllFoods() {
        try {
            ApiErrorHandler.logRequest('GET', API_CONFIG.ENDPOINTS.FOOD.GET_ALL);
            
            const response = await axiosClient.get(
                API_CONFIG.ENDPOINTS.FOOD.GET_ALL
            );

            ApiErrorHandler.logResponse('GET', API_CONFIG.ENDPOINTS.FOOD.GET_ALL, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'FoodService.getAllFoods');
            throw errorData;
        }
    }

    /**
     * Search foods by name
     * @param {string} name - Food name to search
     */
    static async searchFoods(name) {
        try {
            const url = API_CONFIG.ENDPOINTS.FOOD.SEARCH;
            const params = { name };

            ApiErrorHandler.logRequest('GET', url, { params });
            
            const response = await axiosClient.get(url, { params });

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'FoodService.searchFoods');
            throw errorData;
        }
    }

    /**
     * Get all food categories
     */
    static async getFoodCategories() {
        try {
            ApiErrorHandler.logRequest('GET', API_CONFIG.ENDPOINTS.FOOD.GET_CATEGORIES);
            
            const response = await axiosClient.get(
                API_CONFIG.ENDPOINTS.FOOD.GET_CATEGORIES
            );

            ApiErrorHandler.logResponse('GET', API_CONFIG.ENDPOINTS.FOOD.GET_CATEGORIES, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'FoodService.getFoodCategories');
            throw errorData;
        }
    }

    /**
     * Get food by ID
     * @param {number} foodId - Food ID
     */
    static async getFoodById(foodId) {
        try {
            const url = API_CONFIG.ENDPOINTS.FOOD.GET_BY_ID
                .replace(':id', foodId);

            ApiErrorHandler.logRequest('GET', url);
            
            const response = await axiosClient.get(url);

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'FoodService.getFoodById');
            throw errorData;
        }
    }

    /**
     * Create new food (ADMIN only)
     * @param {Object} foodData - Food data
     */
    static async createFood(foodData) {
        try {
            ApiErrorHandler.logRequest('POST', API_CONFIG.ENDPOINTS.FOOD.CREATE, foodData);
            
            const response = await axiosClient.post(
                API_CONFIG.ENDPOINTS.FOOD.CREATE,
                foodData
            );

            ApiErrorHandler.logResponse('POST', API_CONFIG.ENDPOINTS.FOOD.CREATE, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'FoodService.createFood');
            throw errorData;
        }
    }

    /**
     * Update food (ADMIN only)
     * @param {number} foodId - Food ID
     * @param {Object} updates - Update data
     */
    static async updateFood(foodId, updates) {
        try {
            const url = API_CONFIG.ENDPOINTS.FOOD.UPDATE
                .replace(':id', foodId);

            ApiErrorHandler.logRequest('PUT', url, updates);
            
            const response = await axiosClient.put(url, updates);

            ApiErrorHandler.logResponse('PUT', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'FoodService.updateFood');
            throw errorData;
        }
    }

    /**
     * Delete food (ADMIN only)
     * @param {number} foodId - Food ID
     */
    static async deleteFood(foodId) {
        try {
            const url = API_CONFIG.ENDPOINTS.FOOD.DELETE
                .replace(':id', foodId);

            ApiErrorHandler.logRequest('DELETE', url);
            
            const response = await axiosClient.delete(url);

            ApiErrorHandler.logResponse('DELETE', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'FoodService.deleteFood');
            throw errorData;
        }
    }

    /**
     * Add food to meal
     * @param {number} userId - User ID
     * @param {number} mealId - Meal ID
     * @param {number} foodId - Food ID
     * @param {number} weight - Weight in grams
     */
    static async addFoodToMeal(userId, mealId, foodId, weight) {
        try {
            const url = API_CONFIG.ENDPOINTS.FOOD.ADD_TO_MEAL
                .replace(':userId', userId)
                .replace(':mealId', mealId);
            
            const params = {
                foodId: foodId,
                weight: weight
            };

            ApiErrorHandler.logRequest('POST', url, { params });
            
            const response = await axiosClient.post(url, {}, { params });

            ApiErrorHandler.logResponse('POST', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'FoodService.addFoodToMeal');
            throw errorData;
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FoodService;
}
