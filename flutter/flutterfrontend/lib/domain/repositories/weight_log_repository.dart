abstract class WeightLogRepository {
  Future<List<Map<String, dynamic>>> findByUserIdOrderByDateAsc(int userId);
  Future<List<Map<String, dynamic>>> findByUserIdAndDateBetweenOrderByDateAsc(
    int userId,
    DateTime startDate,
    DateTime endDate,
  );
  Future<Map<String, dynamic>?> findByUserIdAndDate(int userId, DateTime date);
  Future<Map<String, dynamic>?> findTopByUserIdOrderByDateDesc(int userId);
  Future<void> deleteByUserId(int userId);
  Future<Map<String, dynamic>?> findById(int id);
  Future<void> save(Map<String, dynamic> weightLog);
  Future<void> update(int id, Map<String, dynamic> weightLog);
  Future<void> delete(int id);
}
