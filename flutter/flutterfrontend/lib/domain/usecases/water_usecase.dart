import 'package:flutterfrontend/data/datasources/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

abstract class WaterUsecase {
  Future<void> logWater(
    int userId,
    DateTime timestamp,
    double amountMl,
    String? source,
    String? externalId,
  );
  Future<double> getDailyTotal(int userId, DateTime date);
  Future<List<WaterLogEntity>> getLogsBetween(
    int userId,
    DateTime start,
    DateTime end,
  );
}

class WaterUsecaseImpl implements WaterUsecase {
  final WaterRemoteDatasource remoteDatasource;

  WaterUsecaseImpl({required this.remoteDatasource});

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
      await remoteDatasource.logWater(userId, timestamp, amountMl, source, externalId);
    } catch (e) {
      throw Exception('Error logging water: $e');
    }
  }

  @override
  Future<double> getDailyTotal(int userId, DateTime date) async {
    try {
      return await remoteDatasource.getDailyTotal(userId, date);
    } catch (e) {
      throw Exception('Error calculating daily water total: $e');
    }
  }

  @override
  Future<List<WaterLogEntity>> getLogsBetween(
    int userId,
    DateTime start,
    DateTime end,
  ) async {
    try {
      final data = await remoteDatasource.getLogsBetween(userId, start, end);
      return (data)
          .map((item) => WaterLogEntity(
                id: item['id'] as int?,
                userId: item['userId'] as int?,
                logDate: item['logDate'] != null
                    ? DateTime.parse(item['logDate'] as String)
                    : null,
                amountMl: (item['amountMl'] as num?)?.toDouble(),
                source: item['source'] as String?,
                externalId: item['externalId'] as String?,
              ))
          .toList();
    } catch (e) {
      throw Exception('Error fetching water logs: $e');
    }
  }
}
