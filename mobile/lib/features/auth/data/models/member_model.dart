import '../../../../core/constants/app_enums.dart';
import '../../domain/entities/member.dart';

/// Data model for Member with JSON serialization.
/// Converts between Appwrite documents and domain entities.
class MemberModel extends Member {
  const MemberModel({
    required super.id,
    required super.userId,
    required super.organizationId,
    required super.name,
    required super.email,
    super.phone,
    super.avatarUrl,
    super.gender,
    super.dateOfBirth,
    super.heightCm,
    super.weightKg,
    super.emergencyContact,
    super.medicalConditions,
    required super.membershipStatus,
    super.membershipStart,
    super.membershipEnd,
    super.membershipPlanName,
    super.assignedTrainerId,
    super.assignedTrainerName,
    super.fitnessGoals = const [],
    required super.joinDate,
    required super.updatedAt,
  });

  /// Create from Appwrite document JSON.
  factory MemberModel.fromJson(Map<String, dynamic> json) {
    return MemberModel(
      id: json['\$id'] ?? json['id'] ?? '',
      userId: json['user_id'] ?? '',
      organizationId: json['organization_id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      avatarUrl: json['avatar_url'],
      gender: json['gender'] != null
          ? Gender.values.firstWhere(
              (g) => g.name == json['gender'],
              orElse: () => Gender.preferNotToSay,
            )
          : null,
      dateOfBirth: json['date_of_birth'] != null
          ? DateTime.tryParse(json['date_of_birth'])
          : null,
      heightCm: (json['height_cm'] as num?)?.toDouble(),
      weightKg: (json['weight_kg'] as num?)?.toDouble(),
      emergencyContact: json['emergency_contact'],
      medicalConditions: json['medical_conditions'],
      membershipStatus: MembershipStatus.values.firstWhere(
        (s) => s.name == json['membership_status'],
        orElse: () => MembershipStatus.active,
      ),
      membershipStart: json['membership_start'] != null
          ? DateTime.tryParse(json['membership_start'])
          : null,
      membershipEnd: json['membership_end'] != null
          ? DateTime.tryParse(json['membership_end'])
          : null,
      membershipPlanName: json['membership_plan_name'],
      assignedTrainerId: json['assigned_trainer_id'],
      assignedTrainerName: json['assigned_trainer_name'],
      fitnessGoals: json['fitness_goals'] != null
          ? List<String>.from(json['fitness_goals'])
          : [],
      joinDate: DateTime.tryParse(json['join_date'] ?? '') ?? DateTime.now(),
      updatedAt:
          DateTime.tryParse(json['\$updatedAt'] ?? json['updated_at'] ?? '') ??
              DateTime.now(),
    );
  }

  /// Convert to JSON for Appwrite document creation/update.
  Map<String, dynamic> toJson() {
    return {
      'user_id': userId,
      'organization_id': organizationId,
      'name': name,
      'email': email,
      'phone': phone,
      'avatar_url': avatarUrl,
      'gender': gender?.name,
      'date_of_birth': dateOfBirth?.toIso8601String(),
      'height_cm': heightCm,
      'weight_kg': weightKg,
      'emergency_contact': emergencyContact,
      'medical_conditions': medicalConditions,
      'membership_status': membershipStatus.name,
      'membership_start': membershipStart?.toIso8601String(),
      'membership_end': membershipEnd?.toIso8601String(),
      'membership_plan_name': membershipPlanName,
      'assigned_trainer_id': assignedTrainerId,
      'assigned_trainer_name': assignedTrainerName,
      'fitness_goals': fitnessGoals,
      'join_date': joinDate.toIso8601String(),
    };
  }

  /// Convert to JSON string for local caching.
  Map<String, dynamic> toCacheJson() {
    final json = toJson();
    json['id'] = id;
    json['updated_at'] = updatedAt.toIso8601String();
    return json;
  }
}
