import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Primary Palette (Soft Blue) - Matches React --brand-primary: #7DB6F8
  static const Color primary50 = Color(0xFFEFF7FF);
  static const Color primary100 = Color(0xFFD9EDFF);
  static const Color primary200 = Color(0xFFBCE0FF);
  static const Color primary300 = Color(0xFF8ECFFF);
  static const Color primary400 = Color(0xFF7DB6F8); // Main Primary (Soft Blue)
  static const Color primary500 = Color(0xFF7DB6F8); // Main Primary (Soft Blue)
  static const Color primary600 = Color(0xFF5B9FE6);
  static const Color primary700 = Color(0xFF4A88D4);
  static const Color primary800 = Color(0xFF3971C2);
  static const Color primary900 = Color(0xFF285AA0);
  
  // Legacy
  static const Color primary = primary500;
  static const Color primaryLight = primary100;
  
  // Secondary Palette (Pastel Pink) - Matches React --brand-secondary: #F6A6D7
  static const Color secondary50 = Color(0xFFFFF5FB);
  static const Color secondary100 = Color(0xFFFFE4F4);
  static const Color secondary200 = Color(0xFFFFC9E8);
  static const Color secondary300 = Color(0xFFFFA6D7);
  static const Color secondary400 = Color(0xFFF6A6D7); // Main Secondary (Pastel Pink)
  static const Color secondary500 = Color(0xFFF6A6D7); // Main Secondary (Pastel Pink)
  static const Color secondary600 = Color(0xFFE48BC4);
  static const Color secondary700 = Color(0xFFD270B1);
  static const Color secondary800 = Color(0xFFC0559E);
  static const Color secondary900 = Color(0xFFAE3A8B);
  
  // Legacy
  static const Color secondary = secondary500;
  static const Color accent = accent500;
  
  // Accent Palette (Mint Green) - Matches React --brand-accent: #B3E6C5
  static const Color accent50 = Color(0xFFF0FBF4);
  static const Color accent100 = Color(0xFFDCF5E6);
  static const Color accent200 = Color(0xFFC8EFDA);
  static const Color accent300 = Color(0xFFB3E6C5); // Main Accent (Mint Green)
  static const Color accent400 = Color(0xFFB3E6C5); // Main Accent (Mint Green)
  static const Color accent500 = Color(0xFFB3E6C5); // Main Accent (Mint Green)
  static const Color accent600 = Color(0xFF9DD4B0);
  static const Color accent700 = Color(0xFF87C29B);
  static const Color accent800 = Color(0xFF71B086);
  static const Color accent900 = Color(0xFF5B9E71);
  
  // Enchant Palette (Lavender) - Matches React --brand-enchant: #C8C5FF
  static const Color enchant50 = Color(0xFFF5F5FF);
  static const Color enchant100 = Color(0xFFEBEAFF);
  static const Color enchant200 = Color(0xFFDDD9FF);
  static const Color enchant300 = Color(0xFFC8C5FF); // Main Enchant (Lavender)
  static const Color enchant400 = Color(0xFFC8C5FF); // Main Enchant (Lavender)
  static const Color enchant500 = Color(0xFFC8C5FF); // Main Enchant (Lavender)
  static const Color enchant600 = Color(0xFFB3AFE6);
  static const Color enchant700 = Color(0xFF9E99CD);
  static const Color enchant800 = Color(0xFF8983B4);
  static const Color enchant900 = Color(0xFF746D9B);
  
  // Semantic Colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);
  static const Color infoLight = Color(0xFFDBeafe);
  
  // Neutral Colors - Matches React palette
  static const Color neutral50 = Color(0xFFFFFBEC); // Main Background - Matches React #FFFBEC
  static const Color neutral100 = Color(0xFFFAFAFB); // Matches React #FAFAFB
  static const Color neutral200 = Color(0xFFF2F4F7); // Matches React #F2F4F7
  static const Color neutral300 = Color(0xFFE4E7EC); // Matches React #E4E7EC
  static const Color neutral400 = Color(0xFFD0D5DD); // Matches React #D0D5DD
  static const Color neutral500 = Color(0xFF98A2B3);
  static const Color neutral600 = Color(0xFF475467); // Matches React #475467
  static const Color neutral700 = Color(0xFF344054);
  static const Color neutral800 = Color(0xFF1D2939);
  static const Color neutral900 = Color(0xFF101828); // Matches React #101828
  
  // Text Colors - Matches React palette
  static const Color textDark = Color(0xFF101828); // Matches React --text-primary
  static const Color textBody = Color(0xFF344054); // Matches React --text-secondary
  static const Color textMuted = Color(0xFF667085); // Matches React --text-muted
  static const Color textLight = Color(0xFFA3A3A3); // Light Gray
  
  // Gradients - Soft pastel gradients matching React design
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [Color(0xFF7DB6F8), Color(0xFF5B9FE6)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient secondaryGradient = LinearGradient(
    colors: [Color(0xFFF6A6D7), Color(0xFFE48BC4)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient accentGradient = LinearGradient(
    colors: [Color(0xFFB3E6C5), Color(0xFF9DD4B0)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient enchantGradient = LinearGradient(
    colors: [Color(0xFFC8C5FF), Color(0xFFB3AFE6)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  // Combined gradient - Soft blue to lavender
  static const LinearGradient primaryEnchantGradient = LinearGradient(
    colors: [Color(0xFF7DB6F8), Color(0xFFC8C5FF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}

class AppSpacing {
  // 8-point grid system
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 20.0;
  static const double xxl = 24.0;
  static const double xxxl = 32.0;
  static const double huge = 40.0;
  static const double massive = 48.0;
  static const double giant = 64.0;
  
  // Legacy (for backwards compatibility)
  static const double screenPadding = xxl;
  static const double cardPadding = xl;
  static const double cardPaddingSm = lg;
  static const double cardPaddingMd = xl;
  static const double elementGapRelated = sm;
  static const double elementGapNormal = lg;
  static const double sectionGapNormal = xxl;
  static const double sectionGapMajor = xxxl;
}

class AppRadius {
  static const double xs = 8.0;
  static const double sm = 8.0;  // Matches React --radius-sm: 8px
  static const double md = 12.0; // Matches React --radius-md: 12px
  static const double lg = 16.0; // Matches React --radius-lg: 16px
  // Keep these for backward compatibility with existing code
  static const double xl = 20.0;
  static const double xxl = 24.0;
  static const double xxxl = 32.0;
  static const double pill = 999.0; // Matches React --radius-pill: 999px
  static const double circle = 9999.0;
}

class AppShadows {
  // Soft, gentle shadows matching React design (softer than before)
  static List<BoxShadow> elevation1 = [
    BoxShadow(
      color: Colors.black.withOpacity(0.04), // Reduced from 0.05
      blurRadius: 10,
      offset: const Offset(0, 2),
    ),
    BoxShadow(
      color: Colors.black.withOpacity(0.02), // Reduced from 0.03
      blurRadius: 3,
      offset: const Offset(0, 1),
    ),
  ];
  
  static List<BoxShadow> elevation2 = [
    BoxShadow(
      color: Colors.black.withOpacity(0.06), // Reduced from 0.08
      blurRadius: 20,
      offset: const Offset(0, 4),
    ),
    BoxShadow(
      color: Colors.black.withOpacity(0.03), // Reduced from 0.04
      blurRadius: 6,
      offset: const Offset(0, 2),
    ),
  ];
  
  static List<BoxShadow> elevation3 = [
    BoxShadow(
      color: Colors.black.withOpacity(0.08), // Reduced from 0.1
      blurRadius: 30,
      offset: const Offset(0, 8),
    ),
    BoxShadow(
      color: Colors.black.withOpacity(0.04), // Reduced from 0.06
      blurRadius: 10,
      offset: const Offset(0, 4),
    ),
  ];
  
  // Soft colored shadow for primary color
  static List<BoxShadow> elevationColored = [
    BoxShadow(
      color: AppColors.primary500.withOpacity(0.15), // Reduced from 0.3
      blurRadius: 20,
      offset: const Offset(0, 8),
    ),
    BoxShadow(
      color: AppColors.primary500.withOpacity(0.08), // Reduced from 0.15
      blurRadius: 10,
      offset: const Offset(0, 4),
    ),
  ];
  
  // Soft glow effect
  static List<BoxShadow> glow = [
    BoxShadow(
      color: AppColors.primary500.withOpacity(0.2), // Reduced from 0.4
      blurRadius: 24,
      offset: const Offset(0, 0),
    ),
  ];
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.light(
        primary: AppColors.primary500,
        secondary: AppColors.secondary500,
        surface: AppColors.neutral50,
        error: AppColors.error,
        background: AppColors.neutral50,
      ),
      scaffoldBackgroundColor: AppColors.neutral50,
      
      // Modern Typography System (Nunito for playful, rounded look)
      textTheme: TextTheme(
        // Display
        displayLarge: GoogleFonts.nunito(
          fontSize: 64,
          fontWeight: FontWeight.w800,
          color: AppColors.textDark,
        ),
        displayMedium: GoogleFonts.nunito(
          fontSize: 48,
          fontWeight: FontWeight.w800,
          color: AppColors.textDark,
        ),
        displaySmall: GoogleFonts.nunito(
          fontSize: 40,
          fontWeight: FontWeight.w700,
          color: AppColors.textDark,
        ),
        
        // Headlines
        headlineLarge: GoogleFonts.nunito(
          fontSize: 32,
          fontWeight: FontWeight.w700,
          color: AppColors.textDark,
        ),
        headlineMedium: GoogleFonts.nunito(
          fontSize: 28,
          fontWeight: FontWeight.w700,
          color: AppColors.textDark,
        ),
        headlineSmall: GoogleFonts.nunito(
          fontSize: 24,
          fontWeight: FontWeight.w700,
          color: AppColors.textDark,
        ),
        
        // Titles
        titleLarge: GoogleFonts.nunito(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: AppColors.textDark,
        ),
        titleMedium: GoogleFonts.nunito(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: AppColors.textDark,
        ),
        titleSmall: GoogleFonts.nunito(
          fontSize: 16,
          fontWeight: FontWeight.w700,
          color: AppColors.textDark,
        ),
        
        // Body (Inter for readability)
        bodyLarge: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: AppColors.textBody,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: AppColors.textBody,
        ),
        bodySmall: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: AppColors.textMuted,
        ),
        
        // Labels
        labelLarge: GoogleFonts.nunito(
          fontSize: 14,
          fontWeight: FontWeight.w700,
          color: AppColors.textDark,
        ),
        labelMedium: GoogleFonts.nunito(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: AppColors.textDark,
        ),
        labelSmall: GoogleFonts.nunito(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: AppColors.textMuted,
        ),
      ),
      
      appBarTheme: AppBarTheme(
        elevation: 0,
        backgroundColor: AppColors.neutral50,
        foregroundColor: AppColors.textDark,
        titleTextStyle: GoogleFonts.nunito(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: AppColors.textDark,
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.dark(
        primary: AppColors.primary500,
        secondary: AppColors.secondary500,
        surface: Color(0xFF1A1A1A),
        error: AppColors.error,
        background: Color(0xFF121212),
      ),
      scaffoldBackgroundColor: Color(0xFF121212),
      
      // Modern Typography System (Nunito for playful, rounded look)
      textTheme: TextTheme(
        // Display
        displayLarge: GoogleFonts.nunito(
          fontSize: 64,
          fontWeight: FontWeight.w800,
          color: Colors.white,
        ),
        displayMedium: GoogleFonts.nunito(
          fontSize: 48,
          fontWeight: FontWeight.w800,
          color: Colors.white,
        ),
        displaySmall: GoogleFonts.nunito(
          fontSize: 40,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
        
        // Headlines
        headlineLarge: GoogleFonts.nunito(
          fontSize: 32,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
        headlineMedium: GoogleFonts.nunito(
          fontSize: 28,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
        headlineSmall: GoogleFonts.nunito(
          fontSize: 24,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
        
        // Titles
        titleLarge: GoogleFonts.nunito(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
        titleMedium: GoogleFonts.nunito(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
        titleSmall: GoogleFonts.nunito(
          fontSize: 16,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
        
        // Body (Inter for readability)
        bodyLarge: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: Color(0xFFE0E0E0),
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: Color(0xFFE0E0E0),
        ),
        bodySmall: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: Color(0xFFB0B0B0),
        ),
        
        // Labels
        labelLarge: GoogleFonts.nunito(
          fontSize: 14,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
        labelMedium: GoogleFonts.nunito(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
        labelSmall: GoogleFonts.nunito(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: Color(0xFFB0B0B0),
        ),
      ),
      
      appBarTheme: AppBarTheme(
        elevation: 0,
        backgroundColor: Color(0xFF1A1A1A),
        foregroundColor: Colors.white,
        titleTextStyle: GoogleFonts.nunito(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: Colors.white,
        ),
      ),
    );
  }
}
