import 'package:flutterfrontend/data/datasources/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

abstract class UserUsecase {
  Future<UserEntity?> register(String email, String password);
  Future<dynamic> login(String email, String password);
  Future<UserEntity?> getUserById(int id);
  Future<void> changePassword(int userId, String newPassword);
  Future<NutritionGoalEntity?> updateProfileAndCalculateGoal(
    int userId,
    UserProfileEntity profile,
  );
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
      // Calculate nutrition goal based on profile data
      final profileData = {
        'age': profile.age,
        'gender': profile.gender,
        'height': profile.height,
        'weight': profile.weight,
        'activityLevel': profile.activityLevel,
        'goal': profile.goal,
        'name': profile.name,
        'fastingGoal': profile.fastingGoal,
      };
      await remoteDatasource.updateProfileAndCalculateGoal(userId, profileData);
      // TODO: Return calculated nutrition goal
      return null;
    } catch (e) {
      throw Exception('Error updating profile: $e');
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
