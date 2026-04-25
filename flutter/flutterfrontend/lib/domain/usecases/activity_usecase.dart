import 'package:flutterfrontend/data/datasources/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

abstract class ActivityUsecase {
  Future<void> addActivity(
    int userId,
    String type,
    int? durationMinutes,
    double? caloriesBurned,
    DateTime? startTime,
    double? distanceKm,
    int? steps,
    String? source,
    String? externalId,
  );
  Future<void> updateActivity(int id, Map<String, dynamic> update);
  Future<void> deleteActivity(int id);
  Future<List<ActivityEntity>> getActivitiesBetween(
    int userId,
    DateTime start,
    DateTime end,
  );
  Future<double> getCaloriesBurned(int userId, DateTime date);
}

class ActivityUsecaseImpl implements ActivityUsecase {
  final ActivityRemoteDatasource remoteDatasource;

  ActivityUsecaseImpl({required this.remoteDatasource});

  @override
  Future<void> addActivity(
    int userId,
    String type,
    int? durationMinutes,
    double? caloriesBurned,
    DateTime? startTime,
    double? distanceKm,
    int? steps,
    String? source,
    String? externalId,
  ) async {
    try {
      final activityData = {
        'activityType': type,
        'durationMinutes': durationMinutes,
        'caloriesBurned': caloriesBurned,
        'startTime': startTime?.toIso8601String(),
        'distanceKm': distanceKm,
        'steps': steps,
        'source': source,
        'externalId': externalId,
      };
      await remoteDatasource.addActivity(userId, activityData);
    } catch (e) {
      throw Exception('Error adding activity: $e');
    }
  }

  @override
  Future<void> updateActivity(int id, Map<String, dynamic> update) async {
    try {
      await remoteDatasource.updateActivity(id, update);
    } catch (e) {
      throw Exception('Error updating activity: $e');
    }
  }

  @override
  Future<void> deleteActivity(int id) async {
    try {
      await remoteDatasource.deleteActivity(id);
    } catch (e) {
      throw Exception('Error deleting activity: $e');
    }
  }

  @override
  Future<List<ActivityEntity>> getActivitiesBetween(
    int userId,
    DateTime start,
    DateTime end,
  ) async {
    try {
      // TODO: Implement fetching activities between dates
      return [];
    } catch (e) {
      throw Exception('Error fetching activities: $e');
    }
  }

  @override
  Future<double> getCaloriesBurned(int userId, DateTime date) async {
    try {
      // TODO: Implement calculating calories burned on a specific date
      return 0.0;
    } catch (e) {
      throw Exception('Error calculating calories burned: $e');
    }
  }
}
