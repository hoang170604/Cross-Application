class ActivityModel {
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

  ActivityModel({
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

  factory ActivityModel.fromJson(Map<String, dynamic> json) {
    return ActivityModel(
      id: json['id'] as int?,
      userId: json['userId'] as int?,
      activityType: json['activityType'] as String?,
      durationMinutes: json['durationMinutes'] as int?,
      caloriesBurned: (json['caloriesBurned'] as num?)?.toDouble(),
      logDate: json['logDate'] != null ? DateTime.parse(json['logDate'] as String) : null,
      startTime: json['startTime'] != null ? DateTime.parse(json['startTime'] as String) : null,
      distanceKm: (json['distanceKm'] as num?)?.toDouble(),
      steps: json['steps'] as int?,
      source: json['source'] as String?,
      externalId: json['externalId'] as String?,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt'] as String) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'activityType': activityType,
      'durationMinutes': durationMinutes,
      'caloriesBurned': caloriesBurned,
      'logDate': logDate?.toIso8601String(),
      'startTime': startTime?.toIso8601String(),
      'distanceKm': distanceKm,
      'steps': steps,
      'source': source,
      'externalId': externalId,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  ActivityModel copyWith({
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
    return ActivityModel(
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
      other is ActivityModel &&
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
    return 'ActivityModel(id: $id, userId: $userId, activityType: $activityType, durationMinutes: $durationMinutes, caloriesBurned: $caloriesBurned, logDate: $logDate, startTime: $startTime, distanceKm: $distanceKm, steps: $steps, source: $source, externalId: $externalId, createdAt: $createdAt)';
  }
}
