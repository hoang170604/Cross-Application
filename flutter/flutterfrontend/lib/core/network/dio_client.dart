import 'package:dio/dio.dart';
import 'package:flutterfrontend/core/constants/values.dart';
import 'package:flutterfrontend/core/network/auth_interceptor.dart';
import 'package:flutterfrontend/core/services/token_service.dart';

class DioClient {
  static final DioClient _instance = DioClient._internal();

  late final Dio _dio;

  factory DioClient() {
    return _instance;
  }

  DioClient._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppValues.apiBaseUrl,
        connectTimeout: Duration(seconds: AppValues.httpConnectTimeout),
        receiveTimeout: Duration(seconds: AppValues.httpReceiveTimeout),
        sendTimeout: Duration(seconds: AppValues.httpSendTimeout),
        headers: AppValues.defaultHttpHeaders,
        contentType: 'application/json',
        responseType: ResponseType.json,
      ),
    );

    // Add logging interceptor
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (AppValues.enableLogging) {
            print('REQUEST[${options.method}] => PATH: ${options.path}');
            print('Headers: ${options.headers}');
            if (options.data != null) {
              print('Data: ${options.data}');
            }
          }
          return handler.next(options);
        },
        onResponse: (response, handler) {
          if (AppValues.enableLogging) {
            print('RESPONSE[${response.statusCode}] => PATH: ${response.requestOptions.path}');
            print('Data: ${response.data}');
          }
          return handler.next(response);
        },
        onError: (DioException e, handler) {
          if (AppValues.enableLogging) {
            print('ERROR[${e.response?.statusCode}] => PATH: ${e.requestOptions.path}');
            print('Error: ${e.message}');
          }
          return handler.next(e);
        },
      ),
    );
  }

  Dio get client => _dio;

  /// Add authentication interceptor to Dio client
  /// Call this after TokenService is initialized
  void addAuthInterceptor(TokenService tokenService) {
    _dio.interceptors.add(
      AuthInterceptor(tokenService: tokenService, dio: _dio),
    );
  }

  Future<void> close() async {
    _dio.close();
  }
}
