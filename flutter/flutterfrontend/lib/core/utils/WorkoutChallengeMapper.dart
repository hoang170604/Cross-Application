import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class WorkoutChallengeMapper {
  /// Convert WorkoutChallengeEntity to WorkoutChallengeModel
  /// Note: Maps nested object (user.id) to simple userId
  static WorkoutChallengeModel toModel(WorkoutChallengeEntity entity) {
    return WorkoutChallengeModel(
      id: entity.id,
      userId: entity.userId,
      challengeName: entity.challengeName,
      targetValue: entity.targetValue,
      currentValue: entity.currentValue,
      unit: entity.unit,
      isActive: entity.isActive,
      startDate: entity.startDate,
      endDate: entity.endDate,
    );
  }

  /// Convert WorkoutChallengeModel to WorkoutChallengeEntity
  /// Note: id and user are ignored in mapping
  static WorkoutChallengeEntity toEntity(WorkoutChallengeModel model) {
    return WorkoutChallengeEntity(
      id: null, // Ignored in mapping
      userId: model.userId,
      challengeName: model.challengeName,
      targetValue: model.targetValue,
      currentValue: model.currentValue,
      unit: model.unit,
      isActive: model.isActive,
      startDate: model.startDate,
      endDate: model.endDate,
    );
  }
}