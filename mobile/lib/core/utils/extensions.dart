import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

/// Extension on BuildContext for easy access to theme and media query.
extension BuildContextX on BuildContext {
  ThemeData get theme => Theme.of(this);
  ColorScheme get colorScheme => theme.colorScheme;
  TextTheme get textTheme => theme.textTheme;
  MediaQueryData get mediaQuery => MediaQuery.of(this);
  Size get screenSize => mediaQuery.size;
  double get screenWidth => screenSize.width;
  double get screenHeight => screenSize.height;
  EdgeInsets get padding => mediaQuery.padding;
  bool get isDarkMode => theme.brightness == Brightness.dark;

  /// Show a snackbar with a message.
  void showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(this).hideCurrentSnackBar();
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? colorScheme.error : null,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  /// Show a success snackbar.
  void showSuccess(String message) {
    ScaffoldMessenger.of(this).hideCurrentSnackBar();
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white, size: 20),
            const SizedBox(width: 8),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: Colors.green.shade600,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }
}

/// Extension on String for common transformations.
extension StringX on String {
  /// Capitalize the first letter.
  String get capitalize {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }

  /// Convert to title case: "hello world" → "Hello World"
  String get titleCase {
    return split(' ').map((word) => word.capitalize).join(' ');
  }

  /// Truncate with ellipsis.
  String truncate(int maxLength) {
    if (length <= maxLength) return this;
    return '${substring(0, maxLength)}…';
  }

  /// Check if the string is a valid email.
  bool get isValidEmail {
    return RegExp(r'^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$')
        .hasMatch(this);
  }
}

/// Extension on num for display formatting.
extension NumX on num {
  /// Format as compact: 1000 → "1K", 1500000 → "1.5M"
  String get compact => NumberFormat.compact().format(this);

  /// Format with commas: 1000 → "1,000"
  String get formatted => NumberFormat('#,##0').format(this);

  /// Format as weight: 65.5 → "65.5 kg"
  String get asKg => '${toStringAsFixed(1)} kg';

  /// Format as calories: 2500 → "2,500 kcal"
  String get asKcal => '${toInt().formatted} kcal';

  /// Format as distance: 5.2 → "5.2 km"
  String get asKm => '${toStringAsFixed(1)} km';

  /// Format as percentage: 0.85 → "85%"
  String get asPercent => '${(this * 100).toInt()}%';

  /// Format duration from seconds: 3661 → "1h 1m"
  String get asDuration {
    final seconds = toInt();
    if (seconds < 60) return '${seconds}s';
    if (seconds < 3600) return '${seconds ~/ 60}m';
    final hours = seconds ~/ 3600;
    final mins = (seconds % 3600) ~/ 60;
    return mins > 0 ? '${hours}h ${mins}m' : '${hours}h';
  }
}

/// Extension on DateTime.
extension DateTimeX on DateTime {
  /// Get date only (strip time).
  DateTime get dateOnly => DateTime(year, month, day);

  /// Check if this date is today.
  bool get isToday {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }

  /// Check if this date is yesterday.
  bool get isYesterday {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return year == yesterday.year &&
        month == yesterday.month &&
        day == yesterday.day;
  }

  /// Get days remaining until this date (from today).
  int get daysRemaining => difference(DateTime.now().dateOnly).inDays;
}
