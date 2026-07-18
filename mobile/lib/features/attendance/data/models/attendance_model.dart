import '../../domain/entities/attendance.dart';

class AttendanceModel extends Attendance {
  const AttendanceModel({
    required super.id,
    required super.memberId,
    required super.organizationId,
    required super.branchId,
    required super.timestamp,
    super.isSynced = false,
  });

  factory AttendanceModel.fromJson(Map<String, dynamic> json) {
    return AttendanceModel(
      id: json['id'] as String,
      memberId: json['member_id'] as String,
      organizationId: json['organization_id'] as String,
      branchId: json['branch_id'] as String? ?? 'main',
      timestamp: DateTime.parse(json['check_in_time'] as String),
      isSynced: (json['synced'] as int? ?? 0) == 1,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'member_id': memberId,
      'organization_id': organizationId,
      'branch_id': branchId,
      'check_in_time': timestamp.toIso8601String(),
      'method': 'qr',
      'created_at': DateTime.now().toIso8601String(),
      'synced': isSynced ? 1 : 0,
    };
  }

  factory AttendanceModel.fromEntity(Attendance entity) {
    return AttendanceModel(
      id: entity.id,
      memberId: entity.memberId,
      organizationId: entity.organizationId,
      branchId: entity.branchId,
      timestamp: entity.timestamp,
      isSynced: entity.isSynced,
    );
  }

  AttendanceModel copyWith({
    String? id,
    String? memberId,
    String? organizationId,
    String? branchId,
    DateTime? timestamp,
    bool? isSynced,
  }) {
    return AttendanceModel(
      id: id ?? this.id,
      memberId: memberId ?? this.memberId,
      organizationId: organizationId ?? this.organizationId,
      branchId: branchId ?? this.branchId,
      timestamp: timestamp ?? this.timestamp,
      isSynced: isSynced ?? this.isSynced,
    );
  }
}
