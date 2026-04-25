class NutritionGoalEntity {
  final int? id;
  final int? userId;
  final double? targetCalories;
  final double? targetProtein;
  final double? targetCarb;
  final double? targetFat;
  final DateTime? createdAt;

  NutritionGoalEntity({
    this.id,
    this.userId,
    this.targetCalories,
    this.targetProtein,
    this.targetCarb,
    this.targetFat,
    this.createdAt,
  });

  NutritionGoalEntity copyWith({
    int? id,
    int? userId,
    double? targetCalories,
    double? targetProtein,
    double? targetCarb,
    double? targetFat,
    DateTime? createdAt,
  }) {
    return NutritionGoalEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
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
      other is NutritionGoalEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          userId == other.userId &&
          targetCalories == other.targetCalories &&
          targetProtein == other.targetProtein &&
          targetCarb == other.targetCarb &&
          targetFat == other.targetFat &&
          createdAt == other.createdAt;

  @override
  int get hashCode =>
      id.hashCode ^
      userId.hashCode ^
      targetCalories.hashCode ^
      targetProtein.hashCode ^
      targetCarb.hashCode ^
      targetFat.hashCode ^
      createdAt.hashCode;

  @override
  String toString() {
    return 'NutritionGoalEntity(id: $id, userId: $userId, targetCalories: $targetCalories, targetProtein: $targetProtein, targetCarb: $targetCarb, targetFat: $targetFat, createdAt: $createdAt)';
  }
}
