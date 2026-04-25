class WeightLogModel {
  final int? userId;
  final DateTime? date;
  final double? weight;

  WeightLogModel({
    this.userId,
    this.date,
    this.weight,
  });

  factory WeightLogModel.fromJson(Map<String, dynamic> json) {
    return WeightLogModel(
      userId: json['userId'] as int?,
      date: json['date'] != null ? DateTime.parse(json['date'] as String) : null,
      weight: (json['weight'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'date': date?.toIso8601String(),
      'weight': weight,
    };
  }

  WeightLogModel copyWith({
    int? userId,
    DateTime? date,
    double? weight,
  }) {
    return WeightLogModel(
      userId: userId ?? this.userId,
      date: date ?? this.date,
      weight: weight ?? this.weight,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WeightLogModel &&
          runtimeType == other.runtimeType &&
          userId == other.userId &&
          date == other.date &&
          weight == other.weight;

  @override
  int get hashCode => userId.hashCode ^ date.hashCode ^ weight.hashCode;

  @override
  String toString() {
    return 'WeightLogModel(userId: $userId, date: $date, weight: $weight)';
  }
}
