class MealLogEntity {
  final int? id;
  final int? foodId;
  final int? mealId;
  final double? quantity;
  final double? calories;
  final double? protein;
  final double? carb;
  final double? fat;

  MealLogEntity({
    this.id,
    this.foodId,
    this.mealId,
    this.quantity,
    this.calories,
    this.protein,
    this.carb,
    this.fat,
  });

  MealLogEntity copyWith({
    int? id,
    int? foodId,
    int? mealId,
    double? quantity,
    double? calories,
    double? protein,
    double? carb,
    double? fat,
  }) {
    return MealLogEntity(
      id: id ?? this.id,
      foodId: foodId ?? this.foodId,
      mealId: mealId ?? this.mealId,
      quantity: quantity ?? this.quantity,
      calories: calories ?? this.calories,
      protein: protein ?? this.protein,
      carb: carb ?? this.carb,
      fat: fat ?? this.fat,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MealLogEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          foodId == other.foodId &&
          mealId == other.mealId &&
          quantity == other.quantity &&
          calories == other.calories &&
          protein == other.protein &&
          carb == other.carb &&
          fat == other.fat;

  @override
  int get hashCode =>
      id.hashCode ^
      foodId.hashCode ^
      mealId.hashCode ^
      quantity.hashCode ^
      calories.hashCode ^
      protein.hashCode ^
      carb.hashCode ^
      fat.hashCode;

  @override
  String toString() {
    return 'MealLogEntity(id: $id, foodId: $foodId, mealId: $mealId, quantity: $quantity, calories: $calories, protein: $protein, carb: $carb, fat: $fat)';
  }
}
