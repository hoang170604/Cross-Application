abstract class WorkoutChallengeRepository {
  Future<List<Map<String, dynamic>>> findByUserId(int userId);
  Future<Map<String, dynamic>?> findById(int id);
  Future<void> save(Map<String, dynamic> workoutChallenge);
  Future<void> update(int id, Map<String, dynamic> workoutChallenge);
  Future<void> delete(int id);
  Future<List<Map<String, dynamic>>> findAll();
}
