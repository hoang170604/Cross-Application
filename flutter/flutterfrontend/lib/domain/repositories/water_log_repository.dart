abstract class WaterLogRepository {
  Future<List<Map<String, dynamic>>> findByUserIdAndLogDate(
    int userId,
    DateTime logDate,
  );
  Future<double> sumAmountByUserIdAndLogDate(int userId, DateTime logDate);
  Future<List<Map<String, dynamic>>> findByUserIdAndLogDateBetween(
    int userId,
    DateTime start,
    DateTime end,
  );
  Future<Map<String, dynamic>?> findById(int id);
  Future<void> save(Map<String, dynamic> waterLog);
  Future<void> update(int id, Map<String, dynamic> waterLog);
  Future<void> delete(int id);
}
