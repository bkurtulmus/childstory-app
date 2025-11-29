import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Simple notifier for theme mode with persistence
class ThemeModeNotifier extends Notifier<bool> {
  static const String _key = 'dark_mode';

  @override
  bool build() {
    // Load saved preference
    _loadPreference();
    return false; // Default to light mode
  }

  Future<void> _loadPreference() async {
    final prefs = await SharedPreferences.getInstance();
    final savedMode = prefs.getBool(_key) ?? false;
    if (state != savedMode) {
      state = savedMode;
    }
  }

  Future<void> toggle() async {
    state = !state;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_key, state);
    print('Dark mode toggled to: $state');
  }

  Future<void> setDarkMode(bool value) async {
    state = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_key, state);
    print('Dark mode set to: $state');
  }
}

// Provider for theme mode
final themeModeProvider = NotifierProvider<ThemeModeNotifier, bool>(
  ThemeModeNotifier.new,
);
