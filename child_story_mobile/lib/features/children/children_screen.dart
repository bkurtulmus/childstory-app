import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/data/services/api_service.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:easy_localization/easy_localization.dart';
import 'dart:convert';
import 'dart:math' as math;

class ChildrenScreen extends StatefulWidget {
  const ChildrenScreen({super.key});

  @override
  State<ChildrenScreen> createState() => _ChildrenScreenState();
}

class _ChildrenScreenState extends State<ChildrenScreen> with TickerProviderStateMixin {
  bool _showSearch = false;
  String _searchQuery = '';
  late AnimationController _entranceController;
  final _apiService = ApiService();
  bool _isLoading = true;

  List<Map<String, dynamic>> _children = [];

  @override
  void initState() {
    super.initState();
    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    )..forward();
    _loadChildren();
  }

  Future<void> _loadChildren() async {
    try {
      final children = await _apiService.getChildren();
      setState(() {
        _children = children;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading children: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _entranceController.dispose();
    super.dispose();
  }

  void _showActionsSheet(String childId, String name, Color themeColor) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          boxShadow: [
            BoxShadow(
              color: themeColor.withOpacity(0.2),
              blurRadius: 20,
              offset: Offset(0, -5),
            ),
          ],
        ),
        padding: EdgeInsets.fromLTRB(24, 24, 24, MediaQuery.of(context).viewInsets.bottom + 24),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.neutral200,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              SizedBox(height: 24),
              Text(
                'child.magic_actions_for'.tr(args: [name]),
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textDark,
                ),
              ),
              SizedBox(height: 24),
              _buildMagicalActionItem(
                icon: LucideIcons.pencil,
                label: 'child.edit_profile'.tr(),
                description: 'child.edit_profile_desc'.tr(),
                color: themeColor,
                onTap: () async {
                  Navigator.pop(context);
                  await context.push('/children/edit/$childId');
                  _loadChildren();
                },
              ),
              SizedBox(height: 12),
              _buildMagicalActionItem(
                icon: LucideIcons.palette,
                label: 'Change Theme',
                description: 'Pick new magical colors',
                color: AppColors.secondary500,
                onTap: () {
                  Navigator.pop(context);
                },
              ),
              SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMagicalActionItem({
    required IconData icon,
    required String label,
    required String description,
    required Color color,
    required VoidCallback onTap,
    bool isDestructive = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDestructive ? AppColors.error.withOpacity(0.05) : color.withOpacity(0.05),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isDestructive ? AppColors.error.withOpacity(0.2) : color.withOpacity(0.2),
            width: 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: isDestructive ? AppColors.error.withOpacity(0.1) : color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: color,
                    ),
                  ),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            Icon(LucideIcons.chevronRight, color: color.withOpacity(0.5), size: 20),
          ],
        ),
      ),
    );
  }

  void _showDeleteConfirm(String childId, String name) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Row(
          children: [
            Text('🎈', style: TextStyle(fontSize: 24)),
            SizedBox(width: 8),
            Text('Say Goodbye?'),
          ],
        ),
        content: Text(
          'Are you sure you want to remove $name from the story heroes? Their magical adventures will disappear too!',
          style: TextStyle(fontSize: 16, color: AppColors.textBody),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Keep $name', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _deleteChild(childId);
            },
            child: Text(
              'Remove',
              style: TextStyle(color: AppColors.error, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _deleteChild(String childId) async {
    try {
      await _apiService.deleteChild(childId);
      _loadChildren();
    } catch (e) {
      print('Error deleting child: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete hero')),
        );
      }
    }
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

  List<Color> _getThemeColors(String avatar) {
    // Simple mapping based on avatar or random
    // This could be enhanced to match the logic in ChildEditScreen
    return [Color(0xFFE0BBE4), Color(0xFF957DAD)]; // Default purple theme
  }

  @override
  Widget build(BuildContext context) {
    final filteredChildren = _children.where((child) {
      if (_searchQuery.isEmpty) return true;
      return (child['name'] ?? '').toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    return Scaffold(
      backgroundColor: Color(0xFFFFFBF5), // Warm cream background
      body: Stack(
        children: [
          // Decorative Background Elements
          Positioned(top: -100, right: -100, child: _buildDecorativeCircle(300, AppColors.primary500.withOpacity(0.05))),
          Positioned(top: 100, left: -50, child: _buildDecorativeCircle(200, AppColors.accent500.withOpacity(0.05))),

          Column(
            children: [
              // Magical Header
              Container(
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.8),
                  borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary500.withOpacity(0.05),
                      blurRadius: 20,
                      offset: Offset(0, 10),
                    ),
                  ],
                ),
                child: SafeArea(
                  bottom: false,
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(20, 10, 20, 24),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildCircularButton(
                              icon: LucideIcons.arrowLeft,
                              onTap: () => context.pop(),
                            ),
                            Row(
                              children: [
                                Text('🏰 ', style: TextStyle(fontSize: 24)),
                                Text(
                                  'Hall of Heroes',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.textDark,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                              ],
                            ),
                            _buildCircularButton(
                              icon: _showSearch ? LucideIcons.x : LucideIcons.search,
                              onTap: () => setState(() => _showSearch = !_showSearch),
                              isActive: _showSearch,
                            ),
                          ],
                        ),
                        if (_showSearch) ...[
                          SizedBox(height: 20),
                          Container(
                            padding: EdgeInsets.symmetric(horizontal: 16),
                            decoration: BoxDecoration(
                              color: AppColors.neutral100,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppColors.neutral200),
                            ),
                            child: TextField(
                              onChanged: (value) => setState(() => _searchQuery = value),
                              decoration: InputDecoration(
                                hintText: 'Find a hero...',
                                border: InputBorder.none,
                                icon: Icon(LucideIcons.search, color: AppColors.textMuted),
                                hintStyle: TextStyle(color: AppColors.textMuted),
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ),

              // Children List
              Expanded(
                child: _isLoading 
                    ? Center(child: CircularProgressIndicator())
                    : filteredChildren.isEmpty && _children.isEmpty
                        ? _buildEmptyState()
                    : ListView(
                        padding: EdgeInsets.fromLTRB(20, 24, 20, 100),
                        physics: BouncingScrollPhysics(),
                        children: [
                          ...filteredChildren.asMap().entries.map((entry) {
                            final index = entry.key;
                            final child = entry.value;
                            return SlideTransition(
                              position: Tween<Offset>(
                                begin: Offset(0, 0.2),
                                end: Offset.zero,
                              ).animate(CurvedAnimation(
                                parent: _entranceController,
                                curve: Interval(
                                  index * 0.1,
                                  1.0,
                                  curve: Curves.easeOutCubic,
                                ),
                              )),
                              child: FadeTransition(
                                opacity: CurvedAnimation(
                                  parent: _entranceController,
                                  curve: Interval(index * 0.1, 1.0, curve: Curves.easeOut),
                                ),
                                child: _buildHeroCard(child),
                              ),
                            );
                          }),
                          SizedBox(height: 20),
                          SlideTransition(
                            position: Tween<Offset>(
                              begin: Offset(0, 0.2),
                              end: Offset.zero,
                            ).animate(CurvedAnimation(
                              parent: _entranceController,
                              curve: Interval(
                                filteredChildren.length * 0.1,
                                1.0,
                                curve: Curves.easeOutCubic,
                              ),
                            )),
                            child: FadeTransition(
                              opacity: CurvedAnimation(
                                parent: _entranceController,
                                curve: Interval(filteredChildren.length * 0.1, 1.0, curve: Curves.easeOut),
                              ),
                              child: _buildAddHeroCard(),
                            ),
                          ),
                        ],
                      ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 160,
              height: 160,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary500.withOpacity(0.1),
                    blurRadius: 30,
                    spreadRadius: 10,
                  ),
                ],
              ),
              child: Center(
                child: Text('🏰', style: TextStyle(fontSize: 80)),
              ),
            ),
            SizedBox(height: 32),
            Text(
              'The Hall is Empty!',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: AppColors.textDark,
              ),
            ),
            SizedBox(height: 12),
            Text(
              'Let\'s make room for our story heroes!\nHow about adding your first little adventurer?',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: AppColors.textBody,
                height: 1.5,
              ),
            ),
            SizedBox(height: 32),
            _buildAddHeroCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroCard(Map<String, dynamic> child) {
    final List<Color> colors = _getThemeColors(child['avatarUrl'] ?? '👶');
    final age = _calculateAge(child['birthDate']);
    final avatar = child['avatarUrl'] ?? '👶';
    
    // Parse interests safely
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
          // ignore
        }
      }
    }
    
    return GestureDetector(
      onTap: () {},
      child: Container(
        margin: EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              colors[0].withOpacity(0.2),
              colors[1].withOpacity(0.1),
            ],
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: colors[0].withOpacity(0.3),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: colors[0].withOpacity(0.1),
              blurRadius: 12,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Row(
            children: [
              // Hero Avatar
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: colors,
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: colors[0].withOpacity(0.3),
                      blurRadius: 8,
                      offset: Offset(0, 4),
                    ),
                  ],
                  border: Border.all(color: Colors.white, width: 3),
                ),
                child: Center(
                  child: Text(
                    avatar,
                    style: TextStyle(fontSize: 32),
                  ),
                ),
              ),
              SizedBox(width: 16),
              
              // Hero Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          child['name'] ?? 'Hero',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textDark,
                          ),
                        ),
                        SizedBox(width: 8),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.6),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '${age}y',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: colors[1],
                            ),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 8),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: interests.take(3).map((interest) {
                        return Container(
                          padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: colors[0].withOpacity(0.2),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(_getInterestEmoji(interest), style: TextStyle(fontSize: 10)),
                              SizedBox(width: 4),
                              Text(
                                interest,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.textBody,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              
              // Menu Button
              GestureDetector(
                onTap: () => _showActionsSheet(child['id'].toString(), child['name'] ?? 'Hero', colors[0]),
                child: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.5),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    LucideIcons.moreVertical,
                    size: 20,
                    color: AppColors.textMuted,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAddHeroCard() {
    return GestureDetector(
      onTap: () async {
        await context.push('/children/add');
        _loadChildren();
      },
      child: Container(
        margin: EdgeInsets.only(bottom: 16),
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: AppColors.primary500.withOpacity(0.2),
            width: 2,
            style: BorderStyle.solid,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary500.withOpacity(0.05),
              blurRadius: 12,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.primary500.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(LucideIcons.plus, color: AppColors.primary500, size: 24),
            ),
            SizedBox(width: 16),
            Text(
              'Add a new little hero!',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.primary500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCircularButton({
    required IconData icon,
    required VoidCallback onTap,
    bool isActive = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: isActive ? AppColors.primary500 : Colors.white,
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
          color: isActive ? Colors.white : AppColors.textDark,
        ),
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

  String _getInterestEmoji(String interest) {
    switch (interest.toLowerCase()) {
      case 'space': return '🚀';
      case 'animals': return '🦁';
      case 'magic': return '✨';
      case 'adventure': return '🗺️';
      case 'dinosaurs': return '🦕';
      case 'pirates': return '🏴‍☠️';
      case 'ocean': return '🌊';
      default: return '⭐';
    }
  }
}
