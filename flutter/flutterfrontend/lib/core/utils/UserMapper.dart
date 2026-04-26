import 'package:flutterfrontend/data/models/index.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

class UserMapper {
  /// Convert UserEntity to UserModel (Entity -> DTO/Model)
  static UserModel toModel(UserEntity entity) {
    return UserModel(
      id: entity.id,
      email: entity.email,
      createdAt: entity.createdAt,
    );
  }

  /// Convert UserModel to UserEntity (DTO/Model -> Entity)
  /// Note: password is ignored as per the Java mapper configuration
  static UserEntity toEntity(UserModel model) {
    return UserEntity(
      id: model.id,
      email: model.email,
      password: null, // Ignored in mapping
      createdAt: model.createdAt,
    );
  }
}