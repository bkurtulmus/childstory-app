import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/widgets/common/buttons.dart';
import 'package:child_story_mobile/widgets/common/inputs.dart';
import 'package:lucide_icons/lucide_icons.dart';

class AiDemoScreen extends StatefulWidget {
  const AiDemoScreen({super.key});

  @override
  State<AiDemoScreen> createState() => _AiDemoScreenState();
}

class _AiDemoScreenState extends State<AiDemoScreen> {
  // Story Generator
  final _storyNameController = TextEditingController(text: 'Emma');
  final _storyThemeController = TextEditingController(text: 'Space Adventures');
  String _storyOutput = '';
  bool _storyLoading = false;

  // Language Enricher
  final _languageInputController = TextEditingController();
  String _languageOutput = '';
  bool _languageLoading = false;

  // Pedagogue Assistant
  final _pedagogueQueryController = TextEditingController(
    text: 'My child doesn\'t like sharing toys, what story theme would help?',
  );
  String _pedagogueOutput = '';
  bool _pedagogueLoading = false;

  // Quiz Generator
  final _quizTopicController = TextEditingController(text: 'Space');
  String _quizOutput = '';
  bool _quizLoading = false;

  @override
  void dispose() {
    _storyNameController.dispose();
    _storyThemeController.dispose();
    _languageInputController.dispose();
    _pedagogueQueryController.dispose();
    _quizTopicController.dispose();
    super.dispose();
  }

