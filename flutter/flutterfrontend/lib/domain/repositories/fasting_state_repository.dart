abstract class FastingStateRepository {
  Future<Map<String, dynamic>?> findById(int id);
  Future<void> save(Map<String, dynamic> fastingState);
  Future<void> update(int id, Map<String, dynamic> fastingState);
  Future<void> delete(int id);
  Future<List<Map<String, dynamic>>> findAll();
}
