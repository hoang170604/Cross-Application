
class ApiResponseModel<T> {
  
  final int status;

  
  final String? message;

  
  final T? data;

  
  final String? errorCode;

  
  ApiResponseModel({
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

  /// Create a success response with optional custom message
  /// Matches backend: success(T data) and success(T data, String message)
  /// If message is not provided, defaults to 'Success'
  factory ApiResponseModel.success(T data, [String? message]) {
    return ApiResponseModel(
      status: 200,
      message: message ?? 'Success',
      data: data,
    );
  }

  /// Create an error response with optional error code
  /// Matches backend: error(String message) and error(String message, String errorCode)
  factory ApiResponseModel.error(String message, [String? errorCode]) {
    return ApiResponseModel(
      status: 400,
      message: message,
      errorCode: errorCode,
    );
  }

  
  factory ApiResponseModel.customStatus(
    int status,
    String message, {
    T? data,
    String? errorCode,
  }) {
    return ApiResponseModel(
      status: status,
      message: message,
      data: data,
      errorCode: errorCode,
    );
  }

  /// Parse JSON to create an ApiResponseModel
  /// 
  /// The [dataFromJson] parameter is a callback function that converts
  /// the JSON data field into an object of type T.
  /// 
  /// Example:
  /// ```dart
  /// final response = ApiResponseModel.fromJson(
  ///   json,
  ///   (data) => UserModel.fromJson(data),
  /// );
  /// ```
  factory ApiResponseModel.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? dataFromJson,
  ) {
    return ApiResponseModel(
      status: json['status'] as int? ?? 400,
      message: json['message'] as String?,
      data: json['data'] != null && dataFromJson != null
          ? dataFromJson(json['data'])
          : null,
      errorCode: json['errorCode'] as String?,
    );
  }

  /// Convert to JSON map
  /// 
  /// The [dataToJson] parameter is a callback function that converts
  /// the data object into a JSON-serializable map.
  /// 
  /// Example:
  /// ```dart
  /// final json = response.toJson((user) => user.toJson());
  /// ```
  Map<String, dynamic> toJson({
    Map<String, dynamic> Function(T)? dataToJson,
  }) {
    final json = {
      'status': status,
      'message': message,
      'errorCode': errorCode,
    };

    // Only include data if it's not null
    if (data != null && dataToJson != null) {
      json['data'] = dataToJson(data as T);
    } else if (data != null) {
      json['data'] = data;
    }

    return json;
  }

  /// Create a copy of this response with some fields replaced
  /// 
  /// Example:
  /// ```dart
  /// final updatedResponse = response.copyWith(
  ///   message: 'Updated message',
  ///   data: newData,
  /// );
  /// ```
  ApiResponseModel<T> copyWith({
    int? status,
    String? message,
    T? data,
    String? errorCode,
  }) {
    return ApiResponseModel(
      status: status ?? this.status,
      message: message ?? this.message,
      data: data ?? this.data,
      errorCode: errorCode ?? this.errorCode,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ApiResponseModel<T> &&
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
      'ApiResponseModel(status: $status, message: $message, data: $data, errorCode: $errorCode)';
}
