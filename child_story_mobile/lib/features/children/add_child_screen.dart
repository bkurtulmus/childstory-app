import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:easy_localization/easy_localization.dart';
import 'dart:math' as math;

class AddChildScreen extends StatefulWidget {
  const AddChildScreen({super.key});

  @override
  State<AddChildScreen> createState() => _AddChildScreenState();
}

class _AddChildScreenState extends State<AddChildScreen> with TickerProviderStateMixin {
  final TextEditingController _nameController = TextEditingController();
  final List<String> _selectedInterests = [];
  late AnimationController _entranceController;
  
  // Avatar Selection
  int _selectedAvatarIndex = 0;
  final List<Map<String, dynamic>> _avatarOptions = [
    {'emoji': '👩‍🚀', 'color': Color(0xFFE0BBE4), 'name': 'Explorer'},
    {'emoji': '🧚‍♀️', 'color': Color(0xFFFFDFD3), 'name': 'Fairy'},
    {'emoji': '🦕', 'color': Color(0xFFB5EAD7), 'name': 'Dino Fan'},
    {'emoji': '🦁', 'color': Color(0xFFFFC3A0), 'name': 'Wild'},
    {'emoji': '🧙‍♂️', 'color': Color(0xFF957DAD), 'name': 'Wizard'},
    {'emoji': '🧜‍♀️', 'color': Color(0xFFA0E6FF), 'name': 'Mermaid'},
  ];

  final List<Map<String, dynamic>> _interestCategories = [
    {
      'category': 'Adventure',
      'icon': '🗺️',
      'color': Color(0xFFFFE5B4),
      'interests': ['Space 🚀', 'Pirates 🏴‍☠️', 'Exploration 🧭', 'Treasure 💎'],
    },
    {
      'category': 'Nature',
      'icon': '🌿',
      'color': Color(0xFFC1E1C1),
      'interests': ['Animals 🦁', 'Forest 🌲', 'Ocean 🌊', 'Garden 🌻'],
    },
    {
      'category': 'Fantasy',
      'icon': '✨',
      'color': Color(0xFFE6E6FA),
      'interests': ['Fairy Tales 🧚', 'Magic 🪄', 'Dragons 🐉', 'Unicorns 🦄'],
    },
    {
      'category': 'Learning',
      'icon': '📚',
      'color': Color(0xFFFFD1DC),
      'interests': ['Science 🔬', 'Numbers 🔢', 'Music 🎵', 'Art 🎨'],
    },
  ];

