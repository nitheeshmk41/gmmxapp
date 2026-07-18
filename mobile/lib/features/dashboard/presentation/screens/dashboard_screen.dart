import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/date_utils.dart';
import '../../../../core/utils/extensions.dart';
import '../../../../core/widgets/gmmx_card.dart';
import '../../../../core/widgets/progress_ring.dart';
import '../../../../core/widgets/stat_card.dart';
import '../../../auth/providers/auth_provider.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final member = authState.member;
    final organization = authState.organization;
    final isDark = context.isDarkMode;

    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // ── Header ──
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppTheme.spacingLg,
                  AppTheme.spacingMd,
                  AppTheme.spacingLg,
                  0,
                ),
                child: FadeInDown(
                  duration: const Duration(milliseconds: 500),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${AppDateUtils.greeting()} 👋',
                              style:
                                  Theme.of(context).textTheme.bodyMedium?.copyWith(
                                        color: isDark
                                            ? AppColors.neutral400
                                            : AppColors.neutral600,
                                      ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              member?.name.split(' ').first ?? 'Member',
                              style: AppTypography.headlineMedium.copyWith(
                                color:
                                    isDark ? Colors.white : AppColors.neutral900,
                              ),
                            ),
                            if (organization != null) ...[
                              const SizedBox(height: 4),
                              Text(
                                organization.name,
                                style: Theme.of(context)
                                    .textTheme
                                    .bodySmall
                                    ?.copyWith(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.w500,
                                    ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      // ── Profile Avatar ──
                      GestureDetector(
                        onTap: () {},
                        child: CircleAvatar(
                          radius: 24,
                          backgroundColor:
                              AppColors.primary.withValues(alpha: 0.12),
                          child: Text(
                            member?.initials ?? '?',
                            style: AppTypography.titleMedium.copyWith(
                              color: AppColors.primary,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 20)),

            // ── Attendance Status Card ──
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppTheme.spacingLg,
                ),
                child: FadeInUp(
                  delay: const Duration(milliseconds: 100),
                  duration: const Duration(milliseconds: 500),
                  child: GmmxCard(
                    gradient: AppColors.primaryGradient,
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Not Checked In',
                                    style: TextStyle(
                                      color: Colors.white.withValues(alpha: 0.9),
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Mark Attendance',
                                style: AppTypography.titleLarge.copyWith(
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Scan the QR code at your gym',
                                style: TextStyle(
                                  color: Colors.white.withValues(alpha: 0.8),
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          width: 56,
                          height: 56,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(
                            LucideIcons.scanLine,
                            color: Colors.white,
                            size: 28,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 20)),

            // ── Quick Stats Grid ──
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppTheme.spacingLg,
                ),
                child: FadeInUp(
                  delay: const Duration(milliseconds: 200),
                  duration: const Duration(milliseconds: 500),
                  child: Row(
                    children: [
                      Expanded(
                        child: StatCard(
                          icon: LucideIcons.flame,
                          value: '7',
                          label: 'Day Streak',
                          iconColor: AppColors.streak,
                          trend: '+2',
                          trendPositive: true,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: StatCard(
                          icon: LucideIcons.footprints,
                          value: '8,542',
                          label: 'Steps Today',
                          iconColor: AppColors.steps,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 20)),

            // ── Today's Nutrition ──
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppTheme.spacingLg,
                ),
                child: FadeInUp(
                  delay: const Duration(milliseconds: 300),
                  duration: const Duration(milliseconds: 500),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Today\'s Nutrition',
                        style: AppTypography.sectionHeader.copyWith(
                          color: isDark ? Colors.white : AppColors.neutral900,
                        ),
                      ),
                      const SizedBox(height: 12),
                      GmmxCard(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            ProgressRing(
                              progress: 0.65,
                              size: 72,
                              strokeWidth: 6,
                              color: AppColors.calories,
                              centerText: '65%',
                              label: 'Calories',
                            ),
                            ProgressRing(
                              progress: 0.45,
                              size: 72,
                              strokeWidth: 6,
                              color: AppColors.protein,
                              centerText: '45%',
                              label: 'Protein',
                            ),
                            ProgressRing(
                              progress: 0.70,
                              size: 72,
                              strokeWidth: 6,
                              color: AppColors.carbs,
                              centerText: '70%',
                              label: 'Carbs',
                            ),
                            ProgressRing(
                              progress: 0.30,
                              size: 72,
                              strokeWidth: 6,
                              color: AppColors.hydration,
                              centerText: '30%',
                              label: 'Water',
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 20)),

            // ── Today's Workout ──
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppTheme.spacingLg,
                ),
                child: FadeInUp(
                  delay: const Duration(milliseconds: 400),
                  duration: const Duration(milliseconds: 500),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Today\'s Workout',
                            style: AppTypography.sectionHeader.copyWith(
                              color:
                                  isDark ? Colors.white : AppColors.neutral900,
                            ),
                          ),
                          TextButton(
                            onPressed: () {},
                            child: const Text('View All'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      GmmxCard(
                        onTap: () {},
                        child: Row(
                          children: [
                            Container(
                              width: 56,
                              height: 56,
                              decoration: BoxDecoration(
                                color: AppColors.workout.withValues(alpha: 0.12),
                                borderRadius:
                                    BorderRadius.circular(AppTheme.radiusSm),
                              ),
                              child: const Icon(
                                LucideIcons.dumbbell,
                                color: AppColors.workout,
                                size: 24,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Push Day - Chest & Shoulders',
                                    style: AppTypography.titleMedium.copyWith(
                                      color: isDark
                                          ? Colors.white
                                          : AppColors.neutral900,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '6 exercises • ~45 min',
                                    style: Theme.of(context)
                                        .textTheme
                                        .bodySmall
                                        ?.copyWith(
                                          color: AppColors.neutral500,
                                        ),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(
                              Icons.chevron_right_rounded,
                              color: AppColors.neutral400,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 20)),

            // ── Quick Actions ──
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppTheme.spacingLg,
                ),
                child: FadeInUp(
                  delay: const Duration(milliseconds: 500),
                  duration: const Duration(milliseconds: 500),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Quick Actions',
                        style: AppTypography.sectionHeader.copyWith(
                          color: isDark ? Colors.white : AppColors.neutral900,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          _QuickAction(
                            icon: LucideIcons.scanLine,
                            label: 'Scan QR',
                            color: AppColors.attendance,
                            isDark: isDark,
                            onTap: () {},
                          ),
                          const SizedBox(width: 12),
                          _QuickAction(
                            icon: LucideIcons.dumbbell,
                            label: 'Log Workout',
                            color: AppColors.workout,
                            isDark: isDark,
                            onTap: () {},
                          ),
                          const SizedBox(width: 12),
                          _QuickAction(
                            icon: LucideIcons.utensilsCrossed,
                            label: 'Log Meal',
                            color: AppColors.nutrition,
                            isDark: isDark,
                            onTap: () {},
                          ),
                          const SizedBox(width: 12),
                          _QuickAction(
                            icon: LucideIcons.droplets,
                            label: 'Water',
                            color: AppColors.hydration,
                            isDark: isDark,
                            onTap: () {},
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // ── Membership Info ──
            if (member != null && member.membershipEnd != null)
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(
                    AppTheme.spacingLg,
                    20,
                    AppTheme.spacingLg,
                    0,
                  ),
                  child: FadeInUp(
                    delay: const Duration(milliseconds: 600),
                    duration: const Duration(milliseconds: 500),
                    child: GmmxCard(
                      color: isDark
                          ? AppColors.warning.withValues(alpha: 0.08)
                          : AppColors.warningLight,
                      child: Row(
                        children: [
                          const Icon(
                            Icons.access_time_rounded,
                            color: AppColors.warning,
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Membership renews in ${member.membershipDaysRemaining ?? 0} days',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodyMedium
                                  ?.copyWith(
                                    color: isDark
                                        ? AppColors.neutral300
                                        : AppColors.neutral700,
                                    fontWeight: FontWeight.w500,
                                  ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final bool isDark;
  final VoidCallback onTap;

  const _QuickAction({
    required this.icon,
    required this.label,
    required this.color,
    required this.isDark,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Column(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: isDark ? AppColors.neutral400 : AppColors.neutral600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
