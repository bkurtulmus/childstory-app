import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/widgets/common/buttons.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:easy_localization/easy_localization.dart';
import 'dart:math' as math;

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> with TickerProviderStateMixin {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  bool _showSkipConfirm = false;
  late AnimationController _floatController;

  final List<Map<String, dynamic>> _slides = [
    {
      'title': 'onboarding.slide1_title',
      'body': 'onboarding.slide1_body',
      'icon': '📖',
      'color': Color(0xFFE1F5FE), // Light Blue
      'accent': Color(0xFF29B6F6),
      'illustration': _StoryIllustration(),
    },
    {
      'title': 'onboarding.slide2_title',
      'body': 'onboarding.slide2_body',
      'icon': '✨',
      'color': Color(0xFFF3E5F5), // Light Purple
      'accent': Color(0xFFAB47BC),
      'illustration': _MagicIllustration(),
    },
    {
      'title': 'onboarding.slide3_title',
      'body': 'onboarding.slide3_body',
      'icon': '🛡️',
      'color': Color(0xFFFFF3E0), // Light Orange
      'accent': Color(0xFFFFA726),
      'illustration': _SafeIllustration(),
    },
  ];

  @override
  void initState() {
    super.initState();
    _floatController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pageController.dispose();
    _floatController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < _slides.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeInOutCubic,
      );
    } else {
      context.go('/auth');
    }
  }

  void _handleSkip() {
    if (_currentPage == _slides.length - 1 && !_showSkipConfirm) {
      setState(() => _showSkipConfirm = true);
    } else {
      context.go('/auth');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFFFBF5), // Warm cream
      body: Stack(
        children: [
          // Animated Background Elements
          Positioned.fill(
            child: AnimatedBuilder(
              animation: _pageController,
              builder: (context, child) {
                // Parallax effect based on scroll
                double offset = 0;
                if (_pageController.hasClients) {
                  offset = _pageController.page ?? 0;
                }
                return Stack(
                  children: [
                    // Floating Clouds
                    Positioned(
                      top: 50,
                      left: 20 - (offset * 50),
                      child: Icon(LucideIcons.cloud, size: 60, color: AppColors.primary500.withOpacity(0.1)),
                    ),
                    Positioned(
                      top: 120,
                      right: -20 - (offset * 30),
                      child: Icon(LucideIcons.cloud, size: 40, color: AppColors.secondary500.withOpacity(0.1)),
                    ),
                    // Floating Stars
                    Positioned(
                      bottom: 100,
                      left: 40 - (offset * 20),
                      child: Icon(LucideIcons.star, size: 30, color: AppColors.accent500.withOpacity(0.2)),
                    ),
                  ],
                );
              },
            ),
          ),

          Column(
            children: [
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (index) => setState(() => _currentPage = index),
                  itemCount: _slides.length,
                  itemBuilder: (context, index) {
                    final slide = _slides[index];
                    return SingleChildScrollView(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(24, 64, 24, 24),
                        child: Column(
                          children: [
                            // Magical Illustration Card
                            AnimatedBuilder(
                              animation: _floatController,
                              builder: (context, child) {
                                return Transform.translate(
                                  offset: Offset(0, math.sin(_floatController.value * math.pi) * 10),
                                  child: child,
                                );
                              },
                              child: Container(
                                width: double.infinity,
                                height: 380,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(32),
                                  boxShadow: [
                                    BoxShadow(
                                      color: (slide['accent'] as Color).withOpacity(0.15),
                                      blurRadius: 30,
                                      offset: Offset(0, 15),
                                    ),
                                  ],
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      Colors.white,
                                      (slide['color'] as Color).withOpacity(0.5),
                                    ],
                                  ),
                                ),
                                child: Stack(
                                  alignment: Alignment.center,
                                  children: [
                                    // Background Glow
                                    Positioned(
                                      top: -50,
                                      right: -50,
                                      child: Container(
                                        width: 200,
                                        height: 200,
                                        decoration: BoxDecoration(
                                          color: (slide['accent'] as Color).withOpacity(0.1),
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                    ),
                                    slide['illustration'] as Widget,
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 32),
                            
                            // Whimsical Typography
                            Text(
                              (slide['title'] as String).tr(),
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 36,
                                fontWeight: FontWeight.w900,
                                color: AppColors.textDark,
                                height: 1.1,
                                letterSpacing: -0.5,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              (slide['body'] as String).tr(),
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w500,
                                color: AppColors.textBody,
                                height: 1.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              
              // Playful Bottom Section
              Container(
                padding: const EdgeInsets.fromLTRB(24, 16, 24, 40),
                child: Column(
                  children: [
                    // Magical Page Indicators
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        _slides.length,
                        (index) => AnimatedContainer(
                          duration: const Duration(milliseconds: 400),
                          curve: Curves.elasticOut,
                          margin: const EdgeInsets.symmetric(horizontal: 6),
                          height: 12,
                          width: _currentPage == index ? 32 : 12,
                          decoration: BoxDecoration(
                            color: _currentPage == index
                                ? (_slides[_currentPage]['accent'] as Color)
                                : AppColors.neutral300,
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: _currentPage == index
                                ? [
                                    BoxShadow(
                                      color: (_slides[_currentPage]['accent'] as Color).withOpacity(0.4),
                                      blurRadius: 8,
                                      offset: Offset(0, 2),
                                    )
                                  ]
                                : [],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                    
                    // Magical Button
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: _nextPage,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _slides[_currentPage]['accent'] as Color,
                          foregroundColor: Colors.white,
                          elevation: 8,
                          shadowColor: (_slides[_currentPage]['accent'] as Color).withOpacity(0.4),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(28),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              _currentPage == _slides.length - 1 ? 'onboarding.start_adventure'.tr() : 'onboarding.next_magic'.tr(),
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(width: 8),
                            Icon(
                              _currentPage == _slides.length - 1 ? LucideIcons.rocket : LucideIcons.sparkles,
                              size: 20,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // Skip Button
                    TextButton(
                      onPressed: _handleSkip,
                      child: Text(
                        'onboarding.skip'.tr(),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          
          // Magical Skip Confirmation
          if (_showSkipConfirm)
            Container(
              color: Colors.black.withOpacity(0.6),
              child: Center(
                child: Container(
                  width: 320,
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(32),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.white.withOpacity(0.2),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('🎈', style: TextStyle(fontSize: 48)),
                      SizedBox(height: 16),
                      Text(
                        'onboarding.almost_there'.tr(),
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: AppColors.textDark,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'onboarding.almost_there_desc'.tr(),
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          color: AppColors.textBody,
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 32),
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: () {
                            setState(() => _showSkipConfirm = false);
                            _nextPage();
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary500,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(28),
                            ),
                          ),
                          child: Text('onboarding.continue_magic'.tr(), style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextButton(
                        onPressed: () {
                          setState(() => _showSkipConfirm = false);
                          context.go('/auth');
                        },
                        child: Text('onboarding.skip_anyway'.tr(), style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textMuted)),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// Magical Illustrations
class _StoryIllustration extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        Icon(LucideIcons.bookOpen, size: 120, color: Color(0xFF29B6F6)),
        Positioned(
          top: 60,
          right: 80,
          child: Icon(LucideIcons.star, size: 40, color: Color(0xFFFFCA28)),
        ),
        Positioned(
          bottom: 60,
          left: 80,
          child: Icon(LucideIcons.sparkles, size: 30, color: Color(0xFFAB47BC)),
        ),
      ],
    );
  }
}

class _MagicIllustration extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        Icon(LucideIcons.wand2, size: 120, color: Color(0xFFAB47BC)),
        Positioned(
          top: 50,
          left: 100,
          child: Icon(LucideIcons.zap, size: 40, color: Color(0xFFFFCA28)),
        ),
        Positioned(
          bottom: 80,
          right: 100,
          child: Icon(LucideIcons.sparkles, size: 50, color: Color(0xFF29B6F6)),
        ),
      ],
    );
  }
}

class _SafeIllustration extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        Icon(LucideIcons.shield, size: 120, color: Color(0xFFFF7043)),
        Positioned(
          top: 70,
          right: 90,
          child: Icon(LucideIcons.lock, size: 40, color: Color(0xFF5C6BC0)),
        ),
        Positioned(
          bottom: 70,
          left: 90,
          child: Icon(LucideIcons.heart, size: 30, color: Color(0xFFEF5350)),
        ),
      ],
    );
  }
}
