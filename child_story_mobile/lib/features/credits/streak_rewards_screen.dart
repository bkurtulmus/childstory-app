import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/data/services/credit_service.dart';
import 'package:child_story_mobile/data/services/ad_service.dart';
import 'package:lucide_icons/lucide_icons.dart';

class StreakRewardsScreen extends StatefulWidget {
  const StreakRewardsScreen({super.key});

  @override
  State<StreakRewardsScreen> createState() => _StreakRewardsScreenState();
}

class _StreakRewardsScreenState extends State<StreakRewardsScreen> with SingleTickerProviderStateMixin {
  final _creditService = CreditService();
  int _currentStreak = 0;
  int _longestStreak = 0;
  int _balance = 0;
  bool _isLoading = true;
  bool _watchedAdToday = false;
  late AnimationController _flameController;

  @override
  void initState() {
    super.initState();
    _flameController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat(reverse: true);
    _loadData();
  }

  @override
  void dispose() {
    _flameController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    try {
      final data = await _creditService.getBalance();
      if (mounted) {
        setState(() {
          _currentStreak = data['currentStreak'] ?? 0;
          _longestStreak = data['longestStreak'] ?? 0;
          _balance = data['balance'] ?? 0;
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading streak data: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _watchAdForStreak() async {
    final success = await AdService().showRewardedAd();
    
    if (success && mounted) {
      setState(() {
        _watchedAdToday = true;
        _balance += 100;
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('🎉 +100 credits! Streak maintained!'),
          backgroundColor: Colors.green,
        ),
      );
      
      await _loadData();
    }
  }

  int _getNextMilestone() {
    if (_currentStreak < 3) return 3;
    if (_currentStreak < 7) return 7;
    if (_currentStreak < 14) return 14;
    if (_currentStreak < 30) return 30;
    return ((_currentStreak ~/ 30) + 1) * 30;
  }

  int _getMilestoneReward(int milestone) {
    if (milestone == 3) return 10;
    if (milestone == 7) return 25;
    if (milestone == 14) return 50;
    return 100;
  }

  @override
  Widget build(BuildContext context) {
    final nextMilestone = _getNextMilestone();
    final milestoneReward = _getMilestoneReward(nextMilestone);
    final progress = _currentStreak / nextMilestone;

    return Scaffold(
      backgroundColor: Color(0xFFFFFBF5),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(LucideIcons.arrowLeft, color: AppColors.textDark),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Streaks & Rewards',
          style: TextStyle(
            color: AppColors.textDark,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Main Streak Card
                  Container(
                    padding: EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [Color(0xFFFF6B6B), Color(0xFFFF8E53)],
                      ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Color(0xFFFF6B6B).withOpacity(0.3),
                          blurRadius: 20,
                          offset: Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        ScaleTransition(
                          scale: Tween<double>(begin: 1.0, end: 1.2).animate(
                            CurvedAnimation(parent: _flameController, curve: Curves.easeInOut),
                          ),
                          child: Text('🔥', style: TextStyle(fontSize: 80)),
                        ),
                        SizedBox(height: 16),
                        Text(
                          '$_currentStreak Day Streak!',
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Keep reading to maintain your streak',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.white.withOpacity(0.9),
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 24),

                  // Progress to Next Milestone
                  Container(
                    padding: EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.neutral200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Next Milestone',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textDark,
                              ),
                            ),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [AppColors.primary500, AppColors.accent500],
                                ),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '+$milestoneReward credits',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 16),
                        Row(
                          children: [
                            Text(
                              '$_currentStreak',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                                color: AppColors.primary500,
                              ),
                            ),
                            Text(
                              ' / $nextMilestone days',
                              style: TextStyle(
                                fontSize: 16,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 12),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: LinearProgressIndicator(
                            value: progress,
                            minHeight: 12,
                            backgroundColor: AppColors.neutral200,
                            valueColor: AlwaysStoppedAnimation<Color>(AppColors.accent500),
                          ),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 24),

                  // Watch Ad to Maintain Streak
                  Container(
                    padding: EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Color(0xFFFFF0F5), Color(0xFFF0F4FF)],
                      ),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.primary500.withOpacity(0.3)),
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppColors.primary500.withOpacity(0.1),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(LucideIcons.playCircle, color: AppColors.primary500, size: 24),
                            ),
                            SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Daily Ad Bonus',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.textDark,
                                    ),
                                  ),
                                  SizedBox(height: 4),
                                  Text(
                                    'Watch an ad to earn 100 credits',
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
                        SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _watchedAdToday ? null : _watchAdForStreak,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.accent500,
                            foregroundColor: Colors.white,
                            padding: EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            disabledBackgroundColor: AppColors.neutral300,
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(_watchedAdToday ? LucideIcons.check : LucideIcons.playCircle, size: 20),
                              SizedBox(width: 8),
                              Text(
                                _watchedAdToday ? 'Completed Today!' : 'Watch Ad (+100 credits)',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 24),

                  // Stats
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          '🏆',
                          'Longest Streak',
                          '$_longestStreak days',
                          Colors.amber,
                        ),
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          '💰',
                          'Total Credits',
                          '$_balance',
                          AppColors.primary500,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 24),

                  // Milestone Rewards
                  Text(
                    'Milestone Rewards',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textDark,
                    ),
                  ),
                  SizedBox(height: 16),
                  _buildMilestoneCard(3, 10, _currentStreak >= 3),
                  SizedBox(height: 12),
                  _buildMilestoneCard(7, 25, _currentStreak >= 7),
                  SizedBox(height: 12),
                  _buildMilestoneCard(14, 50, _currentStreak >= 14),
                  SizedBox(height: 12),
                  _buildMilestoneCard(30, 100, _currentStreak >= 30),
                ],
              ),
            ),
    );
  }

  Widget _buildStatCard(String emoji, String label, String value, Color color) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.neutral200),
      ),
      child: Column(
        children: [
          Text(emoji, style: TextStyle(fontSize: 32)),
          SizedBox(height: 8),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: AppColors.textMuted,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMilestoneCard(int days, int reward, bool achieved) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: achieved ? AppColors.accent500.withOpacity(0.1) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: achieved ? AppColors.accent500 : AppColors.neutral200,
          width: achieved ? 2 : 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: achieved ? AppColors.accent500 : AppColors.neutral200,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                achieved ? '✓' : '🔒',
                style: TextStyle(fontSize: 24),
              ),
            ),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$days Day Streak',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textDark,
                  ),
                ),
                Text(
                  achieved ? 'Completed!' : 'Keep going!',
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: achieved ? AppColors.accent500 : AppColors.neutral300,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              '+$reward',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: achieved ? Colors.white : AppColors.textMuted,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
