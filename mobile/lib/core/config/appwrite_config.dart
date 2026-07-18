import 'package:appwrite/appwrite.dart';
import 'package:flutter/foundation.dart';

/// Appwrite backend configuration.
/// All Appwrite clients and services are initialized here.
class AppwriteConfig {
  AppwriteConfig._();

  // ── Connection Settings ──
  // TODO: Replace with your actual Appwrite endpoint and project ID
  static const String endpoint = 'https://cloud.appwrite.io/v1';
  static const String projectId = 'YOUR_APPWRITE_PROJECT_ID';

  // ── Client ──
  static final Client client = () {
    final c = Client()
      ..setEndpoint(endpoint)
      ..setProject(projectId);
    if (!kIsWeb) {
      c.setSelfSigned(status: true); // Remove in production
    }
    return c;
  }();

  // ── Services ──
  static final Account account = Account(client);
  static final Databases databases = Databases(client);
  static final Storage storage = Storage(client);
  static final Realtime realtime = Realtime(client);
  static final Functions functions = Functions(client);
  static final Avatars avatars = Avatars(client);
}
