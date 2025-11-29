import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:child_story_mobile/config/theme.dart';

class BlobBackground extends StatefulWidget {
  final Widget child;
  final Color color;

  const BlobBackground({
    super.key,
    required this.child,
    this.color = const Color(0xFFE0F2FE), // Light Blue default
  });

  @override
  State<BlobBackground> createState() => _BlobBackgroundState();
}

class _BlobBackgroundState extends State<BlobBackground> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Background Blobs
        Positioned.fill(
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return CustomPaint(
                painter: BlobPainter(
                  color: widget.color,
                  animationValue: _controller.value,
                ),
              );
            },
          ),
        ),
        // Content
        widget.child,
      ],
    );
  }
}

class BlobPainter extends CustomPainter {
  final Color color;
  final double animationValue;

  BlobPainter({required this.color, required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color.withOpacity(0.6)
      ..style = PaintingStyle.fill;

    // Blob 1 (Top Left)
    final path1 = Path();
    final offset1 = math.sin(animationValue * 2 * math.pi) * 20;
    path1.addOval(Rect.fromCircle(
      center: Offset(size.width * 0.1, size.height * 0.1 + offset1),
      radius: size.width * 0.4,
    ));
    canvas.drawPath(path1, paint);

    // Blob 2 (Bottom Right)
    final path2 = Path();
    final offset2 = math.cos(animationValue * 2 * math.pi) * 20;
    path2.addOval(Rect.fromCircle(
      center: Offset(size.width * 0.9, size.height * 0.6 + offset2),
      radius: size.width * 0.5,
    ));
    canvas.drawPath(path2, paint);
    
    // Blob 3 (Top Right - Smaller)
    final paint2 = Paint()
      ..color = AppColors.secondary.withOpacity(0.1)
      ..style = PaintingStyle.fill;
      
    final path3 = Path();
    final offset3 = math.sin((animationValue + 0.5) * 2 * math.pi) * 15;
    path3.addOval(Rect.fromCircle(
      center: Offset(size.width * 0.8, size.height * 0.15 + offset3),
      radius: size.width * 0.2,
    ));
    canvas.drawPath(path3, paint2);
  }

  @override
  bool shouldRepaint(covariant BlobPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}
