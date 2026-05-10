# 🌉 API Response - Frontend Bridge Documentation

## Overview

The API Response model in the Flutter frontend is a standardized "bridge" that mirrors the backend's `ApiResponse<T>` structure. This ensures complete synchronization between frontend and backend API communication.

**Backend Reference:** `com.crossapplication.main.dto.ApiResponse.java`

---

## 📁 Files

### 1. **data/models/api_response_model.dart**
- **Purpose:** Data layer model for API responses
- **Generic:** `ApiResponseModel<T>` - Type-safe response wrapper
- **Responsibility:** JSON serialization/deserialization
- **Used by:** Repositories, Datasources

### 2. **domain/entities/api_response_entity.dart**
- **Purpose:** Domain layer entity for API responses
- **Generic:** `ApiResponseEntity<T>` - Business logic representation
- **Responsibility:** Business logic and status checking
- **Used by:** Use cases, Business logic

### 3. **core/utils/ApiResponseMapper.dart**
- **Purpose:** Convert between Model and Entity
- **Methods:** `toModel()`, `toEntity()`, `toJson()`, `fromJson()`
- **Responsibility:** Data layer ↔ Domain layer conversion

---

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────┐
│    Presentation Layer               │
│  (Screens, ViewModels, Riverpod)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Domain Layer                     │
│  (Use Cases, Entities)              │
│  └─ ApiResponseEntity<T>            │
└──────────────┬──────────────────────┘
               │ Mapper
├──────────────▼──────────────────────┐
│    Data Layer                       │
│  (Repositories, Datasources)        │
│  └─ ApiResponseModel<T>             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    API / Network Layer              │
│  (DIO, HTTP Requests)               │
└─────────────────────────────────────┘
```

---

## 🎯 Field Mapping

### From Backend (Java) to Frontend (Dart)

| Backend Field | Dart Field | Type | Notes |
|---|---|---|---|
| `status` | `status` | `int` | HTTP status code (200, 400, 404, 500, etc.) |
| `message` | `message` | `String?` | Human-readable message |
| `data` | `data` | `T?` | Generic data payload |
| `errorCode` | `errorCode` | `String?` | Machine-readable error code |

---

## 💡 Usage Examples

### Example 1: Creating Success Response

```dart
// Backend
@PostMapping("/register")
public ResponseEntity<ApiResponse<?>> register(@RequestBody UserDTO userDTO) {
    User user = userService.register(userDTO);
    return ResponseEntity.ok(ApiResponse.success(user));
}

// Frontend - Receiving
final response = ApiResponseModel.fromJson(
  jsonData,
  (data) => UserModel.fromJson(data),
);

if (response.isSuccess) {
  final userData = response.data;
  print('User registered: ${userData.email}');
}
```

### Example 2: Handling Errors

```dart
// Backend
return ResponseEntity.badRequest()
    .body(ApiResponse.error("Invalid email", "INVALID_EMAIL"));

// Frontend - Handling
try {
  final response = await datasource.registerUser(user);
  if (response.isBadRequest) {
    print('Error: ${response.message}');
    print('Error Code: ${response.errorCode}');
  }
} catch (e) {
  print('Network error: $e');
}
```

### Example 3: In Repository Pattern

```dart
class UserRepository {
  final UserRemoteDatasource remoteDatasource;

  Future<Either<Failure, User>> registerUser(UserModel model) async {
    try {
      final response = await remoteDatasource.register(model);
      
      // Using mapper to convert to entity
      final entity = ApiResponseMapper.toEntity(response);
      
      if (entity.isSuccess && entity.data != null) {
        return Right(entity.data!);
      } else {
        return Left(ServerFailure(entity.message ?? 'Unknown error'));
      }
    } on DioException catch (e) {
      return Left(NetworkFailure(e.message ?? 'Network error'));
    }
  }
}
```

### Example 4: In Use Case

```dart
class RegisterUserUseCase {
  final UserRepository repository;

  Future<Either<Failure, User>> call(UserModel user) async {
    return await repository.registerUser(user);
  }
}
```

### Example 5: Using Helper Methods

```dart
// Creating different types of responses
final success = ApiResponseModel.success(userData);
final customSuccess = ApiResponseModel.successWithMessage(userData, 'User loaded');
final error = ApiResponseModel.error('Something went wrong');
final errorWithCode = ApiResponseModel.errorWithCode('Invalid input', 'INVALID_PARAMS');
final custom = ApiResponseModel.customStatus(404, 'Not found', errorCode: 'NOT_FOUND');

