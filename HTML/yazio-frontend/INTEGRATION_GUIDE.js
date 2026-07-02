/**
 * Integration Guide for Frontend-Backend Connection
 * Complete setup and usage instructions for Yazio Frontend
 */

// ============================================================================
// 1. SETUP - Include these files in your HTML
// ============================================================================

/*
In your HTML file (index.html or dashboard.html), include:

<script src="js/api/axios-client.js"></script>
<script src="js/config/api.config.js"></script>
<script src="js/utils/error-handler.js"></script>
<script src="js/services/auth.service.js"></script>
<script src="js/services/activity.service.js"></script>
<script src="js/services/food.service.js"></script>
<script src="js/services/diary.service.js"></script>
<script src="js/services/fasting.service.js"></script>
<script src="js/services/water.service.js"></script>
<script src="js/services/progress.service.js"></script>
<script src="js/services/challenge.service.js"></script>
<script src="js/services/index.js"></script>

// Optional: Use ServiceManager for cleaner API access
<script>
    const API = ServiceManager;
</script>
*/

// ============================================================================
// 2. AUTHENTICATION EXAMPLES
// ============================================================================

// Register new user
async function registerExample() {
    try {
        const response = await AuthService.register({
            email: 'user@example.com',
            password: 'SecurePassword123',
            fullName: 'John Doe'
        });
        console.log('Registration successful:', response);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Login user
async function loginExample() {
    try {
        const response = await AuthService.login(
            'user@example.com',
            'SecurePassword123'
        );
        console.log('Login successful:', response);
        // Token is automatically stored in localStorage
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Get current user profile
async function getProfileExample() {
    try {
        const response = await AuthService.getProfile();
        console.log('Current user:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Logout
function logoutExample() {
    AuthService.logout(); // Redirects to login page
}

// ============================================================================
// 3. ACTIVITY EXAMPLES
// ============================================================================

// Get activity types
async function getActivityTypesExample() {
    try {
        const response = await ActivityService.getActivityTypes();
        console.log('Activity types:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Get activity history
async function getActivityHistoryExample() {
    try {
        const userId = 1; // Current user ID
        const response = await ActivityService.getActivityHistory(
            userId,
            '2024-01-01', // Start date
            '2024-01-31'  // End date
        );
        console.log('Activities:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Add new activity
async function addActivityExample() {
    try {
        const userId = 1;
        const response = await ActivityService.addActivity(userId, {
            activityType: 'RUNNING',
            durationMinutes: 30,
            caloriesBurned: 300,
            startTime: new Date().toISOString(),
            distanceKm: 5.0,
            steps: 5000
        });
        console.log('Activity added:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// ============================================================================
// 4. FOOD & DIARY EXAMPLES
// ============================================================================

// Search for foods
async function searchFoodsExample() {
    try {
        const response = await FoodService.searchFoods('chicken');
        console.log('Food search results:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Get all food categories
async function getFoodCategoriesExample() {
    try {
        const response = await FoodService.getFoodCategories();
        console.log('Food categories:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Get diary for specific date
async function getDiaryExample() {
    try {
        const userId = 1;
        const response = await DiaryService.getDiary(userId, '2024-01-15');
        console.log('Diary:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Add food to meal
async function addFoodToMealExample() {
    try {
        const userId = 1;
        const response = await DiaryService.addFoodToMeal(
            userId,
            'breakfast',
            {
                foodId: 1,
                quantity: 100, // grams
                calories: 165,
                protein: 31,
                carb: 0,
                fat: 3.6
            },
            '2024-01-15'
        );
        console.log('Food added to meal:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// ============================================================================
// 5. FASTING EXAMPLES
// ============================================================================

// Start fasting
async function startFastingExample() {
    try {
        const userId = 1;
        const response = await FastingService.startFasting(
            userId,
            new Date().toISOString(),
            16 // 16-hour fasting goal
        );
        console.log('Fasting started:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Stop fasting
async function stopFastingExample() {
    try {
        const userId = 1;
        const response = await FastingService.stopFasting(
            userId,
            new Date().toISOString()
        );
        console.log('Fasting stopped:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Get open fasting session
async function getOpenSessionExample() {
    try {
        const userId = 1;
        const response = await FastingService.getOpenSession(userId);
        if (response.data) {
            console.log('Open fasting session:', response.data);
        } else {
            console.log('No open fasting session');
        }
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// ============================================================================
// 6. WATER TRACKING EXAMPLES
// ============================================================================

// Log water intake
async function logWaterExample() {
    try {
        const response = await WaterService.logWater({
            userId: 1,
            amountMl: 250,
            timestamp: new Date().toISOString()
        });
        console.log('Water logged:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Get daily water total
async function getDailyWaterExample() {
    try {
        const response = await WaterService.getDailyTotal(1, '2024-01-15');
        console.log('Daily water total (ml):', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// ============================================================================
// 7. PROGRESS & NUTRITION EXAMPLES
// ============================================================================

// Log weight
async function logWeightExample() {
    try {
        const response = await ProgressService.logWeight({
            userId: 1,
            weight: 75.5,
            date: '2024-01-15'
        });
        console.log('Weight logged:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Get nutrition report
async function getNutritionReportExample() {
    try {
        const response = await ProgressService.getNutritionReport(
            1,
            '2024-01-01',
            '2024-01-31'
        );
        console.log('Nutrition report:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Get daily nutrition
async function getDailyNutritionExample() {
    try {
        const response = await ProgressService.getDailyNutrition(1, '2024-01-15');
        console.log('Daily nutrition:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// ============================================================================
// 8. WORKOUT CHALLENGES EXAMPLES
// ============================================================================

// Get all challenges
async function getAllChallengesExample() {
    try {
        const response = await WorkoutChallengeService.getAllChallenges();
        console.log('All challenges:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Get user challenges
async function getUserChallengesExample() {
    try {
        const response = await WorkoutChallengeService.getUserChallenges(1);
        console.log('User challenges:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Create new challenge
async function createChallengeExample() {
    try {
        const response = await WorkoutChallengeService.createChallenge({
            userId: 1,
            challengeName: '10000 Steps Daily',
            targetValue: 10000,
            currentValue: 0,
            unit: 'steps',
            startDate: '2024-01-15',
            endDate: '2024-02-15'
        });
        console.log('Challenge created:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// Update challenge
async function updateChallengeExample() {
    try {
        const response = await WorkoutChallengeService.updateChallenge(1, {
            currentValue: 5000
        });
        console.log('Challenge updated:', response.data);
    } catch (error) {
        ApiErrorHandler.showErrorNotification(error);
    }
}

// ============================================================================
// 9. ERROR HANDLING
// ============================================================================

// All services throw ApiErrorHandler.handleError() on failure
// Example:
async function handleErrorExample() {
    try {
        const response = await ActivityService.getActivityHistory(999, '2024-01-01', '2024-01-31');
    } catch (error) {
        // error object structure:
        // {
        //   message: string,
        //   status: number,
        //   errorCode: string,
        //   details: any
        // }
        
        console.error('Error message:', error.message);
        console.error('Status:', error.status);
        console.error('Error code:', error.errorCode);
        
        ApiErrorHandler.showErrorNotification(error);
    }
}

// ============================================================================
// 10. CONFIGURATION
// ============================================================================

// To change API base URL, update the environment variable:
// process.env.REACT_APP_API_URL = 'http://your-backend:8080/api'

// Or modify in api.config.js:
// const API_BASE_URL = 'http://your-backend:8080/api';

// ============================================================================
// 11. TOKEN MANAGEMENT
// ============================================================================

// Get current auth token
const token = AuthService.getToken();

// Check if user is authenticated
if (AuthService.isAuthenticated()) {
    console.log('User is logged in');
} else {
    console.log('User needs to login');
}

// Get current user info
const currentUser = AuthService.getCurrentUser();
console.log('Current user:', currentUser);

// ============================================================================
// 12. IMPORTANT NOTES
// ============================================================================

/*
✓ Token is automatically added to all requests via axiosClient interceptor
✓ Token is stored in localStorage with key: 'authToken'
✓ On 401 Unauthorized, token is cleared and user redirected to login
✓ All API calls include error handling and logging
✓ Responses are formatted consistently: { status, message, data, errorCode }
✓ All date parameters should be in YYYY-MM-DD format
✓ All timestamps should be in ISO 8601 format (new Date().toISOString())
✓ API base URL defaults to http://localhost:8080/api

For debugging, check browser console for detailed request/response logs.
*/
