// Base exception class
abstract class CustomException implements Exception {
  final String message;
  final dynamic originalException;

  CustomException({
    required this.message,
    this.originalException,
  });

  @override
  String toString() => message;
}

// Network exceptions
class NetworkException extends CustomException {
  final String? details;

  NetworkException({
    required super.message,
    this.details,
    super.originalException,
  });
}

// Server exceptions (5xx)
class ServerException extends CustomException {
  final int? statusCode;
  final dynamic responseBody;

  ServerException({
    required super.message,
    this.statusCode,
    this.responseBody,
    super.originalException,
  });
}

// Client exceptions (4xx)
class ClientException extends CustomException {
  final int? statusCode;
  final dynamic responseBody;

  ClientException({
    required super.message,
    this.statusCode,
    this.responseBody,
    super.originalException,
  });
}

// Authentication exceptions (401)
class AuthenticationException extends CustomException {
  AuthenticationException({
    super.message = 'Authentication failed. Please log in again.',
    super.originalException,
  });
}

// Authorization exceptions (403)
class AuthorizationException extends CustomException {
  AuthorizationException({
    super.message = 'You do not have permission to perform this action.',
    super.originalException,
  });
}

// Not found exceptions (404)
class NotFoundException extends CustomException {
  NotFoundException({
    super.message = 'The requested resource was not found.',
    super.originalException,
  });
}

// Validation exceptions (400)
class ValidationException extends CustomException {
  final Map<String, List<String>>? fieldErrors;

  ValidationException({
    super.message = 'Validation failed.',
    this.fieldErrors,
    super.originalException,
  });
}

// Timeout exceptions
class TimeoutException extends CustomException {
  TimeoutException({
    super.message = 'Request timed out. Please try again.',
    super.originalException,
  });
}

// Cache exceptions
class CacheException extends CustomException {
  CacheException({
    super.message = 'Cache operation failed.',
    super.originalException,
  });
}

// Token exceptions
class TokenException extends CustomException {
  TokenException({
    super.message = 'Token is invalid or expired.',
    super.originalException,
  });
}
