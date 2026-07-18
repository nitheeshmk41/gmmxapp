import 'package:animate_do/animate_do.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_enums.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/extensions.dart';
import '../../../../core/utils/validators.dart';
import '../../../../core/widgets/gmmx_button.dart';
import '../../providers/auth_provider.dart';

class ProfileCompletionScreen extends ConsumerStatefulWidget {
  const ProfileCompletionScreen({super.key});

  @override
  ConsumerState<ProfileCompletionScreen> createState() =>
      _ProfileCompletionScreenState();
}

class _ProfileCompletionScreenState
    extends ConsumerState<ProfileCompletionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  final _heightController = TextEditingController();
  final _weightController = TextEditingController();
  final _emergencyContactController = TextEditingController();
  final _medicalController = TextEditingController();

  Gender _selectedGender = Gender.male;
  DateTime? _selectedDate;

  @override
  void dispose() {
    _phoneController.dispose();
    _heightController.dispose();
    _weightController.dispose();
    _emergencyContactController.dispose();
    _medicalController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1940),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context).colorScheme.copyWith(
                  primary: AppColors.primary,
                ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  Future<void> _saveProfile() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    try {
      await ref.read(authProvider.notifier).completeProfile(
            phone: _phoneController.text.trim(),
            gender: _selectedGender.name,
            dateOfBirth: _selectedDate,
            heightCm: double.tryParse(_heightController.text),
            weightKg: double.tryParse(_weightController.text),
            emergencyContact: _emergencyContactController.text.trim().isNotEmpty
                ? _emergencyContactController.text.trim()
                : null,
            medicalConditions: _medicalController.text.trim().isNotEmpty
                ? _medicalController.text.trim()
                : null,
          );
      if (mounted) {
        context.go('/dashboard');
      }
    } catch (e) {
      if (mounted) {
        context.showSnackBar('Failed to save profile.', isError: true);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final isLoading = authState.isLoading;
    final isDark = context.isDarkMode;
    final member = authState.member;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Complete Profile'),
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppTheme.spacingLg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ── Avatar ──
                FadeInDown(
                  duration: const Duration(milliseconds: 500),
                  child: Center(
                    child: Stack(
                      children: [
                        CircleAvatar(
                          radius: 50,
                          backgroundColor: isDark
                              ? AppColors.darkSurfaceVariant
                              : AppColors.neutral200,
                          child: Text(
                            member?.initials ?? '?',
                            style: AppTypography.headlineLarge.copyWith(
                              color: AppColors.primary,
                            ),
                          ),
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: AppColors.primary,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isDark
                                    ? AppColors.darkBackground
                                    : Colors.white,
                                width: 3,
                              ),
                            ),
                            child: const Icon(
                              Icons.camera_alt_rounded,
                              size: 16,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                if (member != null) ...[
                  const SizedBox(height: 12),
                  FadeIn(
                    child: Text(
                      member.name,
                      textAlign: TextAlign.center,
                      style: AppTypography.titleLarge,
                    ),
                  ),
                  FadeIn(
                    child: Text(
                      member.email,
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.neutral500,
                          ),
                    ),
                  ),
                ],

                const SizedBox(height: AppTheme.spacingXl),

                // ── Gender Selection ──
                FadeInUp(
                  delay: const Duration(milliseconds: 100),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Gender',
                        style: AppTypography.titleSmall.copyWith(
                          color:
                              isDark ? AppColors.neutral300 : AppColors.neutral700,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: Gender.values.map((g) {
                          final isSelected = _selectedGender == g;
                          final label = switch (g) {
                            Gender.male => 'Male',
                            Gender.female => 'Female',
                            Gender.other => 'Other',
                            Gender.preferNotToSay => 'Skip',
                          };
                          return Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ChoiceChip(
                                label: Text(label),
                                selected: isSelected,
                                onSelected: (_) =>
                                    setState(() => _selectedGender = g),
                                selectedColor:
                                    AppColors.primary.withValues(alpha: 0.15),
                                labelStyle: TextStyle(
                                  color: isSelected
                                      ? AppColors.primary
                                      : (isDark
                                          ? AppColors.neutral400
                                          : AppColors.neutral600),
                                  fontWeight: isSelected
                                      ? FontWeight.w600
                                      : FontWeight.w500,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: AppTheme.spacingMd),

                // ── Date of Birth ──
                FadeInUp(
                  delay: const Duration(milliseconds: 200),
                  child: GestureDetector(
                    onTap: _pickDate,
                    child: AbsorbPointer(
                      child: TextFormField(
                        decoration: InputDecoration(
                          labelText: 'Date of Birth',
                          hintText: _selectedDate != null
                              ? '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}'
                              : 'Tap to select',
                          prefixIcon: const Icon(Icons.calendar_today, size: 20),
                        ),
                        controller: TextEditingController(
                          text: _selectedDate != null
                              ? '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}'
                              : '',
                        ),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: AppTheme.spacingMd),

                // ── Phone ──
                FadeInUp(
                  delay: const Duration(milliseconds: 250),
                  child: TextFormField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    validator: Validators.phone,
                    decoration: const InputDecoration(
                      labelText: 'Phone Number',
                      hintText: '+91 98765 43210',
                      prefixIcon: Icon(Icons.phone_outlined, size: 20),
                    ),
                  ),
                ),

                const SizedBox(height: AppTheme.spacingMd),

                // ── Height & Weight ──
                FadeInUp(
                  delay: const Duration(milliseconds: 300),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _heightController,
                          keyboardType: TextInputType.number,
                          validator: (v) =>
                              v != null && v.isNotEmpty ? Validators.height(v) : null,
                          decoration: const InputDecoration(
                            labelText: 'Height (cm)',
                            hintText: '175',
                            prefixIcon: Icon(Icons.height, size: 20),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextFormField(
                          controller: _weightController,
                          keyboardType: TextInputType.number,
                          validator: (v) =>
                              v != null && v.isNotEmpty ? Validators.weight(v) : null,
                          decoration: const InputDecoration(
                            labelText: 'Weight (kg)',
                            hintText: '70',
                            prefixIcon: Icon(Icons.monitor_weight_outlined, size: 20),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: AppTheme.spacingMd),

                // ── Emergency Contact ──
                FadeInUp(
                  delay: const Duration(milliseconds: 350),
                  child: TextFormField(
                    controller: _emergencyContactController,
                    keyboardType: TextInputType.phone,
                    decoration: const InputDecoration(
                      labelText: 'Emergency Contact (optional)',
                      hintText: 'Phone number',
                      prefixIcon: Icon(Icons.emergency_outlined, size: 20),
                    ),
                  ),
                ),

                const SizedBox(height: AppTheme.spacingMd),

                // ── Medical Conditions ──
                FadeInUp(
                  delay: const Duration(milliseconds: 400),
                  child: TextFormField(
                    controller: _medicalController,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      labelText: 'Medical Conditions (optional)',
                      hintText: 'Any allergies, injuries, or conditions...',
                      alignLabelWithHint: true,
                    ),
                  ),
                ),

                const SizedBox(height: AppTheme.spacingXl),

                // ── Save Button ──
                FadeInUp(
                  delay: const Duration(milliseconds: 500),
                  child: GmmxButton(
                    label: 'Save & Continue',
                    isLoading: isLoading,
                    onPressed: _saveProfile,
                  ),
                ),

                const SizedBox(height: AppTheme.spacingMd),

                // ── Skip ──
                FadeIn(
                  delay: const Duration(milliseconds: 600),
                  child: TextButton(
                    onPressed: () => context.go('/dashboard'),
                    child: Text(
                      'Skip for now',
                      style: TextStyle(
                        color: isDark
                            ? AppColors.neutral500
                            : AppColors.neutral600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
