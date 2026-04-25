class FoodEntity {
  final int? id;
  final String? name;
  final double? caloriesPer100g;
  final double? proteinPer100g;
  final double? carbPer100g;
  final double? fatPer100g;
  final int? categoryId;

  FoodEntity({
    this.id,
    this.name,
    this.caloriesPer100g,
    this.proteinPer100g,
    this.carbPer100g,
    this.fatPer100g,
    this.categoryId,
  });

  FoodEntity copyWith({
    int? id,
    String? name,
    double? caloriesPer100g,
    double? proteinPer100g,
    double? carbPer100g,
    double? fatPer100g,
    int? categoryId,
  }) {
    return FoodEntity(
      id: id ?? this.id,
      name: name ?? this.name,
      caloriesPer100g: caloriesPer100g ?? this.caloriesPer100g,
      proteinPer100g: proteinPer100g ?? this.proteinPer100g,
      carbPer100g: carbPer100g ?? this.carbPer100g,
      fatPer100g: fatPer100g ?? this.fatPer100g,
      categoryId: categoryId ?? this.categoryId,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FoodEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          caloriesPer100g == other.caloriesPer100g &&
          proteinPer100g == other.proteinPer100g &&
          carbPer100g == other.carbPer100g &&
          fatPer100g == other.fatPer100g &&
          categoryId == other.categoryId;

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      caloriesPer100g.hashCode ^
      proteinPer100g.hashCode ^
      carbPer100g.hashCode ^
      fatPer100g.hashCode ^
      categoryId.hashCode;

  @override
  String toString() {
    return 'FoodEntity(id: $id, name: $name, caloriesPer100g: $caloriesPer100g, proteinPer100g: $proteinPer100g, carbPer100g: $carbPer100g, fatPer100g: $fatPer100g, categoryId: $categoryId)';
  }
}
