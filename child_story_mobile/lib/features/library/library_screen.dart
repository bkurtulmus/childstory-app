import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/config/typography.dart';
import 'package:child_story_mobile/config/spacing.dart';
import 'package:child_story_mobile/data/services/api_service.dart';
import 'package:lucide_icons/lucide_icons.dart';

class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key});

  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen> {
  final _apiService = ApiService();
  bool _isListView = true;
  bool _showSearch = false;
  String _searchQuery = '';
  String _selectedFilter = 'All';
  String _selectedTimeRange = 'All time';
  Set<String> _selectedThemes = {};
  
  List<Map<String, dynamic>> _stories = [];
  List<Map<String, dynamic>> _children = [];
  bool _isLoading = true;

  // Theme-based colors for stories
  final Map<String, List<Color>> _themeColors = {
    'Space': [Color(0xFF4A5FE8), Color(0xFF7B68EE)],
    'Pirates': [Color(0xFF2C5F7C), Color(0xFF4A90A4)],
    'Animals': [Color(0xFF52B788), Color(0xFF74C69D)],
    'Fairy tales': [Color(0xFFE07BE0), Color(0xFFF0A6CA)],
    'Magic': [Color(0xFF9B7EF7), Color(0xFFB794F6)],
    'Adventure': [Color(0xFFFF8C42), Color(0xFFFFB347)],
  };
  
  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Refresh data when screen becomes visible again
    _loadData();
  }
  
  Future<void> _loadData() async {
    // Small delay to ensure auth token is set after navigation from splash
    await Future.delayed(const Duration(milliseconds: 100));
    
    try {
      final stories = await _apiService.getStories();
      final children = await _apiService.getChildren();
      
      setState(() {
        _stories = stories;
        _children = children;
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading library data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFFFF9F0),
              Color(0xFFFFF0F5),
            ],
          ),
          borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: DraggableScrollableSheet(
          initialChildSize: 0.75,
          maxChildSize: 0.9,
          minChildSize: 0.5,
          expand: false,
          builder: (context, scrollController) => StatefulBuilder(
            builder: (context, setModalState) => SingleChildScrollView(
              controller: scrollController,
              padding: EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Drag handle
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: AppColors.neutral300,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  SizedBox(height: 20),
                  
                  // Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Text('🎨 ', style: TextStyle(fontSize: 24)),
                          Text(
                            'library.filter_stories'.tr(),
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textDark,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: Icon(LucideIcons.x, size: 24),
                        style: IconButton.styleFrom(
                          backgroundColor: Colors.white,
                          padding: EdgeInsets.all(8),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 32),
                  
                  // Child Filter
                  Text(
                    'library.who_is_hero'.tr(),
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textDark,
                    ),
                  ),
                  SizedBox(height: 16),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildFilterChip(
                          'library.filter_all'.tr(),
                          selected: _selectedFilter == 'All',
                          onTap: () {
                            setModalState(() => _selectedFilter = 'All');
                            setState(() => _selectedFilter = 'All');
                          },
                        ),
                        SizedBox(width: 12),
                        ..._children.map((child) => Padding(
                          padding: EdgeInsets.only(right: 12),
                          child: _buildFilterChip(
                            child['name'],
                            avatar: child['avatarUrl'] ?? '👶',
                            selected: _selectedFilter == child['name'],
                            onTap: () {
                              setModalState(() => _selectedFilter = child['name']);
                              setState(() => _selectedFilter = child['name']);
                            },
                          ),
                        )),
                      ],
                    ),
                  ),
                  SizedBox(height: 32),
                  
                  // Theme Filter
                  Text(
                    'library.themes'.tr(),
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textDark,
                    ),
                  ),
                  SizedBox(height: 16),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: _themeColors.keys.map((theme) {
                      final isSelected = _selectedThemes.contains(theme);
                      // Convert theme name to key: "Space" -> "themes.space"
                      final themeKey = 'themes.${theme.toLowerCase().replaceAll(' ', '_')}';
                      return FilterChip(
                        label: Text(themeKey.tr()),
                        selected: isSelected,
                        onSelected: (selected) {
                          setModalState(() {
                            if (selected) {
                              _selectedThemes.add(theme);
                            } else {
                              _selectedThemes.remove(theme);
                            }
                          });
                          setState(() {});
                        },
                        backgroundColor: Colors.white,
                        selectedColor: AppColors.primary100,
                        checkmarkColor: AppColors.primary500,
                        labelStyle: TextStyle(
                          color: isSelected ? AppColors.primary500 : AppColors.textDark,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide(
                            color: isSelected ? AppColors.primary500 : AppColors.neutral200,
                          ),
                        ),
                        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      );
                    }).toList(),
                  ),
                  
                  SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary500,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(28),
                        ),
                      ),
                      child: Text(
                        'library.apply_filters'.tr(),
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, {String? avatar, required bool selected, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: AnimatedContainer(
        duration: Duration(milliseconds: 200),
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary500 : Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: selected ? AppColors.primary500 : AppColors.neutral200,
            width: 2,
          ),
          boxShadow: selected ? [
            BoxShadow(
              color: AppColors.primary500.withOpacity(0.3),
              blurRadius: 8,
              offset: Offset(0, 4),
            ),
          ] : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (avatar != null) ...[
              Text(avatar, style: TextStyle(fontSize: 18)),
              SizedBox(width: 8),
            ],
            Text(
              label,
              style: TextStyle(
                color: selected ? Colors.white : AppColors.textDark,
                fontWeight: FontWeight.w700,
                fontSize: 15,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filteredStories = _stories.where((story) {
      if (_searchQuery.isNotEmpty && 
          !story['title'].toLowerCase().contains(_searchQuery.toLowerCase())) {
        return false;
      }
      if (_selectedFilter != 'All' && story['childName'] != _selectedFilter) {
        return false;
      }
      if (_selectedThemes.isNotEmpty) {
        // Mock theme matching since backend doesn't return themes yet
        // In a real app, we would check story['themes']
        return true; 
      }
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: Color(0xFFFFFBF5),
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              padding: EdgeInsets.fromLTRB(20, 16, 20, 16),
              decoration: BoxDecoration(
                color: Color(0xFFFFFBF5),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary500.withOpacity(0.05),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Text('📚 ', style: TextStyle(fontSize: 28)),
                      Expanded(
                        child: Text(
                          'library.title'.tr(),
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textDark,
                            letterSpacing: -0.5,
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: () => setState(() => _showSearch = !_showSearch),
                        icon: Icon(
                          _showSearch ? LucideIcons.x : LucideIcons.search,
                          color: AppColors.textDark,
                        ),
                      ),
                      SizedBox(width: 8),
                      IconButton(
                        onPressed: _showFilterSheet,
                        icon: Icon(LucideIcons.slidersHorizontal, color: AppColors.textDark),
                        style: IconButton.styleFrom(
                          backgroundColor: _selectedFilter != 'All' || _selectedThemes.isNotEmpty 
                              ? AppColors.primary100 
                              : Colors.transparent,
                        ),
                      ),
                    ],
                  ),
                  if (_showSearch) ...[
                    SizedBox(height: 16),
                    TextField(
                      onChanged: (value) => setState(() => _searchQuery = value),
                      decoration: InputDecoration(
                        hintText: 'library.search_placeholder'.tr(),
                        prefixIcon: Icon(LucideIcons.search, color: AppColors.textMuted),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                    ),
                  ],
                ],
              ),
            ),

            // Content
            Expanded(
              child: _isLoading 
                  ? Center(child: CircularProgressIndicator())
                  : filteredStories.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text('📭', style: TextStyle(fontSize: 48)),
                              SizedBox(height: 16),
                              Text(
                                'library.no_stories_found'.tr(),
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: EdgeInsets.all(20),
                          itemCount: filteredStories.length,
                          itemBuilder: (context, index) {
                            final story = filteredStories[index];
                            return _buildStoryCard(story);
                          },
                        ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/story/create'),
        backgroundColor: AppColors.primary500,
        icon: Icon(LucideIcons.wand2),
        label: Text('library.create_magic'.tr()),
      ),
    );
  }

  Widget _buildStoryCard(Map<String, dynamic> story) {
    // Determine theme colors based on title or random
    final themeName = _themeColors.keys.firstWhere(
      (key) => (story['title'] ?? '').toString().contains(key),
      orElse: () => 'Magic',
    );
    final colors = _themeColors[themeName]!;

    return Container(
      margin: EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: colors[0].withOpacity(0.1),
            blurRadius: 16,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(24),
        child: InkWell(
          onTap: () => context.push('/story/reader/${story['id']}'),
          borderRadius: BorderRadius.circular(24),
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Row(
              children: [
                // Story Thumbnail/Image
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: colors,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: colors[0].withOpacity(0.3),
                        blurRadius: 12,
                        offset: Offset(0, 6),
                      ),
                    ],
                  ),
                  child: story['thumbnail'] != null
                      ? ClipRRect(
                          borderRadius: BorderRadius.circular(20),
                          child: story['thumbnail'].toString().startsWith('assets/')
                              ? Image.asset(
                                  story['thumbnail'],
                                  width: 80,
                                  height: 80,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Center(
                                      child: Text('📖', style: TextStyle(fontSize: 32)),
                                    );
                                  },
                                )
                              : Image.network(
                                  'http://localhost:8080/${story['thumbnail']}',
                                  width: 80,
                                  height: 80,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Center(
                                      child: Text('📖', style: TextStyle(fontSize: 32)),
                                    );
                                  },
                                ),
                        )
                      : Center(
                          child: Text('📖', style: TextStyle(fontSize: 32)),
                        ),
                ),
                SizedBox(width: 16),
                
                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: colors[0].withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              themeName,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: colors[0],
                              ),
                            ),
                          ),
                          Spacer(),
                          if (story['isFavorite'] == true)
                            Icon(Icons.favorite, size: 16, color: AppColors.error)
                          else
                            Icon(Icons.favorite_border, size: 16, color: AppColors.neutral300),
                        ],
                      ),
                      SizedBox(height: 8),
                      Text(
                        story['title'] ?? 'Untitled',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textDark,
                          height: 1.2,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (story['contentPreview'] != null) ...[
                        SizedBox(height: 4),
                        Text(
                          story['contentPreview'],
                          style: TextStyle(
                            fontSize: 13,
                            color: AppColors.textMuted,
                            height: 1.3,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                      SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(LucideIcons.user, size: 14, color: AppColors.textMuted),
                          SizedBox(width: 4),
                          Text(
                            story['childName'] ?? 'Unknown',
                            style: TextStyle(
                              fontSize: 13,
                              color: AppColors.textMuted,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          SizedBox(width: 12),
                          Icon(LucideIcons.clock, size: 14, color: AppColors.textMuted),
                          SizedBox(width: 4),
                          Text(
                            story['duration'] ?? '5 min',
                            style: TextStyle(
                              fontSize: 13,
                              color: AppColors.textMuted,
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
      ),
    );
  }
}
