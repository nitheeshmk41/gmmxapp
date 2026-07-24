import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../../../core/network/network_info.dart';
import '../../../../core/storage/local_database.dart';
import '../../auth/providers/auth_provider.dart';
import '../data/datasources/attendance_local_datasource.dart';
import '../data/datasources/attendance_remote_datasource.dart';
import '../data/repositories/attendance_repository_impl.dart';
import '../domain/repositories/attendance_repository.dart';

// ── Providers ──

final attendanceLocalDataSourceProvider = Provider<AttendanceLocalDataSource>((ref) {
  final db = ref.watch(localDatabaseProvider);
  return AttendanceLocalDataSource(db);
});

final attendanceRemoteDataSourceProvider = Provider<AttendanceRemoteDataSource>((ref) {
  return AttendanceRemoteDataSource();
});

final attendanceRepositoryProvider = Provider<AttendanceRepository>((ref) {
  return AttendanceRepositoryImpl(
    local: ref.watch(attendanceLocalDataSourceProvider),
    remote: ref.watch(attendanceRemoteDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
    authLocal: ref.watch(authLocalDataSourceProvider),
  );
});

// ── State ──

enum ScanState { initial, scanning, loading, success, error }

class ScanStateModel {
  final ScanState status;
  final String? errorMessage;
  final bool hasCameraPermission;
  final bool hasLocationPermission;

  const ScanStateModel({
    this.status = ScanState.initial,
    this.errorMessage,
    this.hasCameraPermission = false,
    this.hasLocationPermission = false,
  });

  ScanStateModel copyWith({
    ScanState? status,
    String? errorMessage,
    bool? hasCameraPermission,
    bool? hasLocationPermission,
  }) {
    return ScanStateModel(
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
      hasCameraPermission: hasCameraPermission ?? this.hasCameraPermission,
      hasLocationPermission: hasLocationPermission ?? this.hasLocationPermission,
    );
  }
}

// ── Notifier ──

class ScanNotifier extends Notifier<ScanStateModel> {
  @override
  ScanStateModel build() {
    return const ScanStateModel();
  }

  AttendanceRepository get _repo => ref.read(attendanceRepositoryProvider);

  /// Check and request necessary permissions.
  Future<void> checkPermissions() async {
    final cameraStatus = await Permission.camera.request();
    final locationStatus = await Permission.locationWhenInUse.request();

    state = state.copyWith(
      hasCameraPermission: cameraStatus.isGranted,
      hasLocationPermission: locationStatus.isGranted,
      status: cameraStatus.isGranted && locationStatus.isGranted
          ? ScanState.scanning
          : ScanState.initial,
    );
  }

  /// Reset scanner state so user can scan again.
  void reset() {
    state = state.copyWith(status: ScanState.scanning, errorMessage: null);
  }

  /// Process a scanned QR code payload.
  Future<void> processQrCode(String qrData) async {
    if (state.status == ScanState.loading || state.status == ScanState.success) {
      return; // Prevent multiple scans
    }

    state = state.copyWith(status: ScanState.loading, errorMessage: null);

    try {
      if (!state.hasLocationPermission) {
        throw Exception('Location permission is required to mark attendance.');
      }

      // Check if location services are enabled globally
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw Exception('Location services are disabled on your device.');
      }

      // Get high-accuracy position
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );

      // Attempt to mark attendance
      await _repo.markAttendance(
        qrData: qrData,
        currentLatitude: position.latitude,
        currentLongitude: position.longitude,
      );

      state = state.copyWith(status: ScanState.success);
    } catch (e) {
      state = state.copyWith(
        status: ScanState.error,
        errorMessage: e.toString().replaceAll('Exception: ', ''),
      );
    }
  }
}

final scanNotifierProvider = NotifierProvider<ScanNotifier, ScanStateModel>(() {
  return ScanNotifier();
});
