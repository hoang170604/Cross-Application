import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class FoodMapper {
  /// Convert FoodEntity to FoodModel
  static FoodModel toModel(FoodEntity entity) {
    return FoodModel(
      name: entity.name,
      caloriesPer100g: entity.caloriesPer100g,
      proteinPer100g: entity.proteinPer100g,
      carbPer100g: entity.carbPer100g,
      fatPer100g: entity.fatPer100g,
    );
  }

  /// Convert FoodModel to FoodEntity
  /// Note: id and category are ignored in mapping
  static FoodEntity toEntity(FoodModel model) {
    return FoodEntity(
      id: null, // Ignored in mapping
      name: model.name,
      caloriesPer100g: model.caloriesPer100g,
      proteinPer100g: model.proteinPer100g,
      carbPer100g: model.carbPer100g,
      fatPer100g: model.fatPer100g,
      categoryId: null, // Ignored in mapping
    );
  }
}