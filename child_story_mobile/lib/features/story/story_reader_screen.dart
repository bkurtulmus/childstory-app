import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:easy_localization/easy_localization.dart' hide TextDirection;
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/config/typography.dart';
import 'package:child_story_mobile/data/services/api_service.dart';
import 'package:child_story_mobile/data/models/language_word.dart';
import 'package:child_story_mobile/data/services/language_data_service.dart';
import 'package:child_story_mobile/data/services/tts_service.dart';
import 'package:child_story_mobile/widgets/language/word_dictionary_modal.dart';
import 'package:flutter/gestures.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'dart:math' as math;
import 'dart:async';

class StoryReaderScreen extends StatefulWidget {
  final String? storyId;
  
  const StoryReaderScreen({super.key, this.storyId});

  @override
  State<StoryReaderScreen> createState() => _StoryReaderScreenState();
}

class _StoryReaderScreenState extends State<StoryReaderScreen> with TickerProviderStateMixin {
  final _apiService = ApiService();
  late PageController _pageController;
  int _currentPage = 0;
  bool _isPlaying = false;
  bool _isAutoPlay = false;
  Timer? _autoPlayTimer;
  bool _isBedtimeMode = false;
  bool _isFavorite = false;
  double _fontSize = 22;
  bool _useDyslexicFont = false;
  bool _showControls = true;
  bool _languageModeEnabled = true;
  bool _isLoading = true;
  
  Map<String, dynamic>? _story;
  List<Map<String, dynamic>> _storyPages = [];
  
  // TTS Service
  final _ttsService = TtsService();
  StreamSubscription? _ttsCompletionSubscription;

  // Animation controllers
  late AnimationController _sparkleController;
  late AnimationController _ambientController;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    
    _loadStory();

    _sparkleController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat();

    _ambientController = AnimationController(
      duration: const Duration(seconds: 4),
      vsync: this,
    )..repeat(reverse: true);
    
    // Initialize TTS
    _ttsService.initialize();
    
    // Listen for TTS completion to auto-turn pages
    _ttsCompletionSubscription = _ttsService.onCompletion.listen((_) {
      print('✅ TTS completed. Auto-turn enabled: ${_isAutoPlay || _isPlaying}');
      // Auto-turn if either Auto Magic OR Play is active
      if ((_isAutoPlay || _isPlaying) && _currentPage < _totalPages - 1) {
        Future.delayed(Duration(milliseconds: 500), () {
          if (mounted && (_isAutoPlay || _isPlaying)) {
            print('📄 Auto-turning to next page...');
            _pageController.nextPage(
              duration: Duration(milliseconds: 600),
              curve: Curves.easeInOut,
            );
          }
        });
      }
    });
    
