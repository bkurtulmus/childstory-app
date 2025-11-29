import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/data/services/credit_service.dart';
import 'package:easy_localization/easy_localization.dart';

class CreditWalletWidget extends StatefulWidget {
  const CreditWalletWidget({super.key});

  @override
  State<CreditWalletWidget> createState() => _CreditWalletWidgetState();
}

class _CreditWalletWidgetState extends State<CreditWalletWidget> with SingleTickerProviderStateMixin {
  final _creditService = CreditService();
  int _balance = 0;
  int _streak = 0;
  bool _isLoading = true;
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat(reverse: true);
    
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.1).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final data = await _creditService.getBalance();
      if (mounted) {
        setState(() {
          _balance = data['balance'] ?? 0;
          _streak = data['currentStreak'] ?? 0;
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading credit data: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return SizedBox(
        width: 100,
        height: 40,
        child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
      );
    }

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
        border: Border.all(color: AppColors.neutral200),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Streak Indicator
          if (_streak > 0) ...[
            Row(
              children: [
                Icon(LucideIcons.flame, color: Colors.orange, size: 18),
                SizedBox(width: 4),
                Text(
                  '$_streak',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.orange[700],
                    fontSize: 14,
                  ),
                ),
              ],
            ),
            Container(
              height: 16,
              width: 1,
              margin: EdgeInsets.symmetric(horizontal: 8),
              color: AppColors.neutral300,
            ),
          ],

          // Credit Balance
          GestureDetector(
            onTap: () {
              // TODO: Show transaction history or earn credits dialog
            },
            child: Row(
              children: [
                ScaleTransition(
                  scale: _pulseAnimation,
                  child: Text('💰', style: TextStyle(fontSize: 16)),
                ),
                SizedBox(width: 6),
                Text(
                  '$_balance',
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                    color: AppColors.textDark,
                    fontSize: 15,
                  ),
                ),
              ],
            ),
          ),
          
          SizedBox(width: 8),
          
          // Add Button
          GestureDetector(
            onTap: () {
              // TODO: Show earn credits dialog
            },
            child: Container(
              padding: EdgeInsets.all(2),
              decoration: BoxDecoration(
                color: AppColors.primary500,
                shape: BoxShape.circle,
              ),
              child: Icon(LucideIcons.plus, color: Colors.white, size: 14),
            ),
          ),
        ],
      ),
    );
  }
}
