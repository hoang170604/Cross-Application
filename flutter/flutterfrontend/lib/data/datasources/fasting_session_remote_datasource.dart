import 'package:dio/dio.dart';

abstract class FastingSessionRemoteDatasource {
  Future<List<dynamic>> listForUser(int userId);
  Future<dynamic> get(int id);
  Future<void> create(Map<String, dynamic> sessionData);
  Future<void> update(int id, Map<String, dynamic> sessionData);
  Future<void> delete(int id);
}

class FastingSessionRemoteDatasourceImpl implements FastingSessionRemoteDatasource {
  final Dio dio;
  static const String _baseUrl = '/api/fasting-sessions';

  FastingSessionRemoteDatasourceImpl({required this.dio});

  @override
  Future<List<dynamic>> listForUser(int userId) async {
    try {
      final response = await dio.get('$_baseUrl/user/$userId');
      if (response.statusCode != 200) {
        throw Exception('Failed to list fasting sessions');
      }
      return response.data['data'] ?? [];
    } on DioException catch (e) {
      throw Exception('Error fetching fasting sessions: ${e.message}');
    }
  }

  @override
  Future<dynamic> get(int id) async {
    try {
      final response = await dio.get('$_baseUrl/$id');
      if (response.statusCode != 200) {
        throw Exception('Failed to get fasting session');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error fetching fasting session: ${e.message}');
    }
  }

  @override
  Future<void> create(Map<String, dynamic> sessionData) async {
    try {
      final response = await dio.post(
        _baseUrl,
        data: sessionData,
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to create fasting session');
      }
    } on DioException catch (e) {
      throw Exception('Error creating fasting session: ${e.message}');
    }
  }

  @override
  Future<void> update(int id, Map<String, dynamic> sessionData) async {
    try {
      final response = await dio.put(
        '$_baseUrl/$id',
        data: sessionData,
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to update fasting session');
      }
    } on DioException catch (e) {
      throw Exception('Error updating fasting session: ${e.message}');
    }
  }

  @override
  Future<void> delete(int id) async {
    try {
      final response = await dio.delete('$_baseUrl/$id');
      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete fasting session');
      }
    } on DioException catch (e) {
      throw Exception('Error deleting fasting session: ${e.message}');
    }
  }
}
