import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class FastingSessionMapper {
  /// Convert FastingSessionEntity to FastingSessionModel
  /// Note: Maps nested object (user.id) to simple userId
  static FastingSessionModel toModel(FastingSessionEntity entity) {
    return FastingSessionModel(
      id: entity.id,
      userId: entity.userId,
      startTime: entity.startTime,
      endTime: entity.endTime,
      durationMinutes: entity.durationMinutes,
      isCompleted: entity.isCompleted,
    );
  }

  /// Convert FastingSessionModel to FastingSessionEntity
  /// Note: id and user are ignored in mapping
  static FastingSessionEntity toEntity(FastingSessionModel model) {
    return FastingSessionEntity(
      id: null, // Ignored in mapping
      userId: model.userId,
      startTime: model.startTime,
      endTime: model.endTime,
      durationMinutes: model.durationMinutes,
      isCompleted: model.isCompleted,
    );
  }
}