  void _generateStory() {
    setState(() => _storyLoading = true);
    
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _storyLoading = false;
          _storyOutput = '''
Once upon a time, ${_storyNameController.text} embarked on an incredible journey through the cosmos. 

As ${_storyNameController.text} floated among the stars, they discovered a magical planet where everything sparkled with stardust. The friendly aliens taught ${_storyNameController.text} about the importance of curiosity and exploration.

Together, they built a rocket ship made of dreams and flew across the galaxy, learning that the universe is full of wonder and friendship.

**The End** ✨
''';
          // Auto-fill language enricher
          _languageInputController.text = _storyOutput;
        });
      }
    });
  }

  void _enrichLanguage() {
    if (_languageInputController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Please enter text to enrich'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _languageLoading = true);
    
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _languageLoading = false;
          _languageOutput = '''
Once upon a time, ${_storyNameController.text} embarked on an incredible **Journey** (Yolculuk) through the cosmos. 

As ${_storyNameController.text} floated among the **Stars** (Yıldızlar), they discovered a magical **Planet** (Gezegen) where everything sparkled with stardust. The friendly **Aliens** (Uzaylılar) taught ${_storyNameController.text} about the importance of curiosity and exploration.

Together, they built a **Rocket** (Roket) ship made of dreams and flew across the **Galaxy** (Galaksi), learning that the universe is full of wonder and **Friendship** (Arkadaşlık).
''';
        });
      }
    });
  }

  void _getPedagogueAdvice() {
    setState(() => _pedagogueLoading = true);
    
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _pedagogueLoading = false;
          _pedagogueOutput = '''
**Great question!** For teaching sharing, I recommend:

1. **Theme: "The Magic Sharing Tree"** - A story where characters discover that sharing makes magical things grow.

2. **Approach:** Use positive reinforcement by showing how sharing brings joy to others and creates new friendships.

3. **Activity:** After the story, practice sharing with toys and celebrate each sharing moment with praise.

Remember, children learn best through repetition and positive examples. Be patient and consistent! 🌟
''';
        });
      }
    });
  }

  void _generateQuiz() {
    setState(() => _quizLoading = true);
    
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _quizLoading = false;
          _quizOutput = '''
**Fun Quiz About ${_quizTopicController.text}!** 🚀

**Question:** What do astronauts wear in space?

A) Swimming suit 🏊
B) Space suit 👨‍🚀
C) Party dress 👗

*Tap to reveal answer...*

**Answer: B) Space suit!** 

Space suits protect astronauts from the cold and help them breathe in space. They're like a personal spaceship! ✨
''';
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.neutral50,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(LucideIcons.arrowLeft, color: AppColors.textDark),
          onPressed: () => context.pop(),
        ),
        title: Row(
          children: [
            Icon(LucideIcons.sparkles, size: 20, color: AppColors.primary500),
            const SizedBox(width: 8),
            Text(
              'AI Laboratory',
              style: TextStyle(
                color: AppColors.textDark,
                fontWeight: FontWeight.w600,
                fontSize: 18,
              ),
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Container(
            color: AppColors.neutral200,
            height: 1,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.primary50,
                    Colors.white,
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.primary200),
              ),
              child: Row(
                children: [
                  Container(
                    padding: EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(LucideIcons.info, color: AppColors.primary500, size: 20),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      'Experience 4 AI-powered features with mock responses',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.primary700,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: 32),

            // 1. Story Generator
            _buildDemoCard(
              title: 'Personalized Story Generator',
              icon: LucideIcons.bookOpen,
              color: AppColors.primary500,
              children: [
                AppTextInput(
                  label: 'Child\'s Name',
                  hint: 'Enter name',
                  controller: _storyNameController,
                ),
                SizedBox(height: 16),
                AppTextInput(
                  label: 'Theme / Interest',
                  hint: 'e.g., Space, Dinosaurs',
                  controller: _storyThemeController,
                ),
                SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: PrimaryButton(
                    label: 'Generate Story',
                    icon: LucideIcons.sparkles,
                    onPressed: _storyLoading ? null : _generateStory,
                  ),
                ),
                if (_storyLoading || _storyOutput.isNotEmpty) ...[
                  SizedBox(height: 24),
                  _buildOutputBox(
                    _storyOutput,
                    _storyLoading,
                    AppColors.primary500,
                  ),
                ],
              ],
            ),

            SizedBox(height: 24),

            // 2. Language Enricher
            _buildDemoCard(
              title: 'Smart Language Enrichment',
              icon: LucideIcons.languages,
              color: AppColors.secondary500,
              children: [
                AppTextInput(
                  label: 'Text to Enrich',
                  hint: 'Paste story or generate one above',
                  controller: _languageInputController,
                  maxLines: 3,
                ),
                SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _languageLoading ? null : _enrichLanguage,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.secondary500,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.pill),
                      ),
                    ),
                    icon: const Icon(LucideIcons.languages, size: 20),
                    label: const Text(
                      'Add Foreign Words',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                if (_languageLoading || _languageOutput.isNotEmpty) ...[
                  SizedBox(height: 24),
                  _buildOutputBox(
                    _languageOutput,
                    _languageLoading,
                    AppColors.secondary500,
                  ),
                ],
              ],
            ),

            SizedBox(height: 24),

            // 3. AI Pedagogue
            _buildDemoCard(
              title: 'AI Pedagogue Assistant',
              icon: LucideIcons.graduationCap,
              color: Color(0xFFEA580C), // orange
              children: [
                AppTextInput(
                  label: 'Your Question',
                  hint: 'Ask about child development or story themes',
                  controller: _pedagogueQueryController,
                  maxLines: 2,
                ),
                SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _pedagogueLoading ? null : _getPedagogueAdvice,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFFEA580C),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.pill),
                      ),
                    ),
                    icon: const Icon(LucideIcons.messageCircle, size: 20),
                    label: const Text(
                      'Get Advice',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                if (_pedagogueLoading || _pedagogueOutput.isNotEmpty) ...[
                  SizedBox(height: 24),
                  _buildOutputBox(
                    _pedagogueOutput,
                    _pedagogueLoading,
                    Color(0xFFEA580C),
                  ),
                ],
              ],
            ),

            SizedBox(height: 24),

            // 4. Quiz Generator
            _buildDemoCard(
              title: 'Educational Quiz Maker',
              icon: LucideIcons.brainCircuit,
              color: Color(0xFF3B82F6), // blue
              children: [
                AppTextInput(
                  label: 'Topic',
                  hint: 'e.g., Space, Animals',
                  controller: _quizTopicController,
                ),
                SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: _quizLoading ? null : _generateQuiz,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFF3B82F6),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.pill),
                      ),
                    ),
                    icon: const Icon(LucideIcons.helpCircle, size: 20),
                    label: const Text(
                      'Create Quiz',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                if (_quizLoading || _quizOutput.isNotEmpty) ...[
                  SizedBox(height: 24),
                  _buildOutputBox(
                    _quizOutput,
                    _quizLoading,
                    Color(0xFF3B82F6),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDemoCard({
    required String title,
    required IconData icon,
    required Color color,
    required List<Widget> children,
  }) {
    return Container(
      padding: EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: AppShadows.elevation1,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              SizedBox(width: 16),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textDark,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 24),
          ...children,
        ],
      ),
    );
  }

  Widget _buildOutputBox(String output, bool isLoading, Color color) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.1)),
      ),
      constraints: const BoxConstraints(
        minHeight: 120,
        maxHeight: 300,
      ),
      child: isLoading
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(color),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'AI is thinking...',
                    style: TextStyle(
                      fontSize: 13,
                      color: color,
                      fontStyle: FontStyle.italic,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            )
          : SingleChildScrollView(
              child: Text(
                output,
                style: TextStyle(
                  fontSize: 15,
                  color: AppColors.textDark,
                  height: 1.6,
                ),
              ),
            ),
    );
  }
}
