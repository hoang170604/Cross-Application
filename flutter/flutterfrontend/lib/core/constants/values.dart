/// Application Configuration Constants
/// Converted from: application.properties
library;

class AppValues {
  // ==================== Database Configuration ====================
  /// Database Server Configuration
  static const String dbServer = '127.0.0.1';
  static const int dbPort = 1433;
  static const String dbName = 'QLAppTheDuc';
  static const String dbUsername = 'devuser';
  static const String dbPassword = 'Password123';
  static const String dbDriver = 'com.microsoft.sqlserver.jdbc.SQLServerDriver';

  /// Database Connection String (for reference)
  /// jdbc:sqlserver://127.0.0.1:1433;databaseName=QLAppTheDuc;encrypt=true;trustServerCertificate=true
  static const String dbConnectionString =
      'sqlserver://$dbServer:$dbPort;databaseName=$dbName;encrypt=true;trustServerCertificate=true';

  // ==================== JPA/Hibernate Configuration ====================
  /// Hibernate DDL Auto Strategy
  /// - 'validate': validate database schema
  /// - 'update': update database schema
  /// - 'create': create database schema
  /// - 'create-drop': create and drop database schema
  static const String hibernateDdlAuto = 'update';

  /// Show SQL in logs
  static const bool hibernateShowSql = true;

  /// Hibernate SQL Dialect
  static const String hibernateDialect = 'org.hibernate.dialect.SQLServerDialect';

  // ==================== Server Configuration ====================
  /// Backend API Server Configuration
  /// For Android Emulator: use 10.0.2.2 (special alias for host machine)
  /// For Physical Device or iOS: use 127.0.0.1 or your machine IP
  static const String apiHost = '10.0.2.2'; // Android Emulator: 10.0.2.2, Physical: 127.0.0.1
  static const int apiPort = 8081;

  /// API Base URL
  static const String apiBaseUrl = 'http://$apiHost:$apiPort';

  /// API Endpoint Paths
  static const String apiUsersEndpoint = '$apiBaseUrl/api/users';
  static const String apiActivitiesEndpoint = '$apiBaseUrl/api/activities';
  static const String apiDiariesEndpoint = '$apiBaseUrl/api/diaries';
  static const String apiFastingEndpoint = '$apiBaseUrl/api/fasting';
  static const String apiFastingSessionsEndpoint = '$apiBaseUrl/api/fasting-sessions';
  static const String apiFoodsEndpoint = '$apiBaseUrl/api/foods';
  static const String apiMealsEndpoint = '$apiBaseUrl/api/meals';
  static const String apiNutritionEndpoint = '$apiBaseUrl/api/nutrition';
  static const String apiProgressEndpoint = '$apiBaseUrl/api/progress';
  static const String apiWaterEndpoint = '$apiBaseUrl/api/water';
  static const String apiWeightEndpoint = '$apiBaseUrl/api/weight';
  static const String apiWorkoutChallengesEndpoint = '$apiBaseUrl/api/workout-challenges';

  // ==================== HTTP Client Configuration ====================
  /// HTTP Request Timeout Duration (in seconds)
  static const int httpConnectTimeout = 30;
  static const int httpReceiveTimeout = 30;
  static const int httpSendTimeout = 30;

