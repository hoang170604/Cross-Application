class FoodCategoryModel {
  final String? name;

  FoodCategoryModel({this.name});

  factory FoodCategoryModel.fromJson(Map<String, dynamic> json) {
    return FoodCategoryModel(
      name: json['name'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
    };
  }

  FoodCategoryModel copyWith({
    String? name,
  }) {
    return FoodCategoryModel(
      name: name ?? this.name,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FoodCategoryModel &&
          runtimeType == other.runtimeType &&
          name == other.name;

  @override
  int get hashCode => name.hashCode;

  @override
  String toString() {
    return 'FoodCategoryModel(name: $name)';
  }
}
