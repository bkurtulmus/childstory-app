import 'package:flutter/material.dart';
import 'package:child_story_mobile/config/theme.dart';

class ChildAvatar extends StatelessWidget {
  final String name;
  final String? avatarUrl; // Can be an asset path or URL
  final Color backgroundColor;
  final double size;
  final bool isSelected;
  final VoidCallback? onTap;

  const ChildAvatar({
    super.key,
    required this.name,
    this.avatarUrl,
    this.backgroundColor = AppColors.primaryLight,
    this.size = 60,
    this.isSelected = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              color: backgroundColor,
              shape: BoxShape.circle,
              border: isSelected
                  ? Border.all(color: AppColors.primary, width: 3)
                  : Border.all(color: Colors.transparent, width: 3),
              boxShadow: [
                if (isSelected)
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
              ],
            ),
            child: Center(
              child: avatarUrl != null
                  ? ClipOval(
                      child: avatarUrl!.startsWith('http')
                          ? Image.network(
                              avatarUrl!,
                              width: size * 0.8,
                              height: size * 0.8,
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) => _buildFallbackText(),
                            )
                          : Image.asset(
                              avatarUrl!,
                              width: size * 0.8,
                              height: size * 0.8,
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) => _buildFallbackText(),
                            ),
                    )
                  : Text(
                      name.isNotEmpty ? name[0].toUpperCase() : '?',
                      style: TextStyle(
                        fontSize: size * 0.4,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                    ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            name,
            style: TextStyle(
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: isSelected ? AppColors.primary : AppColors.textBody,
            ),
          ),
        ],
      ),
    );
    }

  Widget _buildFallbackText() {
    return Text(
      name.isNotEmpty ? name[0].toUpperCase() : '?',
      style: TextStyle(
        fontSize: size * 0.4,
        fontWeight: FontWeight.bold,
        color: AppColors.textDark,
      ),
    );
  }
}

