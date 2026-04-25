import 'package:flutterfrontend/data/datasources/index.dart';

abstract class DailyNutritionUsecase {
  Future<void> adjustDailyTotals(
    int userId,
    DateTime date,
    double deltaCalories,
    double deltaProtein,
    double deltaCarb,
    double deltaFat,
  );
}

class DailyNutritionUsecaseImpl implements DailyNutritionUsecase {
  final DiaryRemoteDatasource remoteDatasource;

  DailyNutritionUsecaseImpl({required this.remoteDatasource});

  @override
  Future<void> adjustDailyTotals(
    int userId,
    DateTime date,
    double deltaCalories,
    double deltaProtein,
    double deltaCarb,
    double deltaFat,
  ) async {
    try {
      // Daily nutrition adjustments are handled through meal log updates
      // This is typically called internally when meals are added/updated
    } catch (e) {
      throw Exception('Error adjusting daily nutrition totals: $e');
    }
  }
}
