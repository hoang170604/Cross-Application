import 'package:flutterfrontend/data/datasources/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

abstract class FastingSessionUsecase {
  Future<void> create(Map<String, dynamic> sessionData);
  Future<FastingSessionEntity?> get(int id);
  Future<List<FastingSessionEntity>> listForUser(int userId);
  Future<void> update(int id, Map<String, dynamic> update);
  Future<void> delete(int id);
}

class FastingSessionUsecaseImpl implements FastingSessionUsecase {
  final FastingSessionRemoteDatasource remoteDatasource;

  FastingSessionUsecaseImpl({required this.remoteDatasource});

  @override
  Future<void> create(Map<String, dynamic> sessionData) async {
    try {
      await remoteDatasource.create(sessionData);
    } catch (e) {
      throw Exception('Error creating fasting session: $e');
    }
  }

  @override
  Future<FastingSessionEntity?> get(int id) async {
    try {
      final data = await remoteDatasource.get(id);
      if (data != null) {
        return FastingSessionEntity(
          id: data['id'] as int?,
          userId: data['userId'] as int?,
          startTime: data['startTime'] != null
              ? DateTime.parse(data['startTime'] as String)
              : null,
          endTime: data['endTime'] != null
              ? DateTime.parse(data['endTime'] as String)
              : null,
          durationMinutes: data['durationMinutes'] as int?,
          isCompleted: data['isCompleted'] as bool?,
        );
      }
      return null;
    } catch (e) {
      throw Exception('Error fetching fasting session: $e');
    }
  }

  @override
  Future<List<FastingSessionEntity>> listForUser(int userId) async {
    try {
      final data = await remoteDatasource.listForUser(userId);
      return (data)
          .map((item) => FastingSessionEntity(
                id: item['id'] as int?,
                userId: item['userId'] as int?,
                startTime: item['startTime'] != null
                    ? DateTime.parse(item['startTime'] as String)
                    : null,
                endTime: item['endTime'] != null
                    ? DateTime.parse(item['endTime'] as String)
                    : null,
                durationMinutes: item['durationMinutes'] as int?,
                isCompleted: item['isCompleted'] as bool?,
              ))
          .toList();
    } catch (e) {
      throw Exception('Error listing fasting sessions: $e');
    }
  }

  @override
  Future<void> update(int id, Map<String, dynamic> update) async {
    try {
      await remoteDatasource.update(id, update);
    } catch (e) {
      throw Exception('Error updating fasting session: $e');
    }
  }

  @override
  Future<void> delete(int id) async {
    try {
      await remoteDatasource.delete(id);
    } catch (e) {
      throw Exception('Error deleting fasting session: $e');
    }
  }
}
