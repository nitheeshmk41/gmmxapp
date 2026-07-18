import 'package:equatable/equatable.dart';

/// Base failure class for the application.
/// All domain-level errors extend this.
abstract class Failure extends Equatable {
  final String message;
  final int? code;

  const Failure({required this.message, this.code});

  @override
  List<Object?> get props => [message, code];
}

/// Server/API related failures
class ServerFailure extends Failure {
  const ServerFailure({
    super.message = 'An unexpected server error occurred.',
    super.code,
  });
}

/// Local cache/database failures
class CacheFailure extends Failure {
  const CacheFailure({
    super.message = 'Failed to access local data.',
    super.code,
  });
}

/// Network connectivity failures
class NetworkFailure extends Failure {
  const NetworkFailure({
    super.message = 'No internet connection. Please check your network.',
    super.code,
  });
}

/// Authentication failures
class AuthFailure extends Failure {
  const AuthFailure({
    super.message = 'Authentication failed. Please try again.',
    super.code,
  });
}

/// Location/GPS failures
class LocationFailure extends Failure {
  const LocationFailure({
    super.message = 'Unable to determine your location.',
    super.code,
  });
}

/// Permission failures
class PermissionFailure extends Failure {
  const PermissionFailure({
    super.message = 'Required permission was denied.',
    super.code,
  });
}

/// Validation failures
class ValidationFailure extends Failure {
  const ValidationFailure({
    super.message = 'Invalid input provided.',
    super.code,
  });
}

/// Attendance-specific failures
class AttendanceFailure extends Failure {
  const AttendanceFailure({
    super.message = 'Attendance could not be marked.',
    super.code,
  });
}
