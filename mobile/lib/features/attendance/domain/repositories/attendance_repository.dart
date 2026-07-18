import '../entities/attendance.dart';

/// Interface for the attendance repository.
abstract class AttendanceRepository {
  /// Mark attendance for the current member.
  /// Throws an exception if location validation fails or if the QR is invalid.
  Future<void> markAttendance({
    required String qrData,
    required double currentLatitude,
    required double currentLongitude,
  });

  /// Get the member's attendance history.
  Future<List<Attendance>> getAttendanceHistory({
    int limit = 50,
    int offset = 0,
  });

  /// Sync all pending offline attendance records to the server.
  Future<void> syncPendingAttendance();
}
