/**
 * Authentication Service
 * Handle user registration, login, token management
 */

class AuthService {
    /**
     * Register new user
     * @param {Object} userData - { email, password, fullName, ... }
     */
    static async register(userData) {
        try {
            ApiErrorHandler.logRequest('POST', API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
            
            const response = await axiosClient.post(
                API_CONFIG.ENDPOINTS.AUTH.REGISTER,
                userData
            );

            ApiErrorHandler.logResponse('POST', API_CONFIG.ENDPOINTS.AUTH.REGISTER, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'AuthService.register');
            throw errorData;
        }
    }

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     */
    static async login(email, password) {
        try {
            ApiErrorHandler.logRequest('POST', API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email });
            
            const response = await axiosClient.post(
                API_CONFIG.ENDPOINTS.AUTH.LOGIN,
                { email, password }
            );

            ApiErrorHandler.logResponse('POST', API_CONFIG.ENDPOINTS.AUTH.LOGIN, response);

            // Store token and user info
            if (response.data?.token) {
                localStorage.setItem(API_CONFIG.TOKEN_KEY, response.data.token);
            }
            if (response.data?.user) {
                localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(response.data.user));
            }

            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'AuthService.login');
            throw errorData;
        }
    }

    /**
     * Get current user profile
     */
    static async getProfile() {
        try {
            ApiErrorHandler.logRequest('GET', API_CONFIG.ENDPOINTS.USERS.GET_PROFILE);
            
            const response = await axiosClient.get(
                API_CONFIG.ENDPOINTS.USERS.GET_PROFILE
            );

            ApiErrorHandler.logResponse('GET', API_CONFIG.ENDPOINTS.USERS.GET_PROFILE, response);
            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'AuthService.getProfile');
            throw errorData;
        }
    }

    /**
     * Update user profile
     * @param {Object} userData - Profile data to update
     */
    static async updateProfile(userData) {
        try {
            ApiErrorHandler.logRequest('PUT', API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE, userData);
            
            const response = await axiosClient.put(
                API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE,
                userData
            );

            ApiErrorHandler.logResponse('PUT', API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE, response);
            
            // Update stored user info
            if (response.data) {
                localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(response.data));
            }

            return response;
        } catch (error) {
            const errorData = ApiErrorHandler.handleError(error, 'AuthService.updateProfile');
            throw errorData;
        }
    }

    /**
     * Logout user
     */
    static logout() {
        try {
            localStorage.removeItem(API_CONFIG.TOKEN_KEY);
            localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_KEY);
            localStorage.removeItem(API_CONFIG.USER_KEY);
            
            // Redirect to login
            window.location.href = '/login';
            return true;
        } catch (error) {
            console.error('LogoutError:', error);
            return false;
        }
    }

    /**
     * Check if user is authenticated
     */
    static isAuthenticated() {
        return !!localStorage.getItem(API_CONFIG.TOKEN_KEY);
    }

    /**
     * Get current user from localStorage
     */
    static getCurrentUser() {
        const userJson = localStorage.getItem(API_CONFIG.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    /**
     * Get auth token
     */
    static getToken() {
        return localStorage.getItem(API_CONFIG.TOKEN_KEY);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
}
