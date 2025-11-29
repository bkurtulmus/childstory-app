import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/widgets/common/buttons.dart';
import 'package:lucide_icons/lucide_icons.dart';

class PremiumFeaturesScreen extends StatefulWidget {
  const PremiumFeaturesScreen({super.key});

  @override
  State<PremiumFeaturesScreen> createState() => _PremiumFeaturesScreenState();
}

class _PremiumFeaturesScreenState extends State<PremiumFeaturesScreen> {
  int _selectedFeature = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.neutral50,
      body: Column(
        children: [
          // Custom AppBar
          Container(
            height: 56,
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: AppShadows.elevation1,
            ),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => context.pop(),
                      child: Container(
                        width: 44,
                        height: 44,
                        color: Colors.transparent,
                        alignment: Alignment.center,
                        child: Icon(
                          LucideIcons.arrowLeft,
                          size: 24,
                          color: AppColors.textDark,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(LucideIcons.crown,
                              size: 20, color: AppColors.secondary500),
                          const SizedBox(width: 8),
                          Text(
                            'Premium Features',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textDark,
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(width: 44), // Balance the back button
                  ],
                ),
              ),
            ),
          ),

          // Feature tabs
          Container(
            padding: EdgeInsets.all(AppSpacing.screenPadding),
            child: Row(
              children: [
                Expanded(
                  child: _buildTab(
                    icon: LucideIcons.book,
                    label: 'Physical Book',
                    index: 0,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildTab(
                    icon: LucideIcons.scan,
                    label: 'AR Characters',
                    index: 1,
                  ),
                ),
              ],
            ),
          ),

          // Content
          Expanded(
            child: _selectedFeature == 0
                ? _buildPhysicalBookFeature()
                : _buildARFeature(),
          ),
        ],
      ),
    );
  }

  Widget _buildTab({
    required IconData icon,
    required String label,
    required int index,
  }) {
    final isSelected = _selectedFeature == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedFeature = index),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary500 : Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(
            color: isSelected ? AppColors.primary500 : AppColors.neutral200,
          ),
          boxShadow: isSelected ? AppShadows.elevation2 : AppShadows.elevation1,
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : AppColors.textMuted,
              size: 28,
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white : AppColors.textDark,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPhysicalBookFeature() {
    return SingleChildScrollView(
      padding: EdgeInsets.all(AppSpacing.screenPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: EdgeInsets.all(AppSpacing.cardPaddingMd),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.primary500.withOpacity(0.1),
                  AppColors.secondary500.withOpacity(0.1),
                ],
              ),
              borderRadius: BorderRadius.circular(AppRadius.lg),
              border: Border.all(color: AppColors.primary500.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: AppColors.primary500.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    LucideIcons.book,
                    color: AppColors.primary500,
                    size: 32,
                  ),
                ),
                SizedBox(width: AppSpacing.elementGapNormal),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Print Your Story',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textDark,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Turn digital stories into beautiful keepsakes',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: AppSpacing.sectionGapNormal),

          // Book preview
          Container(
            width: double.infinity,
            height: 280,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppColors.primary500.withOpacity(0.3),
                  AppColors.secondary500.withOpacity(0.3),
                ],
              ),
              borderRadius: BorderRadius.circular(AppRadius.lg),
              boxShadow: AppShadows.elevation3,
            ),
            child: Stack(
              children: [
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        LucideIcons.bookOpen,
                        size: 80,
                        color: AppColors.primary500.withOpacity(0.5),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Luna\'s Space Adventure',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'A Personalized Story',
                        style: TextStyle(
                          fontSize: 16,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
                Positioned(
                  top: 16,
                  right: 16,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.secondary500,
                      borderRadius: BorderRadius.circular(AppRadius.pill),
                    ),
                    child: Text(
                      'PRO ONLY',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: AppSpacing.sectionGapNormal),

          // Features
          Text(
            'What You Get',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.textDark,
            ),
          ),
          SizedBox(height: AppSpacing.elementGapNormal),

          _buildFeatureItem(
            LucideIcons.bookOpen,
            'Hardcover Edition',
            'Premium quality hardcover binding',
          ),
          _buildFeatureItem(
            LucideIcons.palette,
            'Full Color Printing',
            'Vibrant illustrations on every page',
          ),
          _buildFeatureItem(
            LucideIcons.languages,
            'Bilingual Option',
            'Choose dual-language printing',
          ),
          _buildFeatureItem(
            LucideIcons.user,
            'Custom Cover',
            'Child\'s name and avatar on cover',
          ),
          _buildFeatureItem(
            LucideIcons.tag,
            'Pro Discount',
            '20% off for Pro subscribers',
          ),

          SizedBox(height: AppSpacing.sectionGapNormal),

          // Pricing
          Container(
            padding: EdgeInsets.all(AppSpacing.cardPaddingMd),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(AppRadius.lg),
              border: Border.all(color: AppColors.neutral200),
              boxShadow: AppShadows.elevation1,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Starting at',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.textMuted,
                      ),
                    ),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '\$29.99',
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary500,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(bottom: 6, left: 4),
                          child: Text(
                            'per book',
                            style: TextStyle(
                              fontSize: 14,
                              color: AppColors.textMuted,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),

          SizedBox(height: AppSpacing.elementGapNormal),

          SizedBox(
            width: double.infinity,
            child: PrimaryButton(
              label: 'Order Physical Book',
              icon: LucideIcons.shoppingCart,
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text('Print-on-demand service coming soon!'),
                    backgroundColor: AppColors.primary500,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
            ),
          ),
          SizedBox(height: 48),
        ],
      ),
    );
  }

  Widget _buildARFeature() {
    return SingleChildScrollView(
      padding: EdgeInsets.all(AppSpacing.screenPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: EdgeInsets.all(AppSpacing.cardPaddingMd),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.secondary500.withOpacity(0.1),
                  AppColors.primary500.withOpacity(0.1),
                ],
              ),
              borderRadius: BorderRadius.circular(AppRadius.lg),
              border: Border.all(color: AppColors.secondary500.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: AppColors.secondary500.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    LucideIcons.scan,
                    color: AppColors.secondary500,
                    size: 32,
                  ),
                ),
                SizedBox(width: AppSpacing.elementGapNormal),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'AR Characters',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textDark,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Bring story characters to life in 3D',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: AppSpacing.sectionGapNormal),

          // AR Preview
          Container(
            width: double.infinity,
            height: 280,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppColors.secondary500.withOpacity(0.3),
                  AppColors.primary500.withOpacity(0.3),
                ],
              ),
              borderRadius: BorderRadius.circular(AppRadius.lg),
              boxShadow: AppShadows.elevation3,
            ),
            child: Stack(
              children: [
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.3),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          LucideIcons.camera,
                          size: 60,
                          color: AppColors.secondary500,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Point camera to view',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textDark,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Luna the Fox in 3D',
                        style: TextStyle(
                          fontSize: 16,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
                Positioned(
                  top: 16,
                  right: 16,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.secondary500,
                      borderRadius: BorderRadius.circular(AppRadius.pill),
                    ),
                    child: Text(
                      'COMING SOON',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: AppSpacing.sectionGapNormal),

          // Privacy notice
          Container(
            padding: EdgeInsets.all(AppSpacing.cardPaddingSm),
            decoration: BoxDecoration(
              color: AppColors.primary500.withOpacity(0.1),
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.primary500.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                Icon(LucideIcons.shield, size: 20, color: AppColors.primary500),
                SizedBox(width: AppSpacing.elementGapRelated),
                Expanded(
                  child: Text(
                    'KVKK Compliant: Camera-only processing, no data uploaded',
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.primary500,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: AppSpacing.sectionGapNormal),

          // Features
          Text(
            'AR Features',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.textDark,
            ),
          ),
          SizedBox(height: AppSpacing.elementGapNormal),

          _buildFeatureItem(
            LucideIcons.box,
            '3D Characters',
            'View story characters in your room',
          ),
          _buildFeatureItem(
            LucideIcons.move,
            'Interactive',
            'Rotate, zoom, and interact with characters',
          ),
          _buildFeatureItem(
            LucideIcons.camera,
            'Camera Only',
            'All processing on device, privacy-first',
          ),
          _buildFeatureItem(
            LucideIcons.image,
            'Photo Mode',
            'Take pictures with AR characters',
          ),

          SizedBox(height: AppSpacing.sectionGapNormal),

          SizedBox(
            width: double.infinity,
            child: PrimaryButton(
              label: 'Launch AR Viewer',
              icon: LucideIcons.scan,
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text(
                        'AR feature coming soon! Camera permission required.'),
                    backgroundColor: AppColors.secondary500,
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
            ),
          ),
          SizedBox(height: 48),
        ],
      ),
    );
  }

  Widget _buildFeatureItem(IconData icon, String title, String description) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.primary500.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              size: 20,
              color: AppColors.primary500,
            ),
          ),
          SizedBox(width: AppSpacing.elementGapRelated),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                ),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
