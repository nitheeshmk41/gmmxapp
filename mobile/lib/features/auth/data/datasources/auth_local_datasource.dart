import 'dart:convert';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/storage/secure_storage.dart';
import '../models/member_model.dart';
import '../models/organization_model.dart';

/// Local data source for caching auth data in secure storage.
/// Provides offline access to member profile and organization.
class AuthLocalDataSource {
  final SecureStorageService _storage;

  AuthLocalDataSource(this._storage);

  /// Cache the member profile.
  Future<void> cacheMember(MemberModel member) async {
    try {
      final json = jsonEncode(member.toCacheJson());
      await _storage.write(SecureStorageService.keyCachedMember, json);
      await _storage.saveMemberId(member.id);
      await _storage.saveOrganizationId(member.organizationId);
    } catch (e) {
      throw CacheException(message: 'Failed to cache member: $e');
    }
  }

  /// Get cached member profile.
  Future<MemberModel?> getCachedMember() async {
    try {
      final json = await _storage.read(SecureStorageService.keyCachedMember);
      if (json == null) return null;
      return MemberModel.fromJson(jsonDecode(json));
    } catch (_) {
      return null;
    }
  }

  /// Cache the organization data.
  Future<void> cacheOrganization(OrganizationModel organization) async {
    try {
      final json = jsonEncode(organization.toJson());
      await _storage.write(SecureStorageService.keyCachedOrganization, json);
    } catch (e) {
      throw CacheException(message: 'Failed to cache organization: $e');
    }
  }

  /// Get cached organization.
  Future<OrganizationModel?> getCachedOrganization() async {
    try {
      final json =
          await _storage.read(SecureStorageService.keyCachedOrganization);
      if (json == null) return null;
      return OrganizationModel.fromJson(jsonDecode(json));
    } catch (_) {
      return null;
    }
  }

  /// Clear all cached auth data.
  Future<void> clearCache() async {
    await _storage.clearSession();
    await _storage.delete(SecureStorageService.keyCachedMember);
    await _storage.delete(SecureStorageService.keyCachedOrganization);
  }

  /// Get the cached member ID.
  Future<String?> getMemberId() => _storage.getMemberId();

  /// Get the cached organization ID.
  Future<String?> getOrganizationId() => _storage.getOrganizationId();
}
