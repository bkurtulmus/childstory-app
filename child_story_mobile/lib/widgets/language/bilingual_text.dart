import 'package:flutter/material.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/data/models/language_word.dart';

class BilingualText extends StatelessWidget {
  final String text;
  final List<LanguageWord> words;
  final Function(LanguageWord) onWordTap;
  final TextStyle? baseStyle;

  const BilingualText({
    super.key,
    required this.text,
    required this.words,
    required this.onWordTap,
    this.baseStyle,
  });

  @override
  Widget build(BuildContext context) {
    final style = baseStyle ??
        TextStyle(
          fontSize: 18,
          height: 1.6,
          color: AppColors.textDark,
        );

    return RichText(
      text: TextSpan(
        style: style,
        children: _buildTextSpans(context),
      ),
    );
  }

  List<InlineSpan> _buildTextSpans(BuildContext context) {
    final List<InlineSpan> spans = [];
    String remainingText = text;

    // Sort words by position in text (longest first to avoid partial matches)
    final sortedWords = List<LanguageWord>.from(words)
      ..sort((a, b) => b.word.length.compareTo(a.word.length));

    while (remainingText.isNotEmpty) {
      bool foundWord = false;

      for (final word in sortedWords) {
        final index = remainingText.indexOf(word.word);
        if (index == 0) {
          // Add the highlighted word
          spans.add(
            WidgetSpan(
              child: GestureDetector(
                onTap: () => onWordTap(word),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(
                      color: AppColors.primary.withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    word.word,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                      height: 1.6,
                    ),
                  ),
                ),
              ),
            ),
          );

          remainingText = remainingText.substring(word.word.length);
          foundWord = true;
          break;
        }
      }

      if (!foundWord) {
        // Find the next word position
        int nextWordIndex = remainingText.length;
        for (final word in sortedWords) {
          final index = remainingText.indexOf(word.word);
          if (index > 0 && index < nextWordIndex) {
            nextWordIndex = index;
          }
        }

        // Add regular text
        spans.add(TextSpan(text: remainingText.substring(0, nextWordIndex)));
        remainingText = remainingText.substring(nextWordIndex);
      }
    }

    return spans;
  }
}
