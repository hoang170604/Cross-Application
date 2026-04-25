abstract class MealLogRepository {
  Future<List<Map<String, dynamic>>> findByMealId(int id);
  Future<void> deleteByMealId(int id);
  Future<double> sumCaloriesByUserIdAndDate(int userId, DateTime date);
  Future<double> sumProteinByUserIdAndDate(int userId, DateTime date);
  Future<double> sumCarbByUserIdAndDate(int userId, DateTime date);
  Future<double> sumFatByUserIdAndDate(int userId, DateTime date);
  Future<Map<String, dynamic>?> findById(int id);
  Future<void> save(Map<String, dynamic> mealLog);
  Future<void> update(int id, Map<String, dynamic> mealLog);
  Future<void> delete(int id);
}
