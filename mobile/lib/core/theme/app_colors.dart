import 'package:flutter/material.dart';

/// Named color constants and gradients for the GMMX design system.
class AppColors {
  AppColors._();

  // ── Brand Colors ──
  static const Color primary = Color(0xFFFF5C73);
  static const Color primaryLight = Color(0xFFFF8A9B);
  static const Color primaryDark = Color(0xFFD94058);

  // ── Accent Colors ──
  static const Color accent = Color(0xFF6C63FF);
  static const Color accentLight = Color(0xFF9B94FF);
  static const Color accentDark = Color(0xFF4A42D4);

  // ── Semantic Colors ──
  static const Color success = Color(0xFF2ECC71);
  static const Color successLight = Color(0xFFD5F5E3);
  static const Color warning = Color(0xFFF39C12);
  static const Color warningLight = Color(0xFFFEF5E7);
  static const Color error = Color(0xFFE74C3C);
  static const Color errorLight = Color(0xFFFDEDEC);
  static const Color info = Color(0xFF3498DB);
  static const Color infoLight = Color(0xFFEBF5FB);

  // ── Neutral Colors ──
  static const Color neutral50 = Color(0xFFFAFAFA);
  static const Color neutral100 = Color(0xFFF5F5F5);
  static const Color neutral200 = Color(0xFFEEEEEE);
  static const Color neutral300 = Color(0xFFE0E0E0);
  static const Color neutral400 = Color(0xFFBDBDBD);
  static const Color neutral500 = Color(0xFF9E9E9E);
  static const Color neutral600 = Color(0xFF757575);
  static const Color neutral700 = Color(0xFF616161);
  static const Color neutral800 = Color(0xFF424242);
  static const Color neutral900 = Color(0xFF212121);

  // ── Dark Mode Surfaces ──
  static const Color darkSurface = Color(0xFF1E1E1E);
  static const Color darkSurfaceVariant = Color(0xFF2C2C2C);
  static const Color darkBackground = Color(0xFF121212);
  static const Color darkCard = Color(0xFF1E1E2D);
  static const Color darkCardVariant = Color(0xFF252538);

  // ── Light Mode Surfaces ──
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceVariant = Color(0xFFF8F9FA);
  static const Color lightBackground = Color(0xFFF5F6FA);

  // ── Feature Colors ──
  static const Color attendance = Color(0xFF6C63FF);
  static const Color workout = Color(0xFFFF6B35);
  static const Color nutrition = Color(0xFF2ECC71);
  static const Color hydration = Color(0xFF3498DB);
  static const Color streak = Color(0xFFFF9500);
  static const Color steps = Color(0xFF00BCD4);
  static const Color heartRate = Color(0xFFFF5C73);
  static const Color sleep = Color(0xFF9B59B6);
  static const Color calories = Color(0xFFE74C3C);
  static const Color protein = Color(0xFF3498DB);
  static const Color carbs = Color(0xFFF39C12);
  static const Color fat = Color(0xFFE74C3C);

  // ── Gradients ──
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, Color(0xFFFF8A65)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient accentGradient = LinearGradient(
    colors: [accent, Color(0xFF8B83FF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient darkCardGradient = LinearGradient(
    colors: [darkCard, darkCardVariant],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient streakGradient = LinearGradient(
    colors: [Color(0xFFFF9500), Color(0xFFFF5C73)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient successGradient = LinearGradient(
    colors: [Color(0xFF2ECC71), Color(0xFF27AE60)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ── Glassmorphism ──
  static Color glassLight = Colors.white.withValues(alpha: 0.15);
  static Color glassDark = Colors.black.withValues(alpha: 0.2);
  static Color glassBorder = Colors.white.withValues(alpha: 0.2);
}
