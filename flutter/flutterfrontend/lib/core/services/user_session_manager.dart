import 'package:shared_preferences/shared_preferences.dart';

class UserSessionManager {
  static const String _userIdKey = 'user_id';
  static const String _emailKey = 'user_email';
  static const String _tokenKey = 'auth_token';

  final SharedPreferences _prefs;

  UserSessionManager({required SharedPreferences prefs}) : _prefs = prefs;

  // Lưu userId
  Future<bool> setUserId(int userId) async {
    return await _prefs.setInt(_userIdKey, userId);
  }

  // Lấy userId
  int? getUserId() {
    return _prefs.getInt(_userIdKey);
  }

  // Lưu email
  Future<bool> setEmail(String email) async {
    return await _prefs.setString(_emailKey, email);
  }

  // Lấy email
  String? getEmail() {
    return _prefs.getString(_emailKey);
  }

  // Lưu token
  Future<bool> setToken(String token) async {
    return await _prefs.setString(_tokenKey, token);
  }

  // Lấy token
  String? getToken() {
    return _prefs.getString(_tokenKey);
  }

  // Đăng xuất
  Future<bool> logout() async {
    await _prefs.remove(_userIdKey);
    await _prefs.remove(_emailKey);
    await _prefs.remove(_tokenKey);
    return true;
  }

  // Kiểm tra đã đăng nhập
  bool isLoggedIn() {
    return getUserId() != null && getToken() != null;
  }
}
