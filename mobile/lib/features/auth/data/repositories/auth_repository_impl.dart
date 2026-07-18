import '../../../../core/constants/app_enums.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/member.dart';
import '../../domain/entities/organization.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';
import '../datasources/auth_remote_datasource.dart';
import '../models/member_model.dart';
import '../models/organization_model.dart';

/// Implementation of [AuthRepository] with offline-first strategy.
/// Fetches from remote when online, falls back to cache when offline.
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remote;
  final AuthLocalDataSource _local;
  final NetworkInfo _networkInfo;

  AuthRepositoryImpl({
    required AuthRemoteDataSource remote,
    required AuthLocalDataSource local,
    required NetworkInfo networkInfo,
  })  : _remote = remote,
        _local = local,
        _networkInfo = networkInfo;

  @override
  Future<Member> loginWithEmail(String email, String password) async {
    // ── DEV MODE MOCK LOGIN ──
    if (email == 'test@gmmx.com' && password == '12345678') {
      final mockOrg = OrganizationModel(
        id: 'mock_gym_123',
        name: 'GMMX Elite Fitness',
        type: OrganizationType.gym,
        latitude: 37.7749, // Example coordinates (San Francisco)
        longitude: -122.4194,
        primaryColor: '#FF5C73',
      );

      final mockMember = MemberModel(
        id: 'mock_member_123',
        userId: 'mock_user_123',
        organizationId: 'mock_gym_123',
        name: 'Test Member',
        email: 'test@gmmx.com',
        phone: '1234567890',
        membershipStatus: MembershipStatus.active,
        membershipStart: DateTime.now().subtract(const Duration(days: 10)),
        membershipEnd: DateTime.now().add(const Duration(days: 20)),
        joinDate: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await _local.cacheOrganization(mockOrg);
      await _local.cacheMember(mockMember);
      return mockMember;
    }
    // ─────────────────────────

    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }

    try {
      final user = await _remote.loginWithEmail(email, password);
      final member = await _remote.getMemberByEmail(user.email);

      if (member == null) {
        throw const AuthFailure(
          message: 'No member profile found. Contact your gym owner.',
        );
      }

      await _local.cacheMember(member);

      // Fetch and cache organization
      final org = await _remote.getOrganization(member.organizationId);
      if (org != null) {
        await _local.cacheOrganization(org);
      }

      return member;
    } on AuthException catch (e) {
      throw AuthFailure(message: e.message);
    } on ServerException catch (e) {
      throw ServerFailure(message: e.message);
    }
  }

  @override
  Future<Member> loginWithGoogle() async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }

    try {
      final user = await _remote.loginWithGoogle();
      final member = await _remote.getMemberByEmail(user.email);

      if (member == null) {
        throw const AuthFailure(
          message: 'No member profile found. Contact your gym owner.',
        );
      }

      await _local.cacheMember(member);

      final org = await _remote.getOrganization(member.organizationId);
      if (org != null) {
        await _local.cacheOrganization(org);
      }

      return member;
    } on AuthException catch (e) {
      throw AuthFailure(message: e.message);
    } on ServerException catch (e) {
      throw ServerFailure(message: e.message);
    }
  }

  @override
  Future<void> logout() async {
    try {
      await _remote.logout();
    } catch (_) {
      // Even if remote logout fails, clear local state
    }
    await _local.clearCache();
  }

  @override
  Future<Member?> getCurrentMember() async {
    try {
      if (await _networkInfo.isConnected) {
        final user = await _remote.getCurrentUser();
        if (user == null) return null;

        final member = await _remote.getMemberByUserId(user.$id);
        if (member != null) {
          await _local.cacheMember(member);
        }
        return member;
      } else {
        return await _local.getCachedMember();
      }
    } catch (_) {
      return await _local.getCachedMember();
    }
  }

  @override
  Future<Organization?> getOrganization(String organizationId) async {
    try {
      if (await _networkInfo.isConnected) {
        final org = await _remote.getOrganization(organizationId);
        if (org != null) {
          await _local.cacheOrganization(org);
        }
        return org;
      } else {
        return await _local.getCachedOrganization();
      }
    } catch (_) {
      return await _local.getCachedOrganization();
    }
  }

  @override
  Future<Member> updateProfile({
    String? phone,
    String? gender,
    DateTime? dateOfBirth,
    double? heightCm,
    double? weightKg,
    String? emergencyContact,
    String? medicalConditions,
    List<String>? fitnessGoals,
  }) async {
    if (!await _networkInfo.isConnected) {
      throw const NetworkFailure();
    }

    final memberId = await _local.getMemberId();
    if (memberId == null) {
      throw const AuthFailure(message: 'No member profile found.');
    }

    final data = <String, dynamic>{};
    if (phone != null) data['phone'] = phone;
    if (gender != null) data['gender'] = gender;
    if (dateOfBirth != null) {
      data['date_of_birth'] = dateOfBirth.toIso8601String();
    }
    if (heightCm != null) data['height_cm'] = heightCm;
    if (weightKg != null) data['weight_kg'] = weightKg;
    if (emergencyContact != null) data['emergency_contact'] = emergencyContact;
    if (medicalConditions != null) {
      data['medical_conditions'] = medicalConditions;
    }
    if (fitnessGoals != null) data['fitness_goals'] = fitnessGoals;

    // ── DEV MODE MOCK UPDATE ──
    if (memberId == 'mock_member_123') {
      final currentMember = await _local.getCachedMember() as MemberModel?;
      if (currentMember != null) {
        final genderEnum = gender != null 
            ? Gender.values.firstWhere(
                (e) => e.name == gender,
                orElse: () => Gender.other,
              )
            : currentMember.gender;
            
        final updated = MemberModel(
          id: currentMember.id,
          userId: currentMember.userId,
          organizationId: currentMember.organizationId,
          name: currentMember.name,
          email: currentMember.email,
          membershipStatus: currentMember.membershipStatus,
          joinDate: currentMember.joinDate,
          updatedAt: DateTime.now(),
          phone: phone ?? currentMember.phone,
          gender: genderEnum,
          dateOfBirth: dateOfBirth ?? currentMember.dateOfBirth,
          heightCm: heightCm ?? currentMember.heightCm,
          weightKg: weightKg ?? currentMember.weightKg,
          emergencyContact: emergencyContact ?? currentMember.emergencyContact,
          medicalConditions: medicalConditions ?? currentMember.medicalConditions,
          membershipStart: currentMember.membershipStart,
          membershipEnd: currentMember.membershipEnd,
          membershipPlanName: currentMember.membershipPlanName,
          assignedTrainerId: currentMember.assignedTrainerId,
          assignedTrainerName: currentMember.assignedTrainerName,
          fitnessGoals: fitnessGoals ?? currentMember.fitnessGoals,
          avatarUrl: currentMember.avatarUrl,
        );
        await _local.cacheMember(updated);
        return updated;
      }
    }
    // ──────────────────────────

    try {
      final updated = await _remote.updateMember(memberId, data);
      await _local.cacheMember(updated);
      return updated;
    } on ServerException catch (e) {
      throw ServerFailure(message: e.message);
    }
  }

  @override
  Future<bool> hasValidSession() async {
    try {
      final user = await _remote.getCurrentUser();
      return user != null;
    } catch (_) {
      return false;
    }
  }

  @override
  Future<void> refreshSession() async {
    // Appwrite handles session refresh automatically via cookies/tokens.
    // This is a no-op for now but may be needed for custom token management.
  }

  @override
  Future<Member?> getCachedMember() => _local.getCachedMember();

  @override
  Future<Organization?> getCachedOrganization() =>
      _local.getCachedOrganization();
}
