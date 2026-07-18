import 'package:flutter/material.dart';
import '../../../../core/widgets/gmmx_empty_state.dart';

/// Placeholder screen for the Workout tab.
/// Will be replaced with full implementation in Phase 3.
class WorkoutScreen extends StatelessWidget {
  const WorkoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Workout')),
      body: const GmmxEmptyState(
        icon: Icons.fitness_center_rounded,
        title: 'Workout Module',
        subtitle: 'Your workout plans and exercise library will appear here.',
      ),
    );
  }
}
