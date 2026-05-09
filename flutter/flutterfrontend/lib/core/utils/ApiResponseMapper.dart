import 'package:flutterfrontend/data/models/api_response_model.dart';
import 'package:flutterfrontend/domain/entities/api_response_entity.dart';

/// Mapper for converting between ApiResponseModel and ApiResponseEntity
/// 
/// This mapper handles the data layer to domain layer conversion for API responses.
/// It maintains type safety while converting between the model and entity representations.
class ApiResponseMapper {
  /// Convert ApiResponseEntity to ApiResponseModel (Entity → Model)
  /// 
  /// This is typically used when sending data from domain layer to data layer.
  static ApiResponseModel<T> toModel<T>(ApiResponseEntity<T> entity) {
    return ApiResponseModel(
      status: entity.status,
      message: entity.message,
      data: entity.data,
      errorCode: entity.errorCode,
    );
  }

  /// Convert ApiResponseModel to ApiResponseEntity (Model → Entity)
  /// 
  /// This is typically used when receiving data from the API (data layer)
  /// and converting it to domain layer entities.
  static ApiResponseEntity<T> toEntity<T>(ApiResponseModel<T> model) {
    return ApiResponseEntity(
      status: model.status,
      message: model.message,
      data: model.data,
      errorCode: model.errorCode,
    );
  }

  /// Convert ApiResponseEntity to JSON
  /// 
  /// Optional [dataToJson] callback can be provided to serialize the data field.
  static Map<String, dynamic> toJson<T>(
    ApiResponseEntity<T> entity, {
    Map<String, dynamic> Function(T)? dataToJson,
  }) {
    final json = {
      'status': entity.status,
      'message': entity.message,
      'errorCode': entity.errorCode,
    };

    if (entity.data != null && dataToJson != null) {
      json['data'] = dataToJson(entity.data as T);
    } else if (entity.data != null) {
      json['data'] = entity.data;
    }

    return json;
  }

  /// Parse JSON to create an ApiResponseEntity
  /// 
  /// Optional [dataFromJson] callback must be provided to deserialize the data field.
  static ApiResponseEntity<T> fromJson<T>(
    Map<String, dynamic> json,
    T Function(dynamic)? dataFromJson,
  ) {
    return ApiResponseEntity(
      status: json['status'] as int? ?? 400,
      message: json['message'] as String?,
      data: json['data'] != null && dataFromJson != null
          ? dataFromJson(json['data'])
          : null,
      errorCode: json['errorCode'] as String?,
    );
  }
}
