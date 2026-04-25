class NutritionGoalModel {
  final double? targetCalories;
  final double? targetProtein;
  final double? targetCarb;
  final double? targetFat;
  final DateTime? createdAt;

  NutritionGoalModel({
    this.targetCalories,
    this.targetProtein,
    this.targetCarb,
    this.targetFat,
    this.createdAt,
  });

  factory NutritionGoalModel.fromJson(Map<String, dynamic> json) {
    return NutritionGoalModel(
      targetCalories: (json['targetCalories'] as num?)?.toDouble(),
      targetProtein: (json['targetProtein'] as num?)?.toDouble(),
      targetCarb: (json['targetCarb'] as num?)?.toDouble(),
      targetFat: (json['targetFat'] as num?)?.toDouble(),
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt'] as String) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'targetCalories': targetCalories,
      'targetProtein': targetProtein,
      'targetCarb': targetCarb,
      'targetFat': targetFat,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  NutritionGoalModel copyWith({
    double? targetCalories,
    double? targetProtein,
    double? targetCarb,
    double? targetFat,
    DateTime? createdAt,
  }) {
    return NutritionGoalModel(
      targetCalories: targetCalories ?? this.targetCalories,
      targetProtein: targetProtein ?? this.targetProtein,
      targetCarb: targetCarb ?? this.targetCarb,
      targetFat: targetFat ?? this.targetFat,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is NutritionGoalModel &&
          runtimeType == other.runtimeType &&
          targetCalories == other.targetCalories &&
          targetProtein == other.targetProtein &&
          targetCarb == other.targetCarb &&
          targetFat == other.targetFat &&
          createdAt == other.createdAt;

  @override
  int get hashCode =>
      targetCalories.hashCode ^
      targetProtein.hashCode ^
      targetCarb.hashCode ^
      targetFat.hashCode ^
      createdAt.hashCode;

  @override
  String toString() {
    return 'NutritionGoalModel(targetCalories: $targetCalories, targetProtein: $targetProtein, targetCarb: $targetCarb, targetFat: $targetFat, createdAt: $createdAt)';
  }
}
