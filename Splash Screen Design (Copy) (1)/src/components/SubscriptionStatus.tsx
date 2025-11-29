import { useState } from 'react';
import { ArrowLeft, Calendar, Check, X, Shield, Lock, CheckCircle, AlertTriangle, CreditCard, FileText, ChevronDown } from 'lucide-react';
import { toast } from '../utils/toast';

interface SubscriptionStatusProps {
  plan: {
    name: string;
    price: number;
    status: 'active' | 'trial' | 'expired' | 'canceled';
    renewalDate: string;
    storiesUsed: number;
    storiesTotal: number;
    trialDaysLeft?: number;
  };
  paymentMethod?: {
    type: string;
    last4: string;
  };
  onBack: () => void;
  onManagePlan: () => void;
  onCancel: () => void;
  onUpgrade: () => void;
  onChangePayment: () => void;
  onViewHistory: () => void;
}

export function SubscriptionStatus({
  plan,
  paymentMethod,
  onBack,
  onManagePlan,
  onCancel,
  onUpgrade,
  onChangePayment,
  onViewHistory,
}: SubscriptionStatusProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showHistorySheet, setShowHistorySheet] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  // Return early if plan is not provided
  if (!plan) {
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
        <div className="flex items-center justify-center flex-1">
          <p style={{ color: 'var(--text-secondary)' }}>Loading subscription details...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    const styles = {
      active: { bg: 'var(--semantic-success)', text: 'Active' },
      trial: { bg: 'var(--semantic-info)', text: 'Trial' },
      expired: { bg: 'var(--neutral-600)', text: 'Expired' },
      canceled: { bg: 'var(--semantic-error)', text: 'Canceled' },
    };
    return styles[plan.status];
  };

  const getRenewalText = () => {
    if (plan.status === 'trial' && plan.trialDaysLeft) {
      return `Trial ends in ${plan.trialDaysLeft} days`;
    }
    if (plan.status === 'canceled') {
      return `Expires on ${plan.renewalDate}`;
    }
    return `Renews on ${plan.renewalDate}`;
  };

  const usagePercent = (plan.storiesUsed / plan.storiesTotal) * 100;
  const isAtLimit = usagePercent >= 100;

  const statusBadge = getStatusBadge();

  const features = [
    { text: '20 stories per month', included: true },
    { text: 'Interactive choices', included: true },
    { text: 'Priority generation', included: true },
    { text: 'All themes & tones', included: true },
    { text: 'Audio narration', included: false, upgradable: true },
    { text: 'Unlimited stories', included: false, upgradable: true },
  ];

  const billingHistory = [
    { id: '1', date: 'Nov 15, 2025', description: 'Premium Plan - Monthly', amount: 9.99, status: 'Paid' },
    { id: '2', date: 'Oct 15, 2025', description: 'Premium Plan - Monthly', amount: 9.99, status: 'Paid' },
    { id: '3', date: 'Sep 15, 2025', description: 'Premium Plan - Monthly', amount: 9.99, status: 'Paid' },
  ];

  const cancelReasons = ['Too expensive', 'Not using enough', 'Missing features', 'Other'];

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    onCancel();
    toast.success('Subscription canceled', 'Your subscription has been canceled successfully.');
  };

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
        <h2>Subscription</h2>
        <button
          onClick={() => setShowHistorySheet(true)}
          className="flex items-center justify-center transition-opacity hover:opacity-70"
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: 'transparent',
          }}
          aria-label="Billing history"
        >
          <FileText size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
      </div>

      {/* Limit Reached Banner */}
      {isAtLimit && (
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{
            background: 'rgba(251, 191, 36, 0.16)',
          }}
        >
          <div className="flex items-center gap-3 flex-1">
            <AlertTriangle size={20} style={{ color: 'var(--semantic-warning)' }} />
            <span
              style={{
                fontSize: 'var(--text-body-md)',
                fontWeight: 'var(--weight-subheading)',
                color: 'var(--text-primary)',
              }}
            >
              You've reached your monthly limit
            </span>
          </div>
          <button
            onClick={onUpgrade}
            className="transition-opacity hover:opacity-70"
            style={{
              width: '100px',
              height: '36px',
              backgroundColor: 'transparent',
              border: '1px solid var(--semantic-warning)',
              color: 'var(--semantic-warning)',
              borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 'var(--weight-medium)',
            }}
          >
            Upgrade
          </button>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Status Card */}
        <div
          className="mb-8"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--elevation-2)',
            background: 'linear-gradient(135deg, rgba(125, 182, 248, 0.04) 0%, transparent 100%)',
          }}
        >
          {/* Plan Header */}
          <div className="flex items-center justify-between mb-4">
            <h2>{plan.name}</h2>
            <div
              style={{
                padding: '4px 8px',
                backgroundColor: statusBadge.bg,
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-caption)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              {statusBadge.text}
            </div>
          </div>

          {/* Renewal Info */}
          <div className="flex items-center gap-3 mb-6">
            <Calendar size={20} style={{ color: 'var(--brand-primary)' }} />
            <span
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              {getRenewalText()}
            </span>
          </div>

          {plan.status === 'trial' && typeof plan.trialDaysLeft === 'number' && plan.trialDaysLeft > 0 && (
            <div
              className="mb-4"
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(96, 165, 250, 0.12)',
                border: '1px solid var(--semantic-info)',
              }}
              role="status"
              aria-live="polite"
            >
              <span
                style={{
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--text-secondary)',
                }}
              >
                Free trial: {plan.trialDaysLeft} day{plan.trialDaysLeft !== 1 ? 's' : ''} left
              </span>
            </div>
          )}

          {/* Usage Meter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                style={{
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 'var(--weight-subheading)',
                  color: 'var(--text-primary)',
                }}
              >
                Stories this month
              </span>
            </div>
            <div
              style={{
                height: '12px',
                backgroundColor: 'var(--neutral-200)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${usagePercent}%`,
                  height: '100%',
                  backgroundColor: 'var(--brand-primary)',
                }}
              />
            </div>
            <p
              className="mt-2"
              style={{
                fontSize: 'var(--text-body-sm)',
                color: 'var(--text-muted)',
              }}
            >
              {plan.storiesUsed} of {plan.storiesTotal} stories used
            </p>
            <div className="mt-2 flex items-center gap-4" aria-hidden="true">
              <div className="flex items-center gap-2">
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)' }} />
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>Used</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--neutral-300)' }} />
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>Remaining</span>
              </div>
            </div>
            {!isAtLimit && usagePercent >= 80 && (
              <div
                className="mt-3"
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(251, 191, 36, 0.12)',
                  border: '1px solid var(--semantic-warning)',
                }}
              >
                <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)' }}>
                  You’re nearing your monthly limit. Consider upgrading your plan.
                </span>
              </div>
            )}
          </div>

          {/* CTA Row */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onManagePlan}
              className="flex-1 transition-all active:scale-98"
              style={{
                height: '48px',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-lg)',
              }}
            >
              Manage Plan
            </button>
            {plan.status === 'active' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 transition-all active:scale-98"
                style={{
                  height: '48px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--semantic-error)',
                  color: 'var(--semantic-error)',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 'var(--weight-medium)',
                  fontSize: 'var(--text-body-lg)',
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Benefits Card */}
        <div className="mb-8">
          <h3 className="mb-4">What's included</h3>
          <div
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--elevation-1)',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between" style={{ minHeight: '40px' }}>
                  <div className="flex items-center gap-3">
                    {feature.included ? (
                      <Check size={20} style={{ color: 'var(--semantic-success)' }} />
                    ) : (
                      <Lock size={20} style={{ color: 'var(--neutral-400)' }} />
                    )}
                    <span
                      style={{
                        fontSize: 'var(--text-body-md)',
                        color: feature.included ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}
                    >
                      {feature.text}
                    </span>
                  </div>
                  {feature.upgradable && (
                    <button
                      onClick={onUpgrade}
                      style={{
                        fontSize: 'var(--text-caption)',
                        fontWeight: 'var(--weight-medium)',
                        color: 'var(--brand-primary)',
                        backgroundColor: 'transparent',
                      }}
                    >
                      Upgrade
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Billing Section */}
        <div className="mb-8">
          <h3 className="mb-4">Billing & payments</h3>
          <div
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--elevation-1)',
              backgroundColor: '#FFFFFF',
            }}
          >
            {paymentMethod && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CreditCard size={24} style={{ color: 'var(--brand-primary)' }} />
                    <span
                      style={{
                        fontSize: 'var(--text-body-md)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {paymentMethod.type} •••• {paymentMethod.last4}
                    </span>
                  </div>
                  <button
                    onClick={onChangePayment}
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      fontWeight: 'var(--weight-medium)',
                      color: 'var(--brand-primary)',
                      backgroundColor: 'transparent',
                    }}
                  >
                    Change
                  </button>
                </div>
                <div style={{ height: '1px', backgroundColor: 'var(--neutral-200)' }} />
              </>
            )}

            <div className="flex items-center justify-between my-4">
              <div className="flex items-center gap-3">
                <Calendar size={24} style={{ color: 'var(--brand-primary)' }} />
                <div>
                  <div
                    style={{
                      fontSize: 'var(--text-body-md)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Next billing: {plan.renewalDate}
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: 'var(--text-body-md)',
                  fontWeight: 'var(--weight-subheading)',
                  color: 'var(--text-primary)',
                }}
              >
                ${plan.price.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => setShowHistorySheet(true)}
              className="transition-opacity hover:opacity-70"
              style={{
                fontSize: 'var(--text-body-md)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--brand-primary)',
                backgroundColor: 'transparent',
              }}
            >
              View billing history &gt;
            </button>
          </div>
        </div>

        {/* Bottom spacing */}
        <div style={{ height: '48px' }} />
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center px-6"
          style={{
            backgroundColor: 'rgba(16, 24, 40, 0.4)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '343px',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#FFFFFF',
              textAlign: 'center',
            }}
          >
            <div className="flex justify-center mb-4">
              <AlertTriangle size={56} style={{ color: 'var(--semantic-warning)' }} />
            </div>
            <h2 className="mb-3">Cancel your subscription?</h2>
            <p
              className="mb-5"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              You'll lose access to Premium features.
            </p>

            {/* Reason Selection */}
            <div className="mb-6 text-left">
              <label
                className="block mb-3"
                style={{
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 'var(--weight-subheading)',
                  color: 'var(--text-primary)',
                }}
              >
                Help us improve (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {cancelReasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleReasonToggle(reason)}
                    className="transition-all"
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: selectedReasons.includes(reason)
                        ? 'var(--brand-accent)'
                        : 'transparent',
                      border: `1px solid ${selectedReasons.includes(reason)
                          ? 'var(--brand-primary)'
                          : 'var(--neutral-200)'
                        }`,
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCancelConfirm}
              className="w-full mb-3 transition-all active:scale-98"
              style={{
                height: '48px',
                backgroundColor: 'var(--semantic-error)',
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-lg)',
              }}
            >
              Cancel Subscription
            </button>
            <button
              onClick={() => setShowCancelModal(false)}
              className="w-full transition-opacity hover:opacity-70"
              style={{
                height: '44px',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-body-md)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              Keep Subscription
            </button>
          </div>
        </div>
      )}

      {/* Billing History Sheet */}
      {showHistorySheet && (
        <div
          className="absolute inset-0 z-50"
          onClick={() => setShowHistorySheet(false)}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px',
              maxHeight: '70%',
              overflow: 'auto',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2>Billing History</h2>
              <button
                onClick={() => setShowHistorySheet(false)}
                aria-label="Close"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'transparent',
                }}
              >
                <X size={24} style={{ color: 'var(--text-primary)' }} />
              </button>
            </div>

            <div className="space-y-0">
              {billingHistory.map((transaction, index) => (
                <div key={transaction.id}>
                  <div className="py-4">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div
                          style={{
                            fontSize: 'var(--text-body-md)',
                            fontWeight: 'var(--weight-subheading)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {transaction.date}
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--text-body-sm)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {transaction.description}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          style={{
                            fontSize: 'var(--text-body-md)',
                            fontWeight: 'var(--weight-medium)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          ${transaction.amount.toFixed(2)}
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--text-caption)',
                            color: 'var(--semantic-success)',
                          }}
                        >
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                    <button
                      className="transition-opacity hover:opacity-70"
                      style={{
                        fontSize: 'var(--text-caption)',
                        fontWeight: 'var(--weight-medium)',
                        color: 'var(--brand-primary)',
                        backgroundColor: 'transparent',
                      }}
                    >
                      Download
                    </button>
                  </div>
                  {index < billingHistory.length - 1 && (
                    <div style={{ height: '1px', backgroundColor: 'var(--neutral-100)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}