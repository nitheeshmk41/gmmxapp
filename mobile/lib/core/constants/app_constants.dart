/// Application-wide constants for Appwrite collections, buckets, and defaults.
class AppConstants {
  AppConstants._();

  // ── App Info ──
  static const String appName = 'GMMX';
  static const String appTagline = 'Your Fitness Companion';
  static const String appVersion = '1.0.0';

  // ── Appwrite Database ──
  static const String databaseId = 'gmmx_db';

  // ── Appwrite Collections ──
  static const String collectionOrganizations = 'organizations';
  static const String collectionMembers = 'members';
  static const String collectionAttendance = 'attendance';
  static const String collectionWorkoutPlans = 'workout_plans';
  static const String collectionExercises = 'exercises';
  static const String collectionWorkoutLogs = 'workout_logs';
  static const String collectionEquipment = 'equipment';
  static const String collectionEquipmentUsage = 'equipment_usage';
  static const String collectionMealPlans = 'meal_plans';
  static const String collectionFoods = 'foods';
  static const String collectionNutritionLogs = 'nutrition_logs';
  static const String collectionWaterLogs = 'water_logs';
  static const String collectionBodyMeasurements = 'body_measurements';
  static const String collectionAchievements = 'achievements';
  static const String collectionChallenges = 'challenges';
  static const String collectionAnnouncements = 'announcements';
  static const String collectionMessages = 'messages';
  static const String collectionGoals = 'goals';

  // ── Appwrite Storage Buckets ──
  static const String bucketProfilePhotos = 'profile-photos';
  static const String bucketExerciseMedia = 'exercise-media';
  static const String bucketEquipmentImages = 'equipment-images';
  static const String bucketProgressPhotos = 'progress-photos';
  static const String bucketOrgLogos = 'org-logos';

  // ── Appwrite Functions ──
  static const String functionValidateQR = 'validate-qr-attendance';
  static const String functionGenerateQR = 'generate-qr-token';

  // ── Attendance Defaults ──
  static const int qrRefreshIntervalSeconds = 30;
  static const double defaultGeofenceRadiusMeters = 50.0;
  static const int maxAttendancePerDay = 1;

  // ── Nutrition Defaults ──
  static const double defaultDailyCalories = 2000;
  static const double defaultDailyProtein = 120; // grams
  static const double defaultDailyCarbs = 250; // grams
  static const double defaultDailyFat = 65; // grams
  static const double defaultDailyWater = 3000; // ml

  // ── Workout Defaults ──
  static const int defaultRestTimerSeconds = 90;
  static const int defaultSets = 3;
  static const int defaultReps = 12;

  // ── Sync ──
  static const int syncIntervalMinutes = 15;
  static const int maxSyncRetries = 5;

  // ── Pagination ──
  static const int defaultPageSize = 25;
}
