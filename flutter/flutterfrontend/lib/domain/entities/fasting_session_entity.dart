class FastingSessionEntity {
  final int? id;
  final int? userId;
  final DateTime? startTime;
  final DateTime? endTime;
  final int? durationMinutes;
  final bool? isCompleted;

  FastingSessionEntity({
    this.id,
    this.userId,
    this.startTime,
    this.endTime,
    this.durationMinutes,
    this.isCompleted,
  });

  FastingSessionEntity copyWith({
    int? id,
    int? userId,
    DateTime? startTime,
    DateTime? endTime,
    int? durationMinutes,
    bool? isCompleted,
  }) {
    return FastingSessionEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      durationMinutes: durationMinutes ?? this.durationMinutes,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FastingSessionEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          userId == other.userId &&
          startTime == other.startTime &&
          endTime == other.endTime &&
          durationMinutes == other.durationMinutes &&
          isCompleted == other.isCompleted;

  @override
  int get hashCode =>
      id.hashCode ^
      userId.hashCode ^
      startTime.hashCode ^
      endTime.hashCode ^
      durationMinutes.hashCode ^
      isCompleted.hashCode;

  @override
  String toString() {
    return 'FastingSessionEntity(id: $id, userId: $userId, startTime: $startTime, endTime: $endTime, durationMinutes: $durationMinutes, isCompleted: $isCompleted)';
  }
}
