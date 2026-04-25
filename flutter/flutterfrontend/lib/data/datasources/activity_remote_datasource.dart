import 'package:dio/dio.dart';

abstract class ActivityRemoteDatasource {
  Future<void> addActivity(int userId, Map<String, dynamic> activityData);
  Future<void> updateActivity(int id, Map<String, dynamic> activityData);
  Future<void> deleteActivity(int id);
}

class ActivityRemoteDatasourceImpl implements ActivityRemoteDatasource {
  final Dio dio;
  static const String _baseUrl = '/api/activities';

  ActivityRemoteDatasourceImpl({required this.dio});

  @override
  Future<void> addActivity(int userId, Map<String, dynamic> activityData) async {
    try {
      final response = await dio.post(
        '$_baseUrl/users/$userId',
        data: activityData,
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to add activity');
      }
    } on DioException catch (e) {
      throw Exception('Error adding activity: ${e.message}');
    }
  }

  @override
  Future<void> updateActivity(int id, Map<String, dynamic> activityData) async {
    try {
      final response = await dio.put(
        '$_baseUrl/$id',
        data: activityData,
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to update activity');
      }
    } on DioException catch (e) {
      throw Exception('Error updating activity: ${e.message}');
    }
  }

  @override
  Future<void> deleteActivity(int id) async {
    try {
      final response = await dio.delete('$_baseUrl/$id');
      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete activity');
      }
    } on DioException catch (e) {
      throw Exception('Error deleting activity: ${e.message}');
    }
  }
}
