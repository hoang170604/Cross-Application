class UserProfileEntity {
  final int? userId;
  final int? age;
  final String? gender;
  final double? height;
  final double? weight;
  final double? activityLevel;
  final String? goal;
  final String? name;
  final String? fastingGoal;

  UserProfileEntity({
    this.userId,
    this.age,
    this.gender,
    this.height,
    this.weight,
    this.activityLevel,
    this.goal,
    this.name,
    this.fastingGoal,
  });

  UserProfileEntity copyWith({
    int? userId,
    int? age,
    String? gender,
    double? height,
    double? weight,
    double? activityLevel,
    String? goal,
    String? name,
    String? fastingGoal,
  }) {
    return UserProfileEntity(
      userId: userId ?? this.userId,
      age: age ?? this.age,
      gender: gender ?? this.gender,
      height: height ?? this.height,
      weight: weight ?? this.weight,
      activityLevel: activityLevel ?? this.activityLevel,
      goal: goal ?? this.goal,
      name: name ?? this.name,
      fastingGoal: fastingGoal ?? this.fastingGoal,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserProfileEntity &&
          runtimeType == other.runtimeType &&
          userId == other.userId &&
          age == other.age &&
          gender == other.gender &&
          height == other.height &&
          weight == other.weight &&
          activityLevel == other.activityLevel &&
          goal == other.goal &&
          name == other.name &&
          fastingGoal == other.fastingGoal;

  @override
  int get hashCode =>
      userId.hashCode ^
      age.hashCode ^
      gender.hashCode ^
      height.hashCode ^
      weight.hashCode ^
      activityLevel.hashCode ^
      goal.hashCode ^
      name.hashCode ^
      fastingGoal.hashCode;

  @override
  String toString() {
    return 'UserProfileEntity(userId: $userId, age: $age, gender: $gender, height: $height, weight: $weight, activityLevel: $activityLevel, goal: $goal, name: $name, fastingGoal: $fastingGoal)';
  }
}
