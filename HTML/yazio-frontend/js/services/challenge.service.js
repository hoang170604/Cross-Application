/**
 * Workout Challenge Service
 * Handle workout challenge management
 */

class WorkoutChallengeService {
    /**
     * Get all workout challenges
     */
    static async getAllChallenges() {
        try {
            ApiErrorHandler.logRequest('GET', API_CONFIG.ENDPOINTS.CHALLENGES.GET_ALL);
            
            const response = await axiosClient.get(
                API_CONFIG.ENDPOINTS.CHALLENGES.GET_ALL
            );

            ApiErrorHandler.logResponse('GET', API_CONFIG.ENDPOINTS.CHALLENGES.GET_ALL, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'WorkoutChallengeService.getAllChallenges');
            throw errorData;
        }
    }

    /**
     * Get user challenges
     * @param {number} userId - User ID
     */
    static async getUserChallenges(userId) {
        try {
            const url = API_CONFIG.ENDPOINTS.CHALLENGES.GET_USER_CHALLENGES
                .replace(':userId', userId);

            ApiErrorHandler.logRequest('GET', url);
            
            const response = await axiosClient.get(url);

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'WorkoutChallengeService.getUserChallenges');
            throw errorData;
        }
    }

    /**
     * Get challenge by ID
     * @param {number} challengeId - Challenge ID
     */
    static async getChallengeById(challengeId) {
        try {
            const url = API_CONFIG.ENDPOINTS.CHALLENGES.GET_BY_ID
                .replace(':id', challengeId);

            ApiErrorHandler.logRequest('GET', url);
            
            const response = await axiosClient.get(url);

            ApiErrorHandler.logResponse('GET', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'WorkoutChallengeService.getChallengeById');
            throw errorData;
        }
    }

    /**
     * Create new workout challenge
     * @param {Object} challengeData - Challenge data
     */
    static async createChallenge(challengeData) {
        try {
            ApiErrorHandler.logRequest('POST', API_CONFIG.ENDPOINTS.CHALLENGES.CREATE, challengeData);
            
            const response = await axiosClient.post(
                API_CONFIG.ENDPOINTS.CHALLENGES.CREATE,
                challengeData
            );

            ApiErrorHandler.logResponse('POST', API_CONFIG.ENDPOINTS.CHALLENGES.CREATE, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'WorkoutChallengeService.createChallenge');
            throw errorData;
        }
    }

    /**
     * Update workout challenge
     * @param {number} challengeId - Challenge ID
     * @param {Object} updates - Update data
     */
    static async updateChallenge(challengeId, updates) {
        try {
            const url = API_CONFIG.ENDPOINTS.CHALLENGES.UPDATE
                .replace(':id', challengeId);

            ApiErrorHandler.logRequest('PUT', url, updates);
            
            const response = await axiosClient.put(url, updates);

            ApiErrorHandler.logResponse('PUT', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'WorkoutChallengeService.updateChallenge');
            throw errorData;
        }
    }

    /**
     * Delete workout challenge
     * @param {number} challengeId - Challenge ID
     */
    static async deleteChallenge(challengeId) {
        try {
            const url = API_CONFIG.ENDPOINTS.CHALLENGES.DELETE
                .replace(':id', challengeId);

            ApiErrorHandler.logRequest('DELETE', url);
            
            const response = await axiosClient.delete(url);

            ApiErrorHandler.logResponse('DELETE', url, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'WorkoutChallengeService.deleteChallenge');
            throw errorData;
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkoutChallengeService;
}
