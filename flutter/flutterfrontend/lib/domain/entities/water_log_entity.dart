class WaterLogEntity {
  final int? id;
  final int? userId;
  final DateTime? logDate;
  final double? amountMl;
  final String? source;
  final String? externalId;
  final DateTime? createdAt;

  WaterLogEntity({
    this.id,
    this.userId,
    this.logDate,
    this.amountMl,
    this.source,
    this.externalId,
    this.createdAt,
  });

  WaterLogEntity copyWith({
    int? id,
    int? userId,
    DateTime? logDate,
    double? amountMl,
    String? source,
    String? externalId,
    DateTime? createdAt,
  }) {
    return WaterLogEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      logDate: logDate ?? this.logDate,
      amountMl: amountMl ?? this.amountMl,
      source: source ?? this.source,
      externalId: externalId ?? this.externalId,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WaterLogEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          userId == other.userId &&
          logDate == other.logDate &&
          amountMl == other.amountMl &&
          source == other.source &&
          externalId == other.externalId &&
          createdAt == other.createdAt;

  @override
  int get hashCode =>
      id.hashCode ^
      userId.hashCode ^
      logDate.hashCode ^
      amountMl.hashCode ^
      source.hashCode ^
      externalId.hashCode ^
      createdAt.hashCode;

  @override
  String toString() {
    return 'WaterLogEntity(id: $id, userId: $userId, logDate: $logDate, amountMl: $amountMl, source: $source, externalId: $externalId, createdAt: $createdAt)';
  }
}