  @override
  void initState() {
    super.initState();
    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    )..forward();
  }

  @override
  void dispose() {
    _entranceController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  void _toggleInterest(String interest) {
    setState(() {
      if (_selectedInterests.contains(interest)) {
        _selectedInterests.remove(interest);
      } else {
        _selectedInterests.add(interest);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final selectedThemeColor = _avatarOptions[_selectedAvatarIndex]['color'] as Color;

    return Scaffold(
      backgroundColor: Color(0xFFFFFBF5), // Warm cream
      body: Stack(
        children: [
          // Decorative Background
          Positioned(
            top: -100,
            right: -50,
            child: AnimatedContainer(
              duration: Duration(milliseconds: 500),
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                color: selectedThemeColor.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
            ),
          ),

          Column(
            children: [
              // Magical Header
              Container(
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.8),
                  borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
                  boxShadow: [
                    BoxShadow(
                      color: selectedThemeColor.withOpacity(0.1),
                      blurRadius: 20,
                      offset: Offset(0, 10),
                    ),
                  ],
                ),
                child: SafeArea(
                  bottom: false,
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(16, 8, 16, 24),
                    child: Row(
                      children: [
                        _buildCircularButton(
                          icon: LucideIcons.arrowLeft,
                          onTap: () => context.pop(),
                        ),
                        Expanded(
                          child: Column(
                            children: [
                              Text(
                                'child.create_hero'.tr(),
                                style: TextStyle(
                                  fontSize: 14,
                                  color: AppColors.textMuted,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                'child.new_adventure'.tr(),
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.textDark,
                                ),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(width: 40),
                      ],
                    ),
                  ),
                ),
              ),


              // Form Content
              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.all(24),
                  physics: BouncingScrollPhysics(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. Avatar Selection
                      _buildSectionHeader('child.choose_hero'.tr(), 'child.choose_hero_desc'.tr()),
                      SizedBox(height: 20),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        physics: BouncingScrollPhysics(),
                        child: Row(
                          children: _avatarOptions.asMap().entries.map((entry) {
                            final index = entry.key;
                            final avatar = entry.value;
                            final isSelected = index == _selectedAvatarIndex;
                            return GestureDetector(
                              onTap: () => setState(() => _selectedAvatarIndex = index),
                              child: AnimatedContainer(
                                duration: Duration(milliseconds: 300),
                                margin: EdgeInsets.only(right: 16),
                                width: isSelected ? 80 : 64,
                                height: isSelected ? 80 : 64,
                                decoration: BoxDecoration(
                                  color: avatar['color'],
                                  shape: BoxShape.circle,
                                  border: isSelected 
                                      ? Border.all(color: AppColors.textDark, width: 3)
                                      : null,
                                  boxShadow: [
                                    BoxShadow(
                                      color: (avatar['color'] as Color).withOpacity(0.4),
                                      blurRadius: isSelected ? 12 : 4,
                                      offset: Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Center(
                                  child: Text(
                                    avatar['emoji'],
                                    style: TextStyle(fontSize: isSelected ? 40 : 32),
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),

                      SizedBox(height: 32),

                      // 2. Name Input
                      _buildSectionHeader('child.hero_name'.tr(), 'child.hero_name_desc'.tr()),
                      SizedBox(height: 16),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: selectedThemeColor.withOpacity(0.2),
                              blurRadius: 12,
                              offset: Offset(0, 4),
                            ),
                          ],
                        ),
                        child: TextField(
                          controller: _nameController,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textDark,
                          ),
                          decoration: InputDecoration(
                            hintText: 'child.name_placeholder'.tr(),
                            hintStyle: TextStyle(color: AppColors.textMuted.withOpacity(0.5)),
                            prefixIcon: Icon(LucideIcons.star, color: selectedThemeColor),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(20),
                              borderSide: BorderSide.none,
                            ),
                            contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                          ),
                          onChanged: (_) => setState(() {}),
                        ),
                      ),

                      SizedBox(height: 32),

                      // 3. Interests
                      _buildSectionHeader('child.interests'.tr(), 'child.interests_desc'.tr()),
                      SizedBox(height: 16),
                      ..._interestCategories.map((category) => _buildInterestCategory(category, selectedThemeColor)),

                      SizedBox(height: 100), // Spacing for bottom bar
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Bottom Action Bar
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.white.withOpacity(0.0),
                    Colors.white,
                  ],
                  stops: [0.0, 0.3],
                ),
              ),
              child: SafeArea(
                child: AnimatedContainer(
                  duration: Duration(milliseconds: 300),
                  height: 64,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(32),
                    gradient: _nameController.text.isNotEmpty
                        ? LinearGradient(
                            colors: [selectedThemeColor, selectedThemeColor.withOpacity(0.8)],
                          )
                        : LinearGradient(
                            colors: [Colors.grey.shade300, Colors.grey.shade300],
                          ),
                    boxShadow: _nameController.text.isNotEmpty
                        ? [
                            BoxShadow(
                              color: selectedThemeColor.withOpacity(0.4),
                              blurRadius: 16,
                              offset: Offset(0, 8),
                            ),
                          ]
                        : [],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: _nameController.text.isNotEmpty
                          ? () => context.pop()
                          : null,
                      borderRadius: BorderRadius.circular(32),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            LucideIcons.sparkles,
                            color: _nameController.text.isNotEmpty ? Colors.white : Colors.grey,
                          ),
                          SizedBox(width: 12),
                          Text(
                            'child.start_adventure'.tr(),
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: _nameController.text.isNotEmpty ? Colors.white : Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, String subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: AppColors.textDark,
          ),
        ),
        SizedBox(height: 4),
        Text(
          subtitle,
          style: TextStyle(
            fontSize: 14,
            color: AppColors.textMuted,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildInterestCategory(Map<String, dynamic> category, Color themeColor) {
    return Container(
      margin: EdgeInsets.only(bottom: 20),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: (category['color'] as Color).withOpacity(0.3),
          width: 2,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(category['icon'], style: TextStyle(fontSize: 24)),
              SizedBox(width: 12),
              Text(
                category['category'],
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textDark,
                ),
              ),
            ],
          ),
          SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: (category['interests'] as List<String>).map((interest) {
              final isSelected = _selectedInterests.contains(interest);
              return GestureDetector(
                onTap: () => _toggleInterest(interest),
                child: AnimatedContainer(
                  duration: Duration(milliseconds: 200),
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: isSelected ? category['color'] : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isSelected 
                          ? (category['color'] as Color).withOpacity(1) 
                          : AppColors.neutral200,
                      width: 2,
                    ),
                    boxShadow: isSelected
                        ? [
                            BoxShadow(
                              color: (category['color'] as Color).withOpacity(0.3),
                              blurRadius: 8,
                              offset: Offset(0, 2),
                            )
                          ]
                        : [],
                  ),
                  child: Text(
                    interest,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: isSelected ? AppColors.textDark : AppColors.textBody,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildCircularButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Icon(
          icon,
          size: 20,
          color: AppColors.textDark,
        ),
      ),
    );
  }
}
