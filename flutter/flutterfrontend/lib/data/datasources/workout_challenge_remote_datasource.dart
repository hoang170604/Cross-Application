import 'package:dio/dio.dart';

abstract class WorkoutChallengeRemoteDatasource {
  Future<List<dynamic>> listAll();
  Future<List<dynamic>> listForUser(int userId);
  Future<dynamic> get(int id);
  Future<void> create(Map<String, dynamic> challengeData);
  Future<void> update(int id, Map<String, dynamic> challengeData);
  Future<void> delete(int id);
}

class WorkoutChallengeRemoteDatasourceImpl
    implements WorkoutChallengeRemoteDatasource {
  final Dio dio;
  static const String _baseUrl = '/api/workout-challenges';

  WorkoutChallengeRemoteDatasourceImpl({required this.dio});

  @override
  Future<List<dynamic>> listAll() async {
    try {
      final response = await dio.get(_baseUrl);
      if (response.statusCode != 200) {
        throw Exception('Failed to list workout challenges');
      }
      return response.data['data'] ?? [];
    } on DioException catch (e) {
      throw Exception('Error fetching workout challenges: ${e.message}');
    }
  }

  @override
  Future<List<dynamic>> listForUser(int userId) async {
    try {
      final response = await dio.get('$_baseUrl/user/$userId');
      if (response.statusCode != 200) {
        throw Exception('Failed to list user workout challenges');
      }
      return response.data['data'] ?? [];
    } on DioException catch (e) {
      throw Exception('Error fetching user workout challenges: ${e.message}');
    }
  }

  @override
  Future<dynamic> get(int id) async {
    try {
      final response = await dio.get('$_baseUrl/$id');
      if (response.statusCode != 200) {
        throw Exception('Failed to get workout challenge');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error fetching workout challenge: ${e.message}');
    }
  }

  @override
  Future<void> create(Map<String, dynamic> challengeData) async {
    try {
      final response = await dio.post(
        _baseUrl,
        data: challengeData,
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to create workout challenge');
      }
    } on DioException catch (e) {
      throw Exception('Error creating workout challenge: ${e.message}');
    }
  }

  @override
  Future<void> update(int id, Map<String, dynamic> challengeData) async {
    try {
      final response = await dio.put(
        '$_baseUrl/$id',
        data: challengeData,
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to update workout challenge');
      }
    } on DioException catch (e) {
      throw Exception('Error updating workout challenge: ${e.message}');
    }
  }

  @override
  Future<void> delete(int id) async {
    try {
      final response = await dio.delete('$_baseUrl/$id');
      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete workout challenge');
      }
    } on DioException catch (e) {
      throw Exception('Error deleting workout challenge: ${e.message}');
    }
  }
}
