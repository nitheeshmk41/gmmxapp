import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Wrapper around FlutterSecureStorage for encrypted key-value storage.
/// Used for auth tokens, session data, and sensitive user information.
class SecureStorageService {
  final FlutterSecureStorage _storage;

  SecureStorageService(this._storage);

  // ── Keys ──
  static const String keySessionId = 'session_id';
  static const String keyUserId = 'user_id';
  static const String keyMemberId = 'member_id';
  static const String keyOrganizationId = 'organization_id';
  static const String keyDeviceId = 'device_id';
  static const String keyCachedMember = 'cached_member';
  static const String keyCachedOrganization = 'cached_organization';
  static const String keyBiometricEnabled = 'biometric_enabled';
  static const String keyThemeMode = 'theme_mode';

  /// Write a value to secure storage.
  Future<void> write(String key, String value) async {
    await _storage.write(key: key, value: value);
  }

  /// Read a value from secure storage.
  Future<String?> read(String key) async {
    return await _storage.read(key: key);
  }

  /// Delete a specific key from secure storage.
  Future<void> delete(String key) async {
    await _storage.delete(key: key);
  }

  /// Delete all values from secure storage.
  Future<void> deleteAll() async {
    await _storage.deleteAll();
  }

  /// Check if a key exists in secure storage.
  Future<bool> containsKey(String key) async {
    return await _storage.containsKey(key: key);
  }

  // ── Convenience Methods ──

  Future<void> saveSession(String sessionId, String userId) async {
    await write(keySessionId, sessionId);
    await write(keyUserId, userId);
  }

  Future<String?> getSessionId() => read(keySessionId);
  Future<String?> getUserId() => read(keyUserId);

  Future<void> clearSession() async {
    await delete(keySessionId);
    await delete(keyUserId);
    await delete(keyMemberId);
  }

  Future<void> saveMemberId(String memberId) => write(keyMemberId, memberId);
  Future<String?> getMemberId() => read(keyMemberId);

  Future<void> saveOrganizationId(String orgId) =>
      write(keyOrganizationId, orgId);
  Future<String?> getOrganizationId() => read(keyOrganizationId);
}

/// Provider for secure storage singleton.
final secureStorageProvider = Provider<SecureStorageService>((ref) {
  const storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );
  return SecureStorageService(storage);
});
