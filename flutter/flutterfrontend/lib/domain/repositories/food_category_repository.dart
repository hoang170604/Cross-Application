abstract class FoodCategoryRepository {
  Future<List<Map<String, dynamic>>> findByName(String name);
  Future<List<Map<String, dynamic>>> findByNameContainingIgnoreCase(String keyword);
  Future<Map<String, dynamic>?> findById(int id);
  Future<void> save(Map<String, dynamic> foodCategory);
  Future<void> update(int id, Map<String, dynamic> foodCategory);
  Future<void> delete(int id);
  Future<List<Map<String, dynamic>>> findAll();
}
