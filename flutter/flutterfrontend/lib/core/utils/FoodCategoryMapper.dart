import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class FoodCategoryMapper {
  /// Convert FoodCategoryEntity to FoodCategoryModel
  static FoodCategoryModel toModel(FoodCategoryEntity entity) {
    return FoodCategoryModel(
      name: entity.name,
    );
  }

  /// Convert FoodCategoryModel to FoodCategoryEntity
  /// Note: id is ignored in mapping
  static FoodCategoryEntity toEntity(FoodCategoryModel model) {
    return FoodCategoryEntity(
      id: null, // Ignored in mapping
      name: model.name,
    );
  }
}