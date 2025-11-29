import 'package:flutter/material.dart';
import 'package:child_story_mobile/data/models/smart_asset.dart';

class SmartScene extends StatefulWidget {
  final SmartCharacter? character;
  final SmartBackground? background;
  final CharacterPose pose;
  final bool animateEntrance;

  const SmartScene({
    super.key,
    this.character,
    this.background,
    this.pose = CharacterPose.idle,
    this.animateEntrance = true,
  });

  @override
  State<SmartScene> createState() => _SmartSceneState();
}

class _SmartSceneState extends State<SmartScene> with TickerProviderStateMixin {
  late AnimationController _breathingController;
  late AnimationController _entranceController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _entranceScaleAnimation;
  late Animation<double> _entranceOpacityAnimation;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
  }

  void _setupAnimations() {
    // 1. Breathing Animation (Idle Loop)
    _breathingController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    );

    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.03).animate(
      CurvedAnimation(
        parent: _breathingController,
        curve: Curves.easeInOut,
      ),
    );

    if (widget.character?.breathes ?? false) {
      _breathingController.repeat(reverse: true);
    }

    // 2. Entrance Animation (Pop In)
    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _entranceScaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: Curves.elasticOut, // Bouncy entrance
      ),
    );

    _entranceOpacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entranceController,
        curve: const Interval(0.0, 0.5, curve: Curves.easeOut),
      ),
    );

    if (widget.animateEntrance) {
      _entranceController.forward();
    } else {
      _entranceController.value = 1.0;
    }
  }

  @override
  void didUpdateWidget(SmartScene oldWidget) {
    super.didUpdateWidget(oldWidget);
    
    // If character changes, replay entrance
    if (oldWidget.character?.id != widget.character?.id || 
        oldWidget.pose != widget.pose) {
      if (widget.animateEntrance) {
        _entranceController.reset();
        _entranceController.forward();
      }
    }
  }

  @override
  void dispose() {
    _breathingController.dispose();
    _entranceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Stack(
          fit: StackFit.expand,
          children: [
            // 1. Background Layer
            if (widget.background != null)
              Image.asset(
                widget.background!.assetPath,
                fit: BoxFit.cover,
                width: constraints.maxWidth,
                height: constraints.maxHeight,
                errorBuilder: (c, e, s) {
                  print('Error loading background: ${widget.background!.assetPath}');
                  return Container(color: Colors.grey[300]);
                },
              )
            else
              Container(color: Colors.white),

            // 2. Character Layer
            if (widget.character != null)
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                height: constraints.maxHeight * 0.85, // 85% of container height
                child: AnimatedBuilder(
                  animation: Listenable.merge([_breathingController, _entranceController]),
                  builder: (context, child) {
                    // Combine animations
                    double scale = widget.character!.scale;
                    
                    // Apply breathing
                    if (widget.character!.breathes) {
                      scale *= _scaleAnimation.value;
                    }

                    // Apply entrance
                    double entranceScale = _entranceScaleAnimation.value;
                    double opacity = _entranceOpacityAnimation.value;

                    return Opacity(
                      opacity: opacity,
                      child: Transform.scale(
                        scale: scale * entranceScale,
                        alignment: Alignment.bottomCenter, // Scale from feet up
                        child: Align(
                          alignment: Alignment.bottomCenter,
                          child: Image.asset(
                            widget.character!.getAssetPath(widget.pose),
                            fit: BoxFit.contain,
                            errorBuilder: (c, e, s) {
                              print('Error loading character: ${widget.character!.getAssetPath(widget.pose)}');
                              return _buildPlaceholderCharacter();
                            },
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
          ],
        );
      },
    );
  }

  Widget _buildPlaceholderCharacter() {
    return Center(
      child: Container(
        width: 200,
        height: 300,
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey[400]!),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.person, size: 64, color: Colors.grey[600]),
            SizedBox(height: 8),
            Text(
              widget.character?.name ?? 'Character',
              style: TextStyle(color: Colors.grey[600]),
            ),
            Text(
              widget.pose.name,
              style: TextStyle(color: Colors.grey[500], fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}
