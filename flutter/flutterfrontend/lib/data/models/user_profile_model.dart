class UserProfileModel {
  final int? age;
  final String? gender;
  final double? height;
  final double? weight;
  final double? activityLevel;
  final String? goal;
  final String? name;
  final String? fastingGoal;

  UserProfileModel({
    this.age,
    this.gender,
    this.height,
    this.weight,
    this.activityLevel,
    this.goal,
    this.name,
    this.fastingGoal,
  });

  factory UserProfileModel.fromJson(Map<String, dynamic> json) {
    return UserProfileModel(
      age: json['age'] as int?,
      gender: json['gender'] as String?,
      height: (json['height'] as num?)?.toDouble(),
      weight: (json['weight'] as num?)?.toDouble(),
      activityLevel: (json['activityLevel'] as num?)?.toDouble(),
      goal: json['goal'] as String?,
      name: json['name'] as String?,
      fastingGoal: json['fastingGoal'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'age': age,
      'gender': gender,
      'height': height,
      'weight': weight,
      'activityLevel': activityLevel,
      'goal': goal,
      'name': name,
      'fastingGoal': fastingGoal,
    };
  }

  UserProfileModel copyWith({
    int? age,
    String? gender,
    double? height,
    double? weight,
    double? activityLevel,
    String? goal,
    String? name,
    String? fastingGoal,
  }) {
    return UserProfileModel(
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
      other is UserProfileModel &&
          runtimeType == other.runtimeType &&
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
    return 'UserProfileModel(age: $age, gender: $gender, height: $height, weight: $weight, activityLevel: $activityLevel, goal: $goal, name: $name, fastingGoal: $fastingGoal)';
  }
}
