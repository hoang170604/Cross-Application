class ActivityEntity {
  final int? id;
  final int? userId;
  final String? activityType;
  final int? durationMinutes;
  final double? caloriesBurned;
  final DateTime? logDate;
  final DateTime? startTime;
  final double? distanceKm;
  final int? steps;
  final String? source;
  final String? externalId;
  final DateTime? createdAt;

  ActivityEntity({
    this.id,
    this.userId,
    this.activityType,
    this.durationMinutes,
    this.caloriesBurned,
    this.logDate,
    this.startTime,
    this.distanceKm,
    this.steps,
    this.source,
    this.externalId,
    this.createdAt,
  });

  ActivityEntity copyWith({
    int? id,
    int? userId,
    String? activityType,
    int? durationMinutes,
    double? caloriesBurned,
    DateTime? logDate,
    DateTime? startTime,
    double? distanceKm,
    int? steps,
    String? source,
    String? externalId,
    DateTime? createdAt,
  }) {
    return ActivityEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      activityType: activityType ?? this.activityType,
      durationMinutes: durationMinutes ?? this.durationMinutes,
      caloriesBurned: caloriesBurned ?? this.caloriesBurned,
      logDate: logDate ?? this.logDate,
      startTime: startTime ?? this.startTime,
      distanceKm: distanceKm ?? this.distanceKm,
      steps: steps ?? this.steps,
      source: source ?? this.source,
      externalId: externalId ?? this.externalId,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ActivityEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          userId == other.userId &&
          activityType == other.activityType &&
          durationMinutes == other.durationMinutes &&
          caloriesBurned == other.caloriesBurned &&
          logDate == other.logDate &&
          startTime == other.startTime &&
          distanceKm == other.distanceKm &&
          steps == other.steps &&
          source == other.source &&
          externalId == other.externalId &&
          createdAt == other.createdAt;

  @override
  int get hashCode =>
      id.hashCode ^
      userId.hashCode ^
      activityType.hashCode ^
      durationMinutes.hashCode ^
      caloriesBurned.hashCode ^
      logDate.hashCode ^
      startTime.hashCode ^
      distanceKm.hashCode ^
      steps.hashCode ^
      source.hashCode ^
      externalId.hashCode ^
      createdAt.hashCode;

  @override
  String toString() {
    return 'ActivityEntity(id: $id, userId: $userId, activityType: $activityType, durationMinutes: $durationMinutes, caloriesBurned: $caloriesBurned, logDate: $logDate, startTime: $startTime, distanceKm: $distanceKm, steps: $steps, source: $source, externalId: $externalId, createdAt: $createdAt)';
  }
}
