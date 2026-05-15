class UserEntity {
  final int? id;
  final String? email;
  final String? password;
  final String? username;
  final String? avatar;
  final String? role;
  final bool? isEmailVerified;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  UserEntity({
    this.id,
    this.email,
    this.password,
    this.username,
    this.avatar,
    this.role,
    this.isEmailVerified,
    this.createdAt,
    this.updatedAt,
  });

  UserEntity copyWith({
    int? id,
    String? email,
    String? password,
    String? username,
    String? avatar,
    String? role,
    bool? isEmailVerified,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserEntity(
      id: id ?? this.id,
      email: email ?? this.email,
      password: password ?? this.password,
      username: username ?? this.username,
      avatar: avatar ?? this.avatar,
      role: role ?? this.role,
      isEmailVerified: isEmailVerified ?? this.isEmailVerified,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          email == other.email &&
          password == other.password &&
          username == other.username &&
          avatar == other.avatar &&
          role == other.role &&
          isEmailVerified == other.isEmailVerified &&
          createdAt == other.createdAt &&
          updatedAt == other.updatedAt;

  @override
  int get hashCode =>
      id.hashCode ^
      email.hashCode ^
      password.hashCode ^
      username.hashCode ^
      avatar.hashCode ^
      role.hashCode ^
      isEmailVerified.hashCode ^
      createdAt.hashCode ^
      updatedAt.hashCode;

  @override
  String toString() {
    return 'UserEntity(id: $id, email: $email, username: $username, avatar: $avatar, role: $role, isEmailVerified: $isEmailVerified, createdAt: $createdAt, updatedAt: $updatedAt)';
  }
}
