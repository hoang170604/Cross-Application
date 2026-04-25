import 'package:flutterfrontend/data/datasources/index.dart';

abstract class FastingStateUsecase {
  Future<void> startFasting(int userId, int goalHours);
  Future<void> stopFasting(int userId);
  Future<List<dynamic>> getSessions(int userId);
  Future<dynamic> getOpenSession(int userId);
}

class FastingStateUsecaseImpl implements FastingStateUsecase {
  final FastingRemoteDatasource remoteDatasource;

  FastingStateUsecaseImpl({required this.remoteDatasource});

  @override
  Future<void> startFasting(int userId, int goalHours) async {
    try {
      final fastingData = {
        'userId': userId,
        'isFasting': true,
        'startTime': DateTime.now().toIso8601String(),
        'fastingGoalHours': goalHours,
      };
      await remoteDatasource.startFasting(fastingData);
    } catch (e) {
      throw Exception('Error starting fasting: $e');
    }
  }

  @override
  Future<void> stopFasting(int userId) async {
    try {
      final fastingData = {
        'userId': userId,
        'isFasting': false,
        'endTime': DateTime.now().toIso8601String(),
      };
      await remoteDatasource.stopFasting(fastingData);
    } catch (e) {
      throw Exception('Error stopping fasting: $e');
    }
  }

  @override
  Future<List<dynamic>> getSessions(int userId) async {
    try {
      return await remoteDatasource.getSessions(userId);
    } catch (e) {
      throw Exception('Error fetching fasting sessions: $e');
    }
  }

  @override
  Future<dynamic> getOpenSession(int userId) async {
    try {
      return await remoteDatasource.getOpenSession(userId);
    } catch (e) {
      throw Exception('Error fetching open fasting session: $e');
    }
  }
}
