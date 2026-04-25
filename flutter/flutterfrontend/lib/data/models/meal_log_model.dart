class MealLogModel {
  final int? foodId;
  final int? mealId;
  final double? quantity;
  final double? calories;
  final double? protein;
  final double? carb;
  final double? fat;

  MealLogModel({
    this.foodId,
    this.mealId,
    this.quantity,
    this.calories,
    this.protein,
    this.carb,
    this.fat,
  });

  factory MealLogModel.fromJson(Map<String, dynamic> json) {
    return MealLogModel(
      foodId: json['foodId'] as int?,
      mealId: json['mealId'] as int?,
      quantity: (json['quantity'] as num?)?.toDouble(),
      calories: (json['calories'] as num?)?.toDouble(),
      protein: (json['protein'] as num?)?.toDouble(),
      carb: (json['carb'] as num?)?.toDouble(),
      fat: (json['fat'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'foodId': foodId,
      'mealId': mealId,
      'quantity': quantity,
      'calories': calories,
      'protein': protein,
      'carb': carb,
      'fat': fat,
    };
  }

  MealLogModel copyWith({
    int? foodId,
    int? mealId,
    double? quantity,
    double? calories,
    double? protein,
    double? carb,
    double? fat,
  }) {
    return MealLogModel(
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
      other is MealLogModel &&
          runtimeType == other.runtimeType &&
          foodId == other.foodId &&
          mealId == other.mealId &&
          quantity == other.quantity &&
          calories == other.calories &&
          protein == other.protein &&
          carb == other.carb &&
          fat == other.fat;

  @override
  int get hashCode =>
      foodId.hashCode ^
      mealId.hashCode ^
      quantity.hashCode ^
      calories.hashCode ^
      protein.hashCode ^
      carb.hashCode ^
      fat.hashCode;

  @override
  String toString() {
    return 'MealLogModel(foodId: $foodId, mealId: $mealId, quantity: $quantity, calories: $calories, protein: $protein, carb: $carb, fat: $fat)';
  }
}