    // Listen for page changes
    _pageController.addListener(_onPageChanged);
  }
  
  void _onPageChanged() {
    final page = _pageController.page?.round() ?? 0;
    if (page != _currentPage) {
      setState(() => _currentPage = page);
      
      // Stop current TTS
      _ttsService.stop();
      
      // If auto-play is enabled OR playback is active, speak the new page after a short delay
      if (_isAutoPlay || _isPlaying) {
        Future.delayed(Duration(milliseconds: 500), () {
          if (mounted && (_isAutoPlay || _isPlaying)) {
            _speakCurrentPage();
          }
        });
      }
    }
  }
  
  void _speakCurrentPage() {
    if (_currentPage >= _storyPages.length) return;
    
    final page = _storyPages[_currentPage];
    final type = page['type'];
    
    print('📖 Speaking page $_currentPage of ${_storyPages.length}, type: $type');
    
    String textToSpeak = '';
    
    if (type == 'cover') {
      textToSpeak = '${page['title']}. ${page['subtitle']}';
    } else if (type == 'story') {  // Changed from 'content' to 'story'
      textToSpeak = page['text'] ?? '';
    } else if (type == 'end') {
      textToSpeak = 'The End. Thank you for reading!';
    }
    
    print('💬 Text to speak: "${textToSpeak.substring(0, textToSpeak.length > 50 ? 50 : textToSpeak.length)}..."');
    
    if (textToSpeak.isNotEmpty) {
      _ttsService.speak(textToSpeak);
    } else {
      print('⚠️ No text to speak for this page!');
    }
  }

  Future<void> _loadStory() async {
    if (widget.storyId == null) {
      setState(() => _isLoading = false);
      return;
    }

    try {
      final story = await _apiService.getStory(widget.storyId!);
      
      setState(() {
        _story = story;
        _storyPages = _convertStoryToPages(story);
        _isFavorite = story['isFavorite'] ?? false;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading story: $e');
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load story')),
        );
      }
    }
  }

  List<Map<String, dynamic>> _convertStoryToPages(Map<String, dynamic> story) {
    List<Map<String, dynamic>> pages = [];
    
    // Cover Page
    pages.add({
      'type': 'cover',
      'illustration': story['thumbnail'] ?? '📖',
      'title': story['title'] ?? 'Untitled',
      'subtitle': 'A magical journey for ${story['childName'] ?? 'you'}',
      'isAsset': story['thumbnail'] != null && story['thumbnail'].toString().startsWith('assets/'),
    });

    // Story Pages
    final storyPages = List<Map<String, dynamic>>.from(story['pages'] ?? []);
    for (var page in storyPages) {
      // Backend might send 'text' (from JSON) or 'content' (legacy)
      final textContent = page['text'] ?? page['content'] ?? '';
      
      final imageUrl = page['imageUrl'] ?? page['imagePath'];
      
      pages.add({
        'type': 'story',
        'illustration': imageUrl ?? '📖',
        'text': textContent,
        'isAsset': imageUrl != null && imageUrl.toString().startsWith('assets/'),
        // Smart Asset Data (if available in backend response)
        'characterId': page['characterId'],
        'pose': page['pose'],
        'backgroundId': page['backgroundId'],
      });
    }

    // End Page
    pages.add({
      'type': 'end',
      'illustration': '💫',
      'caption': 'story_reader.the_end'.tr(),
      'isAsset': false,
    });

    return pages;
  }

  Future<void> _toggleFavorite() async {
    if (_story == null) return;
    
    try {
      await _apiService.toggleFavorite(widget.storyId!);
      setState(() => _isFavorite = !_isFavorite);
    } catch (e) {
      print('Error toggling favorite: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update favorite')),
      );
    }
  }

  @override
  void dispose() {
    _pageController.removeListener(_onPageChanged);
    _pageController.dispose();
    _sparkleController.dispose();
    _ambientController.dispose();
    _ttsService.stop();
    _ttsCompletionSubscription?.cancel();
    super.dispose();
  }

  int get _totalPages => _storyPages.length;

  Color get _bgColor => _isBedtimeMode ? Color(0xFF1A1625) : Color(0xFFFFFBF5);
  Color get _textColor => _isBedtimeMode ? Color(0xFFE6E1F5) : Color(0xFF2D2838);
  Color get _accentColor => _isBedtimeMode ? Color(0xFF9D84E8) : AppColors.primary500;

  void _toggleControls() {
    setState(() => _showControls = !_showControls);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        backgroundColor: _bgColor,
        body: Center(child: CircularProgressIndicator(color: _accentColor)),
      );
    }

    if (_story == null) {
      return Scaffold(
        backgroundColor: _bgColor,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(LucideIcons.bookX, size: 64, color: _textColor.withOpacity(0.5)),
              SizedBox(height: 16),
              Text(
                'story_reader.story_not_found'.tr(),
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: _textColor,
                ),
              ),
              SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.pop(),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _accentColor,
                  foregroundColor: Colors.white,
                ),
                child: Text('common.go_back'.tr()),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: _bgColor,
      body: Stack(
        children: [
          // Ambient Background Effects
          if (_isBedtimeMode)
            Positioned.fill(
              child: AnimatedBuilder(
                animation: _ambientController,
                builder: (context, child) {
                  return CustomPaint(
                    painter: StarryNightPainter(
                      animationValue: _ambientController.value,
                    ),
                  );
                },
              ),
            ),

          // Main Story Content
          GestureDetector(
            onTap: _toggleControls,
            child: PageView.builder(
              controller: _pageController,
              itemCount: _totalPages,
              onPageChanged: (index) => setState(() => _currentPage = index),
              physics: BouncingScrollPhysics(),
              itemBuilder: (context, index) {
                return _buildStoryPage(_storyPages[index], index);
              },
            ),
          ),

          // Top Navigation Bar
          AnimatedPositioned(
            duration: Duration(milliseconds: 300),
            top: _showControls ? 0 : -100,
            left: 0,
            right: 0,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    _bgColor.withOpacity(0.95),
                    _bgColor.withOpacity(0.0),
                  ],
                ),
              ),
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Spacer to balance the layout since we moved back button
                      SizedBox(width: 48),
                      
                      // Storybook Progress Path
                      Expanded(
                        child: Container(
                          height: 40,
                          padding: EdgeInsets.symmetric(horizontal: 16),
                          child: CustomPaint(
                            painter: StoryProgressPainter(
                              progress: _totalPages > 1 ? _currentPage / (_totalPages - 1) : 0,
                              color: _accentColor,
                              isBedtime: _isBedtimeMode,
                            ),
                          ),
                        ),
                      ),

                      Row(
                        children: [
                          _buildCircularButton(
                            icon: LucideIcons.languages,
                            onTap: () {
                              setState(() => _languageModeEnabled = !_languageModeEnabled);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(_languageModeEnabled ? 'story_reader.spanish_enabled'.tr() : 'story_reader.english_only'.tr()),
                                  duration: Duration(seconds: 1),
                                  backgroundColor: _accentColor,
                                  behavior: SnackBarBehavior.floating,
                                  margin: EdgeInsets.only(
                                    bottom: MediaQuery.of(context).size.height - 150,
                                    left: 20,
                                    right: 20,
                                  ),
                                ),
                              );
                            },
                            isActive: _languageModeEnabled,
                            activeColor: Colors.green,
                          ),
                          SizedBox(width: 8),
                          _buildCircularButton(
                            icon: _isBedtimeMode ? LucideIcons.sun : LucideIcons.moon,
                            onTap: () => setState(() => _isBedtimeMode = !_isBedtimeMode),
                            isActive: _isBedtimeMode,
                          ),
                          SizedBox(width: 8),
                          _buildCircularButton(
                            icon: _isFavorite ? LucideIcons.heart : LucideIcons.heart,
                            onTap: _toggleFavorite,
                            isActive: _isFavorite,
                            activeColor: Colors.red,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Persistent Back Button (Always Visible)
          Positioned(
            top: 0,
            left: 0,
            child: SafeArea(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: _buildCircularButton(
                  icon: LucideIcons.arrowLeft,
                  onTap: () {
                    if (context.canPop()) {
                      context.pop();
                    } else {
                      context.go('/home');
                    }
                  },
                ),
              ),
            ),
          ),

          // Bottom Control Panel
          AnimatedPositioned(
            duration: Duration(milliseconds: 300),
            bottom: _showControls ? 0 : -160,
            left: 0,
            right: 0,
            child: Container(
              margin: EdgeInsets.all(16),
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _isBedtimeMode 
                    ? Color(0xFF2D2838).withOpacity(0.9)
                    : Colors.white.withOpacity(0.9),
                borderRadius: BorderRadius.circular(32),
                border: Border.all(
                  color: _isBedtimeMode 
                      ? Colors.white.withOpacity(0.1)
                      : AppColors.neutral200,
                  width: 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 20,
                    offset: Offset(0, 10),
                  ),
                ],
              ),
              child: SafeArea(
                top: false,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Main Controls
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildNavButton(
                          icon: LucideIcons.chevronLeft,
                          onTap: _currentPage > 0 
                              ? () => _pageController.previousPage(
                                  duration: Duration(milliseconds: 600),
                                  curve: Curves.easeInOutCubic)
                              : null,
                          enabled: _currentPage > 0,
                        ),
                        
                        _buildPlayButton(),
                        
                        _buildNavButton(
                          icon: LucideIcons.chevronRight,
                          onTap: _currentPage < _totalPages - 1
                              ? () => _pageController.nextPage(
                                  duration: Duration(milliseconds: 600),
                                  curve: Curves.easeInOutCubic)
                              : null,
                          enabled: _currentPage < _totalPages - 1,
                        ),
                      ],
                    ),
                    SizedBox(height: 16),
                    
                    // Secondary Controls
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildTextSizeControl(),
                        SizedBox(width: 16),
                        _buildAutoPlayToggle(),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _startAutoPlay() {
    _autoPlayTimer?.cancel();
    _autoPlayTimer = Timer.periodic(Duration(seconds: 5), (timer) {
      if (_currentPage < _totalPages - 1) {
        _pageController.nextPage(
          duration: Duration(milliseconds: 600),
          curve: Curves.easeInOutCubic,
        );
      } else {
        _stopAutoPlay();
      }
    });
  }

  void _stopAutoPlay() {
    _autoPlayTimer?.cancel();
    setState(() => _isAutoPlay = false);
  }

  Widget _buildStoryPage(Map<String, dynamic> page, int index) {
    if (page['type'] == 'cover') {
      return _buildCoverPage(page);
    }
    
    if (page['type'] == 'end') {
      return _buildEndPage(page);
    }

    final illustration = page['illustration'];
    final isAsset = page['isAsset'] == true;

    return Container(
      padding: EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Spacer(flex: 1), // Add some top spacing
            if (illustration != null) ...[
              if (illustration.toString().startsWith('http'))
                // Network image
                Image.network(
                  illustration,
                  height: 200,
                  errorBuilder: (context, error, stackTrace) => Text(
                    '🖼️',
                    style: TextStyle(fontSize: 100),
                  ),
                )
              else if (isAsset && illustration.toString().startsWith('assets/'))
                // Asset image
                Image.asset(
                  illustration,
                  height: 200,
                  errorBuilder: (context, error, stackTrace) => Text(
                    '🖼️',
                    style: TextStyle(fontSize: 100),
                  ),
                )
              else
                // Emoji or fallback
                Text(
                  illustration.toString().length <= 4 ? illustration : '📖',
                  style: TextStyle(fontSize: 100),
                ),
            ],
            SizedBox(height: 32),
            _buildStoryText(page['text'] ?? ''),
            Spacer(flex: 2), // More space at bottom
          ],
      ),
    );
  }

  Widget _buildCoverPage(Map<String, dynamic> page) {
    final illustration = page['illustration'];
    final isAsset = page['isAsset'] == true;

    return Container(
      padding: EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (illustration != null) ...[
            if (illustration.toString().startsWith('http'))
              Image.network(
                illustration,
                height: 250,
                errorBuilder: (context, error, stackTrace) => Text(
                  '📖',
                  style: TextStyle(fontSize: 120),
                ),
              )
            else if (isAsset && illustration.toString().startsWith('assets/'))
              Image.asset(
                illustration,
                height: 250,
                errorBuilder: (context, error, stackTrace) => Text(
                  '📖',
                  style: TextStyle(fontSize: 120),
                ),
              )
            else
              Text(
                illustration.toString().length <= 4 ? illustration : '📖',
                style: TextStyle(fontSize: 120),
              ),
          ],
          SizedBox(height: 48),
          Text(
            page['title'] ?? 'Untitled Story',
            style: TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.bold,
              color: _textColor,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 16),
          Text(
            page['subtitle'] ?? '',
            style: TextStyle(
              fontSize: 20,
              color: _textColor.withOpacity(0.8),
              fontStyle: FontStyle.italic,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildEndPage(Map<String, dynamic> page) {
    return Container(
      padding: EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            page['illustration'] ?? '✨',
            style: TextStyle(fontSize: 100),
          ),
          SizedBox(height: 32),
          Text(
            page['caption'] ?? 'The End',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: _textColor,
            ),
          ),
          SizedBox(height: 32),
          ElevatedButton(
            onPressed: () => context.pop(),
            style: ElevatedButton.styleFrom(
              backgroundColor: _accentColor,
              foregroundColor: Colors.white,
              padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            ),
            child: Text('common.go_back'.tr()),
          ),
        ],
      ),
    );
  }

  Widget _buildStoryText(String text) {
    if (text.isEmpty) return SizedBox.shrink();

    List<InlineSpan> spans = [];
    final words = text.split(' ');

    for (var word in words) {
      final cleanWord = word.replaceAll(RegExp(r'[^\w\s]'), '');
      
      spans.add(
        TextSpan(
          text: '$word ',
          style: TextStyle(
            fontSize: _fontSize,
            height: 1.5,
            color: _textColor,
          ),
          recognizer: TapGestureRecognizer()..onTap = () {
            _showWordTranslation(cleanWord);
          },
        ),
      );
    }

    return RichText(
      textAlign: TextAlign.center,
      text: TextSpan(children: spans),
    );
  }

  void _showWordTranslation(String word) {
    // Create a placeholder LanguageWord object
    final languageWord = LanguageWord(
      id: word,
      word: word,
      translation: "Translation for $word",
      imagePath: "",
      emoji: "📖",
      definition: "",
      exampleSentence: "",
      difficulty: "Beginner",
      category: "Other",
    );

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => WordDictionaryModal(
        word: languageWord,
        onAddToCollection: () {},
        isInCollection: false,
      ),
    );
  }

  Widget _buildCircularButton({
    required IconData icon,
    required VoidCallback onTap,
    bool isActive = false,
    Color? activeColor,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: isActive 
            ? (activeColor ?? _accentColor).withOpacity(0.1) 
            : Colors.white.withOpacity(0.2),
        shape: BoxShape.circle,
        border: Border.all(
          color: isActive 
              ? (activeColor ?? _accentColor) 
              : Colors.white.withOpacity(0.5),
          width: 1,
        ),
      ),
      child: IconButton(
        icon: Icon(icon),
        color: isActive ? (activeColor ?? _accentColor) : _textColor,
        onPressed: onTap,
      ),
    );
  }

  Widget _buildNavButton({
    required IconData icon,
    required VoidCallback? onTap,
    required bool enabled,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: enabled 
            ? _accentColor.withOpacity(0.1)
            : Colors.grey.withOpacity(0.1),
        shape: BoxShape.circle,
      ),
      child: IconButton(
        icon: Icon(icon),
        color: enabled ? _accentColor : Colors.grey,
        onPressed: onTap,
        iconSize: 32,
      ),
    );
  }

  Widget _buildPlayButton() {
    return Container(
      height: 64,
      width: 64,
      decoration: BoxDecoration(
        color: _accentColor,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: _accentColor.withOpacity(0.4),
            blurRadius: 12,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: IconButton(
        icon: Icon(
          _isPlaying ? LucideIcons.pause : LucideIcons.play,
          color: Colors.white,
          size: 32,
        ),
        onPressed: () {
          setState(() => _isPlaying = !_isPlaying);
          if (_isPlaying) {
            _speakCurrentPage();
          } else {
            _ttsService.stop();
          }
        },
      ),
    );
  }

  Widget _buildAutoPlayToggle() {
    return GestureDetector(
      onTap: () {
        setState(() => _isAutoPlay = !_isAutoPlay);
        if (_isAutoPlay) {
          _speakCurrentPage();
        } else {
          _ttsService.stop();
        }
      },
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: _isAutoPlay ? _accentColor : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: _isAutoPlay ? _accentColor : _textColor.withOpacity(0.2),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              _isAutoPlay ? LucideIcons.sparkles : LucideIcons.play,
              size: 16,
              color: _isAutoPlay ? Colors.white : _textColor,
            ),
            SizedBox(width: 8),
            Text(
              'story_reader.auto_magic'.tr(),
              style: TextStyle(
                color: _isAutoPlay ? Colors.white : _textColor,
                fontWeight: FontWeight.bold,
                fontSize: AppTypography.caption,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextSizeControl() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: _isBedtimeMode ? Colors.white.withOpacity(0.05) : AppColors.neutral100,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          GestureDetector(
            onTap: () => setState(() => _fontSize = math.max(18, _fontSize - 2)),
            child: Text('A', style: TextStyle(fontSize: AppTypography.caption, fontWeight: FontWeight.bold, color: _textColor)),
          ),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 8),
            child: Container(width: 1, height: 16, color: _textColor.withOpacity(0.2)),
          ),
          GestureDetector(
            onTap: () => setState(() => _fontSize = math.min(32, _fontSize + 2)),
            child: Text('A', style: TextStyle(fontSize: AppTypography.title, fontWeight: FontWeight.bold, color: _textColor)),
          ),
        ],
      ),
    );
  }
}

