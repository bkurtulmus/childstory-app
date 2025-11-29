import 'package:flutter/material.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:child_story_mobile/data/services/audio_service.dart';

class StoryCard extends StatelessWidget {
  final String title;
  final String date;
  final String duration;
  final bool isFavorite;
  final VoidCallback? onTap;
  final VoidCallback? onFavoriteToggle;
  final String? imageUrl;

  const StoryCard({
    super.key,
    required this.title,
    required this.date,
    required this.duration,
    this.isFavorite = false,
    this.onTap,
    this.onFavoriteToggle,
    this.imageUrl,
    this.heroTag,
  });

  final Object? heroTag;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        AudioService().playClick();
        onTap?.call();
      },
      borderRadius: BorderRadius.circular(AppRadius.lg),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.neutral50,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          boxShadow: AppShadows.elevation1,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image/Thumbnail
              Hero(
                tag: heroTag ?? title,
                child: Container(
                  height: 140,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(AppRadius.lg),
                      topRight: Radius.circular(AppRadius.lg),
                    ),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppColors.primary.withOpacity(0.15),
                        AppColors.secondary.withOpacity(0.15),
                      ],
                    ),
                  ),
                  child: Stack(
                    children: [
                      // Placeholder icon
                      Center(
                        child: Icon(
                          LucideIcons.bookOpen,
                          size: 48,
                          color: AppColors.primary.withOpacity(0.4),
                        ),
                      ),
                      
                      // Favorite button
                      Positioned(
                        top: 8,
                        right: 8,
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: onFavoriteToggle,
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              width: 36,
                              height: 36,
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.9),
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 4,
                                    offset: Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Icon(
                                isFavorite ? LucideIcons.heart : LucideIcons.heart,
                                size: 18,
                                color: isFavorite ? AppColors.error : AppColors.textMuted,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            
            // Content
            Padding(
              padding: EdgeInsets.all(AppSpacing.cardPaddingSm),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textDark,
                      height: 1.4,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        LucideIcons.calendar,
                        size: 14,
                        color: AppColors.textMuted,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        date,
                        style: TextStyle(
                          fontSize: 13,
                          color: AppColors.textMuted,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Icon(
                        LucideIcons.clock,
                        size: 14,
                        color: AppColors.textMuted,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        duration,
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
    );
  }
}
