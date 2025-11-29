import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/data/services/api_service.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:easy_localization/easy_localization.dart';
import 'dart:convert';
import 'dart:math' as math;

class ChildEditScreen extends StatefulWidget {
  final String childId;

  const ChildEditScreen({super.key, required this.childId});

  @override
  State<ChildEditScreen> createState() => _ChildEditScreenState();
}

class _ChildEditScreenState extends State<ChildEditScreen> with TickerProviderStateMixin {
  final _apiService = ApiService();
  late TextEditingController _nameController;
  int _age = 5;
  String _language = 'English 🇬🇧';
  List<String> _selectedInterests = [];
  String _selectedAvatar = '👩‍🚀';
  Color _themeColor = Color(0xFFE0BBE4);
  bool _languageLearningEnabled = false;
  bool _isLoading = true;
  bool _isSaving = false;

  final List<Map<String, dynamic>> _avatarOptions = [
    {'emoji': '👩‍🚀', 'color': Color(0xFFE0BBE4), 'name': 'Explorer'},
    {'emoji': '🧚‍♀️', 'color': Color(0xFFFFDFD3), 'name': 'Fairy'},
    {'emoji': '🦕', 'color': Color(0xFFB5EAD7), 'name': 'Dino Fan'},
    {'emoji': '🦁', 'color': Color(0xFFFFC3A0), 'name': 'Wild'},
    {'emoji': '🧙‍♂️', 'color': Color(0xFF957DAD), 'name': 'Wizard'},
    {'emoji': '🧜‍♀️', 'color': Color(0xFFA0E6FF), 'name': 'Mermaid'},
    {'emoji': '🐻', 'color': Color(0xFFD7B9A1), 'name': 'Bear'},
    {'emoji': '🦊', 'color': Color(0xFFFFB7B2), 'name': 'Fox'},
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

  final List<String> _languages = ['English 🇬🇧', 'Spanish 🇪🇸', 'French 🇫🇷', 'German 🇩🇪', 'Italian 🇮🇹'];

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _loadChildData();
  }

