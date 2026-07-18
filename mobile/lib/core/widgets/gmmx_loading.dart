import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';

/// Full-page loading overlay.
class GmmxLoading extends StatelessWidget {
  final String? message;

  const GmmxLoading({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(
            width: 48,
            height: 48,
            child: CircularProgressIndicator(
              strokeWidth: 3,
              color: AppColors.primary,
            ),
          ),
          if (message != null) ...[
            const SizedBox(height: 16),
            Text(
              message!,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).brightness == Brightness.dark
                        ? AppColors.neutral400
                        : AppColors.neutral600,
                  ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Shimmer loading skeleton for list items.
class GmmxShimmerList extends StatelessWidget {
  final int itemCount;
  final double itemHeight;

  const GmmxShimmerList({
    super.key,
    this.itemCount = 5,
    this.itemHeight = 80,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Shimmer.fromColors(
      baseColor: isDark ? AppColors.darkSurfaceVariant : AppColors.neutral200,
      highlightColor: isDark ? AppColors.darkCard : AppColors.neutral100,
      child: ListView.separated(
        physics: const NeverScrollableScrollPhysics(),
        itemCount: itemCount,
        separatorBuilder: (context, index) => const SizedBox(height: 12),
        padding: const EdgeInsets.all(AppTheme.spacingMd),
        itemBuilder: (context, index) => Container(
          height: itemHeight,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          ),
        ),
      ),
    );
  }
}

/// Shimmer loading skeleton for cards in a grid or horizontal scroll.
class GmmxShimmerCard extends StatelessWidget {
  final double width;
  final double height;

  const GmmxShimmerCard({
    super.key,
    this.width = double.infinity,
    this.height = 120,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Shimmer.fromColors(
      baseColor: isDark ? AppColors.darkSurfaceVariant : AppColors.neutral200,
      highlightColor: isDark ? AppColors.darkCard : AppColors.neutral100,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        ),
      ),
    );
  }
}

/// Inline loading indicator for buttons and small areas.
class GmmxInlineLoader extends StatelessWidget {
  final double size;
  final Color? color;

  const GmmxInlineLoader({
    super.key,
    this.size = 20,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CircularProgressIndicator(
        strokeWidth: 2,
        color: color ?? AppColors.primary,
      ),
    );
  }
}
