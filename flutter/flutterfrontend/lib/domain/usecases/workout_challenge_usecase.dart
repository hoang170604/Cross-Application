import 'package:flutterfrontend/data/datasources/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

abstract class WorkoutChallengeUsecase {
  Future<List<WorkoutChallengeEntity>> listAll();
  Future<List<WorkoutChallengeEntity>> listForUser(int userId);
  Future<WorkoutChallengeEntity?> get(int id);
  Future<void> create(Map<String, dynamic> challengeData);
  Future<void> update(int id, Map<String, dynamic> update);
  Future<void> delete(int id);
}

class WorkoutChallengeUsecaseImpl implements WorkoutChallengeUsecase {
  final WorkoutChallengeRemoteDatasource remoteDatasource;

  WorkoutChallengeUsecaseImpl({required this.remoteDatasource});

  @override
  Future<List<WorkoutChallengeEntity>> listAll() async {
    try {
      final data = await remoteDatasource.listAll();
      return (data)
          .map((item) => WorkoutChallengeEntity(
                id: item['id'] as int?,
                userId: item['userId'] as int?,
                challengeName: item['challengeName'] as String?,
                targetValue: (item['targetValue'] as num?)?.toDouble(),
                currentValue: (item['currentValue'] as num?)?.toDouble(),
                unit: item['unit'] as String?,
                isActive: item['isActive'] as bool?,
                startDate: item['startDate'] != null
                    ? DateTime.parse(item['startDate'] as String)
                    : null,
                endDate: item['endDate'] != null
                    ? DateTime.parse(item['endDate'] as String)
                    : null,
              ))
          .toList();
    } catch (e) {
      throw Exception('Error listing all challenges: $e');
    }
  }

  @override
  Future<List<WorkoutChallengeEntity>> listForUser(int userId) async {
    try {
      final data = await remoteDatasource.listForUser(userId);
      return (data)
          .map((item) => WorkoutChallengeEntity(
                id: item['id'] as int?,
                userId: item['userId'] as int?,
                challengeName: item['challengeName'] as String?,
                targetValue: (item['targetValue'] as num?)?.toDouble(),
                currentValue: (item['currentValue'] as num?)?.toDouble(),
                unit: item['unit'] as String?,
                isActive: item['isActive'] as bool?,
                startDate: item['startDate'] != null
                    ? DateTime.parse(item['startDate'] as String)
                    : null,
                endDate: item['endDate'] != null
                    ? DateTime.parse(item['endDate'] as String)
                    : null,
              ))
          .toList();
    } catch (e) {
      throw Exception('Error listing user challenges: $e');
    }
  }

  @override
  Future<WorkoutChallengeEntity?> get(int id) async {
    try {
      final data = await remoteDatasource.get(id);
      if (data != null) {
        return WorkoutChallengeEntity(
          id: data['id'] as int?,
          userId: data['userId'] as int?,
          challengeName: data['challengeName'] as String?,
          targetValue: (data['targetValue'] as num?)?.toDouble(),
          currentValue: (data['currentValue'] as num?)?.toDouble(),
          unit: data['unit'] as String?,
          isActive: data['isActive'] as bool?,
          startDate: data['startDate'] != null
              ? DateTime.parse(data['startDate'] as String)
              : null,
          endDate: data['endDate'] != null
              ? DateTime.parse(data['endDate'] as String)
              : null,
        );
      }
      return null;
    } catch (e) {
      throw Exception('Error fetching challenge: $e');
    }
  }

  @override
  Future<void> create(Map<String, dynamic> challengeData) async {
    try {
      if (!challengeData.containsKey('userId') ||
          !challengeData.containsKey('challengeName') ||
          !challengeData.containsKey('targetValue')) {
        throw Exception('Required fields missing: userId, challengeName, targetValue');
      }
      await remoteDatasource.create(challengeData);
    } catch (e) {
      throw Exception('Error creating challenge: $e');
    }
  }

  @override
  Future<void> update(int id, Map<String, dynamic> update) async {
    try {
      await remoteDatasource.update(id, update);
    } catch (e) {
      throw Exception('Error updating challenge: $e');
    }
  }

  @override
  Future<void> delete(int id) async {
    try {
      await remoteDatasource.delete(id);
    } catch (e) {
      throw Exception('Error deleting challenge: $e');
    }
  }
}
