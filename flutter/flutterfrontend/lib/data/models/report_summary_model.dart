class ReportSummaryModel {
  final int? userId;
  final DateTime? startDate;
  final DateTime? endDate;
  final double? totalCalories;
  final double? averageCaloriesPerDay;
  final double? totalProtein;
  final double? totalCarbs;
  final double? totalFat;

  ReportSummaryModel({
    this.userId,
    this.startDate,
    this.endDate,
    this.totalCalories,
    this.averageCaloriesPerDay,
    this.totalProtein,
    this.totalCarbs,
    this.totalFat,
  });

  factory ReportSummaryModel.fromJson(Map<String, dynamic> json) {
    return ReportSummaryModel(
      userId: json['userId'] as int?,
      startDate: json['startDate'] != null ? DateTime.parse(json['startDate'] as String) : null,
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate'] as String) : null,
      totalCalories: (json['totalCalories'] as num?)?.toDouble(),
      averageCaloriesPerDay: (json['averageCaloriesPerDay'] as num?)?.toDouble(),
      totalProtein: (json['totalProtein'] as num?)?.toDouble(),
      totalCarbs: (json['totalCarbs'] as num?)?.toDouble(),
      totalFat: (json['totalFat'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'totalCalories': totalCalories,
      'averageCaloriesPerDay': averageCaloriesPerDay,
      'totalProtein': totalProtein,
      'totalCarbs': totalCarbs,
      'totalFat': totalFat,
    };
  }

  ReportSummaryModel copyWith({
    int? userId,
    DateTime? startDate,
    DateTime? endDate,
    double? totalCalories,
    double? averageCaloriesPerDay,
    double? totalProtein,
    double? totalCarbs,
    double? totalFat,
  }) {
    return ReportSummaryModel(
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
      other is ReportSummaryModel &&
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
    return 'ReportSummaryModel(userId: $userId, startDate: $startDate, endDate: $endDate, totalCalories: $totalCalories, averageCaloriesPerDay: $averageCaloriesPerDay, totalProtein: $totalProtein, totalCarbs: $totalCarbs, totalFat: $totalFat)';
  }
}
