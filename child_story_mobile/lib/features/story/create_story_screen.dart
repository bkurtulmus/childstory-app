import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:easy_localization/easy_localization.dart' hide TextDirection;
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/data/services/api_service.dart';
import 'package:child_story_mobile/data/services/credit_service.dart';
import 'package:child_story_mobile/data/services/ad_service.dart';
import 'package:child_story_mobile/features/credits/story_unlock_dialog.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'dart:math' as math;

class CreateStoryScreen extends StatefulWidget {
  const CreateStoryScreen({super.key});

  @override
  State<CreateStoryScreen> createState() => _CreateStoryScreenState();
}

class _CreateStoryScreenState extends State<CreateStoryScreen> with TickerProviderStateMixin {
  final _apiService = ApiService();
  List<Map<String, dynamic>> _children = [];
  bool _isLoadingChildren = true;
  String? _selectedChildId;
  final List<String> _selectedThemes = [];
  String _selectedLesson = 'create_story.lesson_sharing';
  String _selectedTone = 'create_story.tone_gentle';
  double _storyLength = 1; // 0=short, 1=medium, 2=long
  
  late AnimationController _sparkleController;

  @override
  void initState() {
    super.initState();
    _sparkleController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat();
    _loadChildren();
  }

  Future<void> _loadChildren() async {
    try {
      final children = await _apiService.getChildren();
      if (mounted) {
        setState(() {
          _children = children;
          _isLoadingChildren = false;
        });
      }
    } catch (e) {
      print('Error loading children: $e');
      if (mounted) {
        setState(() {
          _isLoadingChildren = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _sparkleController.dispose();
    super.dispose();
  }

  // Theme data with emojis and colors
  final Map<String, Map<String, dynamic>> _themeData = {
    'Bedtime': {'emoji': '🌙', 'colors': [Color(0xFF7B68EE), Color(0xFF9B7EF7)]},
    'Adventure': {'emoji': '🗺️', 'colors': [Color(0xFFFF8C42), Color(0xFFFFB347)]},
    'Friendship': {'emoji': '🤝', 'colors': [Color(0xFFF0A6CA), Color(0xFFFFB6D9)]},
    'Animals': {'emoji': '🦁', 'colors': [Color(0xFF52B788), Color(0xFF74C69D)]},
    'Space': {'emoji': '🚀', 'colors': [Color(0xFF4A5FE8), Color(0xFF7B68EE)]},
    'Fairy tales': {'emoji': '🧚', 'colors': [Color(0xFFE07BE0), Color(0xFFF0A6CA)]},
    'Mystery': {'emoji': '🔍', 'colors': [Color(0xFF6B5B95), Color(0xFF8B7AB8)]},
    'Pirates': {'emoji': '🏴‍☠️', 'colors': [Color(0xFF2C5F7C), Color(0xFF4A90A4)]},
  };

  // Lesson data with emojis
  final Map<String, Map<String, String>> _lessonData = {
    'create_story.lesson_sharing': {'emoji': '🤲', 'description': 'create_story.lesson_sharing_desc'},
    'create_story.lesson_kindness': {'emoji': '❤️', 'description': 'create_story.lesson_kindness_desc'},
    'create_story.lesson_bravery': {'emoji': '🦁', 'description': 'create_story.lesson_bravery_desc'},
    'create_story.lesson_brushing': {'emoji': '🦷', 'description': 'create_story.lesson_brushing_desc'},
    'create_story.lesson_patience': {'emoji': '⏰', 'description': 'create_story.lesson_patience_desc'},
    'create_story.lesson_tidying': {'emoji': '🧹', 'description': 'create_story.lesson_tidying_desc'},
  };

  // Tone data with emojis
  final Map<String, Map<String, dynamic>> _toneData = {
    'create_story.tone_gentle': {'emoji': '☁️', 'description': 'create_story.tone_gentle_desc', 'colors': [Color(0xFFB8D4F1), Color(0xFFD4E7F7)]},
    'create_story.tone_funny': {'emoji': '😄', 'description': 'create_story.tone_funny_desc', 'colors': [Color(0xFFFFE66D), Color(0xFFFFF4A3)]},
    'create_story.tone_magical': {'emoji': '✨', 'description': 'create_story.tone_magical_desc', 'colors': [Color(0xFFE0BBE4), Color(0xFFF4D9F7)]},
  };

  bool get _isChildComplete => _selectedChildId != null;
  bool get _isThemesComplete => _selectedThemes.isNotEmpty;
  bool get _isLessonComplete => _selectedLesson.isNotEmpty;
  bool get _isToneComplete => _selectedTone.isNotEmpty;
  bool get _isFormValid => _isChildComplete && _isThemesComplete && _isLessonComplete;

  int get _completedSteps {
    int count = 0;
    if (_isChildComplete) count++;
    if (_isThemesComplete) count++;
    if (_isLessonComplete) count++;
    if (_isToneComplete) count++;
    return count;
  }

  double get _progressPercent => (_completedSteps / 4) * 100;

  String get _lengthEmoji {
    if (_storyLength == 0) return '📖';
    if (_storyLength == 1) return '📚';
    return '📕';
  }

  String get _lengthText {
    if (_storyLength == 0) return 'create_story.quick_tale'.tr();
    if (_storyLength == 1) return 'create_story.classic_story'.tr();
    return 'create_story.epic_adventure'.tr();
  }

  String get _lengthDuration {
    if (_storyLength == 0) return 'create_story.minutes_short'.tr();
    if (_storyLength == 1) return 'create_story.minutes_medium'.tr();
    return 'create_story.minutes_long'.tr();
  }

  void _showChildSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFFFF9F0),
              Color(0xFFFFF0F5),
            ],
          ),
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: SafeArea(
          child: Padding(
            padding: EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Drag handle
                Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.neutral300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                SizedBox(height: 20),
                
                Row(
                  children: [
                    Text('👧🧒 ', style: TextStyle(fontSize: 28)),
                    Text(
                      'create_story.select_hero_title'.tr(),
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: AppColors.primary500,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                
                _isLoadingChildren
                    ? Center(child: CircularProgressIndicator())
                    : _children.isEmpty
                        ? Center(child: Text('create_story.no_heroes'.tr()))
                        : Column(
                            children: _children.map((child) => _buildChildSheetItem(child)).toList(),
                          ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildChildSheetItem(Map<String, dynamic> child) {
    final isSelected = _selectedChildId == child['id'].toString();
    Color parseColor(String? colorString) {
      if (colorString == null) return AppColors.primary500;
      final hex = colorString.replaceAll('#', '');
      return Color(int.parse('FF$hex', radix: 16));
    }
    
    return Padding(
      padding: EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          setState(() => _selectedChildId = child['id'].toString());
          Navigator.pop(context);
        },
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: isSelected
                ? LinearGradient(
                    colors: [
                      parseColor(child['avatarColor']).withOpacity(0.2),
                      parseColor(child['avatarColor']).withOpacity(0.1),
                    ],
                  )
                : null,
            color: isSelected ? null : Colors.white.withOpacity(0.7),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected ? parseColor(child['avatarColor']) : AppColors.neutral300,
              width: isSelected ? 2.5 : 1.5,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: parseColor(child['avatarColor']).withOpacity(0.3),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 3),
                ),
                child: Center(
                  child: Text(child['avatarUrl'] ?? '👶', style: TextStyle(fontSize: 28)),
                ),
              ),
              SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      child['name'] ?? 'Hero',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textDark,
                      ),
                    ),
                    Text(
                      '${_calculateAge(child['birthDate'])} ${'create_story.years_old'.tr()}',
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              if (isSelected)
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: parseColor(child['avatarColor']),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(LucideIcons.check, color: Colors.white, size: 18),
                ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final selectedChild = _children.firstWhere(
      (c) => c['id'].toString() == _selectedChildId,
      orElse: () => {},
    );
    final hasSelectedChild = selectedChild.isNotEmpty;

    return Scaffold(
      backgroundColor: Color(0xFFFFFBF5),
      body: Column(
        children: [
          // Magical Header
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFFFFF9F0),
                  Color(0xFFFFF5EB),
                ],
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary500.withOpacity(0.08),
                  blurRadius: 16,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: SafeArea(
              bottom: false,
              child: Column(
                children: [
                  // Header Row
                  Padding(
                    padding: EdgeInsets.fromLTRB(16, 16, 16, 16),
                    child: Row(
                      children: [
                        GestureDetector(
                          onTap: () {
                            if (context.canPop()) {
                              context.pop();
                            } else {
                              context.go('/home');
                            }
                          },
                          child: Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.8),
                              borderRadius: BorderRadius.circular(14),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.05),
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
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Row(
                                children: [
                                  Text('✨ ', style: TextStyle(fontSize: 20)),
                                  Flexible(
                                    child: Text(
                                      'create_story.header_title'.tr(),
                                      style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.primary500,
                                        letterSpacing: -0.5,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                'create_story.step_progress'.tr().replaceAll('{}', '$_completedSteps'),
                                style: TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  // Magical Progress Bar
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20),
                    child: Container(
                      height: 8,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: FractionallySizedBox(
                        alignment: Alignment.centerLeft,
                        widthFactor: _progressPercent / 100,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [AppColors.accent500, AppColors.primary500],
                            ),
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                ],
              ),
            ),
          ),

          // Scrollable Content
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.only(bottom: 96),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 20),
                  
                  // Child Selection
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildMagicalSectionHeader(
                          '👧🧒',
                          'create_story.select_hero_title'.tr(),
                          1,
                          _isChildComplete,
                        ),
                        SizedBox(height: 12),
                        
                        InkWell(
                          onTap: _showChildSheet,
                          borderRadius: BorderRadius.circular(24),
                          child: Container(
                            padding: EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              gradient: hasSelectedChild
                                  ? LinearGradient(
                                      colors: [
                                        Color(0xFFFFF0F5),
                                        Color(0xFFFFF9F0),
                                      ],
                                    )
                                  : null,
                              color: !hasSelectedChild ? Colors.white : null,
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: hasSelectedChild
                                    ? AppColors.primary500.withOpacity(0.3)
                                    : AppColors.neutral300,
                                width: 2,
                              ),
                              boxShadow: hasSelectedChild
                                  ? [
                                      BoxShadow(
                                        color: AppColors.primary500.withOpacity(0.15),
                                        blurRadius: 12,
                                        offset: Offset(0, 4),
                                      ),
                                    ]
                                  : null,
                            ),
                            child: hasSelectedChild
                                ? Row(
                                    children: [
                                      Container(
                                        width: 56,
                                        height: 56,
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            colors: [
                                              AppColors.primary500,
                                              AppColors.enchant500,
                                            ],
                                          ),
                                          shape: BoxShape.circle,
                                        ),
                                        child: Center(
                                          child: Text(
                                            selectedChild['avatarUrl'] ?? '👶',
                                            style: TextStyle(fontSize: 28),
                                          ),
                                        ),
                                      ),
                                      SizedBox(width: 16),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              selectedChild['name'] ?? 'Hero',
                                              style: TextStyle(
                                                fontSize: 17,
                                                fontWeight: FontWeight.w700,
                                                color: AppColors.textDark,
                                              ),
                                            ),
                                            Text(
                                              '${_calculateAge(selectedChild['birthDate'])} ${'create_story.years_old'.tr()}',
                                              style: TextStyle(
                                                fontSize: 14,
                                                color: AppColors.textMuted,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Container(
                                        width: 32,
                                        height: 32,
                                        decoration: BoxDecoration(
                                          color: AppColors.primary500,
                                          shape: BoxShape.circle,
                                        ),
                                        child: Icon(
                                          LucideIcons.check,
                                          color: Colors.white,
                                          size: 18,
                                        ),
                                      ),
                                    ],
                                  )
                                : Center(
                                    child: Column(
                                      children: [
                                        Text('👆', style: TextStyle(fontSize: 32)),
                                        SizedBox(height: 8),
                                        Text(
                                          'create_story.tap_to_choose'.tr(),
                                          style: TextStyle(
                                            fontSize: 15,
                                            fontWeight: FontWeight.w600,
                                            color: AppColors.textMuted,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 28),

                  // Themes Selection
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildMagicalSectionHeader(
                          '🌍',
                          'create_story.select_themes_title'.tr(),
                          2,
                          _isThemesComplete,
                        ),
                        SizedBox(height: 12),
                        
                        Wrap(
                          spacing: 10,
                          runSpacing: 10,
                          children: _themeData.entries.map((entry) {
                            final theme = entry.key;
                            final data = entry.value;
                            final isSelected = _selectedThemes.contains(theme);
                            
                            return InkWell(
                              onTap: () {
                                setState(() {
                                  if (isSelected) {
                                    _selectedThemes.remove(theme);
                                  } else {
                                    _selectedThemes.add(theme);
                                  }
                                });
                              },
                              borderRadius: BorderRadius.circular(20),
                              child: Container(
                                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                decoration: BoxDecoration(
                                  gradient: isSelected
                                      ? LinearGradient(colors: data['colors'])
                                      : null,
                                  color: isSelected ? null : Colors.white,
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: isSelected
                                        ? Colors.transparent
                                        : AppColors.neutral300,
                                    width: 2,
                                  ),
                                  boxShadow: isSelected
                                      ? [
                                          BoxShadow(
                                            color: data['colors'][0].withOpacity(0.3),
                                            blurRadius: 8,
                                            offset: Offset(0, 4),
                                          ),
                                        ]
                                      : null,
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(data['emoji'], style: TextStyle(fontSize: 20)),
                                    SizedBox(width: 8),
                                    Text(
                                      theme,
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                        color: isSelected ? Colors.white : AppColors.textDark,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                        
                        if (_selectedThemes.isNotEmpty) ...[
                          SizedBox(height: 12),
                          Container(
                            padding: EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  AppColors.accent500.withOpacity(0.2),
                                  AppColors.primary500.withOpacity(0.1),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text('✨', style: TextStyle(fontSize: 16)),
                                SizedBox(width: 8),
                                Text(
                                  'create_story.themes_chosen'.tr()
                                    .replaceFirst('{}', '${_selectedThemes.length}')
                                    .replaceFirst('{}', _selectedThemes.length == 1 ? 'create_story.world_singular'.tr() : 'create_story.world_plural'.tr()),
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.primary500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  SizedBox(height: 28),

                  // Lesson Selection
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildMagicalSectionHeader(
                          '💝',
                          'create_story.select_lesson_title'.tr(),
                          3,
                          _isLessonComplete,
                        ),
                        SizedBox(height: 12),
                        
                        ..._lessonData.entries.map((entry) {
                          final lesson = entry.key;
                          final data = entry.value;
                          final isSelected = _selectedLesson == lesson;
                          
                          return Padding(
                            padding: EdgeInsets.only(bottom: 10),
                            child: InkWell(
                              onTap: () => setState(() => _selectedLesson = lesson),
                              borderRadius: BorderRadius.circular(20),
                              child: Container(
                                padding: EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  gradient: isSelected
                                      ? LinearGradient(
                                          colors: [
                                            Color(0xFFFFF0F5),
                                            Color(0xFFFFF9F0),
                                          ],
                                        )
                                      : null,
                                  color: isSelected ? null : Colors.white,
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: isSelected
                                        ? AppColors.accent500.withOpacity(0.5)
                                        : AppColors.neutral300,
                                    width: 2,
                                  ),
                                  boxShadow: isSelected
                                      ? [
                                          BoxShadow(
                                            color: AppColors.accent500.withOpacity(0.2),
                                            blurRadius: 12,
                                            offset: Offset(0, 4),
                                          ),
                                        ]
                                      : null,
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 48,
                                      height: 48,
                                      decoration: BoxDecoration(
                                        color: isSelected
                                            ? AppColors.accent500.withOpacity(0.2)
                                            : AppColors.neutral100,
                                        shape: BoxShape.circle,
                                      ),
                                      child: Center(
                                        child: Text(data['emoji']!, style: TextStyle(fontSize: 24)),
                                      ),
                                    ),
                                    SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            lesson.tr(),
                                            style: TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.w700,
                                              color: AppColors.textDark,
                                            ),
                                          ),
                                          SizedBox(height: 2),
                                          Text(
                                            data['description']!.tr(),
                                            style: TextStyle(
                                              fontSize: 13,
                                              color: AppColors.textMuted,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    if (isSelected)
                                      Container(
                                        width: 28,
                                        height: 28,
                                        decoration: BoxDecoration(
                                          color: AppColors.accent500,
                                          shape: BoxShape.circle,
                                        ),
                                        child: Icon(
                                          LucideIcons.check,
                                          color: Colors.white,
                                          size: 16,
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ],
                    ),
                  ),
                  SizedBox(height: 28),

                  // Tone Selection
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildMagicalSectionHeader(
                          '🎭',
                          'create_story.select_tone_title'.tr(),
                          4,
                          _isToneComplete,
                        ),
                        SizedBox(height: 12),
                        
                        ..._toneData.entries.map((entry) {
                          final tone = entry.key;
                          final data = entry.value;
                          final isSelected = _selectedTone == tone;
                          
                          return Padding(
                            padding: EdgeInsets.only(bottom: 10),
                            child: InkWell(
                              onTap: () => setState(() => _selectedTone = tone),
                              borderRadius: BorderRadius.circular(20),
                              child: Container(
                                padding: EdgeInsets.all(18),
                                decoration: BoxDecoration(
                                  gradient: isSelected
                                      ? LinearGradient(colors: data['colors'])
                                      : null,
                                  color: isSelected ? null : Colors.white,
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: isSelected
                                        ? Colors.transparent
                                        : AppColors.neutral300,
                                    width: 2,
                                  ),
                                  boxShadow: isSelected
                                      ? [
                                          BoxShadow(
                                            color: data['colors'][0].withOpacity(0.3),
                                            blurRadius: 12,
                                            offset: Offset(0, 4),
                                          ),
                                        ]
                                      : null,
                                ),
                                child: Row(
                                  children: [
                                    Text(data['emoji'], style: TextStyle(fontSize: 32)),
                                    SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            tone.tr(),
                                            style: TextStyle(
                                              fontSize: 17,
                                              fontWeight: FontWeight.w700,
                                              color: isSelected ? Colors.white : AppColors.textDark,
                                            ),
                                          ),
                                          Text(
                                            (data['description'] as String).tr(),
                                            style: TextStyle(
                                              fontSize: 13,
                                              color: isSelected
                                                  ? Colors.white.withOpacity(0.9)
                                                  : AppColors.textMuted,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    if (isSelected)
                                      Icon(
                                        LucideIcons.check,
                                        color: Colors.white,
                                        size: 24,
                                      ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ],
                    ),
                  ),
                  SizedBox(height: 28),

                  // Story Length
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text('📏 ', style: TextStyle(fontSize: 24)),
                            Text(
                              'create_story.select_length_title'.tr(),
                              style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textDark,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 20),
                        
                        Row(
                          children: [
                            Expanded(child: _buildLengthCard(0, '📖', 'create_story.quick_tale'.tr(), 'create_story.minutes_short'.tr())),
                            SizedBox(width: 12),
                            Expanded(child: _buildLengthCard(1, '📚', 'create_story.classic_story'.tr(), 'create_story.minutes_medium'.tr())),
                            SizedBox(width: 12),
                            Expanded(child: _buildLengthCard(2, '📕', 'create_story.epic_adventure'.tr(), 'create_story.minutes_long'.tr())),
                          ],
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 20),
                ],
              ),
            ),
          ),

          // Magical Bottom CTA
          Container(
            padding: EdgeInsets.fromLTRB(20, 16, 20, 24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xFFFFFBF5).withOpacity(0),
                  Color(0xFFFFFBF5),
                ],
              ),
            ),
            child: SafeArea(
              top: false,
              child: AnimatedBuilder(
                animation: _sparkleController,
                builder: (context, child) {
                  return Container(
                    height: 60,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: _isFormValid
                            ? [Color(0xFF9B7EF7), Color(0xFF7DB6F8)]
                            : [AppColors.neutral300, AppColors.neutral300],
                      ),
                      borderRadius: BorderRadius.circular(30),
                      boxShadow: _isFormValid
                          ? [
                              BoxShadow(
                                color: AppColors.primary500.withOpacity(0.4),
                                blurRadius: 20,
                                offset: Offset(0, 8),
                              ),
                            ]
                          : null,
                    ),
                    child: ElevatedButton(
                      onPressed: _isFormValid ? _checkAccessAndProceed : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        foregroundColor: Colors.white,
                        shadowColor: Colors.transparent,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (_isFormValid)
                            Transform.rotate(
                              angle: math.sin(_sparkleController.value * 2 * math.pi) * 0.1,
                              child: Text('✨', style: TextStyle(fontSize: 24)),
                            ),
                          if (_isFormValid) SizedBox(width: 12),
                          Text(
                            _isFormValid ? 'create_story.create_button'.tr() : 'create_story.complete_steps'.tr(),
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w700,
                              letterSpacing: -0.3,
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

  Widget _buildMagicalSectionHeader(String emoji, String title, int stepNumber, bool isComplete) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            gradient: isComplete
                ? LinearGradient(
                    colors: [AppColors.accent500, AppColors.primary500],
                  )
                : null,
            color: isComplete ? null : Colors.white,
            shape: BoxShape.circle,
            border: Border.all(
              color: isComplete ? Colors.transparent : AppColors.neutral300,
              width: 2,
            ),
          ),
          child: Center(
            child: isComplete
                ? Icon(LucideIcons.check, size: 16, color: Colors.white)
                : Text(
                    '$stepNumber',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textMuted,
                    ),
                  ),
          ),
        ),
        SizedBox(width: 12),
        Text(emoji, style: TextStyle(fontSize: 24)),
        SizedBox(width: 8),
        Flexible(
          child: Text(
            title,
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: AppColors.textDark,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  Widget _buildLengthCard(int value, String emoji, String title, String duration) {
    final isSelected = _storyLength.round() == value;
    
    return InkWell(
      onTap: () => setState(() => _storyLength = value.toDouble()),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: isSelected
              ? LinearGradient(
                  colors: [
                    AppColors.primary500.withOpacity(0.2),
                    AppColors.accent500.withOpacity(0.1),
                  ],
                )
              : null,
          color: isSelected ? null : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.primary500 : AppColors.neutral300,
            width: 2,
          ),
        ),
        child: Column(
          children: [
            Text(emoji, style: TextStyle(fontSize: 32)),
            SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: isSelected ? AppColors.primary500 : AppColors.textDark,
              ),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            SizedBox(height: 4),
            Text(
              duration,
              style: TextStyle(
                fontSize: 11,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }

  int _calculateAge(String? birthDateStr) {
    if (birthDateStr == null) return 0;
    try {
      final birthDate = DateTime.parse(birthDateStr);
      final today = DateTime.now();
      int age = today.year - birthDate.year;
      if (today.month < birthDate.month || 
          (today.month == birthDate.month && today.day < birthDate.day)) {
        age--;
      }
      return age;
    } catch (e) {
      return 0;
    }
  }

  Future<void> _checkAccessAndProceed() async {
    // Show loading indicator if needed, or just proceed
    // For now, we'll assume the button shows loading state if we set a flag
    
    // 1. Check access via API (simulated for now as we need to add the endpoint to ApiService)
    // In a real implementation, we would call:
    // final status = await _apiService.checkStoryAccess();
    
    // Simulating the check for MVP demonstration:
    // We'll use a local check or call a new method we'll add to ApiService
    // Let's assume we added checkStoryAccess to ApiService.
    
    try {
      // TODO: Implement checkStoryAccess in ApiService
      // final status = await _apiService.checkStoryAccess();
      // For now, we'll simulate a "NEEDS_CREDITS" response if we want to test the dialog
      // Or "FREE_AVAILABLE" if we want to proceed.
      
      // Let's use a mock implementation for now until we update ApiService
      final hasAccess = true; // Change to false to test dialog
      
      if (hasAccess) {
        // Show interstitial ad (mandatory for free tier)
        await AdService().showInterstitialAd();
        
        if (mounted) {
          context.push('/story/result');
        }
      } else {
        if (mounted) {
          showDialog(
            context: context,
            builder: (context) => StoryUnlockDialog(
              onUnlocked: () {
                // When unlocked, proceed to result
                context.push('/story/result');
              },
            ),
          );
        }
      }
    } catch (e) {
      print('Error checking access: $e');
      // Fallback to allowing it or showing error
      context.push('/story/result');
    }
  }
}
