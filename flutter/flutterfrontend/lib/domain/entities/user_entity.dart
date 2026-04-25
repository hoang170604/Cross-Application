class UserEntity {
  final int? id;
  final String? email;
  final String? password;
  final DateTime? createdAt;

  UserEntity({
    this.id,
    this.email,
    this.password,
    this.createdAt,
  });

  UserEntity copyWith({
    int? id,
    String? email,
    String? password,
    DateTime? createdAt,
  }) {
    return UserEntity(
      id: id ?? this.id,
      email: email ?? this.email,
      password: password ?? this.password,
      createdAt: createdAt ?? this.createdAt,
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
          createdAt == other.createdAt;

  @override
  int get hashCode =>
      id.hashCode ^ email.hashCode ^ password.hashCode ^ createdAt.hashCode;

  @override
  String toString() {
    return 'UserEntity(id: $id, email: $email, password: $password, createdAt: $createdAt)';
  }
}
