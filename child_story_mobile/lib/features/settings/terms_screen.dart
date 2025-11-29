import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/config/typography.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:easy_localization/easy_localization.dart';

class TermsScreen extends StatelessWidget {
  const TermsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: Column(
        children: [
          // Header
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary500.withOpacity(0.05),
                  blurRadius: 20,
                  offset: Offset(0, 10),
                ),
              ],
            ),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: EdgeInsets.fromLTRB(16, 8, 16, 24),
                child: Row(
                  children: [
                    Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () => context.pop(),
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: AppColors.neutral100,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(LucideIcons.arrowLeft, size: 20, color: AppColors.textDark),
                        ),
                      ),
                    ),
                    Expanded(
                      child: Column(
                        children: [
                          Text(
                            'settings_terms.title'.tr(),
                            style: TextStyle(
                              fontSize: AppTypography.title,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textDark,
                            ),
                          ),
                          Text(
                            'settings_terms.subtitle'.tr(),
                            style: TextStyle(
                              fontSize: AppTypography.caption,
                              color: AppColors.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(width: 40),
                  ],
                ),
              ),
            ),
          ),

          // Content
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.all(20),
              physics: BouncingScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildLastUpdated(context),
                  SizedBox(height: 24),
                  
                  _buildSection(
                    context,
                    'settings_terms.section_acceptance'.tr(),
                    'settings_terms.acceptance_text'.tr(),
                  ),
                  
                  _buildSection(
                    context,
                    'settings_terms.section_use'.tr(),
                    'settings_terms.use_text'.tr(),
                  ),
                  
                  _buildSection(
                    context,
                    'settings_terms.section_content'.tr(),
                    'settings_terms.content_text'.tr(),
                  ),
                  
                  _buildSection(
                    context,
                    'settings_terms.section_prohibited'.tr(),
                    'settings_terms.prohibited_text'.tr(),
                  ),
                  
                  _buildSection(
                    context,
                    'settings_terms.section_termination'.tr(),
                    'settings_terms.termination_text'.tr(),
                  ),
                  
                  _buildSection(
                    context,
                    'settings_terms.section_disclaimer'.tr(),
                    'settings_terms.disclaimer_text'.tr(),
                  ),
                  
                  _buildSection(
                    context,
                    'settings_terms.section_contact'.tr(),
                    'settings_terms.contact_text'.tr(),
                  ),
                  
                  SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLastUpdated(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.accent50,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.accent100, width: 1),
      ),
      child: Row(
        children: [
          Icon(LucideIcons.calendar, color: AppColors.accent500, size: 20),
          SizedBox(width: 12),
          Text(
            'settings_terms.last_updated'.tr(),
            style: TextStyle(
              fontSize: AppTypography.small,
              fontWeight: FontWeight.w600,
              color: AppColors.accent500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection(BuildContext context, String title, String content) {
    return Container(
      margin: EdgeInsets.only(bottom: 24),
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary500.withOpacity(0.05),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: AppTypography.title,
              fontWeight: FontWeight.w800,
              color: AppColors.textDark,
            ),
          ),
          SizedBox(height: 12),
          Text(
            content,
            style: TextStyle(
              fontSize: AppTypography.body,
              color: AppColors.textMuted,
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }
}