  /// HTTP Headers
  static const Map<String, String> defaultHttpHeaders = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json',
  };

  /// Retry Configuration
  static const int maxRetryAttempts = 3;
  static const int retryDelayMs = 1000;

  // ==================== Application Configuration ====================
  /// Application Name
  static const String appName = 'CrossApplication';

  /// Application Version
  static const String appVersion = '1.0.0';

  /// Environment
  static const String environment = 'development'; // development, staging, production

  /// Debug Mode
  static const bool debugMode = true;

  /// Log Level
  /// 0: DEBUG, 1: INFO, 2: WARNING, 3: ERROR
  static const int logLevel = 0; // DEBUG

  // ==================== Feature Flags ====================
  /// Enable Feature Flags
  static const bool enableOfflineMode = true;
  static const bool enableCaching = true;
  static const bool enableLogging = true;
  static const bool enableAnalytics = false;

  // ==================== Cache Configuration ====================
  /// Cache Duration (in hours)
  static const int cacheDurationHours = 24;

  /// Cache Size (in MB)
  static const int maxCacheSizeMb = 50;

  // ==================== Authentication Configuration ====================
  /// Token Storage Key
  static const String tokenStorageKey = 'auth_token';
  static const String refreshTokenStorageKey = 'refresh_token';
  static const String userIdStorageKey = 'user_id';

  /// Token Expiry Time (in hours)
  static const int tokenExpiryHours = 24;

  /// Auto Logout Time (in minutes of inactivity)
  static const int autoLogoutTimeoutMinutes = 30;

  // ==================== Validation Configuration ====================
  /// Password Requirements
  static const int passwordMinLength = 8;
  static const int passwordMaxLength = 128;

  /// Email Validation Pattern
  static const String emailPattern =
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';

  /// Username Requirements
  static const int usernameMinLength = 3;
  static const int usernameMaxLength = 50;

  // ==================== UI Configuration ====================
  /// Page Size for Pagination
  static const int pageSize = 20;

  /// Animation Duration (in milliseconds)
  static const int animationDurationMs = 300;

  /// Debounce Duration (in milliseconds)
  static const int debounceDurationMs = 500;

  // ==================== File Configuration ====================
  /// Maximum File Upload Size (in MB)
  static const int maxFileUploadSizeMb = 10;

  /// Supported Image Formats
  static const List<String> supportedImageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

  // ==================== Error Messages ====================
  /// Error Messages
  static const String errorNetworkFailure = 'Network connection failed';
  static const String errorServerError = 'Server error occurred';
  static const String errorUnauthorized = 'Unauthorized access';
  static const String errorForbidden = 'Access forbidden';
  static const String errorNotFound = 'Resource not found';
  static const String errorValidation = 'Validation failed';
  static const String errorTimeout = 'Request timeout';
  static const String errorUnknown = 'Unknown error occurred';
}

/// API Endpoints Class for better organization
class ApiEndpoints {
  static const String baseUrl = AppValues.apiBaseUrl;

  // Auth Endpoints
  static const String register = '$baseUrl/api/users/register';
  static const String login = '$baseUrl/api/users/login';
  static const String logout = '$baseUrl/api/users/logout';
  static const String changePassword = '$baseUrl/api/users/password';
  static const String requestPasswordReset = '$baseUrl/api/users/password-reset';
  static const String verifyEmail = '$baseUrl/api/users/verify-email';

  // User Endpoints
  static const String getUser = '$baseUrl/api/users';
  static const String updateUser = '$baseUrl/api/users';
  static const String deleteUser = '$baseUrl/api/users';

  // Activity Endpoints
  static const String getActivities = '$baseUrl/api/activities';
  static const String addActivity = '$baseUrl/api/activities';
  static const String updateActivity = '$baseUrl/api/activities';
  static const String deleteActivity = '$baseUrl/api/activities';

  // Diary Endpoints
  static const String addFood = '$baseUrl/api/diaries/food';
  static const String getMeals = '$baseUrl/api/diaries/meals';
  static const String updateMeal = '$baseUrl/api/diaries/meal-logs';
  static const String deleteMeal = '$baseUrl/api/diaries/meal-logs';

  // Fasting Endpoints
  static const String startFasting = '$baseUrl/api/fasting/start';
  static const String stopFasting = '$baseUrl/api/fasting/stop';
  static const String getFastingSessions = '$baseUrl/api/fasting/sessions';
  static const String getOpenFastingSession = '$baseUrl/api/fasting/sessions/open';

  // Fasting Session Endpoints
  static const String listFastingSessions = '$baseUrl/api/fasting-sessions';
  static const String getFastingSession = '$baseUrl/api/fasting-sessions';
  static const String createFastingSession = '$baseUrl/api/fasting-sessions';
  static const String updateFastingSession = '$baseUrl/api/fasting-sessions';
  static const String deleteFastingSession = '$baseUrl/api/fasting-sessions';

  // Food Endpoints
  static const String getAllFoods = '$baseUrl/api/foods';
  static const String searchFoods = '$baseUrl/api/foods/search';
  static const String getFoodsByCategory = '$baseUrl/api/foods/category';
  static const String getFoodCategories = '$baseUrl/api/foods/categories';

