import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/network_info.dart';
import '../../../core/storage/secure_storage.dart';
import '../data/datasources/auth_local_datasource.dart';
import '../data/datasources/auth_remote_datasource.dart';
import '../data/repositories/auth_repository_impl.dart';
import '../domain/entities/member.dart';
import '../domain/entities/organization.dart';
import '../domain/repositories/auth_repository.dart';

// ── Repository Provider ──

final authRemoteDataSourceProvider = Provider<AuthRemoteDataSource>((ref) {
  return AuthRemoteDataSource();
});

final authLocalDataSourceProvider = Provider<AuthLocalDataSource>((ref) {
  return AuthLocalDataSource(ref.watch(secureStorageProvider));
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(
    remote: ref.watch(authRemoteDataSourceProvider),
    local: ref.watch(authLocalDataSourceProvider),
    networkInfo: ref.watch(networkInfoProvider),
  );
});

// ── Auth State ──

enum AuthStatus {
  initial,
  authenticated,
  unauthenticated,
  profileIncomplete,
}

class AuthState {
  final AuthStatus status;
  final Member? member;
  final Organization? organization;
  final bool isLoading;
  final String? error;

  const AuthState({
    this.status = AuthStatus.initial,
    this.member,
    this.organization,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    AuthStatus? status,
    Member? member,
    Organization? organization,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      status: status ?? this.status,
      member: member ?? this.member,
      organization: organization ?? this.organization,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// ── Auth Notifier ──

class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    return const AuthState();
  }

  AuthRepository get _repo => ref.read(authRepositoryProvider);

  /// Check if user has a valid session on app start.
  Future<void> checkAuthStatus() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final hasSession = await _repo.hasValidSession();

      if (!hasSession) {
        state = state.copyWith(
          status: AuthStatus.unauthenticated,
          isLoading: false,
        );
        return;
      }

      final member = await _repo.getCurrentMember();

      if (member == null) {
        state = state.copyWith(
          status: AuthStatus.unauthenticated,
          isLoading: false,
        );
        return;
      }

      // Check if profile is complete
      if (member.phone == null || member.gender == null) {
        state = state.copyWith(
          status: AuthStatus.profileIncomplete,
          member: member,
          isLoading: false,
        );
        return;
      }

      final organization =
          await _repo.getOrganization(member.organizationId);

      state = state.copyWith(
        status: AuthStatus.authenticated,
        member: member,
        organization: organization,
        isLoading: false,
      );
    } catch (e) {
      // Try cached data
      final cachedMember = await _repo.getCachedMember();
      if (cachedMember != null) {
        final cachedOrg = await _repo.getCachedOrganization();
        state = state.copyWith(
          status: AuthStatus.authenticated,
          member: cachedMember,
          organization: cachedOrg,
          isLoading: false,
        );
      } else {
        state = state.copyWith(
          status: AuthStatus.unauthenticated,
          isLoading: false,
          error: e.toString(),
        );
      }
    }
  }

  /// Login with email and password.
  Future<void> loginWithEmail(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final member = await _repo.loginWithEmail(email, password);
      final organization =
          await _repo.getOrganization(member.organizationId);

      // Check if profile is complete
      if (member.phone == null || member.gender == null) {
        state = state.copyWith(
          status: AuthStatus.profileIncomplete,
          member: member,
          organization: organization,
          isLoading: false,
        );
      } else {
        state = state.copyWith(
          status: AuthStatus.authenticated,
          member: member,
          organization: organization,
          isLoading: false,
        );
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      rethrow;
    }
  }

  /// Login with Google OAuth.
  Future<void> loginWithGoogle() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final member = await _repo.loginWithGoogle();
      final organization =
          await _repo.getOrganization(member.organizationId);

      if (member.phone == null || member.gender == null) {
        state = state.copyWith(
          status: AuthStatus.profileIncomplete,
          member: member,
          organization: organization,
          isLoading: false,
        );
      } else {
        state = state.copyWith(
          status: AuthStatus.authenticated,
          member: member,
          organization: organization,
          isLoading: false,
        );
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      rethrow;
    }
  }

  /// Logout.
  Future<void> logout() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      await _repo.logout();
      state = const AuthState(status: AuthStatus.unauthenticated);
    } catch (e) {
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  /// Update profile and mark as complete.
  Future<void> completeProfile({
    String? phone,
    String? gender,
    DateTime? dateOfBirth,
    double? heightCm,
    double? weightKg,
    String? emergencyContact,
    String? medicalConditions,
  }) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final updated = await _repo.updateProfile(
        phone: phone,
        gender: gender,
        dateOfBirth: dateOfBirth,
        heightCm: heightCm,
        weightKg: weightKg,
        emergencyContact: emergencyContact,
        medicalConditions: medicalConditions,
      );

      state = state.copyWith(
        status: AuthStatus.authenticated,
        member: updated,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      rethrow;
    }
  }
}

// ── Providers ──

final authProvider = NotifierProvider<AuthNotifier, AuthState>(() {
  return AuthNotifier();
});

/// Convenience provider for the current member.
final currentMemberProvider = Provider<Member?>((ref) {
  return ref.watch(authProvider).member;
});

/// Convenience provider for the current organization.
final currentOrganizationProvider = Provider<Organization?>((ref) {
  return ref.watch(authProvider).organization;
});
