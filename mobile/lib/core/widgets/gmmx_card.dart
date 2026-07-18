import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';

/// A premium card widget with optional glassmorphism effect.
/// Used throughout the app for dashboard cards, stat cards, etc.
class GmmxCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final VoidCallback? onTap;
  final LinearGradient? gradient;
  final bool isGlass;
  final Color? color;
  final BorderRadius? borderRadius;

  const GmmxCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.onTap,
    this.gradient,
    this.isGlass = false,
    this.color,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final radius = borderRadius ?? BorderRadius.circular(AppTheme.radiusXl);

    Widget card = Container(
      padding: padding ?? const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: radius,
        gradient: gradient,
        color: gradient == null
            ? (color ??
                (isGlass
                    ? (isDark ? AppColors.glassDark : AppColors.glassLight)
                    : (isDark ? AppColors.darkCard : AppColors.lightSurface)))
            : null,
        border: Border.all(
          color: isGlass
              ? AppColors.glassBorder
              : (isDark
                  ? Colors.white.withValues(alpha: 0.08)
                  : AppColors.neutral200),
          width: isGlass ? 1.5 : 1,
        ),
        boxShadow: isGlass
            ? null
            : [
                BoxShadow(
                  color: (isDark ? Colors.black : Colors.black)
                      .withValues(alpha: isDark ? 0.3 : 0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
      ),
      child: child,
    );

    // Apply glassmorphism blur
    if (isGlass) {
      card = ClipRRect(
        borderRadius: radius,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: card,
        ),
      );
    }

    // Wrap with margin
    if (margin != null) {
      card = Padding(padding: margin!, child: card);
    }

    // Wrap with tap handler
    if (onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: card,
      );
    }

    return card;
  }
}
