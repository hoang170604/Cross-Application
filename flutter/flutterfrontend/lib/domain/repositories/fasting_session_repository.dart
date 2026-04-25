abstract class FastingSessionRepository {
  Future<List<Map<String, dynamic>>> findByUserId(int userId);
  Future<Map<String, dynamic>?> findFirstByUserIdAndIsCompletedFalse(int userId);
  Future<Map<String, dynamic>?> findById(int id);
  Future<void> save(Map<String, dynamic> fastingSession);
  Future<void> update(int id, Map<String, dynamic> fastingSession);
  Future<void> delete(int id);
  Future<List<Map<String, dynamic>>> findAll();
}
