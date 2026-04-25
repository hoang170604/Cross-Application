abstract class NutritionGoalRepository {
  Future<Map<String, dynamic>?> findFirstByUserIdOrderByCreatedAtDesc(int userId);
  Future<void> deleteByUserId(int id);
  Future<Map<String, dynamic>?> findById(int id);
  Future<void> save(Map<String, dynamic> nutritionGoal);
  Future<void> update(int id, Map<String, dynamic> nutritionGoal);
  Future<void> delete(int id);
  Future<List<Map<String, dynamic>>> findAll();
}
