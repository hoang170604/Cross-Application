import 'package:flutterfrontend/data/datasources/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';
import 'package:flutterfrontend/core/services/nutrition_calculator_service.dart';

abstract class UserUsecase {
  Future<UserEntity?> register(String email, String password);
  Future<dynamic> login(String email, String password);
  Future<UserEntity?> getUserById(int id);
  Future<void> changePassword(int userId, String newPassword);
  Future<NutritionGoalEntity?> updateProfileAndCalculateGoal(
    int userId,
    UserProfileEntity profile,
  );
  Future<NutritionGoalEntity?> getNutritionGoal(int userId);
  Future<UserProfileEntity?> getUserProfile(int userId);
  Future<void> requestPasswordReset(String email);
  Future<void> verifyEmail(String token);
}

class UserUsecaseImpl implements UserUsecase {
  final UserRemoteDatasource remoteDatasource;

  UserUsecaseImpl({required this.remoteDatasource});

  @override
  Future<UserEntity?> register(String email, String password) async {
    try {
      if (email.isEmpty || password.isEmpty) {
        throw Exception('Email and password are required');
      }
      final data = await remoteDatasource.register(email, password);
      if (data != null) {
        return UserEntity(
          id: data['id'] as int?,
          email: data['email'] as String?,
          password: data['password'] as String?,
          createdAt: data['createdAt'] != null
              ? DateTime.parse(data['createdAt'] as String)
              : null,
        );
      }
      return null;
    } catch (e) {
      throw Exception('Error registering: $e');
    }
  }

  @override
  Future<dynamic> login(String email, String password) async {
    try {
      if (email.isEmpty || password.isEmpty) {
        throw Exception('Email and password are required');
      }
      return await remoteDatasource.login(email, password);
    } catch (e) {
      throw Exception('Error logging in: $e');
    }
  }

  @override
  Future<UserEntity?> getUserById(int id) async {
    try {
      final data = await remoteDatasource.getUserById(id);
      if (data != null) {
        return UserEntity(
          id: data['id'] as int?,
          email: data['email'] as String?,
          createdAt: data['createdAt'] != null
              ? DateTime.parse(data['createdAt'] as String)
              : null,
        );
      }
      return null;
    } catch (e) {
      throw Exception('Error fetching user: $e');
    }
  }

  @override
  Future<void> changePassword(int userId, String newPassword) async {
    try {
      if (newPassword.isEmpty) {
        throw Exception('New password cannot be empty');
      }
      await remoteDatasource.changePassword(userId, newPassword);
    } catch (e) {
      throw Exception('Error changing password: $e');
    }
  }

  @override
  Future<NutritionGoalEntity?> updateProfileAndCalculateGoal(
    int userId,
    UserProfileEntity profile,
  ) async {
    try {
      // Validate required fields
      if (profile.age == null ||
          profile.gender == null ||
          profile.height == null ||
          profile.weight == null ||
          profile.goal == null) {
        throw Exception('Chưa cung cấp đầy đủ thông tin hồ sơ');
      }

      // Calculate nutrition goal based on profile data
      final nutritionGoal = NutritionCalculatorService.calculateNutritionGoal(
        age: profile.age!,
        gender: profile.gender!,
        heightCm: profile.height!,
        weightKg: profile.weight!,
        goal: profile.goal!,
        activityLevel: profile.activityLevel ?? 1.55,
      );

      // Update the nutrition goal with userId
      final goalWithUserId = nutritionGoal.copyWith(userId: userId);

      // Send to backend
      final profileData = {
        'age': profile.age,
        'gender': profile.gender,
        'height': profile.height,
        'weight': profile.weight,
        'activityLevel': profile.activityLevel,
        'goal': profile.goal,
        'name': profile.name,
        'fastingGoal': profile.fastingGoal,
        'targetCalories': goalWithUserId.targetCalories,
        'targetProtein': goalWithUserId.targetProtein,
        'targetCarb': goalWithUserId.targetCarb,
        'targetFat': goalWithUserId.targetFat,
      };
      await remoteDatasource.updateProfileAndCalculateGoal(userId, profileData);

      return goalWithUserId;
    } catch (e) {
      throw Exception('Lỗi cập nhật hồ sơ: $e');
    }
  }

  Future<NutritionGoalEntity?> getNutritionGoal(int userId) async {
    try {
      final data = await remoteDatasource.getNutritionGoal(userId);
      if (data != null) {
        return NutritionGoalEntity(
          id: data['id'] as int?,
          userId: data['userId'] as int?,
          targetCalories: (data['targetCalories'] as num?)?.toDouble(),
          targetProtein: (data['targetProtein'] as num?)?.toDouble(),
          targetCarb: (data['targetCarb'] as num?)?.toDouble(),
          targetFat: (data['targetFat'] as num?)?.toDouble(),
          createdAt: data['createdAt'] != null
              ? DateTime.parse(data['createdAt'] as String)
              : null,
        );
      }
      return null;
    } catch (e) {
      throw Exception('Error fetching nutrition goal: $e');
    }
  }

  Future<UserProfileEntity?> getUserProfile(int userId) async {
    try {
      final data = await remoteDatasource.getUserProfile(userId);
      if (data != null) {
        return UserProfileEntity(
          userId: data['userId'] as int?,
          age: data['age'] as int?,
          gender: data['gender'] as String?,
          height: (data['height'] as num?)?.toDouble(),
          weight: (data['weight'] as num?)?.toDouble(),
          activityLevel: (data['activityLevel'] as num?)?.toDouble(),
          goal: data['goal'] as String?,
          name: data['name'] as String?,
          fastingGoal: data['fastingGoal'] as String?,
        );
      }
      return null;
    } catch (e) {
      throw Exception('Error fetching user profile: $e');
    }
  }

  @override
  Future<void> requestPasswordReset(String email) async {
    try {
      if (email.isEmpty) {
        throw Exception('Email is required');
      }
      await remoteDatasource.requestPasswordReset(email);
    } catch (e) {
      throw Exception('Error requesting password reset: $e');
    }
  }

  @override
  Future<void> verifyEmail(String token) async {
    try {
      if (token.isEmpty) {
        throw Exception('Token is required');
      }
      await remoteDatasource.verifyEmail(token);
    } catch (e) {
      throw Exception('Error verifying email: $e');
    }
  }
}