class StoryProgressPainter extends CustomPainter {
  final double progress;
  final Color color;
  final bool isBedtime;

  StoryProgressPainter({
    required this.progress,
    required this.color,
    required this.isBedtime,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color.withOpacity(0.2)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round;

    final path = Path();
    path.moveTo(0, size.height / 2);
    
    // Draw wavy path
    for (double i = 0; i <= size.width; i += 10) {
      path.lineTo(i, size.height / 2 + math.sin(i / 20) * 5);
    }
    canvas.drawPath(path, paint);

    // Draw progress
    final progressPath = Path();
    progressPath.moveTo(0, size.height / 2);
    for (double i = 0; i <= size.width * progress; i += 10) {
      progressPath.lineTo(i, size.height / 2 + math.sin(i / 20) * 5);
    }
    
    paint.color = color;
    paint.strokeWidth = 3;
    canvas.drawPath(progressPath, paint);

    // Draw current star
    if (progress > 0) {
      final starX = size.width * progress;
      final starY = size.height / 2 + math.sin(starX / 20) * 5;
      
      final starPaint = Paint()
        ..color = color
        ..style = PaintingStyle.fill;
        
      canvas.drawCircle(Offset(starX, starY), 4, starPaint);
    }
  }

  @override
  bool shouldRepaint(StoryProgressPainter oldDelegate) {
    return oldDelegate.progress != progress ||
           oldDelegate.color != color ||
           oldDelegate.isBedtime != isBedtime;
  }
}

class StarryNightPainter extends CustomPainter {
  final double animationValue;
  final math.Random _random = math.Random(42); // Fixed seed for consistent stars

  StarryNightPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Colors.white.withOpacity(0.3);
    
    for (int i = 0; i < 50; i++) {
      final x = _random.nextDouble() * size.width;
      final y = _random.nextDouble() * size.height;
      final radius = _random.nextDouble() * 2;
      
      // Twinkle effect
      final opacity = (math.sin(animationValue * 2 * math.pi + i) + 1) / 2 * 0.5 + 0.1;
      paint.color = Colors.white.withOpacity(opacity);
      
      canvas.drawCircle(Offset(x, y), radius, paint);
    }
  }

  @override
  bool shouldRepaint(StarryNightPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}
