import 'package:equatable/equatable.dart';
import '../../../../core/constants/app_enums.dart';

/// Domain entity representing a fitness organization (gym, studio, academy, etc.).
class Organization extends Equatable {
  final String id;
  final String name;
  final OrganizationType type;
  final String? logoUrl;
  final String? description;
  final String? phone;
  final String? email;
  final String? website;

  // ── Address ──
  final String? address;
  final String? city;
  final String? state;
  final String? country;
  final String? pincode;

  // ── Location (for geofencing) ──
  final double? latitude;
  final double? longitude;
  final double geofenceRadiusMeters;

  // ── Operating Hours ──
  final String? openTime; // "05:00"
  final String? closeTime; // "22:00"
  final List<int> operatingDays; // 1=Mon, 7=Sun

  // ── WiFi Verification ──
  final bool wifiVerificationEnabled;
  final String? wifiSSID;
  final String? wifiBSSID;

  // ── Attendance Settings ──
  final AttendanceSession attendanceSessionType;
  final int maxAttendancePerDay;
  final int qrRefreshIntervalSeconds;

  // ── Branding ──
  final String? primaryColor;
  final String? tagline;

  const Organization({
    required this.id,
    required this.name,
    required this.type,
    this.logoUrl,
    this.description,
    this.phone,
    this.email,
    this.website,
    this.address,
    this.city,
    this.state,
    this.country,
    this.pincode,
    this.latitude,
    this.longitude,
    this.geofenceRadiusMeters = 50.0,
    this.openTime,
    this.closeTime,
    this.operatingDays = const [1, 2, 3, 4, 5, 6],
    this.wifiVerificationEnabled = false,
    this.wifiSSID,
    this.wifiBSSID,
    this.attendanceSessionType = AttendanceSession.fullDay,
    this.maxAttendancePerDay = 1,
    this.qrRefreshIntervalSeconds = 30,
    this.primaryColor,
    this.tagline,
  });

  /// Human-readable organization type label.
  String get typeLabel {
    switch (type) {
      case OrganizationType.gym:
        return 'Gym';
      case OrganizationType.yogaStudio:
        return 'Yoga Studio';
      case OrganizationType.danceAcademy:
        return 'Dance Academy';
      case OrganizationType.swimmingPool:
        return 'Swimming Academy';
      case OrganizationType.martialArts:
        return 'Martial Arts Center';
      case OrganizationType.crossfitBox:
        return 'CrossFit Box';
      case OrganizationType.personalTrainer:
        return 'Personal Trainer';
      case OrganizationType.fitnessClub:
        return 'Fitness Club';
    }
  }

  /// Check if the organization has GPS coordinates set.
  bool get hasLocation => latitude != null && longitude != null;

  /// Full address string.
  String get fullAddress {
    return [address, city, state, pincode, country]
        .where((s) => s != null && s.isNotEmpty)
        .join(', ');
  }

  @override
  List<Object?> get props => [id, name, type];
}
