import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:child_story_mobile/config/theme.dart';

/// Typography constants for consistent font sizing across the app
/// Based on design health check recommendations
class AppTypography {
  // Font size scale - simplified from 19 sizes to 8 core sizes
  static const double display = 48.0;      // Hero titles, large headings
  static const double headline = 32.0;     // Page titles
  static const double subheading = 24.0;   // Section headers
  static const double title = 18.0;        // Card titles, important labels
  static const double body = 16.0;         // Primary readable text
  static const double caption = 14.0;      // Secondary text, descriptions
  static const double label = 12.0;        // UI labels, metadata
  static const double small = 11.0;        // Smallest acceptable size (accessibility minimum)

  // Font weights
  static const FontWeight extraBold = FontWeight.w800;
  static const FontWeight bold = FontWeight.w700;
  static const FontWeight semiBold = FontWeight.w600;
  static const FontWeight medium = FontWeight.w500;

  // Predefined text styles using Nunito (playful, headings)
  static TextStyle displayStyle({Color? color}) => GoogleFonts.nunito(
    fontSize: display,
    fontWeight: extraBold,
    color: color ?? AppColors.textDark,
  );

  static TextStyle headlineStyle({Color? color}) => GoogleFonts.nunito(
    fontSize: headline,
    fontWeight: bold,
    color: color ?? AppColors.textDark,
  );

  static TextStyle subheadingStyle({Color? color}) => GoogleFonts.nunito(
    fontSize: subheading,
    fontWeight: bold,
    color: color ?? AppColors.textDark,
  );

  static TextStyle titleStyle({Color? color}) => GoogleFonts.nunito(
    fontSize: title,
    fontWeight: semiBold,
    color: color ?? AppColors.textDark,
  );

  // Predefined text styles using Inter (readable, body text)
  static TextStyle bodyStyle({Color? color}) => GoogleFonts.inter(
    fontSize: body,
    fontWeight: medium,
    color: color ?? AppColors.textBody,
  );

  static TextStyle captionStyle({Color? color}) => GoogleFonts.inter(
    fontSize: caption,
    fontWeight: medium,
    color: color ?? AppColors.textBody,
  );

  static TextStyle labelStyle({Color? color}) => GoogleFonts.nunito(
    fontSize: label,
    fontWeight: semiBold,
    color: color ?? AppColors.textDark,
  );

  static TextStyle smallStyle({Color? color}) => GoogleFonts.inter(
    fontSize: small,
    fontWeight: medium,
    color: color ?? AppColors.textMuted,
  );

  // Theme-aware versions for dark mode support
  static TextStyle displayStyleThemed(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return displayStyle(color: isDark ? Colors.white : AppColors.textDark);
  }

  static TextStyle headlineStyleThemed(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return headlineStyle(color: isDark ? Colors.white : AppColors.textDark);
  }

  static TextStyle subheadingStyleThemed(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return subheadingStyle(color: isDark ? Colors.white : AppColors.textDark);
  }

  static TextStyle titleStyleThemed(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return titleStyle(color: isDark ? Colors.white : AppColors.textDark);
  }

  static TextStyle bodyStyleThemed(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return bodyStyle(color: isDark ? Color(0xFFE0E0E0) : AppColors.textBody);
  }

  static TextStyle captionStyleThemed(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return captionStyle(color: isDark ? Color(0xFFE0E0E0) : AppColors.textBody);
  }

  static TextStyle labelStyleThemed(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return labelStyle(color: isDark ? Colors.white : AppColors.textDark);
  }

  static TextStyle smallStyleThemed(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return smallStyle(color: isDark ? Color(0xFFB0B0B0) : AppColors.textMuted);
  }
}
