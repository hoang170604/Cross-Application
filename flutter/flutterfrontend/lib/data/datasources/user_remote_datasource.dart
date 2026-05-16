import 'package:dio/dio.dart';

abstract class UserRemoteDatasource {
  Future<dynamic> register(String email, String password);
  Future<dynamic> login(String email, String password);
  Future<dynamic> getUserById(int id);
  Future<void> changePassword(int id, String newPassword);
  Future<dynamic> updateProfileAndCalculateGoal(
    int id,
    Map<String, dynamic> profileData,
  );
  Future<dynamic> getNutritionGoal(int userId);
  Future<dynamic> getUserProfile(int userId);
  Future<void> requestPasswordReset(String email);
  Future<void> verifyEmail(String token);
}

class UserRemoteDatasourceImpl implements UserRemoteDatasource {
  final Dio dio;
  static const String _baseUrl = '/api/users';

  UserRemoteDatasourceImpl({required this.dio});

  @override
  Future<dynamic> register(String email, String password) async {
    try {
      final response = await dio.post(
        '$_baseUrl/register',
        data: {
          'email': email,
          'password': password,
        },
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to register');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error registering: ${e.message}');
    }
  }

  @override
  Future<dynamic> login(String email, String password) async {
    try {
      final response = await dio.post(
        '$_baseUrl/login',
        data: {
          'email': email,
          'password': password,
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to login');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error logging in: ${e.message}');
    }
  }

  @override
  Future<dynamic> getUserById(int id) async {
    try {
      final response = await dio.get('$_baseUrl/$id');
      if (response.statusCode != 200) {
        throw Exception('Failed to get user');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error fetching user: ${e.message}');
    }
  }

  @override
  Future<void> changePassword(int id, String newPassword) async {
    try {
      final response = await dio.put(
        '$_baseUrl/$id/password',
        data: {
          'newPassword': newPassword,
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to change password');
      }
    } on DioException catch (e) {
      throw Exception('Error changing password: ${e.message}');
    }
  }

  @override
  Future<dynamic> updateProfileAndCalculateGoal(
    int id,
    Map<String, dynamic> profileData,
  ) async {
    try {
      final response = await dio.put(
        '$_baseUrl/$id/profile',
        data: profileData,
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to update profile');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error updating profile: ${e.message}');
    }
  }

  @override
  Future<dynamic> getNutritionGoal(int userId) async {
    try {
      final response = await dio.get(
        '$_baseUrl/$userId/nutrition-goal',
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to get nutrition goal');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error fetching nutrition goal: ${e.message}');
    }
  }

  @override
  Future<dynamic> getUserProfile(int userId) async {
    try {
      final response = await dio.get(
        '$_baseUrl/$userId/profile',
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to get user profile');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error fetching user profile: ${e.message}');
    }
  }

  @override
  Future<void> requestPasswordReset(String email) async {
    try {
      final response = await dio.post(
        '$_baseUrl/password-reset',
        data: {
          'email': email,
        },
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to request password reset');
      }
    } on DioException catch (e) {
      throw Exception('Error requesting password reset: ${e.message}');
    }
  }

  @override
  Future<void> verifyEmail(String token) async {
    try {
      final response = await dio.post(
        '$_baseUrl/verify-email',
        data: {
          'token': token,
        },
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to verify email');
      }
    } on DioException catch (e) {
      throw Exception('Error verifying email: ${e.message}');
    }
  }
}
