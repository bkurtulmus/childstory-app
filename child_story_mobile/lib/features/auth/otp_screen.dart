import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'dart:async';
import 'dart:math' as math;

class OtpScreen extends StatefulWidget {
  final String identifier;

  const OtpScreen({super.key, required this.identifier});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> with TickerProviderStateMixin {
  final List<TextEditingController> _controllers =
      List.generate(6, (index) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (index) => FocusNode());
  
  Timer? _timer;
  int _countdown = 30;
  bool _canResend = false;
  bool _isLoading = false;
  bool _showSuccess = false;
  String? _error;
  late AnimationController _floatController;

  @override
  void initState() {
    super.initState();
    _startTimer();
    _floatController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _timer?.cancel();
    _floatController.dispose();
    for (var controller in _controllers) {
      controller.dispose();
    }
    for (var node in _focusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  void _startTimer() {
    setState(() {
      _countdown = 30;
      _canResend = false;
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_countdown > 0) {
        setState(() => _countdown--);
      } else {
        setState(() => _canResend = true);
        timer.cancel();
      }
    });
  }

  void _handleResend() async {
    _startTimer();
    // Simulate resend API
  }

  void _onChanged(String value, int index) {
    if (value.isNotEmpty) {
      if (index < 5) {
        _focusNodes[index + 1].requestFocus();
      } else {
        _focusNodes[index].unfocus();
        _verifyCode();
      }
    } else if (index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
  }

  void _verifyCode() async {
    final code = _controllers.map((c) => c.text).join();
    if (code.length < 6) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    // Simulate API verification
    await Future.delayed(const Duration(milliseconds: 1500));

    if (mounted) {
      if (code == '123456') {
        setState(() {
          _isLoading = false;
          _showSuccess = true;
        });
        
        await Future.delayed(const Duration(milliseconds: 1500));
        if (mounted) {
          context.go('/home');
        }
      } else {
        setState(() {
          _isLoading = false;
          _error = 'Oops! The magic code didn\'t match. Try again ✨';
        });
      }
    }
  }

  String _maskIdentifier(String identifier) {
    if (identifier.contains('@')) {
      final parts = identifier.split('@');
      final local = parts[0];
      final domain = parts[1];
      return '${local[0]}••••@$domain';
    } else {
      if (identifier.length > 4) {
        return '•••• ${identifier.substring(identifier.length - 4)}';
      }
      return identifier;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFFFBF5), // Warm cream
      body: Stack(
        children: [
          // Magical Background Elements
          Positioned.fill(
            child: CustomPaint(
              painter: _MagicalBackgroundPainter(),
            ),
          ),

          // Skip Button (Dev Only)
          Positioned(
            top: SafeArea(child: Container()).minimum.top + 16,
            right: 16,
            child: GestureDetector(
              onTap: () => context.go('/home'),
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.8),
                  borderRadius: BorderRadius.circular(AppRadius.pill),
                  border: Border.all(color: AppColors.primary500.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Text(
                      'Skip to Magic',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary500,
                      ),
                    ),
                    SizedBox(width: 4),
                    Icon(LucideIcons.wand2, size: 12, color: AppColors.primary500),
                  ],
                ),
              ),
            ),
          ),

          Column(
            children: [
              // Magical AppBar
              Container(
                height: 60,
                margin: EdgeInsets.only(top: MediaQuery.of(context).padding.top),
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => context.pop(),
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primary500.withOpacity(0.1),
                              blurRadius: 8,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Icon(
                          LucideIcons.arrowLeft,
                          size: 20,
                          color: AppColors.textDark,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Content
              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.all(24),
                  child: Column(
                    children: [
                      // Floating Magical Icon
                      AnimatedBuilder(
                        animation: _floatController,
                        builder: (context, child) {
                          return Transform.translate(
                            offset: Offset(0, math.sin(_floatController.value * math.pi) * 8),
                            child: child,
                          );
                        },
                        child: Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: RadialGradient(
                              colors: [
                                AppColors.enchant500.withOpacity(0.2),
                                Colors.transparent,
                              ],
                            ),
                          ),
                          child: Icon(
                            LucideIcons.mailOpen,
                            size: 48,
                            color: AppColors.enchant500,
                          ),
                        ),
                      ),
                      SizedBox(height: 24),

                      Text(
                        'A magical code is\non its way!',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          color: AppColors.textDark,
                          height: 1.2,
                          letterSpacing: -0.5,
                        ),
                      ),
                      SizedBox(height: 12),
                      Text(
                        'Check your messages and open the portal\nto the adventure',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          color: AppColors.textBody,
                          height: 1.5,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 32),

                      // Magical Contact Display
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primary500.withOpacity(0.1),
                              blurRadius: 20,
                              offset: Offset(0, 10),
                            ),
                          ],
                          border: Border.all(color: Colors.white),
                        ),
                        child: Column(
                          children: [
                            Text(
                              'Magic code sent to',
                              style: TextStyle(
                                fontSize: 14,
                                color: AppColors.textMuted,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text('✨', style: TextStyle(fontSize: 16)),
                                SizedBox(width: 8),
                                Text(
                                  _maskIdentifier(widget.identifier),
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.primary500,
                                  ),
                                ),
                                SizedBox(width: 8),
                                Text('✨', style: TextStyle(fontSize: 16)),
                              ],
                            ),
                          ],
                        ),
                      ),
                      SizedBox(height: 40),

