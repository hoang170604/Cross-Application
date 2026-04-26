import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class ActivityMapper {
  /// Convert ActivityEntity to ActivityModel
  /// Note: Maps nested object (user.id) to simple userId
  static ActivityModel toModel(ActivityEntity entity) {
    return ActivityModel(
      id: entity.id,
      userId: entity.userId,
      activityType: entity.activityType,
      durationMinutes: entity.durationMinutes,
      caloriesBurned: entity.caloriesBurned,
      logDate: entity.logDate,
      startTime: entity.startTime,
      distanceKm: entity.distanceKm,
      steps: entity.steps,
      source: entity.source,
      externalId: entity.externalId,
      createdAt: entity.createdAt,
    );
  }

  /// Convert ActivityModel to ActivityEntity
  /// Note: id is ignored in mapping, userId is mapped to user
  static ActivityEntity toEntity(ActivityModel model) {
    return ActivityEntity(
      id: null, // Ignored in mapping
      userId: model.userId,
      activityType: model.activityType,
      durationMinutes: model.durationMinutes,
      caloriesBurned: model.caloriesBurned,
      logDate: model.logDate,
      startTime: model.startTime,
      distanceKm: model.distanceKm,
      steps: model.steps,
      source: model.source,
      externalId: model.externalId,
      createdAt: model.createdAt,
    );
  }
}