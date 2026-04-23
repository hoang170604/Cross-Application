# Cross Application API Specification (Standardized)

## Base URL
```
http://localhost:8080/api
```

---

## Global Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errorCode": "ERROR_CODE"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Delete successful (no body) |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Authentication failed |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Endpoints

### 1. USER CONTROLLER (/api/users)

#### Register User
- **POST** `/api/users/register`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** 201 Created
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "token": "token-1-1234567890",
      "userId": 1,
      "email": "user@example.com"
    }
  }
  ```

#### Login
- **POST** `/api/users/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** 200 OK
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "token-1-1234567890",
      "userId": 1,
      "email": "user@example.com"
    }
  }
  ```

#### Get User by ID
- **GET** `/api/users/{id}`
- **Response:** 200 OK
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```

#### Change Password
- **PUT** `/api/users/{id}/password`
- **Request Body:**
  ```json
  {
    "newPassword": "newPassword123"
  }
  ```
- **Response:** 200 OK

#### Update Profile
- **PUT** `/api/users/{id}/profile`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "age": 30,
    "gender": "Male",
    "height": 180,
    "weight": 75,
    "activityLevel": "MODERATE",
    "goal": "LOSE_WEIGHT",
    "fastingGoal": 16
  }
  ```
- **Response:** 200 OK

#### Request Password Reset
- **POST** `/api/users/password-reset`
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:** 200 OK

#### Verify Email
- **POST** `/api/users/verify-email`
- **Request Body:**
  ```json
  {
    "token": "verification-token"
  }
  ```
- **Response:** 200 OK

---

### 2. ACTIVITY CONTROLLER (/api/activities)

#### Add Activity
- **POST** `/api/activities/users/{userId}`
- **Request Body:**
  ```json
  {
    "activityType": "RUNNING",
    "durationMinutes": 30,
    "caloriesBurned": 300,
    "startTime": "2024-01-01T10:00:00",
    "distanceKm": 5.5,
    "steps": 6000,
    "source": "FITBIT",
    "externalId": "ext-123"
  }
  ```
- **Response:** 201 Created

#### Update Activity
- **PUT** `/api/activities/{id}`
- **Request Body:** (Same as add, all fields optional)
- **Response:** 200 OK

#### Delete Activity
- **DELETE** `/api/activities/{id}`
- **Response:** 204 No Content

---

### 3. DIARY CONTROLLER (/api/diaries)

#### Add Food to Meal
- **POST** `/api/diaries/users/{userId}/meals/{mealType}?date=2024-01-01`
- **Request Body:**
  ```json
  {
    "foodId": 1,
    "quantity": 100,
    "calories": 150,
    "protein": 10,
    "carb": 20,
    "fat": 5
  }
  ```
- **Response:** 201 Created

#### Update Meal Log
- **PUT** `/api/diaries/meal-logs/{id}`
- **Request Body:** (Same as add, all fields optional)
- **Response:** 200 OK

#### Delete Meal Log
- **DELETE** `/api/diaries/meal-logs/{id}`
- **Response:** 204 No Content

---

### 4. FASTING CONTROLLER (/api/fasting)

#### Start Fasting
- **POST** `/api/fasting/start`
- **Request Body:**
  ```json
  {
    "userId": 1,
    "startTime": "2024-01-01T08:00:00",
    "fastingGoalHours": 16
  }
  ```
- **Response:** 200 OK

#### Stop Fasting
- **POST** `/api/fasting/stop`
- **Request Body:**
  ```json
  {
    "userId": 1,
    "endTime": "2024-01-02T00:00:00"
  }
  ```
- **Response:** 200 OK

#### Get Fasting Sessions
- **GET** `/api/fasting/sessions/{userId}`
- **Response:** 200 OK
  ```json
  {
    "success": true,
    "message": "Success",
    "data": [
      {
        "id": 1,
        "userId": 1,
        "startTime": "2024-01-01T08:00:00",
        "endTime": "2024-01-02T00:00:00",
        "isCompleted": true
      }
    ]
  }
  ```

#### Get Open Fasting Session
- **GET** `/api/fasting/sessions/{userId}/open`
- **Response:** 200 OK / 404 Not Found

---

### 5. FASTING SESSION CONTROLLER (/api/fasting-sessions)

#### List Sessions for User
- **GET** `/api/fasting-sessions/user/{userId}`
- **Response:** 200 OK

#### Get Session by ID
- **GET** `/api/fasting-sessions/{id}`
- **Response:** 200 OK / 404 Not Found

#### Create Session
- **POST** `/api/fasting-sessions`
- **Request Body:**
  ```json
  {
    "userId": 1,
    "startTime": "2024-01-01T08:00:00",
    "targetEndTime": "2024-01-02T00:00:00"
  }
  ```
- **Response:** 201 Created

#### Update Session
- **PUT** `/api/fasting-sessions/{id}`
- **Request Body:** (All fields optional)
- **Response:** 200 OK

#### Delete Session
- **DELETE** `/api/fasting-sessions/{id}`
- **Response:** 204 No Content

---

### 6. WORKOUT CHALLENGE CONTROLLER (/api/workout-challenges)

#### List All Challenges
- **GET** `/api/workout-challenges`
- **Response:** 200 OK
  ```json
  {
    "success": true,
    "message": "Success",
    "data": [
      {
        "id": 1,
        "name": "100 Push-ups Challenge",
        "description": "Complete 100 push-ups",
        "targetValue": 100
      }
    ]
  }
  ```

#### List User Challenges
- **GET** `/api/workout-challenges/user/{userId}`
- **Response:** 200 OK

#### Get Challenge by ID
- **GET** `/api/workout-challenges/{id}`
- **Response:** 200 OK / 404 Not Found

#### Create Challenge
- **POST** `/api/workout-challenges`
- **Request Body:**
  ```json
  {
    "userId": 1,
    "name": "100 Push-ups",
    "description": "Do 100 push-ups",
    "targetValue": 100,
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  }
  ```
- **Response:** 201 Created

#### Update Challenge
- **PUT** `/api/workout-challenges/{id}`
- **Request Body:** (All fields optional)
- **Response:** 200 OK

#### Delete Challenge
- **DELETE** `/api/workout-challenges/{id}`
- **Response:** 204 No Content

---

## Error Code Reference

| Error Code | Status | Description |
|-----------|--------|-------------|
| INVALID_INPUT | 400 | Missing required field or invalid value |
| USER_NOT_FOUND | 404 | User does not exist |
| REGISTRATION_FAILED | 400 | Registration failed |
| LOGIN_FAILED | 401 | Login credentials invalid |
| PASSWORD_CHANGE_FAILED | 400 | Password change failed |
| PROFILE_UPDATE_FAILED | 400 | Profile update failed |
| PASSWORD_RESET_FAILED | 400 | Password reset request failed |
| EMAIL_VERIFICATION_FAILED | 400 | Email verification failed |
| ACTIVITY_ADD_FAILED | 400 | Activity add failed |
| ACTIVITY_UPDATE_FAILED | 400 | Activity update failed |
| ACTIVITY_DELETE_FAILED | 400 | Activity delete failed |
| FOOD_ADD_FAILED | 400 | Food add to meal failed |
| MEAL_LOG_UPDATE_FAILED | 400 | Meal log update failed |
| MEAL_LOG_DELETE_FAILED | 400 | Meal log delete failed |
| FASTING_START_FAILED | 400 | Fasting start failed |
| FASTING_STOP_FAILED | 400 | Fasting stop failed |
| SESSIONS_FETCH_FAILED | 400 | Failed to fetch sessions |
| NO_OPEN_SESSION | 404 | No open fasting session found |
| SESSION_NOT_FOUND | 404 | Session not found |
| CHALLENGE_NOT_FOUND | 404 | Workout challenge not found |

---

## Implementation Notes for Frontend

1. **Always check `success` field** before accessing `data`
2. **Error Code handling** - Switch on `errorCode` for specific error handling
3. **DELETE operations** return 204 No Content (empty body)
4. **Created resources** are returned with 201 Created
5. **Use `errorCode`** in logs for debugging

### Example Frontend HTTP Interceptor Pattern
```typescript
// Pseudocode
function handleResponse(response) {
  if (response.status === 204) {
    return { success: true };
  }
  
  const body = response.json();
  
  if (!body.success) {
    handleError(body.message, body.errorCode);
    throw new Error(body.errorCode);
  }
  
  return body.data;
}
```

---

## Versioning Strategy

Current API Version: **v1** (implicit)

For future versions, prefix paths: `/api/v2/...`

---

Last Updated: April 23, 2026

