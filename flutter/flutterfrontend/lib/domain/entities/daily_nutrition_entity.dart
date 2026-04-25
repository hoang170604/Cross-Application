class DailyNutritionEntity {
  final int? id;
  final int? userId;
  final DateTime? date;
  final double? totalCalories;
  final double? totalProtein;
  final double? totalCarb;
  final double? totalFat;

  DailyNutritionEntity({
    this.id,
    this.userId,
    this.date,
    this.totalCalories,
    this.totalProtein,
    this.totalCarb,
    this.totalFat,
  });

  DailyNutritionEntity copyWith({
    int? id,
    int? userId,
    DateTime? date,
    double? totalCalories,
    double? totalProtein,
    double? totalCarb,
    double? totalFat,
  }) {
    return DailyNutritionEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      date: date ?? this.date,
      totalCalories: totalCalories ?? this.totalCalories,
      totalProtein: totalProtein ?? this.totalProtein,
      totalCarb: totalCarb ?? this.totalCarb,
      totalFat: totalFat ?? this.totalFat,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DailyNutritionEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          userId == other.userId &&
          date == other.date &&
          totalCalories == other.totalCalories &&
          totalProtein == other.totalProtein &&
          totalCarb == other.totalCarb &&
          totalFat == other.totalFat;

  @override
  int get hashCode =>
      id.hashCode ^
      userId.hashCode ^
      date.hashCode ^
      totalCalories.hashCode ^
      totalProtein.hashCode ^
      totalCarb.hashCode ^
      totalFat.hashCode;

  @override
  String toString() {
    return 'DailyNutritionEntity(id: $id, userId: $userId, date: $date, totalCalories: $totalCalories, totalProtein: $totalProtein, totalCarb: $totalCarb, totalFat: $totalFat)';
  }
}
