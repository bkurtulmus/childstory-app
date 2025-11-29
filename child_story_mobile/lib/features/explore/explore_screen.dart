import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:easy_localization/easy_localization.dart' hide TextDirection;
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/config/typography.dart';
import 'package:child_story_mobile/data/services/api_service.dart';
import 'package:child_story_mobile/widgets/story/personalize_story_modal.dart';
import 'package:lucide_icons/lucide_icons.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final _apiService = ApiService();
  String _selectedCategory = 'All';
  String _selectedSort = 'All';
  List<Map<String, dynamic>> _stories = [];
  bool _isLoading = true;

  final List<String> _categories = [
    'categories.all',
    'categories.adventure',
    'categories.magic',
    'categories.space',
    'categories.animals',
    'categories.fairy_tales',
  ];

  final List<String> _sortOptions = [
    'sort.all',
    'sort.trending',
    'sort.popular',
    'sort.new',
  ];

  @override
  void initState() {
    super.initState();
    _loadStories();
  }

  Future<void> _loadStories() async {
    try {
      final stories = await _apiService.getExploreStories();
      setState(() {
        _stories = stories;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading explore stories: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  List<Map<String, dynamic>> get _filteredStories {
    List<Map<String, dynamic>> stories = List.from(_stories);
    
    // Apply category filter first
    if (_selectedCategory != 'categories.all') {
      // Map translation key to backend category value
      final categoryMap = {
        'categories.adventure': 'Adventure',
        'categories.magic': 'Magic',
        'categories.space': 'Space',
        'categories.animals': 'Animals',
        'categories.fairy_tales': 'Fairy Tales',
      };
      
      final backendCategory = categoryMap[_selectedCategory];
      if (backendCategory != null) {
        stories = stories.where((s) {
          return s['category'] == backendCategory;
        }).toList();
      }
    }
    
    // Then apply sorting
    switch (_selectedSort) {
      case 'sort.trending':
        // Sort by upvotes (trending = high engagement)
        stories.sort((a, b) => (b['upvotes'] ?? 0).compareTo(a['upvotes'] ?? 0));
        break;
      case 'sort.popular':
        // Sort by upvotes (popular = most upvoted)
        stories.sort((a, b) => (b['upvotes'] ?? 0).compareTo(a['upvotes'] ?? 0));
        break;
      case 'sort.new':
        // Sort by creation date (newest first)
        stories.sort((a, b) => (b['createdAt'] ?? '').compareTo(a['createdAt'] ?? ''));
        break;
      default:
        // Default order (by upvotes)
        stories.sort((a, b) => (b['upvotes'] ?? 0).compareTo(a['upvotes'] ?? 0));
        break;
    }
    
    return stories;
  }

  String _getStoryBadge(Map<String, dynamic> story) {
    final upvotes = story['upvotes'] ?? 0;
    if (upvotes >= 180) return 'TRENDING';
    if (upvotes >= 150) return 'POPULAR';
    return 'NEW';
  }

  void _showStoryPreview(BuildContext context, Map<String, dynamic> story) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _StoryPreviewModal(story: story),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Color(0xFFFFFBF5),
      child: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary500.withOpacity(0.05),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    padding: EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.accent50,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(LucideIcons.compass, color: AppColors.accent500),
                  ),
                  SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'explore.title'.tr(),
                        style: TextStyle(
                          fontSize: AppTypography.title,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textDark,
                        ),
                      ),
                      Text(
                        'explore.subtitle'.tr(),
                        style: TextStyle(
                          fontSize: AppTypography.caption,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Content
            Expanded(
              child: _isLoading
                  ? Center(child: CircularProgressIndicator())
                  : SingleChildScrollView(
                      padding: EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Featured Story
                          if (_stories.isNotEmpty) ...[
                            Text(
                              'explore.featured'.tr(),
                              style: TextStyle(
                                fontSize: AppTypography.subheading,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textDark,
                              ),
                            ),
                            SizedBox(height: 16),
                            _buildFeaturedCard(_stories.first),
                            SizedBox(height: 32),
                          ],

                          // Sort Filter
                          Text(
                            'explore.sort_by'.tr(),
                            style: TextStyle(
                              fontSize: AppTypography.caption,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textMuted,
                            ),
                          ),
                          SizedBox(height: 12),
                          SizedBox(
                            height: 40,
                            child: ListView.separated(
                              scrollDirection: Axis.horizontal,
                              itemCount: _sortOptions.length,
                              separatorBuilder: (c, i) => SizedBox(width: 8),
                              itemBuilder: (context, index) {
                                final sort = _sortOptions[index];
                                final isSelected = sort == _selectedSort;
                                return FilterChip(
                                  label: Text(sort.tr()), // Sort options might need mapping if they are not just names
                                  selected: isSelected,
                                  onSelected: (selected) {
                                    setState(() => _selectedSort = sort);
                                  },
                                  backgroundColor: Colors.white,
                                  selectedColor: AppColors.accent100,
                                  labelStyle: TextStyle(
                                    color: isSelected ? AppColors.accent500 : AppColors.textMuted,
                                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20),
                                    side: BorderSide(
                                      color: isSelected ? AppColors.accent500 : Colors.grey.shade200,
                                    ),
                                  ),
                                  showCheckmark: false,
                                );
                              },
                            ),
                          ),
                          SizedBox(height: 20),

                          // Categories
                          Text(
                            'explore.categories'.tr(),
                            style: TextStyle(
                              fontSize: AppTypography.caption,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textMuted,
                            ),
                          ),
                          SizedBox(height: 12),
                          SizedBox(
                            height: 40,
                            child: ListView.separated(
                              scrollDirection: Axis.horizontal,
                              itemCount: _categories.length,
                              separatorBuilder: (c, i) => SizedBox(width: 8),
                              itemBuilder: (context, index) {
                                final category = _categories[index];
                                final isSelected = category == _selectedCategory;
                                return FilterChip(
                                  label: Text(category.tr()),
                                  selected: isSelected,
                                  onSelected: (selected) {
                                    setState(() => _selectedCategory = category);
                                  },
                                  backgroundColor: Colors.white,
                                  selectedColor: AppColors.primary100,
                                  labelStyle: TextStyle(
                                    color: isSelected ? AppColors.primary500 : AppColors.textMuted,
                                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20),
                                    side: BorderSide(
                                      color: isSelected ? AppColors.primary500 : Colors.grey.shade200,
                                    ),
                                  ),
                                  showCheckmark: false,
                                );
                              },
                            ),
                          ),
                          SizedBox(height: 24),

                          // Grid
                          GridView.builder(
                            shrinkWrap: true,
                            physics: NeverScrollableScrollPhysics(),
                            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              childAspectRatio: 0.75,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16,
                            ),
                            itemCount: _filteredStories.length,
                            itemBuilder: (context, index) {
                              return _buildStoryCard(_filteredStories[index]);
                            },
                          ),
                        ],
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeaturedCard(Map<String, dynamic> story) {
    final thumbnail = story['thumbnail'] ?? '';
    final badge = _getStoryBadge(story);
    
    return InkWell(
      onTap: () => _showStoryPreview(context, story),
      borderRadius: BorderRadius.circular(24),
      child: Container(
        height: 200,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          color: AppColors.primary100,
          boxShadow: [
            BoxShadow(
              color: AppColors.primary500.withOpacity(0.2),
              blurRadius: 16,
              offset: Offset(0, 8),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Stack(
            children: [
              // Thumbnail image
              if (thumbnail.isNotEmpty)
                Positioned.fill(
                  child: Image.asset(
                    thumbnail,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: AppColors.primary100,
                        child: Center(
                          child: Icon(LucideIcons.image, size: 48, color: AppColors.primary300),
                        ),
                      );
                    },
                  ),
                )
              else
                Center(child: Icon(LucideIcons.image, size: 48, color: AppColors.primary300)),
              
              // Gradient overlay
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.black.withOpacity(0.7),
                      ],
                    ),
                  ),
                ),
              ),
              
              Positioned(
                bottom: 20,
                left: 20,
                right: 20,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.accent500,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        badge,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      story['title'] ?? 'Untitled',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: AppTypography.subheading,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(LucideIcons.clock, color: Colors.white70, size: 14),
                        SizedBox(width: 4),
                        Text(
                          story['duration'] ?? '5 min',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: AppTypography.small,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStoryCard(Map<String, dynamic> story) {
    final category = story['category'] ?? 'Story';
    final thumbnail = story['thumbnail'] ?? '';
    final badge = _getStoryBadge(story);
    
    return InkWell(
      onTap: () => _showStoryPreview(context, story),
      borderRadius: BorderRadius.circular(20),
      child: Container(
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
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  flex: 3,
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppColors.primary100,
                      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                      child: thumbnail.isNotEmpty
                          ? Image.asset(
                              thumbnail,
                              fit: BoxFit.cover,
                              width: double.infinity,
                              errorBuilder: (context, error, stackTrace) {
                                return Center(
                                  child: Icon(LucideIcons.bookOpen, color: AppColors.primary300, size: 32),
                                );
                              },
                            )
                          : Center(
                              child: Icon(LucideIcons.bookOpen, color: AppColors.primary300, size: 32),
                            ),
                    ),
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: Padding(
                    padding: EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          story['title'] ?? 'Untitled',
                          style: TextStyle(
                            fontSize: AppTypography.body,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textDark,
                            height: 1.2,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Row(
                          children: [
                            _buildTag(category),
                            SizedBox(width: 4),
                            _buildBadge(badge),
                            Spacer(),
                            Icon(LucideIcons.arrowRightCircle, color: AppColors.primary500, size: 20),
                          ],
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
    );
  }

  Widget _buildTag(String text) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: AppColors.primary50,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text.toUpperCase(),
        style: TextStyle(
          fontSize: 9,
          fontWeight: FontWeight.w700,
          color: AppColors.primary500,
        ),
      ),
    );
  }

  Widget _buildBadge(String text) {
    Color badgeColor;
    switch (text) {
      case 'TRENDING':
        badgeColor = AppColors.error;
        break;
      case 'POPULAR':
        badgeColor = AppColors.accent500;
        break;
      default:
        badgeColor = AppColors.info;
    }
    
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: badgeColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 8,
          fontWeight: FontWeight.w800,
          color: badgeColor,
        ),
      ),
    );
  }
}

