import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../providers/auth_provider.dart';

class WelcomeScreen extends ConsumerWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final isLoading = authState.isLoading;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              // Logo placeholder
              const Icon(
                Icons.fitness_center,
                size: 80,
                color: Color(0xFFFF5C73),
              ),
              const SizedBox(height: 24),
              Text(
                'Welcome to GMMX',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 8),
              Text(
                'Your premium fitness companion.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: Colors.grey,
                    ),
              ),
              const Spacer(),
              ElevatedButton.icon(
                onPressed: isLoading
                    ? null
                    : () async {
                        try {
                          await ref.read(authProvider.notifier).loginWithGoogle();
                          if (context.mounted) {
                            context.go('/profile-completion');
                          }
                        } catch (e) {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(e.toString())),
                            );
                          }
                        }
                      },
                icon: const Icon(LucideIcons.chrome),
                label: isLoading
                    ? const SizedBox(
                        height: 20, 
                        width: 20, 
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.grey)
                      )
                    : const Text('Continue with Google'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).brightness == Brightness.dark 
                      ? Colors.grey.shade900 
                      : Colors.white,
                  foregroundColor: Theme.of(context).brightness == Brightness.dark 
                      ? Colors.white 
                      : Colors.black87,
                  side: BorderSide(
                    color: Theme.of(context).brightness == Brightness.dark 
                        ? Colors.white24 
                        : Colors.black12,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: isLoading
                    ? null
                    : () {
                        context.push('/login');
                      },
                child: const Text('Login with Email'),
              ),
              const SizedBox(height: 32),
              const Text(
                'Your gym must create your account first.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
