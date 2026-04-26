import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class FastingStateMapper {
  /// Convert FastingStateEntity to FastingStateModel
  /// Note: Maps nested object (user.id) to simple userId, endTime is ignored
  static FastingStateModel toModel(FastingStateEntity entity) {
    return FastingStateModel(
      userId: entity.userId,
      isFasting: entity.isFasting,
      startTime: entity.startTime,
      endTime: null, // Ignored in mapping
      fastingGoalHours: entity.fastingGoalHours,
    );
  }

  /// Convert FastingStateModel to FastingStateEntity
  /// Note: user is ignored in mapping
  static FastingStateEntity toEntity(FastingStateModel model) {
    return FastingStateEntity(
      userId: model.userId,
      isFasting: model.isFasting,
      startTime: model.startTime,
      endTime: model.endTime,
      fastingGoalHours: model.fastingGoalHours,
    );
  }
}