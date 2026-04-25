# Cấu trúc Dự án Flutter - Clean Architecture

## 📁 Cấu trúc Thư mục

```
lib/
├── core/
│   ├── constants/
│   │   └── values.dart              # Tất cả hằng số cấu hình (API URL, timeouts, etc.)
│   ├── di/
│   │   └── service_locator.dart     # Dependency Injection setup (GetIt)
│   └── network/
│       └── dio_client.dart          # Dio HTTP client singleton
│
├── data/
│   ├── datasources/                 # Remote data sources (HTTP calls)
│   │   ├── activity_remote_datasource.dart
│   │   ├── diary_remote_datasource.dart
│   │   ├── fasting_remote_datasource.dart
│   │   ├── fasting_session_remote_datasource.dart
│   │   ├── food_remote_datasource.dart
│   │   ├── progress_remote_datasource.dart
│   │   ├── user_remote_datasource.dart
│   │   ├── water_remote_datasource.dart
│   │   ├── workout_challenge_remote_datasource.dart
│   │   └── index.dart               # Export all datasources
│   ├── models/                      # API response models (serialization)
│   │   └── ...
│   └── repositories/                # Repository implementations (local DB future)
│       └── ...
│
├── domain/
│   ├── entities/                    # Pure business objects
│   │   ├── activity_entity.dart
│   │   ├── daily_nutrition_entity.dart
│   │   ├── fasting_session_entity.dart
│   │   ├── fasting_state_entity.dart
│   │   ├── food_entity.dart
│   │   ├── food_category_entity.dart
│   │   ├── meal_entity.dart
│   │   ├── meal_log_entity.dart
│   │   ├── nutrition_goal_entity.dart
│   │   ├── report_summary_entity.dart
│   │   ├── user_entity.dart
│   │   ├── user_profile_entity.dart
│   │   ├── water_log_entity.dart
│   │   ├── weight_log_entity.dart
│   │   ├── workout_challenge_entity.dart
│   │   └── index.dart               # Export all entities
│   ├── repositories/                # Repository interfaces
│   │   ├── activity_repository.dart
│   │   ├── daily_nutrition_repository.dart
│   │   ├── fasting_session_repository.dart
│   │   ├── fasting_state_repository.dart
│   │   ├── food_category_repository.dart
│   │   ├── food_repository.dart
│   │   ├── meal_log_repository.dart
│   │   ├── meal_repository.dart
│   │   ├── nutrition_goal_repository.dart
│   │   ├── user_repository.dart
│   │   ├── water_log_repository.dart
│   │   ├── weight_log_repository.dart
│   │   ├── workout_challenge_repository.dart
│   │   └── index.dart               # Export all repositories
│   └── usecases/                    # Business logic (orchestration)
│       ├── activity_usecase.dart
│       ├── daily_nutrition_usecase.dart
│       ├── diary_usecase.dart
│       ├── fasting_session_usecase.dart
│       ├── fasting_state_usecase.dart
│       ├── food_usecase.dart
│       ├── progress_usecase.dart
│       ├── user_usecase.dart
│       ├── water_usecase.dart
│       ├── workout_challenge_usecase.dart
│       └── index.dart               # Export all usecases
│
├── presentation/                    # UI layer (under development)
│   ├── screens/
│   └── widgets/
│
└── main.dart                        # App entry point
```

## 🔄 Data Flow

```
UI (Screens)
    ↓
Usecases (Business Logic)
    ↓
Datasources (HTTP Calls)
    ↓
API Server (Backend)
```

## 📦 Key Components

### 1. **Datasources** (data/datasources/)
- Chịu trách nhiệm gọi API qua Dio HTTP client
- Ánh xạ API response thành các định dạng phù hợp
- Xử lý lỗi DioException

**Ví dụ sử dụng:**
```dart
final activityDatasource = getIt<ActivityRemoteDatasource>();
await activityDatasource.addActivity(userId, activityData);
```

### 2. **Entities** (domain/entities/)
- Các đối tượng business domain thuần (không phụ thuộc serialization)
- Hỗ trợ `copyWith()`, `==`, `hashCode`, `toString()`
- Sử dụng trong toàn bộ ứng dụng

