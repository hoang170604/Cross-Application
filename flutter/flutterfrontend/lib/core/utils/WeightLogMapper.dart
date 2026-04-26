import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class WeightLogMapper {
  /// Convert WeightLogEntity to WeightLogModel
  /// Note: Maps nested object (user.id) to simple userId
  static WeightLogModel toModel(WeightLogEntity entity) {
    return WeightLogModel(
      userId: entity.userId,
      date: entity.date,
      weight: entity.weight,
    );
  }

  /// Convert WeightLogModel to WeightLogEntity
  /// Note: id is ignored in mapping, userId is mapped to user
  static WeightLogEntity toEntity(WeightLogModel model) {
    return WeightLogEntity(
      id: null, // Ignored in mapping
      userId: model.userId,
      date: model.date,
      weight: model.weight,
    );
  }
}