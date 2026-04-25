abstract class ActivityRepository {
  Future<List<Map<String, dynamic>>> findByUserIdAndLogDateBetween(
    int userId,
    DateTime start,
    DateTime end,
  );
  Future<double> sumCaloriesByUserIdAndLogDate(
    int userId,
    DateTime logDate,
  );
  Future<List<Map<String, dynamic>>> findByUserIdAndLogDate(
    int userId,
    DateTime logDate,
  );
  Future<Map<String, dynamic>?> findById(int id);
  Future<void> save(Map<String, dynamic> activity);
  Future<void> update(int id, Map<String, dynamic> activity);
  Future<void> delete(int id);
}
