import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:easy_localization/easy_localization.dart' hide TextDirection;
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/config/typography.dart';
import 'package:child_story_mobile/data/services/api_service.dart';
import 'package:child_story_mobile/data/services/credit_service.dart';
import 'package:lucide_icons/lucide_icons.dart';

class PersonalizeStoryModal extends StatefulWidget {
  final Map<String, dynamic> story;

  const PersonalizeStoryModal({
    super.key,
    required this.story,
  });

  @override
  State<PersonalizeStoryModal> createState() => _PersonalizeStoryModalState();
}

class _PersonalizeStoryModalState extends State<PersonalizeStoryModal> {
  final _apiService = ApiService();
  final _creditService = CreditService();
  List<Map<String, dynamic>> _children = [];
  String? _selectedChildId;
  bool _isLoading = true;
  bool _isPersonalizing = false;
  int _balance = 0;

  @override
  void initState() {
    super.initState();
    _loadChildren();
    _loadBalance();
  }

  Future<void> _loadBalance() async {
    try {
      final data = await _creditService.getBalance();
      if (mounted) {
        setState(() {
          _balance = data['balance'] ?? 0;
        });
      }
    } catch (e) {
      print('Error loading balance: $e');
    }
  }

  int get _cost => widget.story['personalizationCost'] ?? 0;
  bool get _hasSufficientCredits => _balance >= _cost;

  Future<void> _loadChildren() async {
    try {
      final children = await _apiService.getChildren();
      setState(() {
        _children = children;
        _isLoading = false;
        if (_children.isNotEmpty) {
          _selectedChildId = _children.first['id'].toString();
        }
      });
    } catch (e) {
      print('Error loading children: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _personalizeStory() async {
    if (_selectedChildId == null) return;

    // Check if premium and has insufficient credits
    if (_cost > 0 && !_hasSufficientCredits) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Insufficient credits. You need $_cost credits.')),
        );
      }
      return;
    }

    setState(() {
      _isPersonalizing = true;
    });

    try {
      final templateId = widget.story['id'].toString();
      final newStory = await _apiService.personalizeStory(templateId, _selectedChildId!);
      
      if (mounted) {
        // Close the modal
        Navigator.of(context).pop();
        
        // Navigate to the new story
        context.push('/story/reader/${newStory['id']}');
      }
    } catch (e) {
      print('Error personalizing story: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to personalize story: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isPersonalizing = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.neutral50,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          Row(
            children: [
              Expanded(
                child: Text(
                  'Personalize Story',
                  style: AppTypography.headlineStyle(color: AppColors.textDark),
                ),
              ),
              IconButton(
                icon: Icon(LucideIcons.x, color: AppColors.textDark),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),
          SizedBox(height: 8),
          Text(
            'Choose a child to personalize "${widget.story['title']}" for:',
            style: AppTypography.bodyStyle(color: AppColors.textDark.withOpacity(0.7)),
          ),
          SizedBox(height: 24),

          // Loading or Child Selection
          if (_isLoading)
            Center(child: CircularProgressIndicator())
          else if (_children.isEmpty)
            Text(
              'No children found. Please create a child profile first.',
              style: AppTypography.bodyStyle(color: AppColors.textDark),
              textAlign: TextAlign.center,
            )
          else
            ..._children.map((child) {
              final isSelected = _selectedChildId == child['id'].toString();
              return GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedChildId = child['id'].toString();
                  });
                },
                child: Container(
                  margin: EdgeInsets.only(bottom: 12),
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.accent500.withOpacity(0.2) : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSelected ? AppColors.accent500 : Colors.transparent,
                      width: 2,
                    ),
                  ),
                  child: Row(
                    children: [
                      // Avatar
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: AppColors.accent500.withOpacity(0.2),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            child['avatarUrl'] ?? '👶',
                            style: TextStyle(fontSize: 24),
                          ),
                        ),
                      ),
                      SizedBox(width: 16),
                      // Name and Age
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              child['name'] ?? 'Unknown',
                              style: AppTypography.subheadingStyle(color: AppColors.textDark),
                            ),
                            Text(
                              '${child['age'] ?? 0} years old',
                              style: AppTypography.captionStyle(color: AppColors.textDark.withOpacity(0.6)),
                            ),
                          ],
                        ),
                      ),
                      // Checkmark
                      if (isSelected)
                        Icon(LucideIcons.check, color: AppColors.accent500),
                    ],
                  ),
                ),
              );
            }).toList(),

          SizedBox(height: 24),

          // Personalize Button
          ElevatedButton(
            onPressed: _isPersonalizing || _selectedChildId == null
                ? null
                : _personalizeStory,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.accent500,
              foregroundColor: Colors.white,
              padding: EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: _isPersonalizing
                ? SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : Text(
                    _cost > 0
                        ? (_hasSufficientCredits
                            ? 'Personalize ($_cost credits)'
                            : 'Not Enough Credits')
                        : 'Personalize for Free',
                    style: AppTypography.titleStyle(color: Colors.white),
                  ),
          ),
        ],
      ),
    );
  }
}
