import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class WaterLogMapper {
  /// Convert WaterLogEntity to WaterLogModel
  /// Note: Maps nested object (user.id) to simple userId
  static WaterLogModel toModel(WaterLogEntity entity) {
    return WaterLogModel(
      id: entity.id,
      userId: entity.userId,
      logDate: entity.logDate,
      amountMl: entity.amountMl,
      source: entity.source,
      externalId: entity.externalId,
      createdAt: entity.createdAt,
    );
  }

  /// Convert WaterLogModel to WaterLogEntity
  /// Note: userId is mapped to user
  static WaterLogEntity toEntity(WaterLogModel model) {
    return WaterLogEntity(
      id: model.id,
      userId: model.userId,
      logDate: model.logDate,
      amountMl: model.amountMl,
      source: model.source,
      externalId: model.externalId,
      createdAt: model.createdAt,
    );
  }
}