  Future<void> _loadChildData() async {
    if (widget.childId == 'add') {
      setState(() {
        _isLoading = false;
      });
      return;
    }

    try {
      final child = await _apiService.getChild(widget.childId);
      
      // Safe parsing for interests
      List<String> interests = [];
      final interestsData = child['interests'];
      if (interestsData != null) {
        if (interestsData is List) {
          interests = List<String>.from(interestsData);
        } else if (interestsData is String) {
          try {
            if (interestsData.startsWith('[')) {
              final List<dynamic> parsed = jsonDecode(interestsData);
              interests = parsed.map((e) => e.toString()).toList();
            }
          } catch (e) {
            print('Error parsing interests JSON: $e');
          }
        }
      }

      setState(() {
        _nameController.text = child['name'] ?? '';
        _age = _calculateAge(child['birthDate']);
        _selectedInterests = interests;
        _selectedAvatar = child['avatarUrl'] ?? '👩‍🚀';
        // Mock language learning state as it's not in backend yet
        _languageLearningEnabled = false; 
        
        final avatarData = _avatarOptions.firstWhere(
          (a) => a['emoji'] == _selectedAvatar,
          orElse: () => _avatarOptions[0],
        );
        _themeColor = avatarData['color'];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading child: $e');
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('child.load_failed'.tr())),
        );
      }
    }
  }

  int _calculateAge(String? birthDateStr) {
    if (birthDateStr == null) return 5;
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
      return 5;
    }
  }

  String _calculateBirthDate(int age) {
    final today = DateTime.now();
    final birthDate = DateTime(today.year - age, today.month, today.day);
    return birthDate.toIso8601String().split('T')[0];
  }

  Future<void> _saveChild() async {
    if (_nameController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('child.enter_name'.tr())),
      );
      return;
    }

    setState(() => _isSaving = true);

    final childData = {
      'name': _nameController.text,
      'birthDate': _calculateBirthDate(_age),
      'interests': jsonEncode(_selectedInterests),
      'avatarUrl': _selectedAvatar,
      // Add other fields as needed by backend
    };

    try {
      if (widget.childId == 'add') {
        await _apiService.createChild(childData);
      } else {
        await _apiService.updateChild(widget.childId, childData);
      }
      if (mounted) {
        context.pop();
      }
    } catch (e) {
      print('Error saving child: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('child.save_failed'.tr())),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }

  Future<void> _deleteChild() async {
    try {
      await _apiService.deleteChild(widget.childId);
      if (mounted) {
        context.go('/home'); // Go home after delete instead of pop to refresh
      }
    } catch (e) {
      print('Error deleting child: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('child.delete_failed'.tr())),
        );
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _updateTheme(String avatar) {
    final avatarData = _avatarOptions.firstWhere(
      (a) => a['emoji'] == avatar,
      orElse: () => _avatarOptions[0],
    );
    setState(() {
      _selectedAvatar = avatar;
      _themeColor = avatarData['color'];
    });
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

  void _showDeleteConfirmation() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Row(
          children: [
            Text('🎈', style: TextStyle(fontSize: 24)),
            SizedBox(width: 8),
            Text('child.say_goodbye'.tr()),
          ],
        ),
        content: Text(
          'child.delete_confirmation'.tr(namedArgs: {'name': _nameController.text}),
          style: TextStyle(fontSize: 16, color: AppColors.textBody),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('child.keep_hero'.tr(namedArgs: {'name': _nameController.text}), style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _deleteChild();
            },
            child: Text(
              'child.remove'.tr(),
              style: TextStyle(color: AppColors.error, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        backgroundColor: Color(0xFFFFFBF5),
        body: Center(child: CircularProgressIndicator()),
      );
    }

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
                color: _themeColor.withOpacity(0.2),
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
                      color: _themeColor.withOpacity(0.1),
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
                                'child.edit_hero'.tr(),
                                style: TextStyle(
                                  fontSize: 14,
                                  color: AppColors.textMuted,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                'child.update_profile'.tr(),
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.textDark,
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (widget.childId != 'add')
                          _buildCircularButton(
                            icon: LucideIcons.trash2,
                            onTap: _showDeleteConfirmation,
                            color: AppColors.error,
                          )
                        else
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
                          children: _avatarOptions.map((avatar) {
                            final isSelected = avatar['emoji'] == _selectedAvatar;
                            return GestureDetector(
                              onTap: () => _updateTheme(avatar['emoji']),
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

                      // 2. Hero Details Card
                      _buildSectionHeader('child.hero_name'.tr(), 'child.hero_name_desc'.tr()),
                      SizedBox(height: 16),
                      Container(
                        padding: EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: [
                            BoxShadow(
                              color: _themeColor.withOpacity(0.1),
                              blurRadius: 20,
                              offset: Offset(0, 10),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            // Name Input
                            TextField(
                              controller: _nameController,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textDark,
                              ),
                              decoration: InputDecoration(
                                labelText: 'child.hero_name'.tr(),
                                labelStyle: TextStyle(color: AppColors.textMuted),
                                prefixIcon: Icon(LucideIcons.star, color: _themeColor),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(16),
                                  borderSide: BorderSide(color: AppColors.neutral200),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(16),
                                  borderSide: BorderSide(color: AppColors.neutral200),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(16),
                                  borderSide: BorderSide(color: _themeColor),
                                ),
                              ),
                              onChanged: (_) => setState(() {}),
                            ),
                            SizedBox(height: 20),
                            
                            // Age & Language Row
                            Row(
                              children: [
                                Expanded(
                                  child: Container(
                                    padding: EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: AppColors.neutral100,
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Column(
                                      children: [
                                        Text('child.age'.tr(), style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                                        SizedBox(height: 8),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            _buildMiniCircleButton(
                                              icon: LucideIcons.minus,
                                              onTap: _age > 1 ? () => setState(() => _age--) : null,
                                            ),
                                            SizedBox(width: 12),
                                            Text(
                                              '$_age',
                                              style: TextStyle(
                                                fontSize: 24,
                                                fontWeight: FontWeight.bold,
                                                color: AppColors.textDark,
                                              ),
                                            ),
                                            SizedBox(width: 12),
                                            _buildMiniCircleButton(
                                              icon: LucideIcons.plus,
                                              onTap: _age < 18 ? () => setState(() => _age++) : null,
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                SizedBox(width: 16),
                                Expanded(
                                  child: Container(
                                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                                    decoration: BoxDecoration(
                                      color: AppColors.neutral100,
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Column(
                                      children: [
                                        Text('settings.language'.tr(), style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                                        DropdownButtonHideUnderline(
                                          child: DropdownButton<String>(
                                            value: _languages.contains(_language) ? _language : _languages[0],
                                            isDense: true,
                                            icon: Icon(LucideIcons.chevronDown, size: 16, color: AppColors.textMuted),
                                            style: TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                              color: AppColors.textDark,
                                            ),
                                            items: _languages.map((lang) {
                                              return DropdownMenuItem(value: lang, child: Text(lang));
                                            }).toList(),
                                            onChanged: (val) => setState(() => _language = val!),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),

                      SizedBox(height: 32),

                      // 3. Interests
                      _buildSectionHeader('child.interests'.tr(), 'child.interests_desc'.tr()),
                      SizedBox(height: 16),
                      ..._interestCategories.map((category) => _buildInterestCategory(category)),

                      SizedBox(height: 32),
                      _buildSectionHeader('child.language_learning'.tr(), 'child.language_learning_desc'.tr()),
                      SizedBox(height: 16),
                      Container(
                        padding: EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 10,
                              offset: Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            // Enable Toggle
                            Row(
                              children: [
                                Container(
                                  padding: EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary50,
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(color: AppColors.primary100),
                                  ),
                                  child: Text('🎓', style: TextStyle(fontSize: 24)),
                                ),
                                SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'child.enable_language_learning'.tr(),
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w700,
                                          color: AppColors.textDark,
                                        ),
                                      ),
                                      Text(
                                        'child.learn_spanish_desc'.tr(),
                                        style: TextStyle(
                                          fontSize: 13,
                                          color: AppColors.textMuted,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Switch(
                                  value: _languageLearningEnabled,
                                  onChanged: (val) {
                                    setState(() {
                                      _languageLearningEnabled = val;
                                    });
                                  },
                                  activeColor: AppColors.primary500,
                                ),
                              ],
                            ),
                            
                            if (widget.childId != 'add') ...[
                              SizedBox(height: 16),
                              Divider(),
                              SizedBox(height: 16),
                              
                              // View Word Bag Button
                              InkWell(
                                onTap: () {
                                  context.push('/word-bag/${widget.childId}');
                                },
                                borderRadius: BorderRadius.circular(12),
                                child: Container(
                                  padding: EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary50,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Row(
                                    children: [
                                      Text('🎒', style: TextStyle(fontSize: 24)),
                                      SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'child.view_word_bag'.tr(),
                                              style: TextStyle(
                                                fontSize: 15,
                                                fontWeight: FontWeight.w700,
                                                color: AppColors.primary500,
                                              ),
                                            ),
                                            Text(
                                              'child.see_learned_vocabulary'.tr(),
                                              style: TextStyle(
                                                fontSize: 12,
                                                color: AppColors.textMuted,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Icon(
                                        LucideIcons.chevronRight,
                                        color: AppColors.primary500,
                                        size: 20,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),

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
                    gradient: LinearGradient(
                      colors: [_themeColor, _themeColor.withOpacity(0.8)],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: _themeColor.withOpacity(0.4),
                        blurRadius: 16,
                        offset: Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: _isSaving ? null : _saveChild,
                      borderRadius: BorderRadius.circular(32),
                      child: Center(
                        child: _isSaving 
                          ? SizedBox(
                              width: 24, 
                              height: 24, 
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                            )
                          : Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(LucideIcons.sparkles, color: Colors.white),
                                SizedBox(width: 12),
                                Text(
                                  widget.childId == 'add' ? 'child.create_hero_button'.tr() : 'child.update_hero_button'.tr(),
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
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

  Widget _buildInterestCategory(Map<String, dynamic> category) {
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
    Color? color,
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
          color: color ?? AppColors.textDark,
        ),
      ),
    );
  }

  Widget _buildMiniCircleButton({required IconData icon, required VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          border: Border.all(color: AppColors.neutral200),
        ),
        child: Icon(
          icon,
          size: 16,
          color: onTap != null ? AppColors.textDark : AppColors.textMuted,
        ),
      ),
    );
  }
}
