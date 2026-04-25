import 'package:flutterfrontend/data/datasources/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

abstract class ProgressUsecase {
  Future<List<WeightLogEntity>> getWeightHistory(
    int userId,
    DateTime startDate,
    DateTime endDate,
  );
  Future<List<DailyNutritionEntity>> getNutritionReport(
    int userId,
    DateTime startDate,
    DateTime endDate,
  );
  Future<WeightLogEntity?> getLatestWeight(int userId);
  Future<void> logWeight(int userId, double weight, DateTime date);
  Future<DailyNutritionEntity?> getDailyNutrition(int userId, DateTime date);
  Future<ReportSummaryEntity?> getNutritionSummary(
    int userId,
    DateTime start,
    DateTime end,
  );
  Future<void> onChallengeCompleted(int userId, int challengeId);
}

class ProgressUsecaseImpl implements ProgressUsecase {
  final ProgressRemoteDatasource remoteDatasource;

  ProgressUsecaseImpl({required this.remoteDatasource});

  @override
  Future<List<WeightLogEntity>> getWeightHistory(
    int userId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      final data = await remoteDatasource.getWeightHistory(userId, startDate, endDate);
      return (data)
          .map((item) => WeightLogEntity(
                id: item['id'] as int?,
                userId: item['userId'] as int?,
                weight: (item['weight'] as num?)?.toDouble(),
                date: item['date'] != null ? DateTime.parse(item['date'] as String) : null,
              ))
          .toList();
    } catch (e) {
      throw Exception('Error fetching weight history: $e');
    }
  }

  @override
  Future<List<DailyNutritionEntity>> getNutritionReport(
    int userId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      final data = await remoteDatasource.getNutritionReport(userId, startDate, endDate);
      return (data)
          .map((item) => DailyNutritionEntity(
                id: item['id'] as int?,
                userId: item['userId'] as int?,
                date: item['date'] != null ? DateTime.parse(item['date'] as String) : null,
                totalCalories: (item['totalCalories'] as num?)?.toDouble(),
                totalProtein: (item['totalProtein'] as num?)?.toDouble(),
                totalCarb: (item['totalCarb'] as num?)?.toDouble(),
                totalFat: (item['totalFat'] as num?)?.toDouble(),
              ))
          .toList();
    } catch (e) {
      throw Exception('Error fetching nutrition report: $e');
    }
  }

  @override
  Future<WeightLogEntity?> getLatestWeight(int userId) async {
    try {
      final data = await remoteDatasource.getLatestWeight(userId);
      if (data != null) {
        return WeightLogEntity(
          id: data['id'] as int?,
          userId: data['userId'] as int?,
          weight: (data['weight'] as num?)?.toDouble(),
          date: data['date'] != null ? DateTime.parse(data['date'] as String) : null,
        );
      }
      return null;
    } catch (e) {
      throw Exception('Error fetching latest weight: $e');
    }
  }

  @override
  Future<void> logWeight(int userId, double weight, DateTime date) async {
    try {
      await remoteDatasource.logWeight(userId, weight, date);
    } catch (e) {
      throw Exception('Error logging weight: $e');
    }
  }

  @override
  Future<DailyNutritionEntity?> getDailyNutrition(int userId, DateTime date) async {
    try {
      final data = await remoteDatasource.getDailyNutrition(userId, date);
      if (data != null) {
        return DailyNutritionEntity(
          id: data['id'] as int?,
          userId: data['userId'] as int?,
          date: data['date'] != null ? DateTime.parse(data['date'] as String) : null,
          totalCalories: (data['totalCalories'] as num?)?.toDouble(),
          totalProtein: (data['totalProtein'] as num?)?.toDouble(),
          totalCarb: (data['totalCarb'] as num?)?.toDouble(),
          totalFat: (data['totalFat'] as num?)?.toDouble(),
        );
      }
      return null;
    } catch (e) {
      throw Exception('Error fetching daily nutrition: $e');
    }
  }

  @override
  Future<ReportSummaryEntity?> getNutritionSummary(
    int userId,
    DateTime start,
    DateTime end,
  ) async {
    try {
      final data = await remoteDatasource.getNutritionSummary(userId, start, end);
      if (data != null) {
        return ReportSummaryEntity(
          userId: data['userId'] as int?,
          startDate: data['startDate'] != null ? DateTime.parse(data['startDate'] as String) : null,
          endDate: data['endDate'] != null ? DateTime.parse(data['endDate'] as String) : null,
          totalCalories: (data['totalCalories'] as num?)?.toDouble(),
          averageCaloriesPerDay: (data['averageCaloriesPerDay'] as num?)?.toDouble(),
          totalProtein: (data['totalProtein'] as num?)?.toDouble(),
          totalCarbs: (data['totalCarbs'] ?? data['totalCarb'] as num?)?.toDouble(),
          totalFat: (data['totalFat'] as num?)?.toDouble(),
        );
      }
      return null;
    } catch (e) {
      throw Exception('Error generating nutrition summary: $e');
    }
  }

  @override
  Future<void> onChallengeCompleted(int userId, int challengeId) async {
    try {
      // Called when a workout challenge completes to update progress/achievements
    } catch (e) {
      throw Exception('Error handling challenge completion: $e');
    }
  }
}
