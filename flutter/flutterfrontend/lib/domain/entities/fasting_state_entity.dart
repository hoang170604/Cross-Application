class FastingStateEntity {
  final int? userId;
  final bool? isFasting;
  final DateTime? startTime;
  final DateTime? endTime;
  final int? fastingGoalHours;

  FastingStateEntity({
    this.userId,
    this.isFasting,
    this.startTime,
    this.endTime,
    this.fastingGoalHours,
  });

  FastingStateEntity copyWith({
    int? userId,
    bool? isFasting,
    DateTime? startTime,
    DateTime? endTime,
    int? fastingGoalHours,
  }) {
    return FastingStateEntity(
      userId: userId ?? this.userId,
      isFasting: isFasting ?? this.isFasting,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      fastingGoalHours: fastingGoalHours ?? this.fastingGoalHours,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FastingStateEntity &&
          runtimeType == other.runtimeType &&
          userId == other.userId &&
          isFasting == other.isFasting &&
          startTime == other.startTime &&
          endTime == other.endTime &&
          fastingGoalHours == other.fastingGoalHours;

  @override
  int get hashCode =>
      userId.hashCode ^
      isFasting.hashCode ^
      startTime.hashCode ^
      endTime.hashCode ^
      fastingGoalHours.hashCode;

  @override
  String toString() {
    return 'FastingStateEntity(userId: $userId, isFasting: $isFasting, startTime: $startTime, endTime: $endTime, fastingGoalHours: $fastingGoalHours)';
  }
}
