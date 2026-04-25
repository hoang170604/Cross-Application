class ApiResponseModel<T> {
  final bool success;
  final String? message;
  final T? data;
  final String? errorCode;

  ApiResponseModel({
    required this.success,
    this.message,
    this.data,
    this.errorCode,
  });

  factory ApiResponseModel.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? dataFromJson,
  ) {
    return ApiResponseModel(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String?,
      data: json['data'] != null && dataFromJson != null ? dataFromJson(json['data']) : null,
      errorCode: json['errorCode'] as String?,
    );
  }

  Map<String, dynamic> toJson({
    Map<String, dynamic> Function(T)? dataToJson,
  }) {
    return {
      'success': success,
      'message': message,
      'data': data != null && dataToJson != null ? dataToJson(data as T) : data,
      'errorCode': errorCode,
    };
  }

  ApiResponseModel<T> copyWith({
    bool? success,
    String? message,
    T? data,
    String? errorCode,
  }) {
    return ApiResponseModel(
      success: success ?? this.success,
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
          success == other.success &&
          message == other.message &&
          data == other.data &&
          errorCode == other.errorCode;

  @override
  int get hashCode =>
      success.hashCode ^ message.hashCode ^ data.hashCode ^ errorCode.hashCode;

  @override
  String toString() {
    return 'ApiResponseModel(success: $success, message: $message, data: $data, errorCode: $errorCode)';
  }
}
