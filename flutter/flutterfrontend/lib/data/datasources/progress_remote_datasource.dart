import 'package:dio/dio.dart';

abstract class ProgressRemoteDatasource {
  Future<List<dynamic>> getWeightHistory(
    int userId,
    DateTime startDate,
    DateTime endDate,
  );
  Future<List<dynamic>> getNutritionReport(
    int userId,
    DateTime startDate,
    DateTime endDate,
  );
  Future<dynamic> getLatestWeight(int userId);
  Future<void> logWeight(int userId, double weight, DateTime date);
  Future<dynamic> getDailyNutrition(int userId, DateTime date);
  Future<dynamic> getNutritionSummary(
    int userId,
    DateTime start,
    DateTime end,
  );
}

class ProgressRemoteDatasourceImpl implements ProgressRemoteDatasource {
  final Dio dio;
  static const String _baseUrl = '/api/progress';

  ProgressRemoteDatasourceImpl({required this.dio});

  @override
  Future<List<dynamic>> getWeightHistory(
    int userId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      final response = await dio.get(
        '$_baseUrl/weight',
        queryParameters: {
          'userId': userId,
          'startDate': startDate.toIso8601String().split('T')[0],
          'endDate': endDate.toIso8601String().split('T')[0],
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to fetch weight history');
      }
      return response.data['data'] ?? [];
    } on DioException catch (e) {
      throw Exception('Error fetching weight history: ${e.message}');
    }
  }

  @override
  Future<List<dynamic>> getNutritionReport(
    int userId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      final response = await dio.get(
        '$_baseUrl/report',
        queryParameters: {
          'userId': userId,
          'startDate': startDate.toIso8601String().split('T')[0],
          'endDate': endDate.toIso8601String().split('T')[0],
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to fetch nutrition report');
      }
      return response.data['data'] ?? [];
    } on DioException catch (e) {
      throw Exception('Error fetching nutrition report: ${e.message}');
    }
  }

  @override
  Future<dynamic> getLatestWeight(int userId) async {
    try {
      final response = await dio.get(
        '$_baseUrl/latest-weight',
        queryParameters: {'userId': userId},
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to fetch latest weight');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error fetching latest weight: ${e.message}');
    }
  }

  @override
  Future<void> logWeight(int userId, double weight, DateTime date) async {
    try {
      final response = await dio.post(
        '$_baseUrl/log-weight',
        data: {
          'userId': userId,
          'weight': weight,
          'date': date.toIso8601String().split('T')[0],
        },
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to log weight');
      }
    } on DioException catch (e) {
      throw Exception('Error logging weight: ${e.message}');
    }
  }

  @override
  Future<dynamic> getDailyNutrition(int userId, DateTime date) async {
    try {
      final response = await dio.get(
        '$_baseUrl/nutrition',
        queryParameters: {
          'userId': userId,
          'date': date.toIso8601String().split('T')[0],
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to fetch daily nutrition');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error fetching daily nutrition: ${e.message}');
    }
  }

  @override
  Future<dynamic> getNutritionSummary(
    int userId,
    DateTime start,
    DateTime end,
  ) async {
    try {
      final response = await dio.get(
        '$_baseUrl/nutrition/summary',
        queryParameters: {
          'userId': userId,
          'startDate': start.toIso8601String().split('T')[0],
          'endDate': end.toIso8601String().split('T')[0],
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to fetch nutrition summary');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error fetching nutrition summary: ${e.message}');
    }
  }
}