// Status checking
if (response.isSuccess) { }
if (response.isError) { }
if (response.isBadRequest) { }
if (response.isUnauthorized) { }
if (response.isForbidden) { }
if (response.isNotFound) { }
if (response.isServerError) { }
```

---

## 📊 Status Codes Reference

| Code | Meaning | Method |
|---|---|---|
| 200 | Success | `.isSuccess` |
| 400 | Bad Request | `.isBadRequest` |
| 401 | Unauthorized | `.isUnauthorized` |
| 403 | Forbidden | `.isForbidden` |
| 404 | Not Found | `.isNotFound` |
| 500+ | Server Error | `.isServerError` |
| Any ≠ 200 | Error | `.isError` |

---

## 🔄 Data Flow

### Request Flow (Frontend → Backend)

```
┌─────────────────────────────────────────┐
│ 1. User Action (Button Click, etc.)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 2. ViewModel/Riverpod State             │
│    (triggers use case)                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 3. Use Case                             │
│    (business logic)                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 4. Repository                           │
│    (data coordination)                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 5. Remote Datasource                    │
│    (API calls with Model)               │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 6. DIO HTTP Client                      │
│    (JSON serialization)                 │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 7. Network Request to Backend           │
└─────────────────────────────────────────┘
```

### Response Flow (Backend → Frontend)

```
┌─────────────────────────────────────────┐
│ 1. Backend Returns ApiResponse<T>       │
│    (status, message, data, errorCode)   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 2. DIO Receives JSON Response           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 3. Parse to ApiResponseModel<T>         │
│    (fromJson with dataFromJson callback)│
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 4. Datasource Returns ApiResponseModel  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 5. Repository Maps to Entity            │
│    (using ApiResponseMapper.toEntity)   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 6. Repository Processes Response        │
│    (check status, extract data)         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 7. Return Result to Use Case            │
│    (Either<Failure, T>)                 │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 8. Use Case Returns to ViewModel        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 9. ViewModel Updates UI State           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 10. UI Renders Based on State           │
└─────────────────────────────────────────┘
```

---

## 🛠️ Best Practices

### ✅ Do's

1. **Always use Status Checking:**
   ```dart
   if (response.isSuccess) {
     // Handle success
   } else if (response.isUnauthorized) {
     // Handle 401
   } else if (response.isServerError) {
     // Handle 500+
   }
   ```

2. **Use Mapper for Layer Conversion:**
   ```dart
   final entity = ApiResponseMapper.toEntity(model);
   ```

3. **Provide Data Conversion Callbacks:**
   ```dart
   ApiResponseModel.fromJson(
     json,
     (data) => UserModel.fromJson(data),
   )
   ```

4. **Check Error Code for Specific Handling:**
   ```dart
   if (response.errorCode == 'INVALID_EMAIL') {
     // Handle invalid email specifically
   }
   ```

5. **Use Helper Methods:**
   ```dart
   final success = ApiResponseModel.success(data);
   final error = ApiResponseModel.errorWithCode(msg, 'ERROR_CODE');
   ```

### ❌ Don'ts

1. **Don't ignore error responses:**
   ```dart
   // Bad
   final data = response.data;
   
   // Good
   if (response.isSuccess) {
     final data = response.data;
   }
   ```

2. **Don't forget to provide dataFromJson callback:**
   ```dart
   // Bad
   ApiResponseModel.fromJson(json, null)
   
   // Good
   ApiResponseModel.fromJson(json, (d) => UserModel.fromJson(d))
   ```

3. **Don't create ApiResponseModel directly in UI:**
   ```dart
   // Bad - direct model in UI
   
   // Good - use entities in use cases
   ```

---

## 🔀 Synchronization with Backend

### Backend Methods Matched in Frontend

| Backend | Frontend | Purpose |
|---------|----------|---------|
| `.success(data)` | `.success(data)` | Create success response |
| `.success(data, msg)` | `.successWithMessage(data, msg)` | Success with custom message |
| `.error(msg)` | `.error(msg)` | Create error response |
| `.error(msg, code)` | `.errorWithCode(msg, code)` | Error with code |
| Status field | `status` property | HTTP status code |
| Generic type | Generic type `<T>` | Type-safe responses |

---

## 📝 Complete Datasource Example

```dart
import 'package:dio/dio.dart';
import 'package:flutterfrontend/data/models/api_response_model.dart';
import 'package:flutterfrontend/data/models/user_model.dart';

abstract class UserRemoteDatasource {
  Future<ApiResponseModel<UserModel>> registerUser(UserModel user);
  Future<ApiResponseModel<UserModel>> getUserById(int id);
}

class UserRemoteDatasourceImpl implements UserRemoteDatasource {
  final Dio dio;
  static const String _baseUrl = '/api/users';

  UserRemoteDatasourceImpl({required this.dio});

  @override
  Future<ApiResponseModel<UserModel>> registerUser(UserModel user) async {
    try {
      final response = await dio.post(
        '$_baseUrl/register',
        data: user.toJson(),
      );
      
      return ApiResponseModel.fromJson(
        response.data,
        (data) => UserModel.fromJson(data),
      );
    } on DioException catch (e) {
      return ApiResponseModel.errorWithCode(
        e.message ?? 'Network error',
        'NETWORK_ERROR',
      );
    }
  }

  @override
  Future<ApiResponseModel<UserModel>> getUserById(int id) async {
    try {
      final response = await dio.get('$_baseUrl/$id');
      
      return ApiResponseModel.fromJson(
        response.data,
        (data) => UserModel.fromJson(data),
      );
    } on DioException catch (e) {
      return ApiResponseModel.errorWithCode(
        e.message ?? 'Network error',
        'NETWORK_ERROR',
      );
    }
  }
}
```

---

## 🚀 Integration Checklist

- ✅ Use `ApiResponseModel<T>` in datasources and repositories
- ✅ Use `ApiResponseEntity<T>` in use cases and domain logic
- ✅ Use `ApiResponseMapper` to convert between layers
- ✅ Check response status before accessing data
- ✅ Handle all possible HTTP status codes
- ✅ Provide data conversion callbacks
- ✅ Log responses for debugging
- ✅ Return proper error types from repositories

---

## 📚 Related Files

- **Backend:** `com.crossapplication.main.dto.ApiResponse.java`
- **Frontend Model:** `lib/data/models/api_response_model.dart`
- **Frontend Entity:** `lib/domain/entities/api_response_entity.dart`
- **Frontend Mapper:** `lib/core/utils/ApiResponseMapper.dart`
- **Synchronization Report:** `SYNC_REPORT.md`

---

*Last Updated: May 6, 2026*
