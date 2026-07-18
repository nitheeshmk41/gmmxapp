import 'package:equatable/equatable.dart';

/// Represents a single attendance record for a member.
class Attendance extends Equatable {
  final String id;
  final String memberId;
  final String organizationId;
  final String branchId;
  final DateTime timestamp;
  
  /// Whether this record has been synced to the remote backend.
  /// Important for offline-first architecture.
  final bool isSynced;

  const Attendance({
    required this.id,
    required this.memberId,
    required this.organizationId,
    required this.branchId,
    required this.timestamp,
    this.isSynced = false,
  });

  @override
  List<Object?> get props => [
        id,
        memberId,
        organizationId,
        branchId,
        timestamp,
        isSynced,
      ];
}
