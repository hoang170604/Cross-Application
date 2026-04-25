class FoodCategoryEntity {
  final int? id;
  final String? name;

  FoodCategoryEntity({
    this.id,
    this.name,
  });

  FoodCategoryEntity copyWith({
    int? id,
    String? name,
  }) {
    return FoodCategoryEntity(
      id: id ?? this.id,
      name: name ?? this.name,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FoodCategoryEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name;

  @override
  int get hashCode => id.hashCode ^ name.hashCode;

  @override
  String toString() {
    return 'FoodCategoryEntity(id: $id, name: $name)';
  }
}
