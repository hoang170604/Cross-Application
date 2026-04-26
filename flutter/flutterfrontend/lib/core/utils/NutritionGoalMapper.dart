import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class NutritionGoalMapper {
  /// Convert NutritionGoalEntity to NutritionGoalModel
  static NutritionGoalModel toModel(NutritionGoalEntity entity) {
    return NutritionGoalModel(
      targetCalories: entity.targetCalories,
      targetProtein: entity.targetProtein,
      targetCarb: entity.targetCarb,
      targetFat: entity.targetFat,
      createdAt: entity.createdAt,
    );
  }

  /// Convert NutritionGoalModel to NutritionGoalEntity
  /// Note: id and user are ignored in mapping
  static NutritionGoalEntity toEntity(NutritionGoalModel model) {
    return NutritionGoalEntity(
      id: null, // Ignored in mapping
      userId: null, // Ignored in mapping
      targetCalories: model.targetCalories,
      targetProtein: model.targetProtein,
      targetCarb: model.targetCarb,
      targetFat: model.targetFat,
      createdAt: model.createdAt,
    );
  }
}