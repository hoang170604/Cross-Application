class FoodModel {
  final String? name;
  final double? caloriesPer100g;
  final double? proteinPer100g;
  final double? carbPer100g;
  final double? fatPer100g;

  FoodModel({
    this.name,
    this.caloriesPer100g,
    this.proteinPer100g,
    this.carbPer100g,
    this.fatPer100g,
  });

  factory FoodModel.fromJson(Map<String, dynamic> json) {
    return FoodModel(
      name: json['name'] as String?,
      caloriesPer100g: (json['caloriesPer100g'] as num?)?.toDouble(),
      proteinPer100g: (json['proteinPer100g'] as num?)?.toDouble(),
      carbPer100g: (json['carbPer100g'] as num?)?.toDouble(),
      fatPer100g: (json['fatPer100g'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'caloriesPer100g': caloriesPer100g,
      'proteinPer100g': proteinPer100g,
      'carbPer100g': carbPer100g,
      'fatPer100g': fatPer100g,
    };
  }

  FoodModel copyWith({
    String? name,
    double? caloriesPer100g,
    double? proteinPer100g,
    double? carbPer100g,
    double? fatPer100g,
  }) {
    return FoodModel(
      name: name ?? this.name,
      caloriesPer100g: caloriesPer100g ?? this.caloriesPer100g,
      proteinPer100g: proteinPer100g ?? this.proteinPer100g,
      carbPer100g: carbPer100g ?? this.carbPer100g,
      fatPer100g: fatPer100g ?? this.fatPer100g,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FoodModel &&
          runtimeType == other.runtimeType &&
          name == other.name &&
          caloriesPer100g == other.caloriesPer100g &&
          proteinPer100g == other.proteinPer100g &&
          carbPer100g == other.carbPer100g &&
          fatPer100g == other.fatPer100g;

  @override
  int get hashCode =>
      name.hashCode ^
      caloriesPer100g.hashCode ^
      proteinPer100g.hashCode ^
      carbPer100g.hashCode ^
      fatPer100g.hashCode;

  @override
  String toString() {
    return 'FoodModel(name: $name, caloriesPer100g: $caloriesPer100g, proteinPer100g: $proteinPer100g, carbPer100g: $carbPer100g, fatPer100g: $fatPer100g)';
  }
}
