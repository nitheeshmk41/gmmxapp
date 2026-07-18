import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/auth/presentation/screens/welcome_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/profile_completion_screen.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/workout/presentation/screens/workout_screen.dart';
import '../../features/attendance/presentation/screens/scan_screen.dart';
import '../../features/nutrition/presentation/screens/nutrition_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../widgets/app_shell.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>();
final GlobalKey<NavigatorState> _shellNavigatorKey = GlobalKey<NavigatorState>();

final appRouter = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/splash',
  routes: [
    GoRoute(
      path: '/splash',
      name: 'splash',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/welcome',
      name: 'welcome',
      builder: (context, state) => const WelcomeScreen(),
    ),
    GoRoute(
      path: '/login',
      name: 'login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/profile-completion',
      name: 'profile-completion',
      builder: (context, state) => const ProfileCompletionScreen(),
    ),
    ShellRoute(
      navigatorKey: _shellNavigatorKey,
      builder: (context, state, child) {
        // Determine the current index from the route location
        int currentIndex = 0;
        if (state.uri.path.startsWith('/workout')) currentIndex = 1;
        if (state.uri.path.startsWith('/scan')) currentIndex = 2;
        if (state.uri.path.startsWith('/nutrition')) currentIndex = 3;
        if (state.uri.path.startsWith('/profile')) currentIndex = 4;
        
        return AppShell(currentIndex: currentIndex, child: child);
      },
      routes: [
        GoRoute(
          path: '/dashboard',
          name: 'dashboard',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: DashboardScreen(),
          ),
        ),
        GoRoute(
          path: '/workout',
          name: 'workout',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: WorkoutScreen(),
          ),
        ),
        GoRoute(
          path: '/scan',
          name: 'scan',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: ScanScreen(),
          ),
        ),
        GoRoute(
          path: '/nutrition',
          name: 'nutrition',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: NutritionScreen(),
          ),
        ),
        GoRoute(
          path: '/profile',
          name: 'profile',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: ProfileScreen(),
          ),
        ),
      ],
    ),
  ],
);
