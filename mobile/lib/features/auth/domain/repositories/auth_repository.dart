import '../entities/member.dart';
import '../entities/organization.dart';

/// Abstract repository interface for authentication operations.
/// The data layer provides the implementation.
abstract class AuthRepository {
  /// Login with email and password.
  Future<Member> loginWithEmail(String email, String password);

  /// Login with Google OAuth.
  Future<Member> loginWithGoogle();

  /// Logout the current user.
  Future<void> logout();

  /// Get the currently authenticated member profile.
  /// Returns null if not logged in.
  Future<Member?> getCurrentMember();

  /// Get the member's organization.
  Future<Organization?> getOrganization(String organizationId);

  /// Update member profile fields.
  Future<Member> updateProfile({
    String? phone,
    String? gender,
    DateTime? dateOfBirth,
    double? heightCm,
    double? weightKg,
    String? emergencyContact,
    String? medicalConditions,
    List<String>? fitnessGoals,
  });

  /// Check if the user has a valid session.
  Future<bool> hasValidSession();

  /// Refresh the current session.
  Future<void> refreshSession();

  /// Get cached member data for offline access.
  Future<Member?> getCachedMember();

  /// Get cached organization data for offline access.
  Future<Organization?> getCachedOrganization();
}
