import 'package:dio/dio.dart';

abstract class DiaryRemoteDatasource {
  Future<void> addFood(
    int userId,
    String mealType,
    Map<String, dynamic> mealLogData, {
    DateTime? date,
  });
  Future<void> updateMealLog(int id, Map<String, dynamic> mealLogData);
  Future<void> deleteMealLog(int id);
}

class DiaryRemoteDatasourceImpl implements DiaryRemoteDatasource {
  final Dio dio;
  static const String _baseUrl = '/api/diaries';

  DiaryRemoteDatasourceImpl({required this.dio});

  @override
  Future<void> addFood(
    int userId,
    String mealType,
    Map<String, dynamic> mealLogData, {
    DateTime? date,
  }) async {
    try {
      final queryParameters = <String, dynamic>{};
      if (date != null) {
        queryParameters['date'] = date.toIso8601String().split('T')[0];
      }

      final response = await dio.post(
        '$_baseUrl/users/$userId/meals/$mealType',
        data: mealLogData,
        queryParameters: queryParameters.isNotEmpty ? queryParameters : null,
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to add food');
      }
    } on DioException catch (e) {
      throw Exception('Error adding food: ${e.message}');
    }
  }

  @override
  Future<void> updateMealLog(int id, Map<String, dynamic> mealLogData) async {
    try {
      final response = await dio.put(
        '$_baseUrl/meal-logs/$id',
        data: mealLogData,
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to update meal log');
      }
    } on DioException catch (e) {
      throw Exception('Error updating meal log: ${e.message}');
    }
  }

  @override
  Future<void> deleteMealLog(int id) async {
    try {
      final response = await dio.delete('$_baseUrl/meal-logs/$id');
      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete meal log');
      }
    } on DioException catch (e) {
      throw Exception('Error deleting meal log: ${e.message}');
    }
  }
}
