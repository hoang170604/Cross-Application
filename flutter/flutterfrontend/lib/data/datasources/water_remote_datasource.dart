import 'package:dio/dio.dart';

abstract class WaterRemoteDatasource {
  Future<void> logWater(
    int userId,
    DateTime timestamp,
    double amountMl,
    String? source,
    String? externalId,
  );
  Future<double> getDailyTotal(int userId, DateTime date);
  Future<List<dynamic>> getLogsBetween(
    int userId,
    DateTime start,
    DateTime end,
  );
}

class WaterRemoteDatasourceImpl implements WaterRemoteDatasource {
  final Dio dio;
  static const String _baseUrl = '/api/water';

  WaterRemoteDatasourceImpl({required this.dio});

  @override
  Future<void> logWater(
    int userId,
    DateTime timestamp,
    double amountMl,
    String? source,
    String? externalId,
  ) async {
    try {
      if (amountMl <= 0) {
        throw Exception('Amount must be greater than 0');
      }
      final response = await dio.post(
        '$_baseUrl/log',
        data: {
          'userId': userId,
          'timestamp': timestamp.toIso8601String(),
          'amountMl': amountMl,
          'source': source,
          'externalId': externalId,
        },
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to log water');
      }
    } on DioException catch (e) {
      throw Exception('Error logging water: ${e.message}');
    }
  }

  @override
  Future<double> getDailyTotal(int userId, DateTime date) async {
    try {
      final response = await dio.get(
        '$_baseUrl/daily-total',
        queryParameters: {
          'userId': userId,
          'date': date.toIso8601String().split('T')[0],
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to get daily water total');
      }
      return (response.data['data'] as num?)?.toDouble() ?? 0.0;
    } on DioException catch (e) {
      throw Exception('Error getting daily water total: ${e.message}');
    }
  }

  @override
  Future<List<dynamic>> getLogsBetween(
    int userId,
    DateTime start,
    DateTime end,
  ) async {
    try {
      final response = await dio.get(
        '$_baseUrl/logs',
        queryParameters: {
          'userId': userId,
          'startDate': start.toIso8601String().split('T')[0],
          'endDate': end.toIso8601String().split('T')[0],
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to fetch water logs');
      }
      return response.data['data'] ?? [];
    } on DioException catch (e) {
      throw Exception('Error fetching water logs: ${e.message}');
    }
  }
}
