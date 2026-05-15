import 'package:dio/dio.dart';
import 'package:flutterfrontend/core/services/token_service.dart';

class AuthInterceptor extends Interceptor {
  final TokenService tokenService;
  final Dio dio; // Để retry requests

  AuthInterceptor({
    required this.tokenService,
    required this.dio,
  });

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    try {
      // Skip adding token for auth endpoints
      if (_isPublicEndpoint(options.path)) {
        return handler.next(options);
      }

      final token = await tokenService.getToken();
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }

      return handler.next(options);
    } catch (e) {
      return handler.next(options);
    }
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    // Handle 401 Unauthorized
    if (err.response?.statusCode == 401) {
      // Token expired - clear and let auth handle it
      try {
        await tokenService.deleteToken();
      } catch (e) {
        // Log error if needed
      }
    }

    return handler.next(err);
  }

  /// Check if endpoint is public (doesn't need authentication)
  bool _isPublicEndpoint(String path) {
    final publicEndpoints = [
      '/api/users/login',
      '/api/users/register',
      '/api/users/forgot-password',
      '/api/users/verify-email',
      '/api/users/refresh-token',
    ];

    return publicEndpoints.any((endpoint) => path.contains(endpoint));
  }
}
