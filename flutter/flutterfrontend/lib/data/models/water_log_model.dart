class WaterLogModel {
  final int? id;
  final int? userId;
  final DateTime? logDate;
  final double? amountMl;
  final String? source;
  final String? externalId;
  final DateTime? createdAt;

  WaterLogModel({
    this.id,
    this.userId,
    this.logDate,
    this.amountMl,
    this.source,
    this.externalId,
    this.createdAt,
  });

  factory WaterLogModel.fromJson(Map<String, dynamic> json) {
    return WaterLogModel(
      id: json['id'] as int?,
      userId: json['userId'] as int?,
      logDate: json['logDate'] != null ? DateTime.parse(json['logDate'] as String) : null,
      amountMl: (json['amountMl'] as num?)?.toDouble(),
      source: json['source'] as String?,
      externalId: json['externalId'] as String?,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt'] as String) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'logDate': logDate?.toIso8601String(),
      'amountMl': amountMl,
      'source': source,
      'externalId': externalId,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  WaterLogModel copyWith({
    int? id,
    int? userId,
    DateTime? logDate,
    double? amountMl,
    String? source,
    String? externalId,
    DateTime? createdAt,
  }) {
    return WaterLogModel(
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
      other is WaterLogModel &&
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
    return 'WaterLogModel(id: $id, userId: $userId, logDate: $logDate, amountMl: $amountMl, source: $source, externalId: $externalId, createdAt: $createdAt)';
  }
}
