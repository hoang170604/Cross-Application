import 'package:dio/dio.dart';

abstract class FastingRemoteDatasource {
  Future<void> startFasting(Map<String, dynamic> fastingData);
  Future<void> stopFasting(Map<String, dynamic> fastingData);
  Future<List<dynamic>> getSessions(int userId);
  Future<dynamic> getOpenSession(int userId);
}

class FastingRemoteDatasourceImpl implements FastingRemoteDatasource {
  final Dio dio;
  static const String _baseUrl = '/api/fasting';

  FastingRemoteDatasourceImpl({required this.dio});

  @override
  Future<void> startFasting(Map<String, dynamic> fastingData) async {
    try {
      final response = await dio.post(
        '$_baseUrl/start',
        data: fastingData,
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to start fasting');
      }
    } on DioException catch (e) {
      throw Exception('Error starting fasting: ${e.message}');
    }
  }

  @override
  Future<void> stopFasting(Map<String, dynamic> fastingData) async {
    try {
      final response = await dio.post(
        '$_baseUrl/stop',
        data: fastingData,
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to stop fasting');
      }
    } on DioException catch (e) {
      throw Exception('Error stopping fasting: ${e.message}');
    }
  }

  @override
  Future<List<dynamic>> getSessions(int userId) async {
    try {
      final response = await dio.get('$_baseUrl/sessions/$userId');
      if (response.statusCode != 200) {
        throw Exception('Failed to get fasting sessions');
      }
      return response.data['data'] ?? [];
    } on DioException catch (e) {
      throw Exception('Error fetching fasting sessions: ${e.message}');
    }
  }

  @override
  Future<dynamic> getOpenSession(int userId) async {
    try {
      final response = await dio.get('$_baseUrl/sessions/$userId/open');
      if (response.statusCode != 200) {
        throw Exception('Failed to get open fasting session');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error fetching open fasting session: ${e.message}');
    }
  }
}
