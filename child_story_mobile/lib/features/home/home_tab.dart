import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:easy_localization/easy_localization.dart' hide TextDirection;
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/config/typography.dart';
import 'package:child_story_mobile/data/services/api_service.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:child_story_mobile/features/credits/credit_wallet_widget.dart';
import 'dart:math' as math;

class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> with TickerProviderStateMixin {
  final _apiService = ApiService();
  late AnimationController _sparkleController;
  
  List<Map<String, dynamic>> _children = [];
  List<Map<String, dynamic>> _stories = [];
  String _userName = 'Parent';
  bool _isLoading = true;
  
  @override
  void initState() {
    super.initState();
    _sparkleController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat();
    
    _loadData();
  }
  
  Future<void> _loadData() async {
    // Small delay to ensure auth token is set after navigation from splash
    await Future.delayed(const Duration(milliseconds: 100));
    
    try {
      final profile = await _apiService.getUserProfile();
      final children = await _apiService.getChildren();
      final stories = await _apiService.getStories();
      
      setState(() {
        _userName = profile['displayName'] ?? 'Parent';
        _children = children;
        _stories = stories;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }
  
  @override
  void dispose() {
    _sparkleController.dispose();
    super.dispose();
  }
  
  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'greetings.good_morning'.tr();
    if (hour < 18) return 'greetings.good_afternoon'.tr();
    return 'greetings.good_evening'.tr();
  }
  
  String _getGreetingEmoji() {
    final hour = DateTime.now().hour;
    if (hour < 12) return '☀️';
    if (hour < 18) return '🌤️';
    return '🌙';
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

  @override
  Widget build(BuildContext context) {
    final hasChildren = _children.isNotEmpty;
    final firstChildName = hasChildren ? _children.first['name'] ?? '' : '';

    return Scaffold(
      backgroundColor: Color(0xFFFFFBF5),
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFFFFF9F0), Color(0xFFFFF5EB)],
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary500.withOpacity(0.08),
                    blurRadius: 16,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Padding(
                padding: EdgeInsets.fromLTRB(20, 16, 20, 16),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text('✨ ', style: TextStyle(fontSize: AppTypography.title)),
                              Text(
                                'ChildStory',
                                style: AppTypography.titleStyle(color: AppColors.primary500).copyWith(
                                  letterSpacing: -0.5,
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 4),
                          Text(
                            '${_getGreeting()}, $_userName ${_getGreetingEmoji()}',
                            style: AppTypography.captionStyle(color: AppColors.textMuted),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CreditWalletWidget(),
                        SizedBox(width: 8),
                        SizedBox(width: 8),
                        _buildIconButton(
                          icon: LucideIcons.settings,
                          onTap: () => context.push('/settings'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Content
            Expanded(
              child: _isLoading
                  ? Center(child: CircularProgressIndicator())
                  : RefreshIndicator(
                      onRefresh: _loadData,
                      child: SingleChildScrollView(
                        padding: EdgeInsets.fromLTRB(20, 20, 20, 96),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Welcome Card
                            Container(
                              padding: EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [Color(0xFFFFF0F5), Color(0xFFF0F4FF)],
                                ),
                                borderRadius: BorderRadius.circular(28),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.primary500.withOpacity(0.15),
                                    blurRadius: 20,
                                    offset: Offset(0, 8),
                                  ),
                                ],
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Text(
                                          'home.subheading'.tr(),
                                          style: TextStyle(
                                            fontSize: AppTypography.subheading,
                                            fontWeight: FontWeight.w800,
                                            color: AppColors.primary500,
                                            height: 1.2,
                                          ),
                                        ),
                                        SizedBox(height: 8),
                                        Text(
                                          'home.your_heroes'.tr(),
                                          style: TextStyle(
                                            fontSize: AppTypography.caption,
                                            color: AppColors.textMuted,
                                            height: 1.5,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  AnimatedBuilder(
                                    animation: _sparkleController,
                                    builder: (context, child) {
                                      return Transform.rotate(
                                        angle: _sparkleController.value * 2 * math.pi,
                                        child: Container(
                                          width: 60,
                                          height: 60,
                                          decoration: BoxDecoration(
                                            gradient: RadialGradient(
                                              colors: [
                                                AppColors.accent500.withOpacity(0.3),
                                                AppColors.primary500.withOpacity(0.1),
                                              ],
                                            ),
                                            shape: BoxShape.circle,
                                          ),
                                          child: Center(
                                            child: Text('⭐', style: TextStyle(fontSize: 32)),
                                          ),
                                        ),
                                      );
                                    },
                                  ),
                                ],
                              ),
                            ),
                            SizedBox(height: 20),

                            // Create Story Button
                            InkWell(
                              onTap: () => context.push('/story/create'),
                              borderRadius: BorderRadius.circular(28),
                              child: Container(
                                height: 72,
                                padding: EdgeInsets.symmetric(horizontal: 24),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [Color(0xFF9B7EF7), Color(0xFF7DB6F8)],
                                  ),
                                  borderRadius: BorderRadius.circular(28),
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppColors.primary500.withOpacity(0.4),
                                      blurRadius: 20,
                                      offset: Offset(0, 8),
                                    ),
                                  ],
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Container(
                                      width: 48,
                                      height: 48,
                                      decoration: BoxDecoration(
                                        color: Colors.white.withOpacity(0.25),
                                        shape: BoxShape.circle,
                                      ),
                                      child: Center(
                                        child: Text('🪄', style: TextStyle(fontSize: 24)),
                                      ),
                                    ),
                                    SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            'home.create_magic_story'.tr(),
                                            style: TextStyle(
                                              fontSize: AppTypography.title,
                                              fontWeight: FontWeight.w700,
                                              color: Colors.white,
                                            ),
                                          ),
                                          Text(
                                            'home.ready_in_seconds'.tr(),
                                            style: TextStyle(
                                              fontSize: AppTypography.caption,
                                              color: Colors.white.withOpacity(0.9),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Icon(LucideIcons.arrowRight, color: Colors.white, size: 24),
                                  ],
                                ),
                              ),
                            ),
                            SizedBox(height: 32),

                            // Family Section
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Text('👨‍👩‍👧‍👦 ', style: TextStyle(fontSize: AppTypography.title)),
                                    Text(
                                      'home.your_family'.tr(),
                                      style: TextStyle(
                                        fontSize: AppTypography.title,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.textDark,
                                      ),
                                    ),
                                  ],
                                ),
                                if (hasChildren)
                                  TextButton(
                                    onPressed: () => context.push('/children'),
                                    style: TextButton.styleFrom(
                                      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                      backgroundColor: AppColors.primary50,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                    ),
                                    child: Text(
                                      'common.manage'.tr(),
                                      style: TextStyle(
                                        fontSize: AppTypography.caption,
                                        fontWeight: FontWeight.w600,
                                        color: AppColors.primary500,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            SizedBox(height: 16),
                            SizedBox(
                              height: 180,
                              child: ListView.builder(
                                scrollDirection: Axis.horizontal,
                                itemCount: _children.length + 1,
                                itemBuilder: (context, index) {
                                  if (index == _children.length) {
                                    return _buildAddChildCard();
                                  }
                                  return _buildChildCard(_children[index], index);
                                },
                              ),
                            ),
                            SizedBox(height: 32),

                            // Recent Stories
                            if (_stories.isNotEmpty) ...[
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      Text('📚 ', style: TextStyle(fontSize: AppTypography.title)),
                                      Text(
                                        'home.recent_adventures'.tr(),
                                        style: TextStyle(
                                          fontSize: AppTypography.title,
                                          fontWeight: FontWeight.w800,
                                          color: AppColors.textDark,
                                        ),
                                      ),
                                    ],
                                  ),
                                  TextButton(
                                    onPressed: () => context.go('/library'),
                                    style: TextButton.styleFrom(
                                      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                      backgroundColor: AppColors.accent50,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                    ),
                                    child: Text(
                                      'common.view_all'.tr(),
                                      style: TextStyle(
                                        fontSize: AppTypography.caption,
                                        fontWeight: FontWeight.w600,
                                        color: AppColors.accent500,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              SizedBox(height: 16),
                              ..._stories.take(3).map((story) => _buildStoryCard(story)).toList(),
                            ],
                          ],
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIconButton({required IconData icon, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        width: 48,
        height: 48,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.8),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: AppColors.primary500.withOpacity(0.1),
            width: 1.5,
          ),
        ),
        child: Icon(icon, size: 20, color: AppColors.primary500),
      ),
    );
  }

  Widget _buildChildCard(Map<String, dynamic> child, int index) {
    final colors = [
      [Color(0xFFFFF0F5), Color(0xFFFFE4F0)],
      [Color(0xFFF0F4FF), Color(0xFFE4ECFF)],
      [Color(0xFFFFF9E6), Color(0xFFFFF0D9)],
    ];
    final colorSet = colors[index % colors.length];
    final age = _calculateAge(child['birthDate']);
    final avatar = child['avatarUrl'] ?? '👶';
    
    return Container(
      width: 140,
      margin: EdgeInsets.only(right: 16),
      child: InkWell(
        onTap: () async {
          await context.push('/children/edit/${child['id']}');
          _loadData();
        },
        borderRadius: BorderRadius.circular(24),
        child: Container(
          padding: EdgeInsets.all(14),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: colorSet,
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: AppColors.primary500.withOpacity(0.3),
              width: 2.5,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 68,
                height: 68,
                decoration: BoxDecoration(
                  color: AppColors.primary500.withOpacity(0.2),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 3),
                ),
                child: Center(
                  child: Text(avatar, style: TextStyle(fontSize: 32)),
                ),
              ),
              SizedBox(height: 10),
              Text(
                child['name'] ?? 'Child',
                style: TextStyle(
                  fontSize: AppTypography.caption,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textDark,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              SizedBox(height: 4),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.7),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '$age years old',
                  style: TextStyle(
                    fontSize: AppTypography.small,
                    color: AppColors.textMuted,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAddChildCard() {
    return Container(
      width: 140,
      margin: EdgeInsets.only(right: 16),
      child: InkWell(
        onTap: () async {
          await context.push('/children/add');
          _loadData();
        },
        borderRadius: BorderRadius.circular(24),
        child: Container(
          padding: EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: AppColors.primary500.withOpacity(0.3),
              width: 2.5,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppColors.primary50, AppColors.accent50],
                  ),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text('🧸', style: TextStyle(fontSize: 24)),
                ),
              ),
              SizedBox(height: 10),
              Container(
                width: 30,
                height: 30,
                decoration: BoxDecoration(
                  color: AppColors.primary500,
                  shape: BoxShape.circle,
                ),
                child: Icon(LucideIcons.plus, color: Colors.white, size: 16),
              ),
              SizedBox(height: 6),
              Text(
                'Add Child',
                style: TextStyle(
                  fontSize: AppTypography.small,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStoryCard(Map<String, dynamic> story) {
    return Container(
      margin: EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () => context.push('/story/reader/${story['id']}'),
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: AppColors.primary500.withOpacity(0.1),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary500.withOpacity(0.08),
                blurRadius: 12,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppColors.primary500, AppColors.accent500],
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: story['thumbnail'] != null
                      ? story['thumbnail'].toString().startsWith('assets/')
                          ? Image.asset(
                              story['thumbnail'],
                              width: 56,
                              height: 56,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) => Center(
                                child: Text('📖', style: TextStyle(fontSize: 28)),
                              ),
                            )
                          : Image.network(
                              'http://localhost:8080/${story['thumbnail']}',
                              width: 56,
                              height: 56,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) => Center(
                                child: Text('📖', style: TextStyle(fontSize: 28)),
                              ),
                            )
                      : Center(
                          child: Text('📖', style: TextStyle(fontSize: 28)),
                        ),
                ),
              ),
              SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      story['title'] ?? 'Untitled Story',
                      style: TextStyle(
                        fontSize: AppTypography.title,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textDark,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: 4),
                    Text(
                      story['childName'] ?? 'Unknown',
                      style: TextStyle(
                        fontSize: AppTypography.caption,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                LucideIcons.chevronRight,
                color: AppColors.textMuted,
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
