/**
 * API Configuration
 * Centralized configuration for all API endpoints and settings
 */

const API_CONFIG = {
    // Base URL from environment or default to localhost
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8081/api',
    
    // API Versions
    VERSION: 'v1',
    
    // Timeout settings (in milliseconds)
    REQUEST_TIMEOUT: 30000,
    
    // Retry configuration
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // Initial delay in ms, doubles with each retry
    
    // Token settings
    TOKEN_KEY: 'authToken',
    REFRESH_TOKEN_KEY: 'refreshToken',
    USER_KEY: 'currentUser',
    
    // Endpoints
    ENDPOINTS: {
        // Auth
        AUTH: {
            REGISTER: '/users/register',
            LOGIN: '/users/login',
            REFRESH: '/users/refresh-token',
            LOGOUT: '/users/logout',
            VERIFY: '/users/verify-token'
        },
        
        // Users
        USERS: {
            GET_PROFILE: '/users/profile',
            UPDATE_PROFILE: '/users/profile',
            GET_USER: '/users/:id',
            DELETE_ACCOUNT: '/users/delete'
        },
        
        // Activities
        ACTIVITIES: {
            GET_TYPES: '/activities/types',
            GET_HISTORY: '/activities/users/:userId/history',
            GET_DAILY_CALORIES: '/activities/users/:userId/calories-daily',
            ADD: '/activities/users/:userId',
            UPDATE: '/activities/:id',
            DELETE: '/activities/:id'
        },
        
        // Diary & Meals
        DIARY: {
            GET_DIARY: '/diaries/users/:userId',
            GET_MEALS: '/diaries/users/:userId/meals',
            GET_MEAL_LOGS: '/diaries/users/:userId/meal-logs',
            ADD_MEAL: '/diaries/users/:userId/meals/:mealType',
            UPDATE_MEAL_LOG: '/diaries/meal-logs/:id',
            DELETE_MEAL_LOG: '/diaries/meal-logs/:id'
        },
        
        // Fasting
        FASTING: {
            START: '/fasting/start',
            STOP: '/fasting/stop',
            GET_SESSIONS: '/fasting/sessions/:userId',
            GET_OPEN_SESSION: '/fasting/sessions/:userId/open'
        },
        
        // Food
        FOOD: {
            GET_ALL: '/foods',
            CREATE: '/foods',
            SEARCH: '/foods/search',
            GET_CATEGORIES: '/foods/categories',
            GET_BY_ID: '/foods/:id',
            UPDATE: '/foods/:id',
            DELETE: '/foods/:id',
            ADD_TO_MEAL: '/foods/meals/:userId/:mealId/foods'
        },
        
        // Progress & Nutrition
        PROGRESS: {
            GET_WEIGHT_HISTORY: '/progress/weight',
            GET_NUTRITION_REPORT: '/progress/report',
            GET_DAILY_NUTRITION: '/progress/nutrition',
            GET_NUTRITION_SUMMARY: '/progress/nutrition/summary',
            GET_LATEST_WEIGHT: '/progress/latest-weight',
            LOG_WEIGHT: '/progress/log-weight'
        },
        
        // Water
        WATER: {
            LOG: '/water/log',
            GET_DAILY_TOTAL: '/water/daily-total',
            GET_LOGS: '/water/logs'
        },
        
        // Workout Challenges
        CHALLENGES: {
            GET_ALL: '/workout-challenges',
            GET_USER_CHALLENGES: '/workout-challenges/user/:userId',
            GET_BY_ID: '/workout-challenges/:id',
            CREATE: '/workout-challenges',
            UPDATE: '/workout-challenges/:id',
            DELETE: '/workout-challenges/:id'
        }
    },
    
    // Response messages
    MESSAGES: {
        SUCCESS: 'Thao tác thành công',
        ERROR: 'Có lỗi xảy ra',
        NETWORK_ERROR: 'Lỗi kết nối mạng',
        TIMEOUT: 'Yêu cầu hết thời gian chờ',
        UNAUTHORIZED: 'Không được phép truy cập',
        FORBIDDEN: 'Bạn không có quyền truy cập',
        NOT_FOUND: 'Không tìm thấy dữ liệu',
        VALIDATION_ERROR: 'Dữ liệu không hợp lệ'
    },
    
    // Status codes
    STATUS_CODES: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_ERROR: 500
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
