import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class MealMapper {
  /// Convert MealEntity to MealModel
  static MealModel toModel(MealEntity entity) {
    return MealModel(
      mealType: entity.mealType,
      date: entity.date,
    );
  }

  /// Convert MealModel to MealEntity
  /// Note: id and user are ignored in mapping
  static MealEntity toEntity(MealModel model) {
    return MealEntity(
      id: null, // Ignored in mapping
      userId: null, // Ignored in mapping
      mealType: model.mealType,
      date: model.date,
    );
  }
}