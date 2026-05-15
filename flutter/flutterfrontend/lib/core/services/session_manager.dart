import 'package:flutterfrontend/core/services/token_service.dart';
import 'package:flutterfrontend/domain/entities/user_entity.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

abstract class SessionManager {
  Future<void> saveUserSession(UserEntity user);
  Future<UserEntity?> getUserSession();
  Future<bool> isUserLoggedIn();
  Future<void> clearUserSession();
  Future<UserEntity?> refreshUserSession();
}

class SessionManagerImpl implements SessionManager {
  static const String _userSessionKey = 'user_session';
  
  final TokenService tokenService;
  final SharedPreferences sharedPreferences;

  SessionManagerImpl({
    required this.tokenService,
    required this.sharedPreferences,
  });

  @override
  Future<void> saveUserSession(UserEntity user) async {
    try {
      final userJson = {
        'id': user.id,
        'email': user.email,
        'password': user.password,
        'createdAt': user.createdAt?.toIso8601String(),
      };
      
      await sharedPreferences.setString(
        _userSessionKey,
        jsonEncode(userJson),
      );
    } catch (e) {
      throw Exception('Failed to save user session: $e');
    }
  }

  @override
  Future<UserEntity?> getUserSession() async {
    try {
      final hasToken = await tokenService.hasToken();
      
      if (!hasToken) {
        return null;
      }

      final userJson = sharedPreferences.getString(_userSessionKey);
      
      if (userJson == null) {
        return null;
      }

      final decoded = jsonDecode(userJson) as Map<String, dynamic>;
      
      return UserEntity(
        id: decoded['id'] as int?,
        email: decoded['email'] as String?,
        password: decoded['password'] as String?,
        createdAt: decoded['createdAt'] != null
            ? DateTime.parse(decoded['createdAt'] as String)
            : null,
      );
    } catch (e) {
      return null;
    }
  }

  @override
  Future<bool> isUserLoggedIn() async {
    try {
      final hasToken = await tokenService.hasToken();
      final userSession = await getUserSession();
      
      return hasToken && userSession != null;
    } catch (e) {
      return false;
    }
  }

  @override
  Future<void> clearUserSession() async {
    try {
      await sharedPreferences.remove(_userSessionKey);
      await tokenService.deleteToken();
    } catch (e) {
      throw Exception('Failed to clear user session: $e');
    }
  }

  @override
  Future<UserEntity?> refreshUserSession() async {
    try {
      // Refresh user data from API if needed
      // For now, just return current session
      return await getUserSession();
    } catch (e) {
      return null;
    }
  }
}
