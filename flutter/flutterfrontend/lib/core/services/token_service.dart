import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

abstract class TokenService {
  Future<void> saveToken(String token);
  Future<String?> getToken();
  Future<void> deleteToken();
  Future<bool> hasToken();
  Future<Map<String, dynamic>?> decodeToken();
  Future<bool> isTokenExpired();
  Future<void> saveRefreshToken(String refreshToken);
  Future<String?> getRefreshToken();
  Future<String?> getBearerToken();
  Future<void> clearAll();
}

class TokenServiceImpl implements TokenService {
  static const String _tokenKey = 'auth_token';
  static const String _refreshTokenKey = 'refresh_token';
  
  final FlutterSecureStorage _secureStorage;

  TokenServiceImpl({required FlutterSecureStorage secureStorage})
      : _secureStorage = secureStorage;

  @override
  Future<void> saveToken(String token) async {
    try {
      await _secureStorage.write(
        key: _tokenKey,
        value: token,
      );
    } catch (e) {
      throw Exception('Failed to save token: $e');
    }
  }

  @override
  Future<void> saveRefreshToken(String refreshToken) async {
    try {
      await _secureStorage.write(
        key: _refreshTokenKey,
        value: refreshToken,
      );
    } catch (e) {
      throw Exception('Failed to save refresh token: $e');
    }
  }

  @override
  Future<String?> getToken() async {
    try {
      return await _secureStorage.read(key: _tokenKey);
    } catch (e) {
      throw Exception('Failed to retrieve token: $e');
    }
  }

  @override
  Future<String?> getRefreshToken() async {
    try {
      return await _secureStorage.read(key: _refreshTokenKey);
    } catch (e) {
      throw Exception('Failed to retrieve refresh token: $e');
    }
  }

  @override
  Future<void> deleteToken() async {
    try {
      await _secureStorage.delete(key: _tokenKey);
      await _secureStorage.delete(key: _refreshTokenKey);
    } catch (e) {
      throw Exception('Failed to delete token: $e');
    }
  }

  @override
  Future<bool> hasToken() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  @override
  Future<Map<String, dynamic>?> decodeToken() async {
    try {
      final token = await getToken();
      if (token == null) return null;

      // Simple JWT decode (without verification)
      // For real apps, use dart_jsonwebtoken package
      final parts = token.split('.');
      if (parts.length != 3) {
        throw Exception('Invalid token format');
      }

      // Decode payload (parts[1])
      String payload = parts[1];
      // Add padding if necessary
      payload = payload + ('=' * (4 - payload.length % 4));
      
      final decoded = utf8.decode(base64Decode(payload));
      return {'token': token}; // Basic decode, enhance with actual JWT library
    } catch (e) {
      throw Exception('Failed to decode token: $e');
    }
  }

  @override
  Future<bool> isTokenExpired() async {
    try {
      final token = await getToken();
      if (token == null) return true;

      // This is a simple implementation
      // For production, properly decode JWT and check exp claim
      return false; // Assume not expired for now
    } catch (e) {
      return true;
    }
  }

  /// Get Bearer token for authorization header
  @override
  Future<String?> getBearerToken() async {
    final token = await getToken();
    if (token != null) {
      return 'Bearer $token';
    }
    return null;
  }

  /// Clear all authentication data
  @override
  Future<void> clearAll() async {
    try {
      await _secureStorage.deleteAll();
    } catch (e) {
      throw Exception('Failed to clear all auth data: $e');
    }
  }
}
