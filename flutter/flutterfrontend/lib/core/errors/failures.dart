// Abstract base failure class
abstract class Failure {
  final String message;
  final dynamic exception;

  Failure({
    required this.message,
    this.exception,
  });

  @override
  String toString() => message;
}

// Network-related failures
class NetworkFailure extends Failure {
  NetworkFailure({
    required super.message,
    super.exception,
  });
}

// Server-related failures (5xx errors)
class ServerFailure extends Failure {
  final int? statusCode;

  ServerFailure({
    required super.message,
    this.statusCode,
    super.exception,
  });
}

// Client-related failures (4xx errors)
class ClientFailure extends Failure {
  final int? statusCode;

  ClientFailure({
    required super.message,
    this.statusCode,
    super.exception,
  });
}

// Authentication-related failures
class AuthFailure extends Failure {
  final int? statusCode;

  AuthFailure({
    required super.message,
    this.statusCode,
    super.exception,
  });
}

// Authorization-related failures (403)
class AuthorizationFailure extends Failure {
  AuthorizationFailure({
    required super.message,
    super.exception,
  });
}

// Not found failures (404)
class NotFoundFailure extends Failure {
  NotFoundFailure({
    required super.message,
    super.exception,
  });
}

// Validation failures
class ValidationFailure extends Failure {
  final Map<String, List<String>>? fieldErrors;

  ValidationFailure({
    required super.message,
    this.fieldErrors,
    super.exception,
  });
}

// Unknown/Generic failures
class UnknownFailure extends Failure {
  UnknownFailure({
    required super.message,
    super.exception,
  });
}
