import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/widgets/common/confetti_overlay.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'dart:math' as math;

class StoryResultScreen extends StatefulWidget {
  const StoryResultScreen({super.key});

  @override
  State<StoryResultScreen> createState() => _StoryResultScreenState();
}

class _StoryResultScreenState extends State<StoryResultScreen> with TickerProviderStateMixin {
  bool _isLoading = true;
  bool _showConfetti = false;
  
  // Animation controllers
  late AnimationController _loadingController;
  late AnimationController _successController;
  late AnimationController _floatController;
  late AnimationController _shimmerController;

  final List<String> _loadingMessages = [
    '✨ Gathering stardust...',
    '🧚 Summoning friendly creatures...',
    '🎨 Painting your adventure...',
    '🌟 Adding a sprinkle of magic...',
    '📚 Binding the storybook...',
  ];
  
  int _currentMessageIndex = 0;

  @override
  void initState() {
    super.initState();
    
    _loadingController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();

    _successController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    _floatController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);

    _shimmerController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();

    // Cycle loading messages
    _cycleMessages();

    // Simulate generation delay
    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _showConfetti = true;
        });
        _successController.forward();
      }
    });
  }

  void _cycleMessages() async {
    while (_isLoading && mounted) {
      await Future.delayed(const Duration(milliseconds: 1500));
      if (mounted && _isLoading) {
        setState(() {
          _currentMessageIndex = (_currentMessageIndex + 1) % _loadingMessages.length;
        });
      }
    }
  }

  @override
  void dispose() {
    _loadingController.dispose();
    _successController.dispose();
    _floatController.dispose();
    _shimmerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _isLoading ? Color(0xFFFFFBF5) : Colors.white,
      body: _isLoading ? _buildLoadingState() : _buildSuccessState(),
    );
  }

  Widget _buildLoadingState() {
    return Stack(
      children: [
        // Animated Background Particles
        Positioned.fill(
          child: AnimatedBuilder(
            animation: _loadingController,
            builder: (context, child) {
              return CustomPaint(
                painter: MagicDustPainter(animation: _loadingController.value),
              );
            },
          ),
        ),
        
        Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Magical Creation Animation
              Stack(
                alignment: Alignment.center,
                children: [
                  // Outer rotating ring
                  RotationTransition(
                    turns: _loadingController,
                    child: Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: SweepGradient(
                          colors: [
                            AppColors.primary500.withOpacity(0),
                            AppColors.primary500.withOpacity(0.5),
                            AppColors.accent500.withOpacity(0.5),
                            AppColors.primary500.withOpacity(0),
                          ],
                        ),
                      ),
                    ),
                  ),
                  // Inner pulsing core
                  ScaleTransition(
                    scale: Tween(begin: 0.8, end: 1.1).animate(
                      CurvedAnimation(
                        parent: _loadingController,
                        curve: Curves.easeInOut,
                      ),
                    ),
                    child: Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            AppColors.accent500.withOpacity(0.3),
                            AppColors.primary500.withOpacity(0.1),
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary500.withOpacity(0.2),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: Center(
                        child: Icon(
                          LucideIcons.sparkles,
                          size: 40,
                          color: AppColors.primary500,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 40),
              
              // Animated Loading Text
              AnimatedSwitcher(
                duration: Duration(milliseconds: 500),
                child: Text(
                  _loadingMessages[_currentMessageIndex],
                  key: ValueKey(_currentMessageIndex),
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textDark,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSuccessState() {
    return ConfettiOverlay(
      isPlaying: _showConfetti,
      child: Stack(
        children: [
          // Magical Background
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFFFFFBF5),
                  Color(0xFFFFF0F5),
                ],
              ),
            ),
          ),
          
          // Decorative Corners
          Positioned(top: -50, left: -50, child: _buildDecorativeCircle(150, AppColors.primary500.withOpacity(0.1))),
          Positioned(bottom: -30, right: -30, child: _buildDecorativeCircle(120, AppColors.accent500.withOpacity(0.1))),

          SafeArea(
            child: Column(
              children: [
                // Header
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: Icon(LucideIcons.x, color: AppColors.textMuted),
                        onPressed: () => context.go('/home'),
                        style: IconButton.styleFrom(
                          backgroundColor: Colors.white,
                          padding: EdgeInsets.all(12),
                        ),
                      ),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Text('✨ ', style: TextStyle(fontSize: 16)),
                            Text(
                              'Story Ready!',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      SizedBox(width: 48), // Balance
                    ],
                  ),
                ),

                Expanded(
                  child: SingleChildScrollView(
                    padding: EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(height: 20),
                        // Magical Book Reveal
                        AnimatedBuilder(
                          animation: _floatController,
                          builder: (context, child) {
                            return Transform.translate(
                              offset: Offset(0, math.sin(_floatController.value * 2 * math.pi) * 10),
                              child: ScaleTransition(
                                scale: CurvedAnimation(
                                  parent: _successController,
                                  curve: Curves.elasticOut,
                                ),
                                child: Container(
                                  width: 200,
                                  height: 260,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(24),
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        AppColors.primary500,
                                        Color(0xFF4A5FE8),
                                      ],
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: AppColors.primary500.withOpacity(0.3),
                                        blurRadius: 30,
                                        offset: Offset(0, 15),
                                      ),
                                    ],
                                  ),
                                  child: Stack(
                                    children: [
                                      // Book Cover Pattern
                                      Positioned.fill(
                                        child: CustomPaint(
                                          painter: BookCoverPainter(),
                                        ),
                                      ),
                                      // Center Icon
                                      Center(
                                        child: Container(
                                          width: 100,
                                          height: 100,
                                          decoration: BoxDecoration(
                                            color: Colors.white.withOpacity(0.2),
                                            shape: BoxShape.circle,
                                          ),
                                          child: Center(
                                            child: Text('🌳', style: TextStyle(fontSize: 56)),
                                          ),
                                        ),
                                      ),
                                      // Corner Accents
                                      Positioned(
                                        top: 16,
                                        right: 16,
                                        child: Icon(LucideIcons.sparkles, color: Colors.white.withOpacity(0.6)),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                        
                        SizedBox(height: 40),
                        
                        // Title & Description
                        FadeTransition(
                          opacity: CurvedAnimation(
                            parent: _successController,
                            curve: Interval(0.4, 1.0, curve: Curves.easeOut),
                          ),
                          child: Column(
                            children: [
                              Text(
                                'Emma and the Magic Tree',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontFamily: 'Serif',
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textDark,
                                  height: 1.2,
                                ),
                              ),
                              SizedBox(height: 16),
                              Container(
                                padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.6),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: AppColors.primary500.withOpacity(0.1),
                                  ),
                                ),
                                child: Text(
                                  'A gentle story about sharing and friendship, set in a magical forest.',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: AppColors.textBody,
                                    height: 1.5,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Bottom Action
                Padding(
                  padding: EdgeInsets.all(24),
                  child: SlideTransition(
                    position: Tween<Offset>(
                      begin: Offset(0, 1),
                      end: Offset.zero,
                    ).animate(CurvedAnimation(
                      parent: _successController,
                      curve: Interval(0.6, 1.0, curve: Curves.easeOutCubic),
                    )),
                    child: SizedBox(
                      width: double.infinity,
                      height: 64,
                      child: AnimatedBuilder(
                        animation: _shimmerController,
                        builder: (context, child) {
                          return Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(32),
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  AppColors.primary500,
                                  AppColors.accent500,
                                ],
                                stops: [
                                  0.0,
                                  0.5 + math.sin(_shimmerController.value * 2 * math.pi) * 0.2,
                                ],
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.primary500.withOpacity(0.4),
                                  blurRadius: 20,
                                  offset: Offset(0, 8),
                                ),
                              ],
                            ),
                            child: ElevatedButton(
                              onPressed: () => context.push('/story/read'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                foregroundColor: Colors.white,
                                shadowColor: Colors.transparent,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(32),
                                ),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(LucideIcons.bookOpen, size: 24),
                                  SizedBox(width: 12),
                                  Text(
                                    'Open Your Storybook',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDecorativeCircle(double size, Color color) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
      ),
    );
  }
}

class MagicDustPainter extends CustomPainter {
  final double animation;
  final Random _random = Random(42);

  MagicDustPainter({required this.animation});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;

    for (int i = 0; i < 20; i++) {
      final x = _random.nextDouble() * size.width;
      final startY = _random.nextDouble() * size.height;
      final speed = 50.0 + _random.nextDouble() * 50.0;
      
      final y = (startY - animation * speed) % size.height;
      final opacity = (math.sin(animation * 2 * math.pi + i) + 1) / 2 * 0.5;
      
      paint.color = AppColors.primary500.withOpacity(opacity);
      canvas.drawCircle(Offset(x, y), 2 + _random.nextDouble() * 3, paint);
    }
  }

  @override
  bool shouldRepaint(covariant MagicDustPainter oldDelegate) => true;
}

class BookCoverPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    // Draw decorative border
    final rect = Rect.fromLTWH(12, 12, size.width - 24, size.height - 24);
    canvas.drawRRect(RRect.fromRectAndRadius(rect, Radius.circular(12)), paint);

    // Draw spine detail
    paint.style = PaintingStyle.fill;
    paint.color = Colors.black.withOpacity(0.1);
    canvas.drawRect(Rect.fromLTWH(0, 0, 16, size.height), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class Random {
  int _seed;
  Random(this._seed);
  double nextDouble() {
    _seed = (_seed * 16807) % 2147483647;
    return _seed / 2147483647;
  }
}
