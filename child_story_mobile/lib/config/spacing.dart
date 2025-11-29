import 'package:flutter/material.dart';

/// Spacing constants for consistent layout across the app
/// Based on 8px grid system
class AppSpacing {
  // Base spacing unit (8px)
  static const double base = 8.0;

  // Spacing scale
  static const double xs = 4.0;    // 0.5x - Tight spacing
  static const double sm = 8.0;    // 1x - Small spacing
  static const double md = 16.0;   // 2x - Medium spacing (most common)
  static const double lg = 24.0;   // 3x - Large spacing
  static const double xl = 32.0;   // 4x - Extra large spacing
  static const double xxl = 48.0;  // 6x - Extra extra large spacing

  // Common padding values
  static const double paddingXs = xs;
  static const double paddingSm = sm;
  static const double paddingMd = md;
  static const double paddingLg = lg;
  static const double paddingXl = xl;

  // Common margin values
  static const double marginXs = xs;
  static const double marginSm = sm;
  static const double marginMd = md;
  static const double marginLg = lg;
  static const double marginXl = xl;

  // Border radius values
  static const double radiusSm = 8.0;   // Small rounded corners
  static const double radiusMd = 16.0;  // Medium rounded corners
  static const double radiusLg = 24.0;  // Large rounded corners
  static const double radiusXl = 32.0;  // Extra large rounded corners
  static const double radiusFull = 999.0; // Fully rounded (pill shape)

  // Icon sizes
  static const double iconXs = 16.0;
  static const double iconSm = 20.0;
  static const double iconMd = 24.0;
  static const double iconLg = 32.0;
  static const double iconXl = 48.0;

  // Avatar sizes
  static const double avatarSm = 32.0;
  static const double avatarMd = 48.0;
  static const double avatarLg = 64.0;
  static const double avatarXl = 96.0;

  // Button heights
  static const double buttonSm = 36.0;
  static const double buttonMd = 44.0;
  static const double buttonLg = 52.0;

  // Common edge insets
  static const EdgeInsets paddingAllXs = EdgeInsets.all(xs);
  static const EdgeInsets paddingAllSm = EdgeInsets.all(sm);
  static const EdgeInsets paddingAllMd = EdgeInsets.all(md);
  static const EdgeInsets paddingAllLg = EdgeInsets.all(lg);
  static const EdgeInsets paddingAllXl = EdgeInsets.all(xl);

  static const EdgeInsets paddingHorizontalSm = EdgeInsets.symmetric(horizontal: sm);
  static const EdgeInsets paddingHorizontalMd = EdgeInsets.symmetric(horizontal: md);
  static const EdgeInsets paddingHorizontalLg = EdgeInsets.symmetric(horizontal: lg);

  static const EdgeInsets paddingVerticalSm = EdgeInsets.symmetric(vertical: sm);
  static const EdgeInsets paddingVerticalMd = EdgeInsets.symmetric(vertical: md);
  static const EdgeInsets paddingVerticalLg = EdgeInsets.symmetric(vertical: lg);
}
