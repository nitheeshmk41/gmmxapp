import 'package:intl/intl.dart';

/// Date and time utility helpers for the GMMX app.
class AppDateUtils {
  AppDateUtils._();

  // ── Formatters ──

  static final DateFormat _timeFormat = DateFormat('h:mm a');
  static final DateFormat _dateShort = DateFormat('MMM d');
  static final DateFormat _dateMedium = DateFormat('MMM d, yyyy');
  static final DateFormat _dateLong = DateFormat('EEEE, MMMM d, yyyy');
  static final DateFormat _dateTime = DateFormat('MMM d, yyyy • h:mm a');
  static final DateFormat _dayMonth = DateFormat('d MMM');
  static final DateFormat _monthYear = DateFormat('MMMM yyyy');
  static final DateFormat _weekday = DateFormat('EEEE');
  static final DateFormat _iso = DateFormat('yyyy-MM-dd');

  /// Format time only: "5:30 PM"
  static String formatTime(DateTime dt) => _timeFormat.format(dt);

  /// Format short date: "Jul 15"
  static String formatDateShort(DateTime dt) => _dateShort.format(dt);

  /// Format medium date: "Jul 15, 2026"
  static String formatDate(DateTime dt) => _dateMedium.format(dt);

  /// Format long date: "Tuesday, July 15, 2026"
  static String formatDateLong(DateTime dt) => _dateLong.format(dt);

  /// Format date and time: "Jul 15, 2026 • 5:30 PM"
  static String formatDateTime(DateTime dt) => _dateTime.format(dt);

  /// Format day and month: "15 Jul"
  static String formatDayMonth(DateTime dt) => _dayMonth.format(dt);

  /// Format month and year: "July 2026"
  static String formatMonthYear(DateTime dt) => _monthYear.format(dt);

  /// Format weekday: "Tuesday"
  static String formatWeekday(DateTime dt) => _weekday.format(dt);

  /// Format ISO date: "2026-07-15"
  static String formatIso(DateTime dt) => _iso.format(dt);

  // ── Relative Time ──

  /// Returns relative time string: "Just now", "2 hours ago", "Yesterday"
  static String timeAgo(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);

    if (diff.inSeconds < 60) return 'Just now';
    if (diff.inMinutes < 60) {
      return '${diff.inMinutes}m ago';
    }
    if (diff.inHours < 24) {
      return '${diff.inHours}h ago';
    }
    if (diff.inDays == 1) return 'Yesterday';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    if (diff.inDays < 30) return '${(diff.inDays / 7).floor()}w ago';
    if (diff.inDays < 365) return '${(diff.inDays / 30).floor()}mo ago';
    return '${(diff.inDays / 365).floor()}y ago';
  }

  // ── Greeting ──

  /// Returns time-of-day greeting: "Good Morning", etc.
  static String greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  // ── Streak Helpers ──

  /// Calculate current streak from a list of dates (sorted descending).
  static int calculateStreak(List<DateTime> dates) {
    if (dates.isEmpty) return 0;

    // Normalize to date-only
    final normalized = dates
        .map((d) => DateTime(d.year, d.month, d.day))
        .toSet()
        .toList()
      ..sort((a, b) => b.compareTo(a));

    final today = DateTime(
      DateTime.now().year,
      DateTime.now().month,
      DateTime.now().day,
    );

    // Check if the most recent date is today or yesterday
    final latest = normalized.first;
    if (today.difference(latest).inDays > 1) return 0;

    int streak = 1;
    for (int i = 1; i < normalized.length; i++) {
      final diff = normalized[i - 1].difference(normalized[i]).inDays;
      if (diff == 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // ── Comparison Helpers ──

  /// Check if two dates are the same day.
  static bool isSameDay(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  /// Check if a date is today.
  static bool isToday(DateTime dt) => isSameDay(dt, DateTime.now());

  /// Check if a date is yesterday.
  static bool isYesterday(DateTime dt) {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return isSameDay(dt, yesterday);
  }

  /// Get the start of today (midnight).
  static DateTime get startOfToday {
    final now = DateTime.now();
    return DateTime(now.year, now.month, now.day);
  }

  /// Get the start of the current week (Monday).
  static DateTime get startOfWeek {
    final now = DateTime.now();
    final weekday = now.weekday; // 1 = Monday
    return DateTime(now.year, now.month, now.day - (weekday - 1));
  }

  /// Get the start of the current month.
  static DateTime get startOfMonth {
    final now = DateTime.now();
    return DateTime(now.year, now.month, 1);
  }
}
