import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class DailyNutritionMapper {
  /// Convert DailyNutritionEntity to DailyNutritionModel
  static DailyNutritionModel toModel(DailyNutritionEntity entity) {
    return DailyNutritionModel(
      date: entity.date,
      totalCalories: entity.totalCalories,
      totalProtein: entity.totalProtein,
      totalCarb: entity.totalCarb,
      totalFat: entity.totalFat,
    );
  }

  /// Convert DailyNutritionModel to DailyNutritionEntity
  static DailyNutritionEntity toEntity(DailyNutritionModel model) {
    return DailyNutritionEntity(
      id: null, // Can be populated from server
      userId: null, // Can be populated from context
      date: model.date,
      totalCalories: model.totalCalories,
      totalProtein: model.totalProtein,
      totalCarb: model.totalCarb,
      totalFat: model.totalFat,
    );
  }
}