import 'dart:convert';
import 'package:geolocator/geolocator.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/attendance.dart';
import '../../domain/repositories/attendance_repository.dart';
import '../datasources/attendance_local_datasource.dart';
import '../datasources/attendance_remote_datasource.dart';
import '../models/attendance_model.dart';
import '../../../auth/data/datasources/auth_local_datasource.dart';

/// Implementation of [AttendanceRepository].
/// Coordinates offline-first saving, location validation, and backend syncing.
class AttendanceRepositoryImpl implements AttendanceRepository {
  final AttendanceLocalDataSource _local;
  final AttendanceRemoteDataSource _remote;
  final NetworkInfo _networkInfo;
  final AuthLocalDataSource _authLocal;
  final Uuid _uuid;

  AttendanceRepositoryImpl({
    required AttendanceLocalDataSource local,
    required AttendanceRemoteDataSource remote,
    required NetworkInfo networkInfo,
    required AuthLocalDataSource authLocal,
    Uuid? uuid,
  })  : _local = local,
        _remote = remote,
        _networkInfo = networkInfo,
        _authLocal = authLocal,
        _uuid = uuid ?? const Uuid();

  @override
  Future<void> markAttendance({
    required String qrData,
    required double currentLatitude,
    required double currentLongitude,
  }) async {
    // 1. Fetch current member and organization context
    final member = await _authLocal.getCachedMember();
    final org = await _authLocal.getCachedOrganization();

    if (member == null || org == null) {
      throw const AuthException(message: 'User session not found.');
    }

    // 2. Validate QR Data (Expect JSON: {"gymId":"...", "timestamp":123456})
    Map<String, dynamic> qrPayload;
    try {
      qrPayload = jsonDecode(qrData);
    } catch (_) {
      throw const ValidationException(message: 'Invalid QR Code format.');
    }

    final String? qrGymId = qrPayload['gymId'];
    final int? qrTimestampMs = qrPayload['timestamp'];

    if (qrGymId != org.id) {
      throw const ValidationException(
          message: 'This QR code belongs to a different gym.');
    }

    if (qrTimestampMs != null) {
      final qrTime = DateTime.fromMillisecondsSinceEpoch(qrTimestampMs);
      final diff = DateTime.now().difference(qrTime).abs();
      // If QR code is older than 2 minutes, reject it
      if (diff.inSeconds > 120) {
        throw const ValidationException(
            message: 'QR Code expired. Please refresh the scanner.');
      }
    }

    // 3. Location Validation
    if (org.hasLocation) {
      final distanceInMeters = Geolocator.distanceBetween(
        currentLatitude,
        currentLongitude,
        org.latitude!,
        org.longitude!,
      );

      // Defaulting to 100 meters strict radius
      if (distanceInMeters > 100) {
        throw ValidationException(
            message:
                'You are not inside the gym. (Distance: \${distanceInMeters.toStringAsFixed(0)}m)');
      }
    }

    // 4. Create Record
    final newAttendance = AttendanceModel(
      id: _uuid.v4(),
      memberId: member.id,
      organizationId: org.id,
      branchId: 'main', // Default for now
      timestamp: DateTime.now(),
      isSynced: false,
    );

    // 5. Attempt Remote Sync immediately if online
    bool synced = false;
    if (await _networkInfo.isConnected) {
      try {
        await _remote.postAttendance(newAttendance);
        synced = true;
      } catch (e) {
        // Will fallback to local cache
      }
    }

    // 6. Cache locally (whether synced or not)
    await _local.cacheAttendance(newAttendance.copyWith(isSynced: synced));
  }

  @override
  Future<List<Attendance>> getAttendanceHistory({
    int limit = 50,
    int offset = 0,
  }) async {
    final member = await _authLocal.getCachedMember();
    if (member == null) return [];

    return await _local.getAttendanceHistory(member.id, limit, offset);
  }

  @override
  Future<void> syncPendingAttendance() async {
    if (!await _networkInfo.isConnected) return;

    final pending = await _local.getPendingSync();
    if (pending.isEmpty) return;

    final successfulIds = await _remote.syncPending(pending);
    await _local.markAsSynced(successfulIds);
  }
}
