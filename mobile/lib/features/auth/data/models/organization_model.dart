import '../../../../core/constants/app_enums.dart';
import '../../domain/entities/organization.dart';

/// Data model for Organization with JSON serialization.
class OrganizationModel extends Organization {
  const OrganizationModel({
    required super.id,
    required super.name,
    required super.type,
    super.logoUrl,
    super.description,
    super.phone,
    super.email,
    super.website,
    super.address,
    super.city,
    super.state,
    super.country,
    super.pincode,
    super.latitude,
    super.longitude,
    super.geofenceRadiusMeters = 50.0,
    super.openTime,
    super.closeTime,
    super.operatingDays = const [1, 2, 3, 4, 5, 6],
    super.wifiVerificationEnabled = false,
    super.wifiSSID,
    super.wifiBSSID,
    super.attendanceSessionType = AttendanceSession.fullDay,
    super.maxAttendancePerDay = 1,
    super.qrRefreshIntervalSeconds = 30,
    super.primaryColor,
    super.tagline,
  });

  /// Create from Appwrite document JSON.
  factory OrganizationModel.fromJson(Map<String, dynamic> json) {
    return OrganizationModel(
      id: json['\$id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      type: OrganizationType.values.firstWhere(
        (t) => t.name == json['type'],
        orElse: () => OrganizationType.gym,
      ),
      logoUrl: json['logo_url'],
      description: json['description'],
      phone: json['phone'],
      email: json['email'],
      website: json['website'],
      address: json['address'],
      city: json['city'],
      state: json['state'],
      country: json['country'],
      pincode: json['pincode'],
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      geofenceRadiusMeters:
          (json['geofence_radius_meters'] as num?)?.toDouble() ?? 50.0,
      openTime: json['open_time'],
      closeTime: json['close_time'],
      operatingDays: json['operating_days'] != null
          ? List<int>.from(json['operating_days'])
          : [1, 2, 3, 4, 5, 6],
      wifiVerificationEnabled: json['wifi_verification_enabled'] ?? false,
      wifiSSID: json['wifi_ssid'],
      wifiBSSID: json['wifi_bssid'],
      attendanceSessionType: AttendanceSession.values.firstWhere(
        (s) => s.name == json['attendance_session_type'],
        orElse: () => AttendanceSession.fullDay,
      ),
      maxAttendancePerDay: json['max_attendance_per_day'] ?? 1,
      qrRefreshIntervalSeconds: json['qr_refresh_interval_seconds'] ?? 30,
      primaryColor: json['primary_color'],
      tagline: json['tagline'],
    );
  }

  /// Convert to JSON for caching.
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type.name,
      'logo_url': logoUrl,
      'description': description,
      'phone': phone,
      'email': email,
      'website': website,
      'address': address,
      'city': city,
      'state': state,
      'country': country,
      'pincode': pincode,
      'latitude': latitude,
      'longitude': longitude,
      'geofence_radius_meters': geofenceRadiusMeters,
      'open_time': openTime,
      'close_time': closeTime,
      'operating_days': operatingDays,
      'wifi_verification_enabled': wifiVerificationEnabled,
      'wifi_ssid': wifiSSID,
      'wifi_bssid': wifiBSSID,
      'attendance_session_type': attendanceSessionType.name,
      'max_attendance_per_day': maxAttendancePerDay,
      'qr_refresh_interval_seconds': qrRefreshIntervalSeconds,
      'primary_color': primaryColor,
      'tagline': tagline,
    };
  }
}
