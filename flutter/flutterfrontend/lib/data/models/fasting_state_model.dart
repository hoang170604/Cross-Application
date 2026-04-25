class FastingStateModel {
  final int? userId;
  final bool? isFasting;
  final DateTime? startTime;
  final DateTime? endTime;
  final int? fastingGoalHours;

  FastingStateModel({
    this.userId,
    this.isFasting,
    this.startTime,
    this.endTime,
    this.fastingGoalHours,
  });

  factory FastingStateModel.fromJson(Map<String, dynamic> json) {
    return FastingStateModel(
      userId: json['userId'] as int?,
      isFasting: json['isFasting'] as bool?,
      startTime: json['startTime'] != null ? DateTime.parse(json['startTime'] as String) : null,
      endTime: json['endTime'] != null ? DateTime.parse(json['endTime'] as String) : null,
      fastingGoalHours: json['fastingGoalHours'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'isFasting': isFasting,
      'startTime': startTime?.toIso8601String(),
      'endTime': endTime?.toIso8601String(),
      'fastingGoalHours': fastingGoalHours,
    };
  }

  FastingStateModel copyWith({
    int? userId,
    bool? isFasting,
    DateTime? startTime,
    DateTime? endTime,
    int? fastingGoalHours,
  }) {
    return FastingStateModel(
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
      other is FastingStateModel &&
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
    return 'FastingStateModel(userId: $userId, isFasting: $isFasting, startTime: $startTime, endTime: $endTime, fastingGoalHours: $fastingGoalHours)';
  }
}
