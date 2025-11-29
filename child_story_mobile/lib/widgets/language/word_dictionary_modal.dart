import 'package:flutter/material.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/data/models/language_word.dart';
import 'package:child_story_mobile/widgets/common/buttons.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'dart:ui';

class WordDictionaryModal extends StatelessWidget {
  final LanguageWord word;
  final VoidCallback onAddToCollection;
  final bool isInCollection;

  const WordDictionaryModal({
    super.key,
    required this.word,
    required this.onAddToCollection,
    this.isInCollection = false,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: EdgeInsets.all(AppSpacing.screenPadding),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.9),
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(AppRadius.xl),
            ),
            border: Border(
              top: BorderSide(color: Colors.white.withOpacity(0.5)),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 20,
                offset: const Offset(0, -5),
              ),
            ],
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
              // Handle bar
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.neutral300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              SizedBox(height: AppSpacing.sectionGapNormal),

              // Word illustration
              Container(
                width: 160,
                height: 160,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppColors.primary.withOpacity(0.1),
                      AppColors.secondary.withOpacity(0.1),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(AppRadius.circle),
                  boxShadow: AppShadows.elevation2,
                  border: Border.all(color: Colors.white, width: 4),
                ),
                child: Center(
                  child: Text(
                    word.emoji,
                    style: const TextStyle(fontSize: 80),
                  ),
                ),
              ),
              SizedBox(height: AppSpacing.sectionGapNormal),

              // Word and translation
              Text(
                word.word,
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                word.translation,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textDark,
                ),
              ),
              
              const SizedBox(height: 16),
              
              // Definition
              if (word.definition.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    word.definition,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.textMuted,
                      height: 1.4,
                    ),
                  ),
                ),

              if (word.exampleSentence.isNotEmpty) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.neutral100,
                    borderRadius: BorderRadius.circular(AppRadius.md),
                  ),
                  child: Text(
                    '"${word.exampleSentence}"',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      fontStyle: FontStyle.italic,
                      color: AppColors.textDark,
                    ),
                  ),
                ),
              ],

              SizedBox(height: AppSpacing.sectionGapNormal),

              // Pronunciation button
              Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () {},
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  child: Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(AppSpacing.cardPaddingSm),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                      border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(LucideIcons.volume2, color: AppColors.primary, size: 24),
                        SizedBox(width: AppSpacing.elementGapRelated),
                        Text(
                          'Listen to pronunciation',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              SizedBox(height: AppSpacing.elementGapNormal),

              // Add to collection button
              SizedBox(
                width: double.infinity,
                child: PrimaryButton(
                  label: isInCollection ? 'In Word Bag' : 'Add to Word Bag',
                  icon: isInCollection ? LucideIcons.check : LucideIcons.plus,
                  onPressed: isInCollection ? null : onAddToCollection,
                ),
              ),

              SizedBox(height: AppSpacing.elementGapRelated),
            ],
            ),
          ),
        ),
      ),
    );
  }

  static void show(
    BuildContext context, {
    required LanguageWord word,
    required VoidCallback onAddToCollection,
    bool isInCollection = false,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => WordDictionaryModal(
        word: word,
        onAddToCollection: onAddToCollection,
        isInCollection: isInCollection,
      ),
    );
  }
}
