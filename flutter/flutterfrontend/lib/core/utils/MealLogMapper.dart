import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class MealLogMapper {
  /// Convert MealLogEntity to MealLogModel
  /// Note: Maps nested objects (food.id, meal.id) to simple IDs
  static MealLogModel toModel(MealLogEntity entity) {
    return MealLogModel(
      foodId: entity.foodId,
      mealId: entity.mealId,
      quantity: entity.quantity,
      calories: entity.calories,
      protein: entity.protein,
      carb: entity.carb,
      fat: entity.fat,
    );
  }

  /// Convert MealLogModel to MealLogEntity
  /// Note: id, food, and meal are ignored in mapping
  static MealLogEntity toEntity(MealLogModel model) {
    return MealLogEntity(
      id: null, // Ignored in mapping
      foodId: model.foodId,
      mealId: model.mealId,
      quantity: model.quantity,
      calories: model.calories,
      protein: model.protein,
      carb: model.carb,
      fat: model.fat,
    );
  }
}