class _StoryPreviewModal extends StatefulWidget {
  final Map<String, dynamic> story;

  const _StoryPreviewModal({required this.story});

  @override
  State<_StoryPreviewModal> createState() => _StoryPreviewModalState();
}

class _StoryPreviewModalState extends State<_StoryPreviewModal> {
  final _apiService = ApiService();
  bool _isRemixing = false;
  Map<String, dynamic>? _fullStory;
  bool _isLoadingDetails = true;

  @override
  void initState() {
    super.initState();
    _loadStoryDetails();
  }

  Future<void> _loadStoryDetails() async {
    try {
      final storyId = widget.story['id'].toString();
      final fullStory = await _apiService.getStory(storyId);
      setState(() {
        _fullStory = fullStory;
        _isLoadingDetails = false;
      });
    } catch (e) {
      print('Error loading story details: $e');
      setState(() {
        _isLoadingDetails = false;
      });
    }
  }

  void _handleRemix() async {
    // Show personalize modal
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => PersonalizeStoryModal(story: widget.story),
    );
  }

  @override
  Widget build(BuildContext context) {
    final themes = List<String>.from(widget.story['themes'] ?? []);
    final pages = _fullStory != null ? List.from(_fullStory!['pages'] ?? []) : [];
    final thumbnail = widget.story['thumbnail'];

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: Column(
        children: [
          // Handle
          Center(
            child: Container(
              margin: EdgeInsets.only(top: 12),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          
          Expanded(
            child: CustomScrollView(
              slivers: [
                SliverAppBar(
                  expandedHeight: 240,
                  pinned: false,
                  backgroundColor: Colors.white,
                  flexibleSpace: FlexibleSpaceBar(
                    background: Stack(
                      fit: StackFit.expand,
                      children: [
                        // Display thumbnail if available
                        if (thumbnail != null)
                          thumbnail.startsWith('assets/')
                              ? Image.asset(
                                  thumbnail,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Container(color: AppColors.primary100);
                                  },
                                )
                              : Image.network(
                                  'http://localhost:8080/$thumbnail',
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Container(color: AppColors.primary100);
                                  },
                                )
                        else
                          Container(color: AppColors.primary100),
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.transparent,
                                Colors.black.withOpacity(0.7),
                              ],
                            ),
                          ),
                        ),
                        Positioned(
                          bottom: 20,
                          left: 20,
                          right: 20,
                          child: Text(
                            widget.story['title'] ?? 'Untitled',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.w800,
                              height: 1.2,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Stats
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _buildStat(LucideIcons.clock, widget.story['duration'] ?? '5 min', 'explore.preview.duration'.tr()),
                            _buildStat(LucideIcons.bookOpen, '${pages.length} ${'explore.preview.pages'.tr()}', 'explore.preview.length'.tr()),
                            _buildStat(LucideIcons.sparkles, widget.story['theme'] ?? 'Fun', 'explore.preview.tone'.tr()),
                          ],
                        ),
                        SizedBox(height: 32),
                        
                        Text(
                          'explore.preview.about_title'.tr(),
                          style: TextStyle(
                            fontSize: AppTypography.subheading,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textDark,
                          ),
                        ),
                        SizedBox(height: 12),
                        Text(
                          'explore.preview.about_desc'.tr().replaceAll('{}', widget.story['lesson']?.toLowerCase() ?? 'life'),
                          style: TextStyle(
                            fontSize: AppTypography.body,
                            color: AppColors.textMuted,
                            height: 1.6,
                          ),
                        ),
                        SizedBox(height: 24),
                        
                        Text(
                          'explore.preview.themes'.tr(),
                          style: TextStyle(
                            fontSize: AppTypography.subheading,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textDark,
                          ),
                        ),
                        SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: themes.map((t) => Chip(
                            label: Text(t),
                            backgroundColor: AppColors.primary50,
                            labelStyle: TextStyle(
                              color: AppColors.primary500,
                              fontWeight: FontWeight.w600,
                            ),
                            side: BorderSide.none,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                          )).toList(),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // Bottom Action Bar
          Container(
            padding: EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 20,
                  offset: Offset(0, -4),
                ),
              ],
            ),
            child: SafeArea(
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _isRemixing ? null : _handleRemix,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary500,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: _isRemixing
                    ? SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(LucideIcons.wand2, size: 20),
                          SizedBox(width: 12),
                          Text(
                            'explore.preview.remix_button'.tr(),
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStat(IconData icon, String value, String label) {
    return Column(
      children: [
        Container(
          padding: EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.primary50,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: AppColors.primary500, size: 20),
        ),
        SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            fontWeight: FontWeight.w700,
            color: AppColors.textDark,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: AppColors.textMuted,
          ),
        ),
      ],
    );
  }
}
