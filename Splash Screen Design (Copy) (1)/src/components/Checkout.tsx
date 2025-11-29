import { useState } from 'react';
import { X, CreditCard, Info, Lock, Shield, CheckCircle, Check } from 'lucide-react';

interface CheckoutProps {
  planName: string;
  planPrice: number;
  billingPeriod: 'monthly' | 'annual';
  hasTrial?: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onChangePlan: () => void;
}

type PaymentMethod = 'card' | 'apple-pay' | 'google-pay' | 'paypal';

export function Checkout({
  planName = 'Premium Plan',
  planPrice = 0,
  billingPeriod = 'monthly',
  hasTrial = false,
  onClose,
  onSuccess,
  onChangePlan,
}: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Validation
  const [cardNumberError, setCardNumberError] = useState('');
  const [expiryError, setExpiryError] = useState('');
  const [cvvError, setCvvError] = useState('');

  const totalToday = hasTrial ? 0 : planPrice;

  const handleCardNumberChange = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Format with spaces every 4 digits
    const formatted = digits.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted.slice(0, 19)); // 16 digits + 3 spaces
    setCardNumberError('');
  };

  const handleExpiryChange = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Format as MM / YY
    let formatted = digits;
    if (digits.length >= 2) {
      formatted = `${digits.slice(0, 2)} / ${digits.slice(2, 4)}`;
    }
    setExpiry(formatted.slice(0, 7));
    setExpiryError('');
  };

  const handleCvvChange = (value: string) => {
    const digits = value.replace(/\D/g, '');
    setCvv(digits.slice(0, 4));
    setCvvError('');
  };

  const validateCard = () => {
    let isValid = true;

    if (paymentMethod === 'card') {
      const digits = cardNumber.replace(/\s/g, '');
      if (digits.length !== 16) {
        setCardNumberError('Invalid card number');
        isValid = false;
      }

      const expiryDigits = expiry.replace(/\D/g, '');
      if (expiryDigits.length !== 4) {
        setExpiryError('Invalid expiry date');
        isValid = false;
      } else {
        const month = parseInt(expiryDigits.slice(0, 2));
        const year = parseInt(expiryDigits.slice(2, 4));
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
          setExpiryError('Card is expired');
          isValid = false;
        }
      }

      if (cvv.length < 3) {
        setCvvError('Invalid CVV');
        isValid = false;
      }
    }

    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      isValid = false;
    }

    return isValid;
  };

  const handleConfirm = async () => {
    setError('');

    if (!validateCard()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success (90% success rate for demo)
    const success = Math.random() > 0.1;

    setIsProcessing(false);

    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } else {
      setError('Payment failed. Please try again.');
    }
  };

  if (showSuccess) {
    return (
      <div
        className="relative flex flex-col items-center justify-center"
        style={{
          width: '100%',
        maxWidth: 'var(--container-max-width)',
        minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          margin: '0 auto',
        }}
      >
        {/* Subtle confetti animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                width: '6px',
                height: '6px',
                backgroundColor: ['#7DB6F8', '#F6A6D7', '#B3E6C5', '#C8C5FF'][i % 4],
                borderRadius: '50%',
                animation: `fall ${2 + Math.random()}s linear`,
                animationDelay: `${Math.random() * 0.5}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <div
            className="flex items-center justify-center mb-6"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--semantic-success)',
              borderRadius: '50%',
            }}
          >
            <Check size={40} style={{ color: 'white' }} />
          </div>
          <h2 className="mb-3">Welcome to {planName}!</h2>
          <p
            className="mb-8"
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-secondary)',
            }}
          >
            Your subscription is active
          </p>
          <button
            onClick={onSuccess}
            className="w-full mb-3 transition-all active:scale-98"
            style={{
              maxWidth: '280px',
              height: '48px',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-lg)',
            }}
          >
            Go to Dashboard
          </button>
          <button
            onClick={onSuccess}
            className="transition-opacity hover:opacity-70"
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-body-md)',
              fontWeight: 'var(--weight-medium)',
            }}
          >
            Start Creating
          </button>
        </div>

        <style>{`
          @keyframes fall {
            to {
              transform: translateY(900px) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

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
      {/* Processing Overlay */}
      {isProcessing && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div
                className="animate-spin"
                style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid var(--neutral-200)',
                  borderTopColor: 'var(--brand-primary)',
                  borderRadius: '50%',
                }}
              />
            </div>
            <p
              style={{
                fontSize: 'var(--text-body-lg)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-primary)',
              }}
            >
              Processing payment…
            </p>
          </div>
        </div>
      )}

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
          onClick={onClose}
          className="flex items-center justify-center transition-opacity hover:opacity-70"
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: 'transparent',
          }}
          aria-label="Close"
        >
          <X size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
        <h2>Checkout</h2>
        <div style={{ width: '44px' }} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Order Summary Card */}
        <div
          className="mb-8"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--elevation-2)',
            backgroundColor: '#F8FAFC',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3>{planName}</h3>
            <h3 style={{ color: 'var(--brand-primary)' }}>
              ${planPrice.toFixed(2)}/mo
            </h3>
          </div>
          <p
            className="mb-4"
            style={{
              fontSize: 'var(--text-body-sm)',
              color: 'var(--text-muted)',
            }}
          >
            Billed {billingPeriod}
          </p>

          <div style={{ height: '1px', backgroundColor: 'var(--neutral-200)', margin: '16px 0' }} />

          {hasTrial && (
            <>
              <div className="flex items-start gap-3 mb-4">
                <Info size={20} style={{ color: 'var(--semantic-info)', flexShrink: 0, marginTop: '2px' }} />
                <p
                  style={{
                    fontSize: 'var(--text-body-md)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Free for 7 days, then ${planPrice.toFixed(2)}/month
                </p>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--neutral-200)', margin: '16px 0' }} />
            </>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--text-secondary)',
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--text-secondary)',
                }}
              >
                ${planPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--text-muted)',
                }}
              >
                Taxes & fees
              </span>
              <span
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--text-muted)',
                }}
              >
                $0.00
              </span>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--neutral-200)', margin: '16px 0' }} />

          <div className="flex items-center justify-between">
            <h3>Total today</h3>
            <h3>${totalToday.toFixed(2)}</h3>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="mb-8">
          <h3 className="mb-4">Payment method</h3>

          {/* Payment Options */}
          <div className="space-y-3 mb-4">
            <button
              onClick={() => setPaymentMethod('card')}
              className="w-full flex items-center gap-4 p-4 transition-all"
              style={{
                border: `2px solid ${
                  paymentMethod === 'card' ? 'var(--brand-primary)' : 'var(--neutral-200)'
                }`,
                borderRadius: 'var(--radius-md)',
                backgroundColor: paymentMethod === 'card' ? 'rgba(125, 182, 248, 0.04)' : '#FFFFFF',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `2px solid ${
                    paymentMethod === 'card' ? 'var(--brand-primary)' : 'var(--neutral-300)'
                  }`,
                  backgroundColor: paymentMethod === 'card' ? 'var(--brand-primary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {paymentMethod === 'card' && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                    }}
                  />
                )}
              </div>
              <CreditCard size={24} style={{ color: 'var(--text-primary)' }} />
              <span
                style={{
                  fontSize: 'var(--text-body-md)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--text-primary)',
                }}
              >
                Credit or Debit Card
              </span>
            </button>
          </div>

          {/* Card Input Fields */}
          {paymentMethod === 'card' && (
            <div className="space-y-3 mb-4">
              <div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 outline-none"
                  style={{
                    height: '56px',
                    border: `1px solid ${cardNumberError ? 'var(--semantic-error)' : 'var(--neutral-200)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-body-lg)',
                    fontWeight: 'var(--weight-regular)',
                    color: 'var(--text-primary)',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                {cardNumberError && (
                  <p
                    className="mt-1"
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--semantic-error)',
                    }}
                  >
                    {cardNumberError}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    placeholder="MM / YY"
                    className="w-full px-4 outline-none"
                    style={{
                      height: '56px',
                      border: `1px solid ${expiryError ? 'var(--semantic-error)' : 'var(--neutral-200)'}`,
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-body-lg)',
                      fontWeight: 'var(--weight-regular)',
                      color: 'var(--text-primary)',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                  {expiryError && (
                    <p
                      className="mt-1"
                      style={{
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--semantic-error)',
                      }}
                    >
                      {expiryError}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => handleCvvChange(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 outline-none"
                    style={{
                      height: '56px',
                      border: `1px solid ${cvvError ? 'var(--semantic-error)' : 'var(--neutral-200)'}`,
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-body-lg)',
                      fontWeight: 'var(--weight-regular)',
                      color: 'var(--text-primary)',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                  {cvvError && (
                    <p
                      className="mt-1"
                      style={{
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--semantic-error)',
                      }}
                    >
                      {cvvError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Terms & Privacy */}
        <div className="mb-8">
          <button
            onClick={() => setAgreeToTerms(!agreeToTerms)}
            className="flex items-start gap-3 transition-opacity hover:opacity-70"
          >
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: '24px',
                height: '24px',
                border: `2px solid ${agreeToTerms ? 'var(--brand-primary)' : 'var(--neutral-300)'}`,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: agreeToTerms ? 'var(--brand-primary)' : 'transparent',
              }}
            >
              {agreeToTerms && <Check size={16} style={{ color: 'white' }} />}
            </div>
            <p
              style={{
                fontSize: 'var(--text-body-sm)',
                color: 'var(--text-secondary)',
                textAlign: 'left',
              }}
            >
              I agree to the{' '}
              <span style={{ color: 'var(--brand-primary)', fontWeight: 'var(--weight-medium)' }}>
                Terms of Service
              </span>{' '}
              and{' '}
              <span style={{ color: 'var(--brand-primary)', fontWeight: 'var(--weight-medium)' }}>
                Privacy Policy
              </span>
            </p>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mb-8">
          <div className="flex justify-center gap-6 mb-3">
            <Lock size={32} style={{ color: 'var(--semantic-success)' }} />
            <Shield size={32} style={{ color: 'var(--semantic-success)' }} />
            <CheckCircle size={32} style={{ color: 'var(--semantic-success)' }} />
          </div>
          <p
            className="text-center"
            style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--text-muted)',
            }}
          >
            Secure • Encrypted • Cancel anytime
          </p>
        </div>

        {/* Bottom spacing */}
        <div style={{ height: '100px' }} />
      </div>

      {/* Sticky Bottom Action Bar */}
      <div
        className="px-6 py-6 shrink-0"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--elevation-3)',
        }}
      >
        {error && (
          <div
            className="flex items-center gap-3 mb-4 p-3"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <X size={20} style={{ color: 'var(--semantic-error)', flexShrink: 0 }} />
            <p
              style={{
                fontSize: 'var(--text-body-sm)',
                color: 'var(--semantic-error)',
              }}
            >
              {error}
            </p>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!agreeToTerms || isProcessing}
          className="w-full mb-3 transition-all active:scale-98 disabled:opacity-40"
          style={{
            height: '48px',
            backgroundColor: agreeToTerms ? 'var(--brand-primary)' : 'var(--neutral-300)',
            color: agreeToTerms ? 'white' : 'var(--text-muted)',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 'var(--weight-medium)',
            fontSize: 'var(--text-body-lg)',
          }}
        >
          Confirm and Subscribe
        </button>
        <button
          onClick={onChangePlan}
          className="w-full transition-opacity hover:opacity-70"
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            color: 'var(--brand-primary)',
            fontSize: 'var(--text-body-sm)',
            fontWeight: 'var(--weight-medium)',
          }}
        >
          Change Plan
        </button>
      </div>
    </div>
  );
}
