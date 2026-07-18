import 'package:equatable/equatable.dart';
import '../../../../core/constants/app_enums.dart';

/// Domain entity representing a registered member.
/// This is a pure domain model — no serialization logic here.
class Member extends Equatable {
  final String id;
  final String userId; // Appwrite auth user ID
  final String organizationId;
  final String name;
  final String email;
  final String? phone;
  final String? avatarUrl;
  final Gender? gender;
  final DateTime? dateOfBirth;
  final double? heightCm;
  final double? weightKg;
  final String? emergencyContact;
  final String? medicalConditions;
  final MembershipStatus membershipStatus;
  final DateTime? membershipStart;
  final DateTime? membershipEnd;
  final String? membershipPlanName;
  final String? assignedTrainerId;
  final String? assignedTrainerName;
  final List<String> fitnessGoals;
  final DateTime joinDate;
  final DateTime updatedAt;

  const Member({
    required this.id,
    required this.userId,
    required this.organizationId,
    required this.name,
    required this.email,
    this.phone,
    this.avatarUrl,
    this.gender,
    this.dateOfBirth,
    this.heightCm,
    this.weightKg,
    this.emergencyContact,
    this.medicalConditions,
    required this.membershipStatus,
    this.membershipStart,
    this.membershipEnd,
    this.membershipPlanName,
    this.assignedTrainerId,
    this.assignedTrainerName,
    this.fitnessGoals = const [],
    required this.joinDate,
    required this.updatedAt,
  });

  /// Check if membership is active.
  bool get isMembershipActive => membershipStatus == MembershipStatus.active;

  /// Check if membership is expiring soon (within 7 days).
  bool get isMembershipExpiringSoon {
    if (membershipEnd == null) return false;
    final daysRemaining = membershipEnd!.difference(DateTime.now()).inDays;
    return daysRemaining >= 0 && daysRemaining <= 7;
  }

  /// Days remaining in membership.
  int? get membershipDaysRemaining {
    if (membershipEnd == null) return null;
    return membershipEnd!.difference(DateTime.now()).inDays;
  }

  /// Get initials for avatar fallback.
  String get initials {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }

  @override
  List<Object?> get props => [id, userId, organizationId, email, updatedAt];
}
