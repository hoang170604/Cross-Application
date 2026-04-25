import 'package:flutterfrontend/data/datasources/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

abstract class FoodUsecase {
  Future<List<FoodEntity>> getAllFood();
  Future<List<FoodEntity>> searchByName(String name);
  Future<List<FoodCategoryEntity>> getAllCategories();
  Future<Map<String, double>> calculateNutrition(int foodId, double weightInGrams);
  Future<void> createFood(String name, double calories, double protein, double carb, double fat);
  Future<void> updateFood(int id, Map<String, dynamic> foodData);
  Future<void> deleteFood(int id);
}

class FoodUsecaseImpl implements FoodUsecase {
  final FoodRemoteDatasource remoteDatasource;

  FoodUsecaseImpl({required this.remoteDatasource});

  @override
  Future<List<FoodEntity>> getAllFood() async {
    try {
      final data = await remoteDatasource.getAllFood();
      return (data)
          .map((item) => FoodEntity(
                id: item['id'] as int?,
                name: item['name'] as String?,
                caloriesPer100g: (item['caloriesPer100g'] as num?)?.toDouble(),
                proteinPer100g: (item['proteinPer100g'] as num?)?.toDouble(),
                carbPer100g: (item['carbPer100g'] as num?)?.toDouble(),
                fatPer100g: (item['fatPer100g'] as num?)?.toDouble(),
                categoryId: item['categoryId'] as int?,
              ))
          .toList();
    } catch (e) {
      throw Exception('Error fetching foods: $e');
    }
  }

  @override
  Future<List<FoodEntity>> searchByName(String name) async {
    try {
      final data = await remoteDatasource.searchByName(name);
      return (data)
          .map((item) => FoodEntity(
                id: item['id'] as int?,
                name: item['name'] as String?,
                caloriesPer100g: (item['caloriesPer100g'] as num?)?.toDouble(),
                proteinPer100g: (item['proteinPer100g'] as num?)?.toDouble(),
                carbPer100g: (item['carbPer100g'] as num?)?.toDouble(),
                fatPer100g: (item['fatPer100g'] as num?)?.toDouble(),
                categoryId: item['categoryId'] as int?,
              ))
          .toList();
    } catch (e) {
      throw Exception('Error searching foods: $e');
    }
  }

  @override
  Future<List<FoodCategoryEntity>> getAllCategories() async {
    try {
      final data = await remoteDatasource.getAllCategories();
      return (data)
          .map((item) => FoodCategoryEntity(
                id: item['id'] as int?,
                name: item['name'] as String?,
              ))
          .toList();
    } catch (e) {
      throw Exception('Error fetching food categories: $e');
    }
  }

  @override
  Future<Map<String, double>> calculateNutrition(int foodId, double weightInGrams) async {
    try {
      final food = await remoteDatasource.getFoodById(foodId);
      final factor = weightInGrams / 100.0;
      return {
        'calories': ((food['caloriesPer100g'] as num?)?.toDouble() ?? 0.0) * factor,
        'protein': ((food['proteinPer100g'] as num?)?.toDouble() ?? 0.0) * factor,
        'carb': ((food['carbPer100g'] as num?)?.toDouble() ?? 0.0) * factor,
        'fat': ((food['fatPer100g'] as num?)?.toDouble() ?? 0.0) * factor,
      };
    } catch (e) {
      throw Exception('Error calculating nutrition: $e');
    }
  }

  @override
  Future<void> createFood(
    String name,
    double calories,
    double protein,
    double carb,
    double fat,
  ) async {
    try {
      await remoteDatasource.createFood({
        'name': name,
        'caloriesPer100g': calories,
        'proteinPer100g': protein,
        'carbPer100g': carb,
        'fatPer100g': fat,
      });
    } catch (e) {
      throw Exception('Error creating food: $e');
    }
  }

  @override
  Future<void> updateFood(int id, Map<String, dynamic> foodData) async {
    try {
      await remoteDatasource.updateFood(id, foodData);
    } catch (e) {
      throw Exception('Error updating food: $e');
    }
  }

  @override
  Future<void> deleteFood(int id) async {
    try {
      await remoteDatasource.deleteFood(id);
    } catch (e) {
      throw Exception('Error deleting food: $e');
    }
  }
}