  // Nutrition Endpoints
  static const String getNutritionGoals = '$baseUrl/api/nutrition/goals';
  static const String calculateNutrition = '$baseUrl/api/nutrition/calculate';
  static const String getDailyNutrition = '$baseUrl/api/nutrition/daily';

  // Progress Endpoints
  static const String getWeightHistory = '$baseUrl/api/progress/weight';
  static const String getNutritionReport = '$baseUrl/api/progress/report';
  static const String logWeight = '$baseUrl/api/progress/weight/log';

  // Water Endpoints
  static const String logWater = '$baseUrl/api/water/log';
  static const String getWaterIntake = '$baseUrl/api/water/intake';

  // Workout Challenge Endpoints
  static const String getAllChallenges = '$baseUrl/api/workout-challenges';
  static const String getUserChallenges = '$baseUrl/api/workout-challenges/user';
  static const String getChallenge = '$baseUrl/api/workout-challenges';
  static const String createChallenge = '$baseUrl/api/workout-challenges';
  static const String updateChallenge = '$baseUrl/api/workout-challenges';
  static const String deleteChallenge = '$baseUrl/api/workout-challenges';
}

/// HTTP Status Codes
class HttpStatusCodes {
  static const int ok = 200;
  static const int created = 201;
  static const int noContent = 204;
  static const int badRequest = 400;
  static const int unauthorized = 401;
  static const int forbidden = 403;
  static const int notFound = 404;
  static const int internalServerError = 500;
  static const int badGateway = 502;
  static const int serviceUnavailable = 503;
  static const int gatewayTimeout = 504;
}

/// Nutrition Constants
class NutritionConstants {
  /// BMR Calculation Constants (Mifflin-St Jeor Formula)
  static const double maleConstant1 = 10.0; // weight in kg
  static const double maleConstant2 = 6.25; // height in cm
  static const double maleConstant3 = 5.0; // age in years
  static const double maleConstant4 = 5.0; // constant

  static const double femaleConstant1 = 10.0; // weight in kg
  static const double femaleConstant2 = 6.25; // height in cm
  static const double femaleConstant3 = 5.0; // age in years
  static const double femaleConstant4 = 161.0; // constant

  /// Activity Level Multipliers (for TDEE calculation)
  static const double sedentary = 1.2; // sedentary (little or no exercise)
  static const double lightlyActive = 1.375; // lightly active (1-3 days/week)
  static const double moderatelyActive = 1.55; // moderately active (3-5 days/week)
  static const double veryActive = 1.725; // very active (6-7 days/week)
  static const double extremelyActive = 1.9; // extremely active (physical job or training twice per day)

  /// Calorie Adjustment for Goals
  static const double calorieDeficit = 500.0; // calories to lose weight
  static const double calorieExcess = 500.0; // calories to build muscle

  /// Macronutrient Ratios for Different Goals
  /// Goal: lose_weight (calories: TDEE - 500)
  static const double loseWeightProteinRatio = 0.40; // 40%
  static const double loseWeightCarbRatio = 0.30; // 30%
  static const double loseWeightFatRatio = 0.30; // 30%

  /// Goal: build_muscle (calories: TDEE + 500)
  static const double buildMuscleProteinRatio = 0.30; // 30%
  static const double buildMuscleCarbRatio = 0.50; // 50%
  static const double buildMuscleFatRatio = 0.20; // 20%

  /// Goal: maintain
  static const double maintainProteinRatio = 0.30; // 30%
  static const double maintainCarbRatio = 0.40; // 40%
  static const double maintainFatRatio = 0.30; // 30%

  /// Macronutrient Calories per Gram
  static const double caloriesPerGramProtein = 4.0;
  static const double caloriesPerGramCarb = 4.0;
  static const double caloriesPerGramFat = 9.0;
}

/// Fasting Constants
class FastingConstants {
  static const int minimumFastingHours = 12;
  static const int maximumFastingHours = 48;
  static const int defaultFastingHours = 16;
}

/// DateTime Constants
class DateTimeConstants {
  static const String dateFormat = 'dd/MM/yyyy';
  static const String timeFormat = 'HH:mm';
  static const String dateTimeFormat = 'dd/MM/yyyy HH:mm';
  static const String isoDateFormat = 'yyyy-MM-dd';
  static const String isoDateTimeFormat = 'yyyy-MM-ddTHH:mm:ss';
}
