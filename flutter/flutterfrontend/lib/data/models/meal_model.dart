class MealModel {
  final String? mealType;
  final DateTime? date;

  MealModel({
    this.mealType,
    this.date,
  });

  factory MealModel.fromJson(Map<String, dynamic> json) {
    return MealModel(
      mealType: json['mealType'] as String?,
      date: json['date'] != null ? DateTime.parse(json['date'] as String) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'mealType': mealType,
      'date': date?.toIso8601String(),
    };
  }

  MealModel copyWith({
    String? mealType,
    DateTime? date,
  }) {
    return MealModel(
      mealType: mealType ?? this.mealType,
      date: date ?? this.date,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MealModel &&
          runtimeType == other.runtimeType &&
          mealType == other.mealType &&
          date == other.date;

  @override
  int get hashCode => mealType.hashCode ^ date.hashCode;

  @override
  String toString() {
    return 'MealModel(mealType: $mealType, date: $date)';
  }
}
