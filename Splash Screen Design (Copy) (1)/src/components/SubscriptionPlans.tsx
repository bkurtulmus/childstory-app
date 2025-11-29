import { useState } from 'react';
import { ArrowLeft, Check, X, Shield, Lock, CheckCircle, ChevronDown, Sparkles } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  subtitle: string;
  monthlyPrice: number;
  annualPrice: number;
  features: Array<{
    text: string;
    included: boolean;
    badge?: string;
  }>;
  isRecommended?: boolean;
  isCurrent?: boolean;
  hasTrial?: boolean;
}

interface SubscriptionPlansProps {
  currentPlan?: string;
  isAtLimit?: boolean;
  onSelectPlan: (planId: string, billingPeriod: 'monthly' | 'annual') => void;
  onBack: () => void;
  onRestorePurchase?: () => void;
}

export function SubscriptionPlans({
  currentPlan = 'free',
  isAtLimit = false,
  onSelectPlan,
  onBack,
  onRestorePurchase,
}: SubscriptionPlansProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      subtitle: 'Try it out',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        { text: '3 stories per month', included: true },
        { text: 'Basic themes', included: true },
        { text: 'Email support', included: true },
        { text: 'No priority generation', included: false },
        { text: 'No interactive choices', included: false },
      ],
      isCurrent: currentPlan === 'free',
    },
    {
      id: 'premium',
      name: 'Premium',
      subtitle: 'For storytellers',
      monthlyPrice: 9.99,
      annualPrice: 7.99,
      features: [
        { text: '20 stories per month', included: true },
        { text: 'All themes & tones', included: true },
        { text: 'Interactive choices', included: true },
        { text: 'Priority generation', included: true },
        { text: 'Audio narration', included: true, badge: 'coming soon' },
      ],
      isRecommended: true,
      isCurrent: currentPlan === 'premium',
      hasTrial: true,
    },
    {
      id: 'family',
      name: 'Family',
      subtitle: 'For multiple children',
      monthlyPrice: 14.99,
      annualPrice: 11.99,
      features: [
        { text: 'Unlimited stories', included: true },
        { text: 'Up to 5 children', included: true },
        { text: 'All themes & features', included: true },
        { text: 'Priority support', included: true },
        { text: 'Early access to new features', included: true },
      ],
      isCurrent: currentPlan === 'family',
    },
  ];

  const faqs = [
    {
      id: '1',
      question: 'What happens after my trial?',
      answer:
        'After your 7-day free trial, you\'ll be charged the monthly subscription fee. You can cancel anytime before the trial ends to avoid charges.',
    },
    {
      id: '2',
      question: 'Can I change plans anytime?',
      answer:
        'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we\'ll prorate your billing accordingly.',
    },
    {
      id: '3',
      question: 'How do I cancel?',
      answer:
        'You can cancel your subscription anytime from the Settings page. Your access will continue until the end of your billing period.',
    },
  ];

  const getPrice = (plan: Plan) => {
    if (billingPeriod === 'monthly') {
      return plan.monthlyPrice;
    }
    return plan.annualPrice;
  };

  const getSavings = (plan: Plan) => {
    if (billingPeriod === 'annual' && plan.monthlyPrice > 0) {
      const monthlyCost = plan.monthlyPrice * 12;
      const annualCost = plan.annualPrice * 12;
      const savings = Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
      return savings;
    }
    return 0;
  };

  // Localized currency formatter
  const currency = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });
  const formatPrice = (n: number) => currency.format(n);

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: '100%',
        maxWidth: 'var(--container-max-width)',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        margin: '0 auto',
      }}
    >
      {/* AppBar */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{
          height: '56px',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--elevation-1)',
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center transition-opacity hover:opacity-70"
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: 'transparent',
          }}
          aria-label="Back"
        >
          <ArrowLeft size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
        <h2>Choose a Plan</h2>
        <div style={{ width: '44px' }} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Banner */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            height: '220px',
            background:
              'linear-gradient(135deg, rgba(125, 182, 248, 0.08) 0%, rgba(246, 166, 215, 0.08) 100%)',
            padding: '32px 24px',
          }}
        >
          {/* Illustration */}
          <BookWithSparklesIllustration />
          <h1
            className="mb-2 text-center mt-4"
            style={{
              fontSize: 'var(--text-display-md)',
              fontWeight: 'var(--weight-heading)',
              color: 'var(--text-primary)',
            }}
          >
            Unlock more stories
          </h1>
          <p
            className="text-center"
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-primary)',
              opacity: 0.9,
            }}
          >
            Create unlimited magical tales
          </p>
        </div>

        {/* Content Area */}
        <div className="px-6 py-6">
          {/* Context Banner */}
          {isAtLimit && (
            <div
              className="mb-8"
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--elevation-2)',
                background: 'rgba(251, 191, 36, 0.12)',
              }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle size={24} style={{ color: 'var(--semantic-warning)', flexShrink: 0 }} />
                <div>
                  <p
                    className="mb-1"
                    style={{
                      fontSize: 'var(--text-body-md)',
                      fontWeight: 'var(--weight-subheading)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    You've reached your monthly limit
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Upgrade to keep creating
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Billing Period Toggle */}
          <div className="flex justify-center mb-6">
            <div
              className="flex"
              style={{
                width: '240px',
                height: '44px',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setBillingPeriod('monthly')}
                className="flex-1 transition-all hit-48"
                aria-pressed={billingPeriod === 'monthly'}
                style={{
                  backgroundColor:
                    billingPeriod === 'monthly' ? 'var(--brand-primary)' : 'transparent',
                  color: billingPeriod === 'monthly' ? 'white' : 'var(--text-primary)',
                  fontSize: 'var(--text-body-md)',
                  fontWeight: 'var(--weight-medium)',
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className="flex-1 transition-all hit-48"
                aria-pressed={billingPeriod === 'annual'}
                style={{
                  backgroundColor:
                    billingPeriod === 'annual' ? 'var(--brand-primary)' : 'transparent',
                  color: billingPeriod === 'annual' ? 'white' : 'var(--text-primary)',
                  fontSize: 'var(--text-body-md)',
                  fontWeight: 'var(--weight-medium)',
                }}
              >
                Annual
              </button>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="space-y-6">
            {plans.map((plan) => {
              const price = getPrice(plan);
              const savings = getSavings(plan);

              return (
                <div
                  key={plan.id}
                  className="relative"
                  role="article"
                  aria-labelledby={`plan-${plan.id}-title`}
                  style={{
                    padding: '24px',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: plan.isRecommended ? 'var(--elevation-2)' : 'var(--elevation-1)',
                    backgroundColor: '#FFFFFF',
                    border: plan.isRecommended
                      ? '2px solid var(--brand-primary)'
                      : '1px solid var(--neutral-200)',
                    ...(plan.isRecommended && {
                      boxShadow: '0 0 20px rgba(125, 182, 248, 0.12), var(--elevation-2)',
                    }),
                  }}
                >
                  {/* Badges */}
                  {plan.isRecommended && (
                    <div
                      className="absolute top-4 right-4"
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'var(--brand-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-caption)',
                        fontWeight: 'var(--weight-medium)',
                      }}
                    >
                      Recommended
                    </div>
                  )}
                  {billingPeriod === 'annual' && getSavings(plan) > 0 && (
                    <div
                      className="absolute top-4 left-4"
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'var(--semantic-success)',
                        color: 'white',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-caption)',
                        fontWeight: 'var(--weight-medium)',
                      }}
                    >
                      Best value
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-5">
                    <h2 id={`plan-${plan.id}-title`} className="mb-1">{plan.name}</h2>
                    <p
                      style={{
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span
                      style={{
                        fontSize: 'var(--text-display-md)',
                        fontWeight: 'var(--weight-heading)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {formatPrice(price)}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--text-body-md)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      /month
                    </span>
                    {savings > 0 && billingPeriod === 'annual' && (
                      <div
                        style={{
                          marginLeft: '8px',
                          padding: '4px 8px',
                          backgroundColor: 'var(--semantic-success)',
                          color: 'white',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-caption)',
                          fontWeight: 'var(--weight-medium)',
                        }}
                      >
                        Save {savings}%
                      </div>
                    )}
                  </div>
                  {billingPeriod === 'annual' && (
                    <div className="mb-5" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>
                      Billed yearly
                    </div>
                  )}

                  {/* Features */}
                  <div className="space-y-3 mb-5">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check size={16} style={{ color: 'var(--semantic-success)', flexShrink: 0 }} />
                        ) : (
                          <X size={16} style={{ color: 'var(--neutral-300)', flexShrink: 0 }} />
                        )}
                        <span
                          style={{
                            fontSize: 'var(--text-body-md)',
                            color: feature.included ? 'var(--text-secondary)' : 'var(--text-muted)',
                          }}
                        >
                          {feature.text}
                        </span>
                        {feature.badge && (
                          <span
                            style={{
                              padding: '2px 6px',
                              backgroundColor: 'var(--brand-accent)',
                              color: 'var(--brand-primary)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: 'var(--text-caption)',
                              fontWeight: 'var(--weight-medium)',
                            }}
                          >
                            {feature.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => !plan.isCurrent && onSelectPlan(plan.id, billingPeriod)}
                    disabled={plan.isCurrent}
                    className="w-full transition-all active:scale-98 disabled:opacity-50 hit-48"
                    style={{
                      height: plan.isCurrent ? '44px' : '48px',
                      backgroundColor: plan.isCurrent
                        ? 'transparent'
                        : 'var(--brand-primary)',
                      color: plan.isCurrent ? 'var(--text-primary)' : 'white',
                      border: plan.isCurrent ? '1px solid var(--neutral-300)' : 'none',
                      borderRadius: 'var(--radius-pill)',
                      fontWeight: 'var(--weight-medium)',
                      fontSize: 'var(--text-body-lg)',
                    }}
                    aria-label={plan.isCurrent ? `${plan.name} is your current plan` : `Select the ${plan.name} plan`}
                  >
                    {plan.isCurrent
                      ? 'Current Plan'
                      : plan.hasTrial
                      ? 'Start Free Trial'
                      : billingPeriod === 'annual' && getSavings(plan) > 0
                      ? `Choose Plan — Save ${getSavings(plan)}%`
                      : 'Choose Plan'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pricing note */}
          <p className="mt-2 mb-6 text-center" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>
            Prices shown are per month. Annual option is billed yearly.
          </p>

          {/* Trust Section */}
          <div
            className="mt-8"
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--neutral-200)',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div className="flex justify-center gap-6 mb-3">
              <Shield size={24} style={{ color: 'var(--brand-primary)' }} />
              <Lock size={24} style={{ color: 'var(--brand-primary)' }} />
              <CheckCircle size={24} style={{ color: 'var(--brand-primary)' }} />
            </div>
            <p
              className="text-center"
              style={{
                fontSize: 'var(--text-body-sm)',
                color: 'var(--text-muted)',
              }}
            >
              Cancel anytime • Safe & private • Secure payments
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="mt-8">
            <h3 className="mb-4">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  style={{
                    border: '1px solid var(--neutral-200)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 transition-opacity hover:opacity-70"
                    style={{
                      height: '56px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--text-body-md)',
                        fontWeight: 'var(--weight-subheading)',
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                      }}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      style={{
                        color: 'var(--text-muted)',
                        transform: expandedFaq === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </button>
                  {expandedFaq === faq.id && (
                    <div
                      style={{
                        padding: '16px',
                        borderTop: '1px solid var(--neutral-200)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: 'var(--text-body-md)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Restore Purchase Link */}
          {onRestorePurchase && (
            <div className="mt-6 text-center">
              <button
                onClick={onRestorePurchase}
                className="transition-opacity hover:opacity-70"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--brand-primary)',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 'var(--weight-medium)',
                  padding: '8px',
                }}
              >
                Restore purchase
              </button>
            </div>
          )}

          {/* Bottom spacing */}
          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}

// Book with sparkles illustration
function BookWithSparklesIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book */}
      <rect x="35" y="45" width="50" height="40" rx="4" fill="#7DB6F8" opacity="0.3" />
      <line x1="60" y1="45" x2="60" y2="85" stroke="#7DB6F8" strokeWidth="2" opacity="0.5" />
      
      {/* Floating sparkles */}
      <path
        d="M25 30 L27 36 L33 38 L27 40 L25 46 L23 40 L17 38 L23 36 Z"
        fill="#F6A6D7"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 -5; 0 0"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </path>
      <path
        d="M90 35 L91.5 39 L95.5 40.5 L91.5 42 L90 46 L88.5 42 L84.5 40.5 L88.5 39 Z"
        fill="#B3E6C5"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 -8; 0 0"
          dur="2.5s"
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path
        d="M60 20 L61 23 L64 24 L61 25 L60 28 L59 25 L56 24 L59 23 Z"
        fill="#C8C5FF"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 -3; 0 0"
          dur="1.8s"
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

// AlertCircle icon component (since lucide-react import might not have it)
function AlertCircle({ size, style }: { size: number; style: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
