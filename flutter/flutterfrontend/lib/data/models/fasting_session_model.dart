class FastingSessionModel {
  final int? id;
  final int? userId;
  final DateTime? startTime;
  final DateTime? endTime;
  final int? durationMinutes;
  final bool? isCompleted;

  FastingSessionModel({
    this.id,
    this.userId,
    this.startTime,
    this.endTime,
    this.durationMinutes,
    this.isCompleted,
  });

  factory FastingSessionModel.fromJson(Map<String, dynamic> json) {
    return FastingSessionModel(
      id: json['id'] as int?,
      userId: json['userId'] as int?,
      startTime: json['startTime'] != null ? DateTime.parse(json['startTime'] as String) : null,
      endTime: json['endTime'] != null ? DateTime.parse(json['endTime'] as String) : null,
      durationMinutes: json['durationMinutes'] as int?,
      isCompleted: json['isCompleted'] as bool?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'startTime': startTime?.toIso8601String(),
      'endTime': endTime?.toIso8601String(),
      'durationMinutes': durationMinutes,
      'isCompleted': isCompleted,
    };
  }

  FastingSessionModel copyWith({
    int? id,
    int? userId,
    DateTime? startTime,
    DateTime? endTime,
    int? durationMinutes,
    bool? isCompleted,
  }) {
    return FastingSessionModel(
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
      other is FastingSessionModel &&
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
    return 'FastingSessionModel(id: $id, userId: $userId, startTime: $startTime, endTime: $endTime, durationMinutes: $durationMinutes, isCompleted: $isCompleted)';
  }
}