**Ví dụ:**
```dart
final activity = ActivityEntity(
  id: 1,
  userId: 5,
  type: 'running',
  caloriesBurned: 500,
);
```

### 3. **Usecases** (domain/usecases/)
- Chứa business logic orchestration
- Kết hợp datasources với business rules
- Chuyển đổi API responses thành Entities

**Ví dụ:**
```dart
final activityUsecase = getIt<ActivityUsecase>();
await activityUsecase.addActivity(
  userId, 'running', 30, 500, 
  DateTime.now(), null, null, null, null
);
```

### 4. **Repositories** (domain/repositories/)
- Interface trừu tượng cho persistence layer
- Sẽ được implement với local database trong tương lai
- Hiện tại là placeholder cho kiến trúc

### 5. **DioClient** (core/network/dio_client.dart)
- Singleton instance của Dio HTTP client
- Cấu hình BaseURL, timeouts, headers
- Logging interceptor cho debugging

**Cấu hình:**
```dart
- Base URL: http://10.0.2.2:8081  (Android Emulator)
- Connect Timeout: 30 seconds
- Receive Timeout: 30 seconds
- Send Timeout: 30 seconds
```

### 6. **Service Locator** (core/di/service_locator.dart)
- Quản lý dependency injection với GetIt
- Khởi tạo toàn bộ datasources, usecases, repositories
- Gọi `setupServiceLocator()` trong main.dart

## 🚀 Cách sử dụng

### Setup trong main.dart:
```dart
import 'package:flutterfrontend/core/di/service_locator.dart';

void main() {
  setupServiceLocator();  // Initialize DI
  runApp(const MyApp());
}
```

### Sử dụng Usecase:
```dart
import 'package:flutterfrontend/core/di/service_locator.dart';
import 'package:flutterfrontend/domain/usecases/index.dart';

// Trong Widget hoặc Controller
final userUsecase = getIt<UserUsecase>();
final user = await userUsecase.login('email@example.com', 'password123');
```

### Lấy tất cả thực phẩm:
```dart
final foodUsecase = getIt<FoodUsecase>();
final foods = await foodUsecase.getAllFood();
```

### Ghi log cân nặng:
```dart
final progressUsecase = getIt<ProgressUsecase>();
await progressUsecase.logWeight(userId, 75.5, DateTime.now());
```

## ⚙️ Cấu hình (lib/core/constants/values.dart)

- **API Host**: 10.0.2.2 (Android Emulator) - thay đổi thành 127.0.0.1 hoặc IP máy của bạn nếu cần
- **API Port**: 8081
- **HTTP Timeouts**: 30 giây
- **Feature Flags**: Offline mode, Caching, Logging
- **Authentication**: Token storage keys, expiry times
- **Nutrition Constants**: BMR formula, Activity multipliers, Macro ratios

## 📋 Dependency Injection (GetIt)

**Các dependencies được inject tự động:**
- 9 Remote Datasources
- 10 Usecases
- DioClient singleton

## 🔧 Dependencies (pubspec.yaml)

```yaml
dependencies:
  dio: ^5.4.0              # HTTP Client
  get_it: ^7.6.0           # Dependency Injection
  shared_preferences: ^2.2.2  # Local Storage
```

## 📝 Ghi chú

1. **URL API**: Đảm bảo backend Spring Boot đang chạy trên `http://10.0.2.2:8081`
2. **Android Emulator**: Sử dụng `10.0.2.2` thay vì `127.0.0.1`
3. **Physical Device**: Thay đổi `apiHost` trong values.dart thành IP máy của bạn
4. **Null Safety**: Tất cả nullable fields sử dụng `?` operator
5. **Error Handling**: Tất cả datasources có proper DioException handling

## 🎯 Tiếp theo

- [ ] Implement presentation layer (UI Screens)
- [ ] Add local database repository implementations
- [ ] Setup state management (BLoC/Riverpod)
- [ ] Add authentication token refresh logic
- [ ] Implement offline support
- [ ] Add unit & integration tests
