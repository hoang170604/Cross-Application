abstract class FoodRepository {
  Future<Map<String, dynamic>?> saveFood(Map<String, dynamic> food);
  Future<void> deleteFood(int id);
  Future<Map<String, dynamic>?> findById(int id);
  Future<List<Map<String, dynamic>>> findAllFood();
  Future<List<Map<String, dynamic>>> findByNameContainingIgnoreCase(String keyword);
  Future<List<Map<String, dynamic>>> findByCategory(int categoryId);
  Future<double> calculateFood(double foodPer100g);
}
