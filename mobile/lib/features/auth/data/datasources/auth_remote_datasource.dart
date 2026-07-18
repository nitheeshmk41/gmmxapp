import 'package:appwrite/appwrite.dart';
import 'package:appwrite/enums.dart';
import 'package:appwrite/models.dart' as models;
import '../../../../core/config/appwrite_config.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/errors/exceptions.dart';
import '../models/member_model.dart';
import '../models/organization_model.dart';

/// Remote data source for authentication operations via Appwrite.
class AuthRemoteDataSource {
  final Account _account = AppwriteConfig.account;
  final Databases _databases = AppwriteConfig.databases;

  /// Create an email/password session and return the Appwrite user.
  Future<models.User> loginWithEmail(String email, String password) async {
    try {
      await _account.createEmailPasswordSession(
        email: email,
        password: password,
      );
      return await _account.get();
    } on AppwriteException catch (e) {
      throw AuthException(
        message: e.message ?? 'Login failed',
        code: e.code,
      );
    }
  }

  /// Create a Google OAuth session.
  Future<models.User> loginWithGoogle() async {
    try {
      await _account.createOAuth2Session(provider: OAuthProvider.google);
      return await _account.get();
    } on AppwriteException catch (e) {
      throw AuthException(
        message: e.message ?? 'Google sign-in failed',
        code: e.code,
      );
    }
  }

  /// Delete the current session.
  Future<void> logout() async {
    try {
      await _account.deleteSession(sessionId: 'current');
    } on AppwriteException catch (e) {
      throw AuthException(
        message: e.message ?? 'Logout failed',
        code: e.code,
      );
    }
  }

  /// Get the current Appwrite user.
  Future<models.User?> getCurrentUser() async {
    try {
      return await _account.get();
    } catch (_) {
      return null;
    }
  }

  /// Fetch the member document associated with the given email.
  Future<MemberModel?> getMemberByEmail(String email) async {
    try {
      final response = await _databases.listDocuments(
        databaseId: AppConstants.databaseId,
        collectionId: AppConstants.collectionMembers,
        queries: [
          Query.equal('email', email),
          Query.limit(1),
        ],
      );

      if (response.documents.isEmpty) return null;
      return MemberModel.fromJson(response.documents.first.data);
    } on AppwriteException catch (e) {
      throw ServerException(
        message: e.message ?? 'Failed to fetch member profile',
        statusCode: e.code,
      );
    }
  }

  /// Fetch the member document associated with the given user ID.
  Future<MemberModel?> getMemberByUserId(String userId) async {
    try {
      final response = await _databases.listDocuments(
        databaseId: AppConstants.databaseId,
        collectionId: AppConstants.collectionMembers,
        queries: [
          Query.equal('user_id', userId),
          Query.limit(1),
        ],
      );

      if (response.documents.isEmpty) return null;
      return MemberModel.fromJson(response.documents.first.data);
    } on AppwriteException catch (e) {
      throw ServerException(
        message: e.message ?? 'Failed to fetch member profile',
        statusCode: e.code,
      );
    }
  }

  /// Fetch the organization document by ID.
  Future<OrganizationModel?> getOrganization(String organizationId) async {
    try {
      final doc = await _databases.getDocument(
        databaseId: AppConstants.databaseId,
        collectionId: AppConstants.collectionOrganizations,
        documentId: organizationId,
      );
      return OrganizationModel.fromJson(doc.data);
    } on AppwriteException catch (e) {
      throw ServerException(
        message: e.message ?? 'Failed to fetch organization',
        statusCode: e.code,
      );
    }
  }

  /// Update member profile fields.
  Future<MemberModel> updateMember(
    String memberId,
    Map<String, dynamic> data,
  ) async {
    try {
      final doc = await _databases.updateDocument(
        databaseId: AppConstants.databaseId,
        collectionId: AppConstants.collectionMembers,
        documentId: memberId,
        data: data,
      );
      return MemberModel.fromJson(doc.data);
    } on AppwriteException catch (e) {
      throw ServerException(
        message: e.message ?? 'Failed to update profile',
        statusCode: e.code,
      );
    }
  }
}
