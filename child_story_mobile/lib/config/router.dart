import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

import 'package:child_story_mobile/widgets/navigation/bottom_nav.dart';
import 'package:child_story_mobile/features/onboarding/splash_screen.dart';
import 'package:child_story_mobile/features/onboarding/onboarding_screen.dart';
import 'package:child_story_mobile/features/auth/auth_screen.dart';
import 'package:child_story_mobile/features/auth/otp_screen.dart';
import 'package:child_story_mobile/features/home/home_tab.dart';
import 'package:child_story_mobile/features/explore/explore_screen.dart';
import 'package:child_story_mobile/features/library/library_screen.dart';
import 'package:child_story_mobile/features/settings/settings_screen.dart';
import 'package:child_story_mobile/features/story/create_story_screen.dart';
import 'package:child_story_mobile/features/story/story_result_screen.dart';
import 'package:child_story_mobile/features/story/story_reader_screen.dart';
import 'package:child_story_mobile/features/children/children_screen.dart';
import 'package:child_story_mobile/features/children/add_child_screen.dart';
import 'package:child_story_mobile/features/children/child_edit_screen.dart';
import 'package:child_story_mobile/features/language/language_quest_screen.dart';
import 'package:child_story_mobile/features/language/word_bag_screen.dart';
import 'package:child_story_mobile/features/subscription/subscription_screen.dart';
import 'package:child_story_mobile/features/ai_demo/ai_demo_screen.dart';
import 'package:child_story_mobile/features/premium/premium_features_screen.dart';
import 'package:child_story_mobile/features/gamification/gamification_screen.dart';
import 'package:child_story_mobile/features/visual_media/visual_media_screen.dart';
import 'package:child_story_mobile/features/settings/manage_profile_screen.dart';
import 'package:child_story_mobile/features/settings/privacy_policy_screen.dart';
import 'package:child_story_mobile/features/settings/terms_screen.dart';
import 'package:child_story_mobile/features/settings/help_center_screen.dart';
import 'package:child_story_mobile/features/settings/contact_support_screen.dart';
import 'package:child_story_mobile/features/credits/streak_rewards_screen.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();

final router = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/onboarding',
      builder: (context, state) => const OnboardingScreen(),
    ),
    GoRoute(
      path: '/auth',
      builder: (context, state) => const AuthScreen(),
    ),
    GoRoute(
      path: '/auth/verify',
      builder: (context, state) {
        final identifier = state.extra as String? ?? '';
        return OtpScreen(identifier: identifier);
      },
    ),
    
    // Shell Route for Bottom Navigation
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return Scaffold(
          body: navigationShell,
          bottomNavigationBar: BottomNav(
            currentIndex: navigationShell.currentIndex,
            onTap: (index) => navigationShell.goBranch(index),
          ),
        );
      },
      branches: [
        // Branch 0: Home
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/home',
              builder: (context, state) => const HomeTab(),
            ),
          ],
        ),
        // Branch 1: Explore
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/explore',
              builder: (context, state) => const ExploreScreen(),
            ),
          ],
        ),
        // Branch 2: Create (Center button)
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/create',
              builder: (context, state) => const CreateStoryScreen(),
            ),
          ],
        ),
        // Branch 3: Library
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/library',
              builder: (context, state) => const LibraryScreen(),
            ),
          ],
        ),
        // Branch 4: Settings
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/settings',
              builder: (context, state) => const SettingsScreen(),
            ),
          ],
        ),
      ],
    ),
    
    // Story Routes (Full Screen)
    GoRoute(
      path: '/story/create',
      builder: (context, state) => const CreateStoryScreen(),
    ),
    GoRoute(
      path: '/story/result',
      builder: (context, state) => const StoryResultScreen(),
    ),
    GoRoute(
      path: '/story/reader/:id',
      builder: (context, state) {
        final id = state.pathParameters['id'] ?? '';
        return StoryReaderScreen(storyId: id);
      },
    ),
    GoRoute(
      path: '/story/read',
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>?;
        final storyId = extra?['storyId'];
        return StoryReaderScreen(storyId: storyId);
      },
    ),
    
    // Children Routes
    GoRoute(
      path: '/children',
      builder: (context, state) => const ChildrenScreen(),
    ),
    GoRoute(
      path: '/children/add',
      builder: (context, state) => const AddChildScreen(),
    ),
    GoRoute(
      path: '/children/edit/:id',
      builder: (context, state) {
        final id = state.pathParameters['id'] ?? '';
        return ChildEditScreen(childId: id);
      },
    ),
    
    // Language Learning Routes
    GoRoute(
      path: '/language/quest/:storyId',
      builder: (context, state) {
        final storyId = state.pathParameters['storyId'] ?? '';
        final extra = state.extra as Map<String, dynamic>? ?? {};
        final childId = extra['childId'] as String? ?? '';
        final questWordIds = extra['questWordIds'] as List<String>? ?? [];
        return LanguageQuestScreen(
          storyId: storyId,
          childId: childId,
          questWordIds: questWordIds,
        );
      },
    ),
    GoRoute(
      path: '/word-bag',
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>? ?? {};
        final childId = extra['childId'] as String?;
        return WordBagScreen(childId: childId);
      },
    ),
    GoRoute(
      path: '/word-bag/:childId',
      builder: (context, state) {
        final childId = state.pathParameters['childId'];
        return WordBagScreen(childId: childId);
      },
    ),
    
    // Subscription Route
    GoRoute(
      path: '/subscription',
      builder: (context, state) => const SubscriptionScreen(),
    ),
    
    // AI Demo Route
    GoRoute(
      path: '/ai-demo',
      builder: (context, state) => const AiDemoScreen(),
    ),
    
    // Premium Features Route
    GoRoute(
      path: '/premium-features',
      builder: (context, state) => const PremiumFeaturesScreen(),
    ),

    // Gamification Route
    GoRoute(
      path: '/gamification',
      builder: (context, state) => const GamificationScreen(),
    ),

    // Settings Routes
    GoRoute(
      path: '/settings/profile',
      builder: (context, state) => const ManageProfileScreen(),
    ),
    GoRoute(
      path: '/settings/privacy',
      builder: (context, state) => const PrivacyPolicyScreen(),
    ),
    GoRoute(
      path: '/settings/terms',
      builder: (context, state) => const TermsScreen(),
    ),
    GoRoute(
      path: '/settings/help',
      builder: (context, state) => const HelpCenterScreen(),
    ),
    GoRoute(
      path: '/settings/contact',
      builder: (context, state) => const ContactSupportScreen(),
    ),

    // Streaks & Rewards Route
    GoRoute(
      path: '/streaks',
      builder: (context, state) => const StreakRewardsScreen(),
    ),

    // Visual Media Route
    GoRoute(
      path: '/visual-media',
      builder: (context, state) => const VisualMediaScreen(),
    ),
  ],
);
