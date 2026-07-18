// All domain enums for the GMMX member app.

/// Type of fitness organization.
enum OrganizationType {
  gym,
  yogaStudio,
  danceAcademy,
  swimmingPool,
  martialArts,
  crossfitBox,
  personalTrainer,
  fitnessClub,
}

/// Membership status.
enum MembershipStatus {
  active,
  expired,
  frozen,
  trial,
  cancelled,
}

/// Attendance method.
enum AttendanceMethod {
  qrCode,
  manual,
  wifiVerified,
  biometric,
}

/// Attendance status for the day.
enum AttendanceStatus {
  notMarked,
  checkedIn,
  checkedOut,
}

/// Manual attendance reason.
enum ManualAttendanceReason {
  forgotPhone,
  phoneBatteryDead,
  scannerUnavailable,
  guestEntry,
  other,
}

/// Workout session category.
enum WorkoutCategory {
  weightLoss,
  muscleGain,
  strength,
  bodybuilding,
  powerlifting,
  crossfit,
  yoga,
  swimming,
  dance,
  martialArts,
  cardio,
  flexibility,
  custom,
}

/// Muscle group targeted.
enum MuscleGroup {
  chest,
  back,
  shoulders,
  biceps,
  triceps,
  forearms,
  quadriceps,
  hamstrings,
  glutes,
  calves,
  abs,
  obliques,
  traps,
  lats,
  fullBody,
  cardio,
}

/// Exercise difficulty level.
enum ExerciseDifficulty {
  beginner,
  intermediate,
  advanced,
  expert,
}

/// Equipment category.
enum EquipmentCategory {
  freeWeights,
  machines,
  cardio,
  cables,
  bodyweight,
  accessories,
  stretching,
}

/// Equipment maintenance status.
enum EquipmentStatus {
  available,
  inUse,
  maintenance,
  outOfOrder,
}

/// Meal type.
enum MealType {
  breakfast,
  lunch,
  dinner,
  snack,
  preWorkout,
  postWorkout,
}

/// Goal type.
enum GoalType {
  weightLoss,
  muscleGain,
  distanceRun,
  gymVisits,
  waterIntake,
  dailyWorkout,
  streakDays,
  custom,
}

/// Goal status.
enum GoalStatus {
  active,
  completed,
  abandoned,
  paused,
}

/// Achievement category.
enum AchievementCategory {
  attendance,
  workout,
  nutrition,
  streak,
  milestone,
  challenge,
  personalRecord,
}

/// Personal record type.
enum PersonalRecordType {
  highestWeight,
  mostReps,
  longestWorkout,
  fastestTime,
  longestStreak,
}

/// Notification type.
enum NotificationType {
  workoutReminder,
  mealReminder,
  waterReminder,
  attendanceReminder,
  membershipRenewal,
  trainerMessage,
  announcement,
  achievement,
  challenge,
}

/// Day of workout plan.
enum WorkoutDay {
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday,
}

/// Workout session phase.
enum WorkoutPhase {
  warmup,
  workout,
  cooldown,
  stretching,
  rest,
}

/// Attendance session type.
enum AttendanceSession {
  fullDay,
  morning,
  evening,
}

/// Theme mode preference.
enum AppThemeMode {
  system,
  light,
  dark,
}

/// Gender.
enum Gender {
  male,
  female,
  other,
  preferNotToSay,
}

/// Geofence radius option.
enum GeofenceRadius {
  meters25(25),
  meters50(50),
  meters75(75),
  meters100(100);

  final double meters;
  const GeofenceRadius(this.meters);
}

/// Location verification confidence level.
enum LocationConfidence {
  gpsOnly('GPS Only', 0.70),
  gpsWifi('GPS + WiFi', 0.95),
  gpsWifiDevice('GPS + WiFi + Device', 0.99);

  final String label;
  final double confidence;
  const LocationConfidence(this.label, this.confidence);
}
