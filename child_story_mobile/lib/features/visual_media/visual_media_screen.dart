import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/widgets/common/buttons.dart';
import 'package:lucide_icons/lucide_icons.dart';

class VisualMediaScreen extends StatefulWidget {
  const VisualMediaScreen({super.key});

  @override
  State<VisualMediaScreen> createState() => _VisualMediaScreenState();
}

class _VisualMediaScreenState extends State<VisualMediaScreen> {
  double _bgMusicVolume = 0.5;
  double _narrationSpeed = 1.0;
  bool _isSleepMode = false;
  String _selectedVisualTheme = 'Watercolor';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.neutral50,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(LucideIcons.arrowLeft, color: AppColors.textDark),
          onPressed: () => context.pop(),
        ),
        title: Row(
          children: [
            Icon(LucideIcons.palette, size: 20, color: AppColors.secondary500),
            const SizedBox(width: 8),
            Text(
              'Visual & Media Studio',
              style: TextStyle(
                color: AppColors.textDark,
                fontWeight: FontWeight.w600,
                fontSize: 18,
              ),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Container(
            color: AppColors.neutral200,
            height: 1,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Parametric Visual Engine
            _buildSectionHeader('PARAMETRIC VISUAL ENGINE', LucideIcons.layers),
            SizedBox(height: 16),
            
            Container(
              padding: EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: AppShadows.elevation1,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Layer Composition System',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textDark,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Visual Layer Preview
                  Container(
                    height: 200,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.neutral200),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Stack(
                        children: [
                          // Background Layer
                          Positioned.fill(
                            child: Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [Color(0xFFE0F2FE), Color(0xFFBAE6FD)],
                                ),
                              ),
                              child: Center(
                                child: Icon(LucideIcons.cloud, size: 100, color: Colors.white.withOpacity(0.5)),
                              ),
                            ),
                          ),
                          // Middle Layer (Objects)
                          Positioned(
                            bottom: 20,
                            right: 40,
                            child: Icon(LucideIcons.trees, size: 80, color: Color(0xFF059669)),
                          ),
                          // Foreground Layer (Character)
                          Positioned(
                            bottom: 20,
                            left: 40,
                            child: Icon(LucideIcons.cat, size: 60, color: AppColors.primary500),
                          ),
                          // Layer Labels
                          Positioned(
                            top: 12,
                            left: 12,
                            child: _buildLayerBadge('Background: Sky'),
                          ),
                          Positioned(
                            bottom: 12,
                            right: 12,
                            child: _buildLayerBadge('Object: Forest'),
                          ),
                          Positioned(
                            bottom: 80,
                            left: 12,
                            child: _buildLayerBadge('Character: Luna'),
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  SizedBox(height: 24),
                  
                  // Style Selector
                  Text(
                    'Art Style',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(height: 12),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildStyleChip('Watercolor', LucideIcons.brush),
                        const SizedBox(width: 8),
                        _buildStyleChip('Vector Art', LucideIcons.penTool),
                        const SizedBox(width: 8),
                        _buildStyleChip('3D Render', LucideIcons.box),
                        const SizedBox(width: 8),
                        _buildStyleChip('Pixel Art', LucideIcons.grid),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: 32),

            // Audio & TTS
            _buildSectionHeader('SMART AUDIO ENGINE', LucideIcons.music),
            SizedBox(height: 16),
            
            Container(
              padding: EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: AppShadows.elevation1,
              ),
              child: Column(
                children: [
                  _buildAudioControl(
                    'Background Music',
                    'Adaptive to story mood',
                    LucideIcons.music,
                    _bgMusicVolume,
                    (val) => setState(() => _bgMusicVolume = val),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 24),
                    child: Divider(height: 1, color: AppColors.neutral200),
                  ),
                  _buildAudioControl(
                    'Narration Speed',
                    'Natural TTS voice',
                    LucideIcons.mic,
                    _narrationSpeed,
                    (val) => setState(() => _narrationSpeed = val),
                    min: 0.5,
                    max: 2.0,
                  ),
                ],
              ),
            ),

            SizedBox(height: 32),

            // Sleep Assistant
            _buildSectionHeader('SLEEP ASSISTANT', LucideIcons.moon),
            SizedBox(height: 16),
            
            Container(
              padding: EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF4C1D95), Color(0xFF8B5CF6)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: AppShadows.elevation2,
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(LucideIcons.moon, color: Colors.white, size: 24),
                          ),
                          const SizedBox(width: 16),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Smart Sleep Mode',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                              ),
                              Text(
                                'Gradual slowdown & dimming',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.white.withOpacity(0.8),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Switch(
                        value: _isSleepMode,
                        onChanged: (val) => setState(() => _isSleepMode = val),
                        activeColor: Colors.white,
                        activeTrackColor: Colors.white.withOpacity(0.4),
                        inactiveThumbColor: Colors.white.withOpacity(0.8),
                        inactiveTrackColor: Colors.transparent,
                      ),
                    ],
                  ),
                  
                  if (_isSleepMode) ...[
                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        children: [
                          Icon(LucideIcons.volume1, color: Colors.white.withOpacity(0.8), size: 20),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Audio will fade out over 15 minutes',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.9),
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppColors.textMuted),
        const SizedBox(width: 8),
        Text(
          title,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: AppColors.textMuted,
            letterSpacing: 1.2,
          ),
        ),
      ],
    );
  }

  Widget _buildLayerBadge(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.6),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: Colors.white.withOpacity(0.2), width: 0.5),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: Colors.white,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildStyleChip(String label, IconData icon) {
    final isSelected = _selectedVisualTheme == label;
    return GestureDetector(
      onTap: () => setState(() => _selectedVisualTheme = label),
      child: AnimatedContainer(
        duration: Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary500 : Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.pill),
          border: Border.all(
            color: isSelected ? AppColors.primary500 : AppColors.neutral200,
          ),
          boxShadow: isSelected ? AppShadows.elevationColored : [],
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected ? Colors.white : AppColors.textMuted,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : AppColors.textDark,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAudioControl(
    String title,
    String subtitle,
    IconData icon,
    double value,
    Function(double) onChanged, {
    double min = 0.0,
    double max = 1.0,
  }) {
    return Column(
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.primary50.withOpacity(0.5),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: AppColors.primary500, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textDark,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            SizedBox(
              width: 40,
              child: Text(
                '${(value * 100).toInt()}%',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary500,
                  fontSize: 13,
                ),
              ),
            ),
            Expanded(
              child: SliderTheme(
                data: SliderThemeData(
                  activeTrackColor: AppColors.primary500,
                  inactiveTrackColor: AppColors.neutral200,
                  thumbColor: AppColors.primary500,
                  overlayColor: AppColors.primary500.withOpacity(0.1),
                  trackHeight: 6,
                  thumbShape: RoundSliderThumbShape(enabledThumbRadius: 8),
                  overlayShape: RoundSliderOverlayShape(overlayRadius: 16),
                ),
                child: Slider(
                  value: value,
                  min: min,
                  max: max,
                  onChanged: onChanged,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
