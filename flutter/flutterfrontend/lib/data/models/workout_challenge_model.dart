class WorkoutChallengeModel {
  final int? id;
  final int? userId;
  final String? challengeName;
  final double? targetValue;
  final double? currentValue;
  final String? unit;
  final bool? isActive;
  final DateTime? startDate;
  final DateTime? endDate;

  WorkoutChallengeModel({
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

  factory WorkoutChallengeModel.fromJson(Map<String, dynamic> json) {
    return WorkoutChallengeModel(
      id: json['id'] as int?,
      userId: json['userId'] as int?,
      challengeName: json['challengeName'] as String?,
      targetValue: (json['targetValue'] as num?)?.toDouble(),
      currentValue: (json['currentValue'] as num?)?.toDouble(),
      unit: json['unit'] as String?,
      isActive: json['isActive'] as bool?,
      startDate: json['startDate'] != null ? DateTime.parse(json['startDate'] as String) : null,
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate'] as String) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'challengeName': challengeName,
      'targetValue': targetValue,
      'currentValue': currentValue,
      'unit': unit,
      'isActive': isActive,
      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
    };
  }

  WorkoutChallengeModel copyWith({
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
    return WorkoutChallengeModel(
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
      other is WorkoutChallengeModel &&
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
    return 'WorkoutChallengeModel(id: $id, userId: $userId, challengeName: $challengeName, targetValue: $targetValue, currentValue: $currentValue, unit: $unit, isActive: $isActive, startDate: $startDate, endDate: $endDate)';
  }
}
