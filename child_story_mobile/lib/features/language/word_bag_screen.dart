import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/config/typography.dart';
import 'package:child_story_mobile/data/services/language_data_service.dart';
import 'package:child_story_mobile/data/services/mock_data_service.dart';
import 'package:child_story_mobile/data/models/language_word.dart';
import 'package:lucide_icons/lucide_icons.dart';

class WordBagScreen extends StatefulWidget {
  final String? childId;

  const WordBagScreen({
    super.key,
    this.childId,
  });

  @override
  State<WordBagScreen> createState() => _WordBagScreenState();
}

class _WordBagScreenState extends State<WordBagScreen> {
  final _mockData = MockDataService();
  final _languageData = LanguageDataService();
  late Child? _selectedChild;
  List<LanguageWord> _learnedWords = [];

  @override
  void initState() {
    super.initState();
    _loadChildData();
  }

  void _loadChildData() {
    // Get the child (use provided ID or first child with language learning enabled)
    if (widget.childId != null) {
      _selectedChild = _mockData.getChildById(widget.childId!);
    } else {
      _selectedChild = _mockData.children.firstWhere(
        (child) => child.languageLearningEnabled,
        orElse: () => _mockData.children.first,
      );
    }

    if (_selectedChild != null && _selectedChild!.languageLearningEnabled) {
      _learnedWords = _languageData.getWordsByIds(_selectedChild!.wordBag);
    }

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    if (_selectedChild == null) {
      return Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final isLanguageLearningEnabled = _selectedChild!.languageLearningEnabled;

    return Scaffold(
      backgroundColor: Color(0xFFFFFBF5),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: Icon(LucideIcons.arrowLeft, color: AppColors.textDark),
          onPressed: () => context.pop(),
        ),
        title: Text(
          '${_selectedChild!.name}\'s Word Bag',
          style: TextStyle(
            color: AppColors.textDark,
            fontWeight: FontWeight.w700,
            fontSize: AppTypography.title,
          ),
        ),
      ),
      body: !isLanguageLearningEnabled
          ? _buildLanguageDisabledView()
          : _buildWordBagView(),
    );
  }

  Widget _buildLanguageDisabledView() {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '🎒',
              style: TextStyle(fontSize: 80),
            ),
            SizedBox(height: 24),
            Text(
              'Language Learning Disabled',
              style: TextStyle(
                fontSize: AppTypography.headline,
                fontWeight: FontWeight.w800,
                color: AppColors.textDark,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 12),
            Text(
              'Enable language learning for ${_selectedChild!.name} in Settings to start collecting words!',
              style: TextStyle(
                fontSize: AppTypography.body,
                color: AppColors.textMuted,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                context.go('/children/edit/${_selectedChild!.id}');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary500,
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Text(
                'Go to Settings',
                style: TextStyle(
                  fontSize: AppTypography.body,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWordBagView() {
    return Column(
      children: [
        // Progress Card
        Container(
          margin: EdgeInsets.all(20),
          padding: EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [AppColors.primary500, AppColors.primary600],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary500.withOpacity(0.3),
                blurRadius: 20,
                offset: Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            children: [
              Row(
                children: [
                  Text(
                    '📊',
                    style: TextStyle(fontSize: 32),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Progress',
                          style: TextStyle(
                            fontSize: AppTypography.body,
                            color: Colors.white.withOpacity(0.9),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          '${_selectedChild!.wordsLearned}/50 Spanish words',
                          style: TextStyle(
                            fontSize: AppTypography.headline,
                            color: Colors.white,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: _selectedChild!.wordsLearned / 50,
                  backgroundColor: Colors.white.withOpacity(0.3),
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  minHeight: 8,
                ),
              ),
              SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildStatBadge(
                    '🎯',
                    'Level',
                    _selectedChild!.proficiencyLevel,
                  ),
                  _buildStatBadge(
                    '🔥',
                    'Streak',
                    _selectedChild!.lastQuestDate != null ? '${DateTime.now().difference(_selectedChild!.lastQuestDate!).inDays} days' : '0 days',
                  ),
                ],
              ),
            ],
          ),
        ),

        // Words Grid
        Expanded(
          child: _learnedWords.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '🎓',
                        style: TextStyle(fontSize: 80),
                      ),
                      SizedBox(height: 20),
                      Text(
                        'No words yet!',
                        style: TextStyle(
                          fontSize: AppTypography.headline,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textDark,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Read stories to collect new words',
                        style: TextStyle(
                          fontSize: AppTypography.body,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                )
              : GridView.builder(
                  padding: EdgeInsets.fromLTRB(20, 0, 20, 20),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 0.9,
                  ),
                  itemCount: _learnedWords.length,
                  itemBuilder: (context, index) {
                    final word = _learnedWords[index];
                    return _buildWordCard(word);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildStatBadge(String emoji, String label, String value) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            emoji,
            style: TextStyle(fontSize: 20),
          ),
          SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  color: Colors.white.withOpacity(0.8),
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                value,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWordCard(LanguageWord word) {
    return GestureDetector(
      onTap: () => _showWordDetails(word),
      child: Container(
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Emoji
            Text(
              word.emoji,
              style: TextStyle(fontSize: 48),
            ),
            SizedBox(height: 12),

            // Foreign Word
            Text(
              word.word,
              style: TextStyle(
                fontSize: AppTypography.subheading,
                fontWeight: FontWeight.w800,
                color: AppColors.primary500,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            SizedBox(height: 4),

            // Translation
            Text(
              word.translation,
              style: TextStyle(
                fontSize: AppTypography.small,
                color: AppColors.textMuted,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),

            SizedBox(height: 8),

            // Category Badge
            Container(
              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primary50,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                word.category,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showWordDetails(LanguageWord word) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Emoji
            Text(
              word.emoji,
              style: TextStyle(fontSize: 80),
            ),
            SizedBox(height: 16),

            // Word
            Text(
              word.word,
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w800,
                color: AppColors.primary500,
              ),
            ),
            SizedBox(height: 8),

            // Translation
            Text(
              word.translation,
              style: TextStyle(
                fontSize: AppTypography.headline,
                color: AppColors.textMuted,
                fontWeight: FontWeight.w600,
              ),
            ),
            SizedBox(height: 24),

            // Definition
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.primary50,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                word.definition,
                style: TextStyle(
                  fontSize: AppTypography.body,
                  color: AppColors.textDark,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            SizedBox(height: 16),

            // Example
            Text(
              'Example:',
              style: TextStyle(
                fontSize: AppTypography.small,
                fontWeight: FontWeight.w700,
                color: AppColors.textMuted,
              ),
            ),
            SizedBox(height: 8),
            Text(
              '"${word.exampleSentence}"',
              style: TextStyle(
                fontSize: AppTypography.body,
                color: AppColors.textDark,
                fontStyle: FontStyle.italic,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 24),

            // Close Button
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary500,
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Text(
                'Got it!',
                style: TextStyle(
                  fontSize: AppTypography.body,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
