class WeightLogEntity {
  final int? id;
  final int? userId;
  final DateTime? date;
  final double? weight;

  WeightLogEntity({
    this.id,
    this.userId,
    this.date,
    this.weight,
  });

  WeightLogEntity copyWith({
    int? id,
    int? userId,
    DateTime? date,
    double? weight,
  }) {
    return WeightLogEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      date: date ?? this.date,
      weight: weight ?? this.weight,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WeightLogEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          userId == other.userId &&
          date == other.date &&
          weight == other.weight;

  @override
  int get hashCode =>
      id.hashCode ^ userId.hashCode ^ date.hashCode ^ weight.hashCode;

  @override
  String toString() {
    return 'WeightLogEntity(id: $id, userId: $userId, date: $date, weight: $weight)';
  }
}
