import 'package:dio/dio.dart';

abstract class FoodRemoteDatasource {
  Future<List<dynamic>> getAllFood();
  Future<List<dynamic>> searchByName(String name);
  Future<List<dynamic>> getAllCategories();
  Future<dynamic> getFoodById(int id);
  Future<void> createFood(Map<String, dynamic> foodData);
  Future<void> updateFood(int id, Map<String, dynamic> foodData);
  Future<void> deleteFood(int id);
}

class FoodRemoteDatasourceImpl implements FoodRemoteDatasource {
  final Dio dio;
  static const String _baseUrl = '/api/foods';

  FoodRemoteDatasourceImpl({required this.dio});

  @override
  Future<List<dynamic>> getAllFood() async {
    try {
      final response = await dio.get(_baseUrl);
      if (response.statusCode != 200) {
        throw Exception('Failed to fetch foods');
      }
      return response.data['data'] ?? [];
    } on DioException catch (e) {
      throw Exception('Error fetching foods: ${e.message}');
    }
  }

  @override
  Future<List<dynamic>> searchByName(String name) async {
    try {
      final response = await dio.get(
        '$_baseUrl/search',
        queryParameters: {'name': name},
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to search foods');
      }
      return response.data['data'] ?? [];
    } on DioException catch (e) {
      throw Exception('Error searching foods: ${e.message}');
    }
  }

  @override
  Future<List<dynamic>> getAllCategories() async {
    try {
      final response = await dio.get('$_baseUrl/categories');
      if (response.statusCode != 200) {
        throw Exception('Failed to fetch categories');
      }
      return response.data['data'] ?? [];
    } on DioException catch (e) {
      throw Exception('Error fetching categories: ${e.message}');
    }
  }

  @override
  Future<dynamic> getFoodById(int id) async {
    try {
      final response = await dio.get('$_baseUrl/$id');
      if (response.statusCode != 200) {
        throw Exception('Failed to fetch food');
      }
      return response.data['data'];
    } on DioException catch (e) {
      throw Exception('Error fetching food: ${e.message}');
    }
  }

  @override
  Future<void> createFood(Map<String, dynamic> foodData) async {
    try {
      final response = await dio.post(
        _baseUrl,
        data: foodData,
      );
      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to create food');
      }
    } on DioException catch (e) {
      throw Exception('Error creating food: ${e.message}');
    }
  }

  @override
  Future<void> updateFood(int id, Map<String, dynamic> foodData) async {
    try {
      final response = await dio.put(
        '$_baseUrl/$id',
        data: foodData,
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to update food');
      }
    } on DioException catch (e) {
      throw Exception('Error updating food: ${e.message}');
    }
  }

  @override
  Future<void> deleteFood(int id) async {
    try {
      final response = await dio.delete('$_baseUrl/$id');
      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete food');
      }
    } on DioException catch (e) {
      throw Exception('Error deleting food: ${e.message}');
    }
  }
}
