abstract class DailyNutritionRepository {
  Future<Map<String, dynamic>?> findByUserIdAndDate(
    int userId,
    DateTime date,
  );
  Future<List<Map<String, dynamic>>> findAllByUserIdAndDateBetween(
    int userId,
    DateTime startDate,
    DateTime endDate,
  );
  Future<int> incrementTotals(
    int userId,
    DateTime date,
    double deltaCalories,
    double deltaProtein,
    double deltaCarb,
    double deltaFat,
  );
  Future<Map<String, dynamic>?> findById(int id);
  Future<void> save(Map<String, dynamic> dailyNutrition);
  Future<void> update(int id, Map<String, dynamic> dailyNutrition);
  Future<void> delete(int id);
}