                      // Magical OTP Inputs
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(6, (index) {
                          final isFilled = _controllers[index].text.isNotEmpty;
                          return AnimatedContainer(
                            duration: Duration(milliseconds: 200),
                            width: 48,
                            height: 60,
                            margin: EdgeInsets.symmetric(horizontal: 4),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: _error != null
                                    ? AppColors.error
                                    : isFilled
                                        ? AppColors.primary500
                                        : AppColors.neutral200,
                                width: 2,
                              ),
                              boxShadow: isFilled
                                  ? [
                                      BoxShadow(
                                        color: AppColors.primary500.withOpacity(0.2),
                                        blurRadius: 8,
                                        spreadRadius: 2,
                                      )
                                    ]
                                  : [],
                            ),
                            child: TextField(
                              controller: _controllers[index],
                              focusNode: _focusNodes[index],
                              textAlign: TextAlign.center,
                              keyboardType: TextInputType.number,
                              maxLength: 1,
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                color: AppColors.textDark,
                              ),
                              decoration: InputDecoration(
                                counterText: '',
                                border: InputBorder.none,
                              ),
                              onChanged: (value) => _onChanged(value, index),
                            ),
                          );
                        }),
                      ),
                      
                      if (_error != null) ...[
                        SizedBox(height: 24),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            color: AppColors.error.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.error.withOpacity(0.3)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(LucideIcons.sparkles, size: 16, color: AppColors.error),
                              SizedBox(width: 8),
                              Text(
                                _error!,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.error,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],

                      SizedBox(height: 40),

                      // Magical Resend
                      if (_canResend)
                        ElevatedButton.icon(
                          onPressed: _handleResend,
                          icon: Icon(LucideIcons.refreshCw, size: 18),
                          label: Text('Resend Magic Code'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: AppColors.primary500,
                            elevation: 4,
                            shadowColor: AppColors.primary500.withOpacity(0.2),
                            padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(24),
                            ),
                          ),
                        )
                      else
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                          decoration: BoxDecoration(
                            color: AppColors.neutral100,
                            borderRadius: BorderRadius.circular(24),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(LucideIcons.clock, size: 16, color: AppColors.textMuted),
                              SizedBox(width: 8),
                              Text(
                                'Magic arrives in ${_countdown}s',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                        
                      SizedBox(height: 24),
                      TextButton(
                        onPressed: () => context.pop(),
                        child: Text(
                          'Use a different star number/magic mail',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textMuted,
                          ),
                        ),
                      ),
                      
                      if (_isLoading && !_showSuccess) ...[
                        SizedBox(height: 32),
                        CircularProgressIndicator(
                          color: AppColors.primary500,
                          strokeWidth: 3,
                        ),
                        SizedBox(height: 12),
                        Text(
                          'Opening the portal...',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary500,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Magical Success Overlay
          if (_showSuccess)
            Container(
              color: Colors.black.withOpacity(0.6),
              child: Center(
                child: TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0.0, end: 1.0),
                  duration: Duration(milliseconds: 500),
                  curve: Curves.elasticOut,
                  builder: (context, value, child) {
                    return Transform.scale(
                      scale: value,
                      child: Container(
                        margin: EdgeInsets.all(32),
                        padding: EdgeInsets.all(40),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(32),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.white.withOpacity(0.5),
                              blurRadius: 30,
                              spreadRadius: 5,
                            ),
                          ],
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text('🎉', style: TextStyle(fontSize: 64)),
                            SizedBox(height: 24),
                            Text(
                              'Portal Opened!',
                              style: TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.w900,
                                color: AppColors.textDark,
                              ),
                            ),
                            SizedBox(height: 12),
                            Text(
                              'Your adventure begins now ✨',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 18,
                                color: AppColors.textBody,
                                fontWeight: FontWeight.w500,
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
        ],
      ),
    );
  }
}

class _MagicalBackgroundPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.primary500.withOpacity(0.05)
      ..style = PaintingStyle.fill;

    canvas.drawCircle(Offset(size.width * 0.2, size.height * 0.1), 60, paint);
    canvas.drawCircle(Offset(size.width * 0.8, size.height * 0.3), 100, paint);
    
    paint.color = AppColors.accent500.withOpacity(0.05);
    canvas.drawCircle(Offset(size.width * 0.1, size.height * 0.8), 120, paint);
    canvas.drawCircle(Offset(size.width * 0.9, size.height * 0.9), 80, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
