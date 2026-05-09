/// API Response Entity - Domain layer representation
/// 
/// This entity mirrors the backend's ApiResponse<T> structure and is used
/// in the domain layer for business logic and use cases.
/// 
/// Backend reference: com.crossapplication.main.dto.ApiResponse.java
class ApiResponseEntity<T> {
  /// HTTP Status Code (200 = success, 400 = client error, 500 = server error)
  final int status;

  /// Human-readable message describing the response
  final String? message;

  /// The actual response payload of generic type T
  final T? data;

  /// Machine-readable error code for programmatic error handling
  final String? errorCode;

  /// Constructor for creating an API response
  ApiResponseEntity({
    required this.status,
    this.message,
    this.data,
    this.errorCode,
  });

  /// Check if the response indicates success (status 200)
  bool get isSuccess => status == 200;

  /// Check if the response indicates an error (status != 200)
  bool get isError => status != 200;

  /// Check if the response is a 400 Bad Request error
  bool get isBadRequest => status == 400;

  /// Check if the response is a 401 Unauthorized error
  bool get isUnauthorized => status == 401;

  /// Check if the response is a 403 Forbidden error
  bool get isForbidden => status == 403;

  /// Check if the response is a 404 Not Found error
  bool get isNotFound => status == 404;

  /// Check if the response is a 500 Server error
  bool get isServerError => status >= 500;

  /// Create a copy of this response with some fields replaced
  ApiResponseEntity<T> copyWith({
    int? status,
    String? message,
    T? data,
    String? errorCode,
  }) {
    return ApiResponseEntity(
      status: status ?? this.status,
      message: message ?? this.message,
      data: data ?? this.data,
      errorCode: errorCode ?? this.errorCode,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ApiResponseEntity<T> &&
          runtimeType == other.runtimeType &&
          status == other.status &&
          message == other.message &&
          data == other.data &&
          errorCode == other.errorCode;

  @override
  int get hashCode =>
      status.hashCode ^
      message.hashCode ^
      data.hashCode ^
      errorCode.hashCode;

  @override
  String toString() =>
      'ApiResponseEntity(status: $status, message: $message, data: $data, errorCode: $errorCode)';
}
