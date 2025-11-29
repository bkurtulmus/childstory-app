import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/config/typography.dart';
import 'package:child_story_mobile/data/services/language_data_service.dart';
import 'package:child_story_mobile/data/models/language_word.dart';
import 'dart:math';

class LanguageQuestScreen extends StatefulWidget {
  final String storyId;
  final String childId;
  final List<String> questWordIds;

  const LanguageQuestScreen({
    super.key,
    required this.storyId,
    required this.childId,
    required this.questWordIds,
  });

  @override
  State<LanguageQuestScreen> createState() => _LanguageQuestScreenState();
}

class _LanguageQuestScreenState extends State<LanguageQuestScreen> with SingleTickerProviderStateMixin {
  final _languageData = LanguageDataService();
  late List<LanguageWord> _questWords;
  late List<LanguageWord> _allWords;
  int _currentQuestionIndex = 0;
  int _correctAnswers = 0;
  bool _showingFeedback = false;
  bool _isCorrect = false;
  late AnimationController _feedbackController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _loadQuestWords();
    
    _feedbackController = AnimationController(
      duration: Duration(milliseconds: 600),
      vsync: this,
    );
    
    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(parent: _feedbackController, curve: Curves.elasticOut),
    );
  }

  void _loadQuestWords() {
    // Load the quest words
    _questWords = _languageData.getWordsByIds(widget.questWordIds);
    // Load all words for wrong answer options
    _allWords = _languageData.allSpanishWords;
  }

  List<LanguageWord> _getAnswerOptions() {
    final currentWord = _questWords[_currentQuestionIndex];
    final options = <LanguageWord>[currentWord];
    
    // Get 2 random wrong answers from the same difficulty level
    final wrongAnswers = _allWords
        .where((w) => w.id != currentWord.id && w.difficulty == currentWord.difficulty)
        .toList()
      ..shuffle();
    
    options.addAll(wrongAnswers.take(2));
    options.shuffle();
    
    return options;
  }

  void _handleAnswer(LanguageWord selectedWord) {
    if (_showingFeedback) return;

    final currentWord = _questWords[_currentQuestionIndex];
    final isCorrect = selectedWord.id == currentWord.id;

    setState(() {
      _showingFeedback = true;
      _isCorrect = isCorrect;
      if (isCorrect) {
        _correctAnswers++;
      }
    });

    _feedbackController.forward().then((_) {
      Future.delayed(Duration(milliseconds: 800), () {
        _feedbackController.reverse();
        
        if (isCorrect) {
          if (_currentQuestionIndex < _questWords.length - 1) {
            // Move to next question
            setState(() {
              _currentQuestionIndex++;
              _showingFeedback = false;
            });
          } else {
            // Quest complete!
            _completeQuest();
          }
        } else {
          // Try again
          setState(() {
            _showingFeedback = false;
          });
        }
      });
    });
  }

  void _completeQuest() {
    // Navigate to story reader with quest completion data
    context.go('/story/reader/${widget.storyId}', extra: {
      'questCompleted': true,
      'wordsLearned': _questWords.map((w) => w.id).toList(),
    });
  }

  void _skipQuest() {
    // Navigate directly to story reader
    context.go('/story/reader/${widget.storyId}');
  }

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_questWords.isEmpty) {
      return Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final currentWord = _questWords[_currentQuestionIndex];
    final answerOptions = _getAnswerOptions();
    final progress = (_currentQuestionIndex + 1) / _questWords.length;

    return Scaffold(
      backgroundColor: Color(0xFFFFFBF5),
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Text(
                        '🎓',
                        style: TextStyle(fontSize: 32),
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Language Quest',
                              style: TextStyle(
                                fontSize: AppTypography.headline,
                                fontWeight: FontWeight.w800,
                                color: AppColors.textDark,
                              ),
                            ),
                            Text(
                              'Learn ${_questWords.length} words to unlock story!',
                              style: TextStyle(
                                fontSize: AppTypography.small,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  // Progress bar
                  Row(
                    children: [
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: LinearProgressIndicator(
                            value: progress,
                            backgroundColor: AppColors.primary100,
                            valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary500),
                            minHeight: 8,
                          ),
                        ),
                      ),
                      SizedBox(width: 12),
                      Text(
                        '${_currentQuestionIndex + 1}/${_questWords.length}',
                        style: TextStyle(
                          fontSize: AppTypography.body,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Question Area
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.all(24),
                child: Column(
                  children: [
                    // Image
                    AnimatedBuilder(
                      animation: _scaleAnimation,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: _showingFeedback ? _scaleAnimation.value : 1.0,
                          child: Container(
                            width: 200,
                            height: 200,
                            decoration: BoxDecoration(
                              color: _showingFeedback
                                  ? (_isCorrect ? Colors.green.shade50 : Colors.red.shade50)
                                  : Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: _showingFeedback
                                    ? (_isCorrect ? Colors.green : Colors.red)
                                    : Colors.grey.shade200,
                                width: 3,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.1),
                                  blurRadius: 20,
                                  offset: Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Center(
                              child: Text(
                                currentWord.emoji,
                                style: TextStyle(fontSize: 120),
                              ),
                            ),
                          ),
                        );
                      },
                    ),

                    SizedBox(height: 32),

                    // Question
                    Text(
                      'What is this in Spanish?',
                      style: TextStyle(
                        fontSize: AppTypography.subheading,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textDark,
                      ),
                      textAlign: TextAlign.center,
                    ),

                    SizedBox(height: 32),

                    // Answer Options
                    ...answerOptions.map((word) => _buildAnswerButton(word)),

                    SizedBox(height: 24),

                    // Feedback message
                    if (_showingFeedback)
                      AnimatedOpacity(
                        opacity: _showingFeedback ? 1.0 : 0.0,
                        duration: Duration(milliseconds: 300),
                        child: Container(
                          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                          decoration: BoxDecoration(
                            color: _isCorrect ? Colors.green.shade100 : Colors.red.shade100,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                _isCorrect ? Icons.check_circle : Icons.cancel,
                                color: _isCorrect ? Colors.green : Colors.red,
                              ),
                              SizedBox(width: 8),
                              Text(
                                _isCorrect ? '¡Correcto! Great job!' : 'Try again!',
                                style: TextStyle(
                                  fontSize: AppTypography.body,
                                  fontWeight: FontWeight.w700,
                                  color: _isCorrect ? Colors.green.shade900 : Colors.red.shade900,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),

            // Skip Button
            Padding(
              padding: EdgeInsets.all(20),
              child: TextButton(
                onPressed: _skipQuest,
                child: Text(
                  'Skip Quest',
                  style: TextStyle(
                    fontSize: AppTypography.body,
                    color: AppColors.textMuted,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAnswerButton(LanguageWord word) {
    final currentWord = _questWords[_currentQuestionIndex];
    final isCorrectAnswer = word.id == currentWord.id;
    final isSelected = _showingFeedback && isCorrectAnswer;

    return Padding(
      padding: EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () => _handleAnswer(word),
        borderRadius: BorderRadius.circular(16),
        child: Container(
          width: double.infinity,
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          decoration: BoxDecoration(
            color: isSelected
                ? (_isCorrect ? Colors.green.shade100 : Colors.white)
                : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected
                  ? (_isCorrect ? Colors.green : Colors.grey.shade300)
                  : Colors.grey.shade300,
              width: 2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 8,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: Text(
            word.word,
            style: TextStyle(
              fontSize: AppTypography.subheading,
              fontWeight: FontWeight.w700,
              color: isSelected
                  ? (_isCorrect ? Colors.green.shade900 : AppColors.textDark)
                  : AppColors.textDark,
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}
