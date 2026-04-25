abstract class MealRepository {
  Future<List<Map<String, dynamic>>> findByUserIdAndDate(
    int userId,
    DateTime date,
  );
  Future<List<Map<String, dynamic>>> findByUserIdAndMealType(
    int userId,
    String mealType,
  );
  Future<List<Map<String, dynamic>>> findByDateAndMealType(
    DateTime date,
    String mealType,
  );
  Future<Map<String, dynamic>?> save(Map<String, dynamic> meal);
  Future<Map<String, dynamic>?> findById(int id);
  Future<void> update(int id, Map<String, dynamic> meal);
  Future<void> delete(int id);
}
