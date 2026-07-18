import 'package:flutter/material.dart';
import '../../../../core/widgets/gmmx_empty_state.dart';

/// Placeholder screen for the Nutrition tab.
/// Will be replaced with full implementation in Phase 4.
class NutritionScreen extends StatelessWidget {
  const NutritionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nutrition')),
      body: const GmmxEmptyState(
        icon: Icons.restaurant_menu_rounded,
        title: 'Nutrition Module',
        subtitle: 'Your meal plans, food log, and macros will appear here.',
      ),
    );
  }
}
