import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/extensions.dart';
import '../../../auth/providers/auth_provider.dart';

/// Placeholder profile screen.
/// Will be enhanced with full profile management in Phase 6.
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final member = authState.member;
    final organization = authState.organization;
    final isDark = context.isDarkMode;

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(AppTheme.spacingMd),
        children: [
          // ── Profile Header ──
          Container(
            padding: const EdgeInsets.all(AppTheme.spacingLg),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkCard : AppColors.lightSurface,
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              border: Border.all(
                color: isDark
                    ? Colors.white.withValues(alpha: 0.08)
                    : AppColors.neutral200,
              ),
            ),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 40,
                  backgroundColor: AppColors.primary.withValues(alpha: 0.12),
                  child: Text(
                    member?.initials ?? '?',
                    style: AppTypography.headlineLarge.copyWith(
                      color: AppColors.primary,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  member?.name ?? 'Member',
                  style: AppTypography.titleLarge,
                ),
                const SizedBox(height: 4),
                Text(
                  member?.email ?? '',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.neutral500,
                      ),
                ),
                if (organization != null) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                    ),
                    child: Text(
                      organization.name,
                      style: AppTypography.badge.copyWith(
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),

          const SizedBox(height: AppTheme.spacingMd),

          // ── Menu Items ──
          _buildMenuItem(
            context,
            icon: LucideIcons.user,
            title: 'Edit Profile',
            onTap: () {},
          ),
          _buildMenuItem(
            context,
            icon: LucideIcons.creditCard,
            title: 'Membership',
            subtitle: member?.membershipPlanName ?? 'View details',
            onTap: () {},
          ),
          _buildMenuItem(
            context,
            icon: LucideIcons.bell,
            title: 'Notifications',
            onTap: () {},
          ),
          _buildMenuItem(
            context,
            icon: LucideIcons.palette,
            title: 'Appearance',
            subtitle: 'Theme, language',
            onTap: () {},
          ),
          _buildMenuItem(
            context,
            icon: LucideIcons.shield,
            title: 'Privacy & Security',
            onTap: () {},
          ),
          _buildMenuItem(
            context,
            icon: LucideIcons.helpCircle,
            title: 'Help & Support',
            onTap: () {},
          ),

          const SizedBox(height: AppTheme.spacingLg),

          // ── Logout ──
          _buildMenuItem(
            context,
            icon: LucideIcons.logOut,
            title: 'Logout',
            isDestructive: true,
            onTap: () async {
              final confirmed = await showDialog<bool>(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Logout'),
                  content: const Text('Are you sure you want to logout?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx, false),
                      child: const Text('Cancel'),
                    ),
                    TextButton(
                      onPressed: () => Navigator.pop(ctx, true),
                      child: const Text('Logout'),
                    ),
                  ],
                ),
              );
              if (confirmed == true) {
                await ref.read(authProvider.notifier).logout();
                if (context.mounted) {
                  context.go('/welcome');
                }
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    String? subtitle,
    required VoidCallback onTap,
    bool isDestructive = false,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: ListTile(
        leading: Icon(
          icon,
          size: 20,
          color: isDestructive
              ? AppColors.error
              : (isDark ? AppColors.neutral400 : AppColors.neutral600),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.w500,
            color: isDestructive ? AppColors.error : null,
          ),
        ),
        subtitle: subtitle != null
            ? Text(
                subtitle,
                style: TextStyle(
                  fontSize: 13,
                  color: AppColors.neutral500,
                ),
              )
            : null,
        trailing: isDestructive
            ? null
            : Icon(
                Icons.chevron_right_rounded,
                size: 20,
                color: AppColors.neutral400,
              ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusSm),
        ),
        onTap: onTap,
      ),
    );
  }
}
