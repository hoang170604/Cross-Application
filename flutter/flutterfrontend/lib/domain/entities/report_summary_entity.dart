class ReportSummaryEntity {
  final int? userId;
  final DateTime? startDate;
  final DateTime? endDate;
  final double? totalCalories;
  final double? averageCaloriesPerDay;
  final double? totalProtein;
  final double? totalCarbs;
  final double? totalFat;

  ReportSummaryEntity({
    this.userId,
    this.startDate,
    this.endDate,
    this.totalCalories,
    this.averageCaloriesPerDay,
    this.totalProtein,
    this.totalCarbs,
    this.totalFat,
  });

  ReportSummaryEntity copyWith({
    int? userId,
    DateTime? startDate,
    DateTime? endDate,
    double? totalCalories,
    double? averageCaloriesPerDay,
    double? totalProtein,
    double? totalCarbs,
    double? totalFat,
  }) {
    return ReportSummaryEntity(
      userId: userId ?? this.userId,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      totalCalories: totalCalories ?? this.totalCalories,
      averageCaloriesPerDay: averageCaloriesPerDay ?? this.averageCaloriesPerDay,
      totalProtein: totalProtein ?? this.totalProtein,
      totalCarbs: totalCarbs ?? this.totalCarbs,
      totalFat: totalFat ?? this.totalFat,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ReportSummaryEntity &&
          runtimeType == other.runtimeType &&
          userId == other.userId &&
          startDate == other.startDate &&
          endDate == other.endDate &&
          totalCalories == other.totalCalories &&
          averageCaloriesPerDay == other.averageCaloriesPerDay &&
          totalProtein == other.totalProtein &&
          totalCarbs == other.totalCarbs &&
          totalFat == other.totalFat;

  @override
  int get hashCode =>
      userId.hashCode ^
      startDate.hashCode ^
      endDate.hashCode ^
      totalCalories.hashCode ^
      averageCaloriesPerDay.hashCode ^
      totalProtein.hashCode ^
      totalCarbs.hashCode ^
      totalFat.hashCode;

  @override
  String toString() {
    return 'ReportSummaryEntity(userId: $userId, startDate: $startDate, endDate: $endDate, totalCalories: $totalCalories, averageCaloriesPerDay: $averageCaloriesPerDay, totalProtein: $totalProtein, totalCarbs: $totalCarbs, totalFat: $totalFat)';
  }
}
