class MealEntity {
  final int? id;
  final int? userId;
  final String? mealType;
  final DateTime? date;

  MealEntity({
    this.id,
    this.userId,
    this.mealType,
    this.date,
  });

  MealEntity copyWith({
    int? id,
    int? userId,
    String? mealType,
    DateTime? date,
  }) {
    return MealEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      mealType: mealType ?? this.mealType,
      date: date ?? this.date,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MealEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          userId == other.userId &&
          mealType == other.mealType &&
          date == other.date;

  @override
  int get hashCode =>
      id.hashCode ^ userId.hashCode ^ mealType.hashCode ^ date.hashCode;

  @override
  String toString() {
    return 'MealEntity(id: $id, userId: $userId, mealType: $mealType, date: $date)';
  }
}
