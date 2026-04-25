class WorkoutChallengeEntity {
  final int? id;
  final int? userId;
  final String? challengeName;
  final double? targetValue;
  final double? currentValue;
  final String? unit;
  final bool? isActive;
  final DateTime? startDate;
  final DateTime? endDate;

  WorkoutChallengeEntity({
    this.id,
    this.userId,
    this.challengeName,
    this.targetValue,
    this.currentValue,
    this.unit,
    this.isActive,
    this.startDate,
    this.endDate,
  });

  WorkoutChallengeEntity copyWith({
    int? id,
    int? userId,
    String? challengeName,
    double? targetValue,
    double? currentValue,
    String? unit,
    bool? isActive,
    DateTime? startDate,
    DateTime? endDate,
  }) {
    return WorkoutChallengeEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      challengeName: challengeName ?? this.challengeName,
      targetValue: targetValue ?? this.targetValue,
      currentValue: currentValue ?? this.currentValue,
      unit: unit ?? this.unit,
      isActive: isActive ?? this.isActive,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WorkoutChallengeEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          userId == other.userId &&
          challengeName == other.challengeName &&
          targetValue == other.targetValue &&
          currentValue == other.currentValue &&
          unit == other.unit &&
          isActive == other.isActive &&
          startDate == other.startDate &&
          endDate == other.endDate;

  @override
  int get hashCode =>
      id.hashCode ^
      userId.hashCode ^
      challengeName.hashCode ^
      targetValue.hashCode ^
      currentValue.hashCode ^
      unit.hashCode ^
      isActive.hashCode ^
      startDate.hashCode ^
      endDate.hashCode;

  @override
  String toString() {
    return 'WorkoutChallengeEntity(id: $id, userId: $userId, challengeName: $challengeName, targetValue: $targetValue, currentValue: $currentValue, unit: $unit, isActive: $isActive, startDate: $startDate, endDate: $endDate)';
  }
}
