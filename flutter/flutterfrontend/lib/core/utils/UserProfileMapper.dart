import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class UserProfileMapper {
  /// Convert UserProfileEntity to UserProfileModel
  static UserProfileModel toModel(UserProfileEntity entity) {
    return UserProfileModel(
      age: entity.age,
      gender: entity.gender,
      height: entity.height,
      weight: entity.weight,
      activityLevel: entity.activityLevel,
      goal: entity.goal,
      name: entity.name,
      fastingGoal: entity.fastingGoal,
    );
  }

  /// Convert UserProfileModel to UserProfileEntity
  /// Note: user and userId are ignored in mapping
  static UserProfileEntity toEntity(UserProfileModel model) {
    return UserProfileEntity(
      userId: null, // Ignored in mapping
      age: model.age,
      gender: model.gender,
      height: model.height,
      weight: model.weight,
      activityLevel: model.activityLevel,
      goal: model.goal,
      name: model.name,
      fastingGoal: model.fastingGoal,
    );
  }
}