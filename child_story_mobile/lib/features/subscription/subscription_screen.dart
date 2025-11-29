import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:child_story_mobile/config/theme.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'dart:math' as math;

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> with TickerProviderStateMixin {
  String _billingPeriod = 'monthly'; // 'monthly' or 'annual'
  String? _expandedFaqId;
  late AnimationController _entranceController;

  final List<Map<String, dynamic>> _plans = [
    {
      'id': 'free',
      'name': 'Little Explorer',
      'icon': '🎈',
      'color': Color(0xFFE0F7FA), // Light Cyan
      'accent': Color(0xFF00BCD4),
      'subtitle': 'Start your journey',
      'monthlyPrice': 0.0,
      'annualPrice': 0.0,
      'features': [
        {'text': '3 Magical Stories / mo', 'included': true},
        {'text': 'Basic Themes', 'included': true},
        {'text': 'Standard Magic', 'included': true},
      ],
      'isCurrent': true,
    },
    {
      'id': 'premium',
      'name': 'Master Storyteller',
      'icon': '✨',
      'color': Color(0xFFF3E5F5), // Light Purple
      'accent': Color(0xFF9C27B0),
      'subtitle': 'Unlock the full library',
      'monthlyPrice': 9.99,
      'annualPrice': 7.99,
      'features': [
        {'text': '20 Stories / mo', 'included': true},
        {'text': 'All Magical Themes', 'included': true},
        {'text': 'Interactive Choices', 'included': true},
        {'text': 'Priority Generation', 'included': true},
        {'text': 'Audio Narration', 'included': true, 'badge': 'SOON'},
      ],
      'isRecommended': true,
      'hasTrial': true,
    },
    {
      'id': 'family',
      'name': 'Royal Family',
      'icon': '🏰',
      'color': Color(0xFFFFF3E0), // Light Orange
      'accent': Color(0xFFFF9800),
      'subtitle': 'Adventures for everyone',
      'monthlyPrice': 14.99,
      'annualPrice': 11.99,
      'features': [
        {'text': 'Unlimited Stories', 'included': true},
        {'text': 'Up to 5 Heroes', 'included': true},
        {'text': 'Everything in Premium', 'included': true},
        {'text': 'Early Access Magic', 'included': true},
      ],
    },
  ];

  final List<Map<String, String>> _faqs = [
    {
      'id': '1',
      'question': 'What happens after my trial?',
      'answer':
          'Your magical journey continues! After 7 days, you\'ll join the club officially. But don\'t worry, you can cancel anytime before the trial ends with no magic spells attached.',
    },
    {
      'id': '2',
      'question': 'Can I change my mind?',
      'answer':
          'Absolutely! You can switch between plans or cancel anytime from the "App Enchantments" (Settings) page. We want you to be happy with your adventure.',
    },
    {
      'id': '3',
      'question': 'Is it safe for my child?',
      'answer':
          '100% Safe & Magical. We prioritize privacy and safety above all else. No ads, no scary content, just pure imagination.',
    },
  ];

  @override
  void initState() {
    super.initState();
    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..forward();
  }

  @override
  void dispose() {
    _entranceController.dispose();
    super.dispose();
  }

  double _getPrice(Map<String, dynamic> plan) {
    if (_billingPeriod == 'monthly') {
      return plan['monthlyPrice'];
    }
    return plan['annualPrice'];
  }

  int _getSavings(Map<String, dynamic> plan) {
    if (_billingPeriod == 'annual' && plan['monthlyPrice'] > 0) {
      final monthlyCost = plan['monthlyPrice'] * 12;
      final annualCost = plan['annualPrice'] * 12;
      return (((monthlyCost - annualCost) / monthlyCost) * 100).round();
    }
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFFFFBF5), // Warm cream
      body: Stack(
        children: [
          // Decorative Background Elements
          Positioned(
            top: -50,
            right: -50,
            child: Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                color: AppColors.primary500.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Positioned(
            top: 100,
            left: -30,
            child: Container(
              width: 150,
              height: 150,
              decoration: BoxDecoration(
                color: AppColors.accent500.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
            ),
          ),

          Column(
            children: [
              // Magical Header
              Container(
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.8),
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
                    padding: EdgeInsets.fromLTRB(16, 8, 16, 16),
                    child: Row(
                      children: [
                        _buildCircularButton(
                          icon: LucideIcons.arrowLeft,
                          onTap: () => context.pop(),
                        ),
                        Expanded(
                          child: Text(
                            '✨ Unlock Adventures',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textDark,
                            ),
                          ),
                        ),
                        SizedBox(width: 40), // Balance
                      ],
                    ),
                  ),
                ),
              ),

              // Scrollable Content
              Expanded(
                child: SingleChildScrollView(
                  physics: BouncingScrollPhysics(),
                  padding: EdgeInsets.fromLTRB(20, 20, 20, 40),
                  child: Column(
                    children: [
                      // Hero Section
                      FadeTransition(
                        opacity: _entranceController,
                        child: Column(
                          children: [
                            Container(
                              padding: EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [Color(0xFFE1F5FE), Color(0xFFE0F7FA)],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                borderRadius: BorderRadius.circular(32),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.blue.withOpacity(0.1),
                                    blurRadius: 20,
                                    offset: Offset(0, 10),
                                  ),
                                ],
                              ),
                              child: Column(
                                children: [
                                  Text('🏰', style: TextStyle(fontSize: 48)),
                                  SizedBox(height: 16),
                                  Text(
                                    'Give your child infinite\nmagical adventures',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.w800,
                                      color: AppColors.textDark,
                                      height: 1.2,
                                    ),
                                  ),
                                  SizedBox(height: 8),
                                  Text(
                                    'Create bedtime stories that come alive every night with your little hero as the star.',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 16,
                                      color: AppColors.textBody,
                                      height: 1.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      SizedBox(height: 32),

                      // Billing Toggle
                      _buildBillingToggle(),

                      SizedBox(height: 32),

                      // Plans
                      ..._plans.asMap().entries.map((entry) {
                        final index = entry.key;
                        final plan = entry.value;
                        return SlideTransition(
                          position: Tween<Offset>(begin: Offset(0, 0.1), end: Offset.zero).animate(
                            CurvedAnimation(
                              parent: _entranceController,
                              curve: Interval(0.2 + (index * 0.1), 1.0, curve: Curves.easeOut),
                            ),
                          ),
                          child: FadeTransition(
                            opacity: CurvedAnimation(
                              parent: _entranceController,
                              curve: Interval(0.2 + (index * 0.1), 1.0),
                            ),
                            child: _buildMagicalPlanCard(plan),
                          ),
                        );
                      }),

                      SizedBox(height: 32),

                      // Magical Promise (Trust)
                      Container(
                        padding: EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: AppColors.neutral200),
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                _buildTrustIcon(LucideIcons.shield, Colors.blue),
                                SizedBox(width: 24),
                                _buildTrustIcon(LucideIcons.heart, Colors.pink),
                                SizedBox(width: 24),
                                _buildTrustIcon(LucideIcons.star, Colors.orange),
                              ],
                            ),
                            SizedBox(height: 16),
                            Text(
                              'Our Magical Promise',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                                color: AppColors.textDark,
                              ),
                            ),
                            SizedBox(height: 8),
                            Text(
                              'Safe, private, and always here for your child\'s imagination. Cancel anytime.',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 14,
                                color: AppColors.textMuted,
                                height: 1.5,
                              ),
                            ),
                          ],
                        ),
                      ),

                      SizedBox(height: 32),

                      // FAQ
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          '🧙‍♂️ Wizard\'s Wisdom (FAQ)',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textDark,
                          ),
                        ),
                      ),
                      SizedBox(height: 16),
                      ..._faqs.map((faq) => _buildMagicalFaq(faq)),

                      SizedBox(height: 32),

                      // Restore Purchase
                      TextButton.icon(
                        onPressed: () {},
                        icon: Icon(LucideIcons.refreshCw, size: 16),
                        label: Text('Restore Magic Purchase'),
                        style: TextButton.styleFrom(
                          foregroundColor: AppColors.textMuted,
                          textStyle: TextStyle(fontWeight: FontWeight.w600),
                        ),
                      ),
                      SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBillingToggle() {
    return Container(
      padding: EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.neutral100,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: AppColors.neutral200),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildToggleOption('Monthly 🌙', 'monthly'),
          _buildToggleOption('Annual ☀️', 'annual'),
        ],
      ),
    );
  }

  Widget _buildToggleOption(String label, String value) {
    final isSelected = _billingPeriod == value;
    return GestureDetector(
      onTap: () => setState(() => _billingPeriod = value),
      child: AnimatedContainer(
        duration: Duration(milliseconds: 200),
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(28),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ]
              : [],
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: isSelected ? AppColors.textDark : AppColors.textMuted,
          ),
        ),
      ),
    );
  }

  Widget _buildMagicalPlanCard(Map<String, dynamic> plan) {
    final isRecommended = plan['isRecommended'] == true;
    final isCurrent = plan['isCurrent'] == true;
    final price = _getPrice(plan);
    final savings = _getSavings(plan);
    final color = plan['color'] as Color;
    final accent = plan['accent'] as Color;

    return Container(
      margin: EdgeInsets.only(bottom: 24),
      child: Stack(
        children: [
          Container(
            padding: EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(32),
              border: Border.all(
                color: isRecommended ? accent : Colors.transparent,
                width: 2,
              ),
              boxShadow: [
                BoxShadow(
                  color: accent.withOpacity(0.1),
                  blurRadius: 20,
                  offset: Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: color,
                        shape: BoxShape.circle,
                      ),
                      child: Text(plan['icon'], style: TextStyle(fontSize: 24)),
                    ),
                    if (isRecommended)
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(colors: [accent, accent.withOpacity(0.8)]),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          '✨ Best Magic',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                  ],
                ),
                SizedBox(height: 16),
                Text(
                  plan['name'],
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textDark,
                  ),
                ),
                Text(
                  plan['subtitle'],
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textMuted,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                SizedBox(height: 20),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      '\$${price.toStringAsFixed(2)}',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textDark,
                      ),
                    ),
                    Text(
                      '/mo',
                      style: TextStyle(
                        fontSize: 16,
                        color: AppColors.textMuted,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    if (_billingPeriod == 'annual' && savings > 0) ...[
                      SizedBox(width: 12),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.success.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'Save $savings%',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppColors.success,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                SizedBox(height: 24),
                ...plan['features'].map<Widget>((feature) => Padding(
                  padding: EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      Icon(
                        feature['included'] ? LucideIcons.star : LucideIcons.lock,
                        size: 18,
                        color: feature['included'] ? accent : AppColors.neutral300,
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          feature['text'],
                          style: TextStyle(
                            fontSize: 15,
                            color: feature['included'] ? AppColors.textDark : AppColors.textMuted,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      if (feature['badge'] != null)
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: accent.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            feature['badge'],
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: accent,
                            ),
                          ),
                        ),
                    ],
                  ),
                )),
                SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: isCurrent ? null : () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isCurrent ? AppColors.neutral100 : accent,
                      foregroundColor: isCurrent ? AppColors.textMuted : Colors.white,
                      elevation: isCurrent ? 0 : 8,
                      shadowColor: accent.withOpacity(0.4),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(28),
                      ),
                    ),
                    child: Text(
                      isCurrent
                          ? 'Current Adventure'
                          : plan['hasTrial'] == true
                              ? 'Start Free 7-Day Trial'
                              : 'Choose This Adventure',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMagicalFaq(Map<String, String> faq) {
    final isExpanded = _expandedFaqId == faq['id'];
    return AnimatedContainer(
      duration: Duration(milliseconds: 300),
      margin: EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isExpanded ? AppColors.primary500.withOpacity(0.3) : Colors.transparent,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary500.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () => setState(() => _expandedFaqId = isExpanded ? null : faq['id']),
            borderRadius: BorderRadius.circular(20),
            child: Padding(
              padding: EdgeInsets.all(20),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      faq['question']!,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textDark,
                      ),
                    ),
                  ),
                  Icon(
                    isExpanded ? LucideIcons.minus : LucideIcons.plus,
                    color: AppColors.primary500,
                    size: 20,
                  ),
                ],
              ),
            ),
          ),
          AnimatedCrossFade(
            firstChild: Container(),
            secondChild: Padding(
              padding: EdgeInsets.fromLTRB(20, 0, 20, 20),
              child: Text(
                faq['answer']!,
                style: TextStyle(
                  fontSize: 15,
                  color: AppColors.textBody,
                  height: 1.6,
                ),
              ),
            ),
            crossFadeState: isExpanded ? CrossFadeState.showSecond : CrossFadeState.showFirst,
            duration: Duration(milliseconds: 200),
          ),
        ],
      ),
    );
  }

  Widget _buildTrustIcon(IconData icon, Color color) {
    return Container(
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: color, size: 24),
    );
  }

  Widget _buildCircularButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Icon(
          icon,
          size: 20,
          color: AppColors.textDark,
        ),
      ),
    );
  }
}
