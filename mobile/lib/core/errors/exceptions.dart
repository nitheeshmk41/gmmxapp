/// Base exception for server/API errors.
class ServerException implements Exception {
  final String message;
  final int? statusCode;

  const ServerException({
    this.message = 'An unexpected server error occurred.',
    this.statusCode,
  });

  @override
  String toString() => 'ServerException: $message (code: $statusCode)';
}

/// Exception for local cache operations.
class CacheException implements Exception {
  final String message;

  const CacheException({this.message = 'Cache operation failed.'});

  @override
  String toString() => 'CacheException: $message';
}
/// Exception for validation failures (e.g. invalid location, expired QR)
class ValidationException implements Exception {
  final String message;

  const ValidationException({required this.message});

  @override
  String toString() => 'ValidationException: $message';
}

/// Exception for network-related issues.
class NetworkException implements Exception {
  final String message;

  const NetworkException({this.message = 'No internet connection.'});

  @override
  String toString() => 'NetworkException: $message';
}

/// Exception for authentication issues.
class AuthException implements Exception {
  final String message;
  final int? code;

  const AuthException({
    this.message = 'Authentication failed.',
    this.code,
  });

  @override
  String toString() => 'AuthException: $message (code: $code)';
}

/// Exception for location-related issues.
class LocationException implements Exception {
  final String message;

  const LocationException({this.message = 'Location service unavailable.'});

  @override
  String toString() => 'LocationException: $message';
}

/// Exception for attendance-related issues.
class AttendanceException implements Exception {
  final String message;

  const AttendanceException({this.message = 'Attendance operation failed.'});

  @override
  String toString() => 'AttendanceException: $message';
}
