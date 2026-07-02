# Frontend-Backend Integration Guide

## 📋 Overview

Frontend (HTML Yazio) is now fully configured to connect with Spring Boot Backend seamlessly. This guide explains the complete integration setup.

---

## ✅ What's Included

### 1. **API Configuration** (`js/config/api.config.js`)
- Centralized API endpoints configuration
- Base URL, timeouts, retry settings
- All available endpoints organized by module
- Response messages and status codes

### 2. **HTTP Client** (`js/api/axios-client.js`)
- Axios instance with JWT interceptor
- Automatic token injection to all requests
- Response data extraction
- 401 Unauthorized handling

### 3. **Error Handler** (`js/utils/error-handler.js`)
- Centralized error handling
- Consistent error format
- Status code-specific handling
- Error logging and notifications

### 4. **Service Layer** (Multiple files)
Each service provides clean API for specific feature:

- **AuthService** - Login, Register, Profile
- **ActivityService** - Exercise tracking
- **FoodService** - Food database & search
- **DiaryService** - Meal logging
- **FastingService** - Fasting sessions
- **WaterService** - Water intake tracking
- **ProgressService** - Weight & nutrition reports
- **WorkoutChallengeService** - Challenge management

---

## 🚀 Quick Start

### Step 1: Include Files in HTML

Add these script tags in your HTML file (before your custom scripts):

```html
<!-- API Setup -->
<script src="js/api/axios-client.js"></script>
<script src="js/config/api.config.js"></script>
<script src="js/utils/error-handler.js"></script>

<!-- Services -->
<script src="js/services/auth.service.js"></script>
<script src="js/services/activity.service.js"></script>
<script src="js/services/food.service.js"></script>
<script src="js/services/diary.service.js"></script>
<script src="js/services/fasting.service.js"></script>
<script src="js/services/water.service.js"></script>
<script src="js/services/progress.service.js"></script>
<script src="js/services/challenge.service.js"></script>
<script src="js/services/index.js"></script>
```

### Step 2: Use Services in Your Code

```javascript
// Login example
async function handleLogin() {
    try {
        const response = await AuthService.login(email, password);
        console.log('Login success:', response);
        // Redirect to dashboard
    } catch (error) {
        alert(error.message);
    }
}

// Get food list
async function loadFoods() {
    try {
        const foods = await FoodService.getAllFoods();
        displayFoods(foods.data);
    } catch (error) {
        console.error(error);
    }
}
```

---

## 📚 API Usage Examples

### Authentication

```javascript
// Register
const registerResponse = await AuthService.register({
    email: 'user@example.com',
    password: 'password123',
    fullName: 'User Name'
});

// Login
const loginResponse = await AuthService.login('user@example.com', 'password123');

// Get Profile
const profile = await AuthService.getProfile();

// Logout
AuthService.logout(); // Redirects to /login
```

### Activities

```javascript
// Get activity types
const types = await ActivityService.getActivityTypes();

// Get history
const history = await ActivityService.getActivityHistory(userId, '2024-01-01', '2024-01-31');

// Add activity
const activity = await ActivityService.addActivity(userId, {
    activityType: 'RUNNING',
    durationMinutes: 30,
    caloriesBurned: 300,
    startTime: new Date().toISOString(),
    distanceKm: 5.0
});

// Get daily burned calories
const calories = await ActivityService.getDailyCaloriesBurned(userId, '2024-01-15');
```

### Food & Diary

```javascript
// Search foods
const foods = await FoodService.searchFoods('chicken');

// Get categories
const categories = await FoodService.getFoodCategories();

// Get diary
const meals = await DiaryService.getDiary(userId, '2024-01-15');

// Add food to meal
const result = await DiaryService.addFoodToMeal(userId, 'breakfast', {
    foodId: 1,
    quantity: 100,
    calories: 165,
    protein: 31,
    carb: 0,
    fat: 3.6
});
```

### Fasting

```javascript
// Start fasting
await FastingService.startFasting(userId, new Date().toISOString(), 16);

// Get open session
const session = await FastingService.getOpenSession(userId);

// Stop fasting
await FastingService.stopFasting(userId, new Date().toISOString());

// Get all sessions
const sessions = await FastingService.getFastingSessions(userId);
```

### Water Tracking

```javascript
// Log water
await WaterService.logWater({
    userId: 1,
    amountMl: 250,
    timestamp: new Date().toISOString()
});

// Get daily total
const total = await WaterService.getDailyTotal(userId, '2024-01-15');
```

### Progress & Nutrition

