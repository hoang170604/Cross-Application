abstract class UserRepository {
  Future<Map<String, dynamic>?> findByEmail(String email);
  Future<List<Map<String, dynamic>>> findAllUser();
  Future<void> updateUser(Map<String, dynamic> user);
  Future<void> deleteUser(int id);
  Future<Map<String, dynamic>?> findById(int id);
  Future<Map<String, dynamic>?> save(Map<String, dynamic> user);
}
