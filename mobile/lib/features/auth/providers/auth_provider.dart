import 'package:appwrite/appwrite.dart';
import 'package:appwrite/enums.dart';
import 'package:appwrite/models.dart' as models;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/config/appwrite_config.dart';

class AuthNotifier extends AsyncNotifier<models.User?> {
  @override
  Future<models.User?> build() async {
    try {
      return await AppwriteConfig.account.get();
    } catch (e) {
      return null;
    }
  }

  Future<void> loginWithEmail(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      await AppwriteConfig.account.createEmailPasswordSession(
        email: email,
        password: password,
      );
      final user = await AppwriteConfig.account.get();
      state = AsyncValue.data(user);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> loginWithGoogle() async {
    state = const AsyncValue.loading();
    try {
      await AppwriteConfig.account.createOAuth2Session(
        provider: OAuthProvider.google,
      );
      final user = await AppwriteConfig.account.get();
      state = AsyncValue.data(user);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> logout() async {
    state = const AsyncValue.loading();
    try {
      await AppwriteConfig.account.deleteSession(sessionId: 'current');
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final authProvider = AsyncNotifierProvider<AuthNotifier, models.User?>(() {
  return AuthNotifier();
});