```javascript
// Log weight
await ProgressService.logWeight({
    userId: 1,
    weight: 75.5,
    date: '2024-01-15'
});

// Get weight history
const history = await ProgressService.getWeightHistory(userId, '2024-01-01', '2024-01-31');

// Get daily nutrition
const nutrition = await ProgressService.getDailyNutrition(userId, '2024-01-15');

// Get nutrition summary
const summary = await ProgressService.getNutritionSummary(userId, '2024-01-01', '2024-01-31');
```

### Workout Challenges

```javascript
// Get all challenges
const allChallenges = await WorkoutChallengeService.getAllChallenges();

// Get user challenges
const userChallenges = await WorkoutChallengeService.getUserChallenges(userId);

// Create challenge
const challenge = await WorkoutChallengeService.createChallenge({
    userId: 1,
    challengeName: '10000 Steps Daily',
    targetValue: 10000,
    currentValue: 0,
    unit: 'steps',
    startDate: '2024-01-15',
    endDate: '2024-02-15'
});

// Update challenge
await WorkoutChallengeService.updateChallenge(challengeId, {
    currentValue: 5000
});
```

---

## 🔐 Token Management

Tokens are automatically managed:

```javascript
// Get current token
const token = AuthService.getToken();

// Check if authenticated
if (AuthService.isAuthenticated()) {
    console.log('User is logged in');
}

// Get current user info
const user = AuthService.getCurrentUser();
console.log(user.email, user.fullName);
```

---

## ⚠️ Error Handling

All services throw structured errors:

```javascript
try {
    const result = await ActivityService.getActivityHistory(userId, start, end);
} catch (error) {
    // error structure:
    // {
    //   message: string,
    //   status: number,
    //   errorCode: string,
    //   details: any
    // }
    
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('Code:', error.errorCode);
    
    // Show to user
    ApiErrorHandler.showErrorNotification(error);
}
```

---

## 🔧 Configuration

### Change API Base URL

Edit `js/config/api.config.js`:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://your-backend-server:8080/api',
    // ... rest of config
};
```

Or set environment variable:
```javascript
process.env.REACT_APP_API_URL = 'http://your-backend:8080/api';
```

### Adjust Timeouts and Retries

```javascript
const API_CONFIG = {
    REQUEST_TIMEOUT: 60000, // 60 seconds
    MAX_RETRIES: 5,
    RETRY_DELAY: 2000, // 2 seconds
};
```

---

## 📝 Data Format Standards

### Dates
- Format: `YYYY-MM-DD`
- Example: `2024-01-15`

### Timestamps
- Format: ISO 8601
- Example: `2024-01-15T14:30:00Z` or `new Date().toISOString()`

### Response Format
```javascript
{
    "status": 200,
    "message": "Success",
    "data": { /* actual data */ },
    "errorCode": null
}
```

---

## 🐛 Debugging

All API calls are logged to console:

```
[API] GET /api/users/profile - Response: {...}
[API] POST /api/activities/users/1 - Response: {...}
```

For detailed debugging:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for `[API]` prefixed logs
4. Check Network tab for raw requests/responses

---

## ✨ Features

✅ **Automatic JWT Injection** - Token added to all requests  
✅ **Centralized Error Handling** - Consistent error format  
✅ **Request Logging** - Debug-friendly console logs  
✅ **Auto Logout on 401** - Redirects to login when unauthorized  
✅ **LocalStorage Integration** - Automatic token/user storage  
✅ **Organized Services** - Clean separation of concerns  
✅ **Type-safe Parameters** - Clear function signatures  
✅ **Retry Logic Ready** - Framework for implementing retries  

---

## 🔗 Backend Integration

Backend is already configured for frontend:

- ✅ CORS enabled for all origins
- ✅ JWT authentication implemented
- ✅ All endpoints with role-based access
- ✅ Consistent API response format
- ✅ Input validation and error codes
- ✅ Database relationships properly set up

---

## 📞 Support

For issues or questions:

1. Check browser Console for error messages
2. Verify API_CONFIG base URL is correct
3. Ensure backend is running on configured port
4. Check JWT token in localStorage
5. Review error logs in Network tab

---

## 📦 File Structure

```
HTML/yazio-frontend/
├── js/
│   ├── api/
│   │   └── axios-client.js
│   ├── config/
│   │   └── api.config.js
│   ├── utils/
│   │   └── error-handler.js
│   └── services/
│       ├── auth.service.js
│       ├── activity.service.js
│       ├── food.service.js
│       ├── diary.service.js
│       ├── fasting.service.js
│       ├── water.service.js
│       ├── progress.service.js
│       ├── challenge.service.js
│       └── index.js
├── INTEGRATION_GUIDE.js
├── FRONTEND_INTEGRATION.md (this file)
└── [other existing files]
```

---

## 🎉 You're Ready!

Frontend is now fully equipped to communicate with backend seamlessly. Start using the services in your pages!
