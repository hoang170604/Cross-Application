class DailyNutritionModel {
  final int? userId;
  final DateTime? date;
  final double? totalCalories;
  final double? totalProtein;
  final double? totalCarb;
  final double? totalFat;

  DailyNutritionModel({
    this.userId,
    this.date,
    this.totalCalories,
    this.totalProtein,
    this.totalCarb,
    this.totalFat,
  });

  factory DailyNutritionModel.fromJson(Map<String, dynamic> json) {
    return DailyNutritionModel(
      userId: json['userId'] as int?,
      date: json['date'] != null ? DateTime.parse(json['date'] as String) : null,
      totalCalories: (json['totalCalories'] as num?)?.toDouble(),
      totalProtein: (json['totalProtein'] as num?)?.toDouble(),
      totalCarb: (json['totalCarb'] as num?)?.toDouble(),
      totalFat: (json['totalFat'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'date': date?.toIso8601String(),
      'totalCalories': totalCalories,
      'totalProtein': totalProtein,
      'totalCarb': totalCarb,
      'totalFat': totalFat,
    };
  }

  DailyNutritionModel copyWith({
    int? userId,
    DateTime? date,
    double? totalCalories,
    double? totalProtein,
    double? totalCarb,
    double? totalFat,
  }) {
    return DailyNutritionModel(
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
      other is DailyNutritionModel &&
          runtimeType == other.runtimeType &&
          userId == other.userId &&
          date == other.date &&
          totalCalories == other.totalCalories &&
          totalProtein == other.totalProtein &&
          totalCarb == other.totalCarb &&
          totalFat == other.totalFat;

  @override
  int get hashCode =>
      userId.hashCode ^
      date.hashCode ^
      totalCalories.hashCode ^
      totalProtein.hashCode ^
      totalCarb.hashCode ^
      totalFat.hashCode;

  @override
  String toString() {
    return 'DailyNutritionModel(userId: $userId, date: $date, totalCalories: $totalCalories, totalProtein: $totalProtein, totalCarb: $totalCarb, totalFat: $totalFat)';
  }
}
