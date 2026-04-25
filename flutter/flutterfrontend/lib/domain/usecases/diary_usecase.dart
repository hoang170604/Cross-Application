import 'package:flutterfrontend/data/datasources/index.dart';

abstract class DiaryUsecase {
  Future<void> addFood(
    int userId,
    String mealType,
    Map<String, dynamic> mealLogData, {
    DateTime? date,
  });
  Future<void> updateMealLog(int id, Map<String, dynamic> update);
  Future<void> deleteMealLog(int id);
}

class DiaryUsecaseImpl implements DiaryUsecase {
  final DiaryRemoteDatasource remoteDatasource;

  DiaryUsecaseImpl({required this.remoteDatasource});

  @override
  Future<void> addFood(
    int userId,
    String mealType,
    Map<String, dynamic> mealLogData, {
    DateTime? date,
  }) async {
    try {
      await remoteDatasource.addFood(
        userId,
        mealType,
        mealLogData,
        date: date,
      );
    } catch (e) {
      throw Exception('Error adding food to meal: $e');
    }
  }

  @override
  Future<void> updateMealLog(int id, Map<String, dynamic> update) async {
    try {
      await remoteDatasource.updateMealLog(id, update);
    } catch (e) {
      throw Exception('Error updating meal log: $e');
    }
  }

  @override
  Future<void> deleteMealLog(int id) async {
    try {
      await remoteDatasource.deleteMealLog(id);
    } catch (e) {
      throw Exception('Error deleting meal log: $e');
    }
  }
}
