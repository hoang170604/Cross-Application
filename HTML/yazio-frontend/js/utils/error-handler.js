/**
 * Error Handler Utility
 * Centralized error handling and logging
 */

class ApiErrorHandler {
    /**
     * Handle API errors consistently
     */
    static handleError(error, context = '') {
        let errorData = {
            message: API_CONFIG.MESSAGES.ERROR,
            status: null,
            errorCode: null,
            details: null
        };

        // Network error
        if (!error.response) {
            if (error.code === 'ECONNABORTED') {
                errorData.message = API_CONFIG.MESSAGES.TIMEOUT;
            } else if (error.message === 'Network Error') {
                errorData.message = API_CONFIG.MESSAGES.NETWORK_ERROR;
            }
            console.error(`[${context}] Network Error:`, error);
            return errorData;
        }

        // HTTP error response
        const status = error.response?.status;
        const data = error.response?.data;

        errorData.status = status;
        errorData.message = data?.message || API_CONFIG.MESSAGES.ERROR;
        errorData.errorCode = data?.errorCode;
        errorData.details = data?.details || data;

        // Handle specific status codes
        switch (status) {
            case 400:
                errorData.message = data?.message || API_CONFIG.MESSAGES.VALIDATION_ERROR;
                break;
            case 401:
                errorData.message = API_CONFIG.MESSAGES.UNAUTHORIZED;
                localStorage.removeItem(API_CONFIG.TOKEN_KEY);
                window.location.href = '/login';
                break;
            case 403:
                errorData.message = API_CONFIG.MESSAGES.FORBIDDEN;
                break;
            case 404:
                errorData.message = API_CONFIG.MESSAGES.NOT_FOUND;
                break;
            case 500:
                errorData.message = 'Lỗi máy chủ. Vui lòng thử lại sau.';
                break;
        }

        console.error(`[${context}] API Error (${status}):`, errorData);
        return errorData;
    }

    /**
     * Show error notification to user
     */
    static showErrorNotification(error) {
        const message = error.message || API_CONFIG.MESSAGES.ERROR;
        
        // If you have a notification system, use it here
        if (window.showNotification) {
            window.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    /**
     * Validate response data
     */
    static validateResponse(response) {
        if (!response) {
            return { valid: false, error: 'Lỗi: Response rỗng' };
        }

        if (response.status && response.status >= 400) {
            return {
                valid: false,
                error: response.message || API_CONFIG.MESSAGES.ERROR
            };
        }

        return { valid: true };
    }

    /**
     * Log API request details (for debugging)
     */
    static logRequest(method, url, config) {
        console.debug(`[API] ${method.toUpperCase()} ${url}`, config);
    }

    /**
     * Log API response details (for debugging)
     */
    static logResponse(method, url, response) {
        console.debug(`[API] ${method.toUpperCase()} ${url} - Response:`, response);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiErrorHandler;
}
