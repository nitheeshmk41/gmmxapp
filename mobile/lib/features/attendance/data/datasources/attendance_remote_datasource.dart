import 'package:appwrite/appwrite.dart';
import '../../../../core/config/appwrite_config.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/errors/exceptions.dart';
import '../models/attendance_model.dart';

/// Remote datasource for sending attendance to the server.
class AttendanceRemoteDataSource {
  final Databases _databases = AppwriteConfig.databases;

  /// Post a single attendance record to Appwrite.
  Future<void> postAttendance(AttendanceModel attendance) async {
    try {
      await _databases.createDocument(
        databaseId: AppConstants.databaseId,
        collectionId: AppConstants.collectionAttendance,
        documentId: attendance.id,
        data: {
          'gymId': attendance.organizationId,
          'memberId': attendance.memberId,
          'attendanceDate': attendance.timestamp.toIso8601String().split('T').first,
          'checkIn': attendance.timestamp.toIso8601String(),
          'checkOut': null,
          'method': 'qr',
          'source': 'mobile_qr',
        },
      );
    } on AppwriteException catch (e) {
      throw ServerException(message: e.message ?? 'Failed to log attendance');
    }
  }

  /// Bulk sync pending offline records to Appwrite.
  /// Returns a list of IDs that were successfully synced.
  Future<List<String>> syncPending(List<AttendanceModel> pending) async {
    final List<String> successfulIds = [];

    for (final record in pending) {
      try {
        await postAttendance(record);
        successfulIds.add(record.id);
      } catch (e) {
        // Skip failed ones, we'll try again later
        continue;
      }
    }

    return successfulIds;
  }
}
