import 'package:appwrite/appwrite.dart';

class AppwriteConfig {
  static const String endpoint = 'YOUR_APPWRITE_ENDPOINT'; // e.g. https://cloud.appwrite.io/v1
  static const String projectId = 'YOUR_APPWRITE_PROJECT_ID';

  static final Client client = Client()
    ..setEndpoint(endpoint)
    ..setProject(projectId);

  static final Account account = Account(client);
  static final Databases databases = Databases(client);
}
