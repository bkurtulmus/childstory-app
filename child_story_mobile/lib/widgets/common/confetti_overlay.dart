import 'dart:math';
import 'package:flutter/material.dart';

class ConfettiOverlay extends StatefulWidget {
  final Widget child;
  final bool isPlaying;
  final Duration duration;

  const ConfettiOverlay({
    super.key,
    required this.child,
    this.isPlaying = false,
    this.duration = const Duration(seconds: 3),
  });

  @override
  State<ConfettiOverlay> createState() => _ConfettiOverlayState();
}

class _ConfettiOverlayState extends State<ConfettiOverlay> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<_ConfettiParticle> _particles = [];
  final Random _random = Random();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);
    _controller.addListener(() {
      setState(() {
        for (var particle in _particles) {
          particle.update();
        }
      });
    });

    if (widget.isPlaying) {
      _startConfetti();
    }
  }

  @override
  void didUpdateWidget(ConfettiOverlay oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isPlaying && !oldWidget.isPlaying) {
      _startConfetti();
    }
  }

  void _startConfetti() {
    _particles.clear();
    for (int i = 0; i < 50; i++) {
      _particles.add(_ConfettiParticle(_random));
    }
    _controller.forward(from: 0);
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
        widget.child,
        if (_controller.isAnimating)
          IgnorePointer(
            child: CustomPaint(
              painter: _ConfettiPainter(_particles),
              size: Size.infinite,
            ),
          ),
      ],
    );
  }
}

class _ConfettiParticle {
  late double x;
  late double y;
  late double size;
  late Color color;
  late double speedY;
  late double speedX;
  late double rotation;
  late double rotationSpeed;

  _ConfettiParticle(Random random) {
    x = random.nextDouble(); // 0.0 to 1.0
    y = -0.1 - random.nextDouble() * 0.5; // Start above screen
    size = 5 + random.nextDouble() * 10;
    color = [
      Colors.red,
      Colors.blue,
      Colors.green,
      Colors.yellow,
      Colors.purple,
      Colors.orange,
    ][random.nextInt(6)];
    speedY = 0.005 + random.nextDouble() * 0.01;
    speedX = (random.nextDouble() - 0.5) * 0.005;
    rotation = random.nextDouble() * pi * 2;
    rotationSpeed = (random.nextDouble() - 0.5) * 0.2;
  }

  void update() {
    y += speedY;
    x += speedX;
    rotation += rotationSpeed;
    speedY += 0.0001; // Gravity
  }
}

class _ConfettiPainter extends CustomPainter {
  final List<_ConfettiParticle> particles;

  _ConfettiPainter(this.particles);

  @override
  void paint(Canvas canvas, Size size) {
    for (var particle in particles) {
      final paint = Paint()..color = particle.color;
      final dx = particle.x * size.width;
      final dy = particle.y * size.height;

      canvas.save();
      canvas.translate(dx, dy);
      canvas.rotate(particle.rotation);
      canvas.drawRect(
        Rect.fromCenter(center: Offset.zero, width: particle.size, height: particle.size * 0.6),
        paint,
      );
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
