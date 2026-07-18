import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/extensions.dart';
import '../../providers/auth_provider.dart';

class WelcomeScreen extends ConsumerWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final isLoading = authState.isLoading;
    final isDark = context.isDarkMode;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppTheme.spacingLg,
            vertical: AppTheme.spacingMd,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(flex: 2),

              // ── Hero Section ──
              FadeInDown(
                duration: const Duration(milliseconds: 600),
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: BorderRadius.circular(28),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary.withValues(alpha: 0.3),
                        blurRadius: 24,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.fitness_center_rounded,
                    size: 48,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: AppTheme.spacingXl),

              FadeInUp(
                delay: const Duration(milliseconds: 200),
                duration: const Duration(milliseconds: 600),
                child: Text(
                  'Welcome to GMMX',
                  textAlign: TextAlign.center,
                  style: AppTypography.headlineLarge.copyWith(
                    color: isDark ? Colors.white : AppColors.neutral900,
                  ),
                ),
              ),
              const SizedBox(height: AppTheme.spacingSm),

              FadeInUp(
                delay: const Duration(milliseconds: 350),
                duration: const Duration(milliseconds: 600),
                child: Text(
                  'Your premium fitness companion.\nTrack workouts, nutrition, and progress.',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: isDark
                            ? AppColors.neutral400
                            : AppColors.neutral600,
                        height: 1.5,
                      ),
                ),
              ),

              const Spacer(flex: 2),

              // ── Feature Pills ──
              FadeInUp(
                delay: const Duration(milliseconds: 450),
                duration: const Duration(milliseconds: 600),
                child: Wrap(
                  alignment: WrapAlignment.center,
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _FeaturePill(
                      icon: LucideIcons.scanLine,
                      label: 'QR Attendance',
                      isDark: isDark,
                    ),
                    _FeaturePill(
                      icon: LucideIcons.dumbbell,
                      label: 'Workouts',
                      isDark: isDark,
                    ),
                    _FeaturePill(
                      icon: LucideIcons.apple,
                      label: 'Nutrition',
                      isDark: isDark,
                    ),
                    _FeaturePill(
                      icon: LucideIcons.trendingUp,
                      label: 'Progress',
                      isDark: isDark,
                    ),
                  ],
                ),
              ),

              const Spacer(),

              // ── Auth Buttons ──
              FadeInUp(
                delay: const Duration(milliseconds: 550),
                duration: const Duration(milliseconds: 600),
                child: OutlinedButton.icon(
                  onPressed: isLoading
                      ? null
                      : () async {
                          try {
                            await ref
                                .read(authProvider.notifier)
                                .loginWithGoogle();
                            if (!context.mounted) return;
                            final status = ref.read(authProvider).status;
                            if (status == AuthStatus.profileIncomplete) {
                              context.go('/profile-completion');
                            } else if (status == AuthStatus.authenticated) {
                              context.go('/dashboard');
                            }
                          } catch (e) {
                            if (context.mounted) {
                              context.showSnackBar(e.toString(), isError: true);
                            }
                          }
                        },
                  icon: isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : Icon(
                          LucideIcons.chrome,
                          size: 20,
                          color: isDark ? Colors.white : AppColors.neutral800,
                        ),
                  label: Text(
                    'Continue with Google',
                    style: TextStyle(
                      color: isDark ? Colors.white : AppColors.neutral800,
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 56),
                    side: BorderSide(
                      color: isDark
                          ? Colors.white.withValues(alpha: 0.2)
                          : AppColors.neutral300,
                    ),
                    backgroundColor: isDark
                        ? Colors.white.withValues(alpha: 0.05)
                        : Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(AppTheme.radiusMd),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              FadeInUp(
                delay: const Duration(milliseconds: 650),
                duration: const Duration(milliseconds: 600),
                child: ElevatedButton(
                  onPressed: isLoading ? null : () => context.push('/login'),
                  child: const Text('Login with Email'),
                ),
              ),

              const SizedBox(height: AppTheme.spacingLg),

              FadeIn(
                delay: const Duration(milliseconds: 800),
                child: Text(
                  'Your gym must create your account first.\nNo public registration available.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color:
                        isDark ? AppColors.neutral600 : AppColors.neutral500,
                    fontSize: 12,
                    height: 1.5,
                  ),
                ),
              ),
              const SizedBox(height: AppTheme.spacingMd),
            ],
          ),
        ),
      ),
    );
  }
}

class _FeaturePill extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isDark;

  const _FeaturePill({
    required this.icon,
    required this.label,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: isDark
            ? Colors.white.withValues(alpha: 0.06)
            : AppColors.neutral100,
        borderRadius: BorderRadius.circular(AppTheme.radiusFull),
        border: Border.all(
          color: isDark
              ? Colors.white.withValues(alpha: 0.08)
              : AppColors.neutral200,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: AppColors.primary,
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: isDark ? AppColors.neutral300 : AppColors.neutral700,
            ),
          ),
        ],
      ),
    );
  }
}
