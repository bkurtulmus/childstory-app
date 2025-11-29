import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:child_story_mobile/config/typography.dart';
import 'package:child_story_mobile/data/services/api_service.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:easy_localization/easy_localization.dart';
import 'dart:convert';

class ManageProfileScreen extends StatefulWidget {
  const ManageProfileScreen({super.key});

  @override
  State<ManageProfileScreen> createState() => _ManageProfileScreenState();
}

class _ManageProfileScreenState extends State<ManageProfileScreen> with TickerProviderStateMixin {
  final _apiService = ApiService();
  final _formKey = GlobalKey<FormState>();
  
  // Controllers
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  late TextEditingController _currentPasswordController;
  late TextEditingController _newPasswordController;
  late TextEditingController _confirmPasswordController;
  
  // State
  bool _isLoading = true;
  bool _isSaving = false;
  bool _showPasswordSection = false;
  bool _obscureCurrentPassword = true;
  bool _obscureNewPassword = true;
  bool _obscureConfirmPassword = true;
  
  late AnimationController _entranceController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _emailController = TextEditingController();
    _phoneController = TextEditingController();
    _currentPasswordController = TextEditingController();
    _newPasswordController = TextEditingController();
    _confirmPasswordController = TextEditingController();
    
    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    )..forward();
    
    _loadUserProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    _entranceController.dispose();
    super.dispose();
  }

  Future<void> _loadUserProfile() async {
    try {
      final profile = await _apiService.getUserProfile();
      if (mounted) {
        setState(() {
          _nameController.text = profile['displayName'] ?? '';
          _emailController.text = profile['email'] ?? '';
          _phoneController.text = profile['phone'] ?? '';
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        _showErrorSnackBar('settings_profile.update_error'.tr());
      }
    }
  }

  Future<void> _saveProfile() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSaving = true);

    try {
      // TODO: Implement updateUserProfile API method
      // await _apiService.updateUserProfile({
      //   'displayName': _nameController.text,
      //   'email': _emailController.text,
      //   'phone': _phoneController.text.isEmpty ? null : _phoneController.text,
      // });
      await Future.delayed(Duration(seconds: 1)); // Simulate API call

      if (mounted) {
        _showSuccessSnackBar('settings_profile.update_success'.tr());
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackBar('settings_profile.update_error'.tr());
      }
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }

  Future<void> _changePassword() async {
    if (_newPasswordController.text != _confirmPasswordController.text) {
      _showErrorSnackBar('settings_profile.passwords_dont_match'.tr());
      return;
    }

    if (_newPasswordController.text.length < 6) {
      _showErrorSnackBar('settings_profile.password_too_short'.tr());
      return;
    }

    setState(() => _isSaving = true);

    try {
      // TODO: Implement changePassword API method
      // await _apiService.changePassword(
      //   _currentPasswordController.text,
      //   _newPasswordController.text,
      // );
      await Future.delayed(Duration(seconds: 1)); // Simulate API call

      if (mounted) {
        _showSuccessSnackBar('settings_profile.password_changed'.tr());
        setState(() {
          _showPasswordSection = false;
          _currentPasswordController.clear();
          _newPasswordController.clear();
          _confirmPasswordController.clear();
        });
      }
    } catch (e) {
      if (mounted) {
        _showErrorSnackBar('settings_profile.password_error'.tr());
      }
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(LucideIcons.checkCircle, color: Colors.white),
            SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(LucideIcons.alertCircle, color: Colors.white),
            SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: AppColors.error,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: Stack(
        children: [
          // Decorative Background
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                color: AppColors.primary500.withOpacity(0.05),
                shape: BoxShape.circle,
              ),
            ),
          ),

          Column(
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
                        _buildCircularButton(
                          icon: LucideIcons.arrowLeft,
                          onTap: () => context.pop(),
                        ),
                        Expanded(
                          child: Column(
                            children: [
                              Text(
                                'settings_profile.title'.tr(),
                                style: TextStyle(
                                  fontSize: AppTypography.title,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.textDark,
                                ),
                              ),
                              Text(
                                'settings_profile.subtitle'.tr(),
                                style: TextStyle(
                                  fontSize: AppTypography.caption,
                                  color: AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(width: 40), // Balance
                      ],
                    ),
                  ),
                ),
              ),

              // Content
              Expanded(
                child: _isLoading
                    ? Center(child: CircularProgressIndicator())
                    : SingleChildScrollView(
                        padding: EdgeInsets.all(20),
                        physics: BouncingScrollPhysics(),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Profile Information Card
                              _buildAnimatedCard(
                                delay: 0.0,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    _buildSectionTitle('settings_profile.display_name'.tr()),
                                    SizedBox(height: 12),
                                    _buildTextField(
                                      controller: _nameController,
                                      hint: 'settings_profile.display_name_hint'.tr(),
                                      icon: LucideIcons.user,
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Please enter your name';
                                        }
                                        return null;
                                      },
                                    ),
                                    SizedBox(height: 20),
                                    
                                    _buildSectionTitle('settings_profile.email'.tr()),
                                    SizedBox(height: 12),
                                    _buildTextField(
                                      controller: _emailController,
                                      hint: 'settings_profile.email_hint'.tr(),
                                      icon: LucideIcons.mail,
                                      keyboardType: TextInputType.emailAddress,
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return 'Please enter your email';
                                        }
                                        if (!value.contains('@')) {
                                          return 'Please enter a valid email';
                                        }
                                        return null;
                                      },
                                    ),
                                    SizedBox(height: 20),
                                    
                                    _buildSectionTitle('settings_profile.phone'.tr()),
                                    SizedBox(height: 12),
                                    _buildTextField(
                                      controller: _phoneController,
                                      hint: 'settings_profile.phone_hint'.tr(),
                                      icon: LucideIcons.phone,
                                      keyboardType: TextInputType.phone,
                                    ),
                                  ],
                                ),
                              ),

                              SizedBox(height: 20),

                              // Change Password Section
                              _buildAnimatedCard(
                                delay: 0.1,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    InkWell(
                                      onTap: () => setState(() => _showPasswordSection = !_showPasswordSection),
                                      child: Row(
                                        children: [
                                          Container(
                                            padding: EdgeInsets.all(8),
                                            decoration: BoxDecoration(
                                              color: AppColors.accent500.withOpacity(0.1),
                                              shape: BoxShape.circle,
                                            ),
                                            child: Icon(LucideIcons.lock, size: 20, color: AppColors.accent500),
                                          ),
                                          SizedBox(width: 12),
                                          Expanded(
                                            child: Text(
                                              'settings_profile.change_password'.tr(),
                                              style: TextStyle(
                                                fontSize: AppTypography.body,
                                                fontWeight: FontWeight.w600,
                                                color: AppColors.textDark,
                                              ),
                                            ),
                                          ),
                                          Icon(
                                            _showPasswordSection ? LucideIcons.chevronUp : LucideIcons.chevronDown,
                                            color: AppColors.textMuted,
                                          ),
                                        ],
                                      ),
                                    ),
                                    
                                    if (_showPasswordSection) ...[
                                      SizedBox(height: 20),
                                      _buildPasswordField(
                                        controller: _currentPasswordController,
                                        hint: 'settings_profile.current_password'.tr(),
                                        obscure: _obscureCurrentPassword,
                                        onToggle: () => setState(() => _obscureCurrentPassword = !_obscureCurrentPassword),
                                      ),
                                      SizedBox(height: 16),
                                      _buildPasswordField(
                                        controller: _newPasswordController,
                                        hint: 'settings_profile.new_password'.tr(),
                                        obscure: _obscureNewPassword,
                                        onToggle: () => setState(() => _obscureNewPassword = !_obscureNewPassword),
                                      ),
                                      SizedBox(height: 16),
                                      _buildPasswordField(
                                        controller: _confirmPasswordController,
                                        hint: 'settings_profile.confirm_password'.tr(),
                                        obscure: _obscureConfirmPassword,
                                        onToggle: () => setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
                                      ),
                                      SizedBox(height: 16),
                                      SizedBox(
                                        width: double.infinity,
                                        height: 48,
                                        child: ElevatedButton(
                                          onPressed: _isSaving ? null : _changePassword,
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: AppColors.accent500,
                                            foregroundColor: Colors.white,
                                            shape: RoundedRectangleBorder(
                                              borderRadius: BorderRadius.circular(16),
                                            ),
                                          ),
                                          child: _isSaving
                                              ? SizedBox(
                                                  width: 20,
                                                  height: 20,
                                                  child: CircularProgressIndicator(
                                                    strokeWidth: 2,
                                                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                                  ),
                                                )
                                              : Text('Update Password'),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ),

                              SizedBox(height: 100), // Space for FAB
                            ],
                          ),
                        ),
                      ),
              ),
            ],
          ),
        ],
      ),
      floatingActionButton: _isLoading
          ? null
          : FloatingActionButton.extended(
              onPressed: _isSaving ? null : _saveProfile,
              backgroundColor: AppColors.primary500,
              icon: _isSaving
                  ? SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : Icon(LucideIcons.save),
              label: Text('settings_profile.save_changes'.tr()),
            ),
    );
  }

  Widget _buildCircularButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: AppColors.neutral100,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, size: 20, color: AppColors.textDark),
        ),
      ),
    );
  }

  Widget _buildAnimatedCard({required double delay, required Widget child}) {
    return SlideTransition(
      position: Tween<Offset>(begin: Offset(0, 0.1), end: Offset.zero).animate(
        CurvedAnimation(
          parent: _entranceController,
          curve: Interval(delay, 1.0, curve: Curves.easeOut),
        ),
      ),
      child: FadeTransition(
        opacity: CurvedAnimation(
          parent: _entranceController,
          curve: Interval(delay, 1.0),
        ),
        child: Container(
          padding: EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary500.withOpacity(0.05),
                blurRadius: 12,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: child,
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: TextStyle(
        fontSize: AppTypography.small,
        fontWeight: FontWeight.w700,
        color: AppColors.textMuted,
        letterSpacing: 0.5,
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      validator: validator,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon, color: AppColors.primary500),
        filled: true,
        fillColor: AppColors.neutral50,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: AppColors.neutral100, width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: AppColors.primary500, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: AppColors.error, width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: AppColors.error, width: 2),
        ),
      ),
    );
  }

  Widget _buildPasswordField({
    required TextEditingController controller,
    required String hint,
    required bool obscure,
    required VoidCallback onToggle,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(LucideIcons.lock, color: AppColors.accent500),
        suffixIcon: IconButton(
          icon: Icon(
            obscure ? LucideIcons.eyeOff : LucideIcons.eye,
            color: AppColors.textMuted,
          ),
          onPressed: onToggle,
        ),
        filled: true,
        fillColor: AppColors.neutral50,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: AppColors.neutral100, width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: AppColors.accent500, width: 2),
        ),
      ),
    );
  }
}
