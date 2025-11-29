import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

interface VerifyOTPProps {
  contact: string;
  type: 'phone' | 'email';
  onVerify: () => void;
  onBack: () => void;
  onUseDifferent: () => void;
  onSkipToHome?: () => void;
}

export function VerifyOTP({
  contact,
  type,
  onVerify,
  onBack,
  onUseDifferent,
  onSkipToHome,
}: VerifyOTPProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPasteConfirm, setShowPasteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-verify when all 6 digits are entered
  useEffect(() => {
    const code = otp.join('');
    if (code.length === 6) {
      handleVerify();
    }
  }, [otp]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-advance to next cell
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous cell on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);

    // Show paste confirmation
    setShowPasteConfirm(true);
    setTimeout(() => setShowPasteConfirm(false), 1500);

    // Focus on the next empty cell or last cell
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      return;
      // This check is now redundant due to the new validation, but kept for initial quick exit if not full.
      // The more specific error for length will be caught below.
      // return;
    }

    setIsLoading(true);
    // Simulate API verification
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Enhanced validation with specific error messages
    if (code.length < 6) {
      setError('Please enter all 6 digits of your verification code');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setIsLoading(false);
      return;
    }

    if (!/^\d+$/.test(code)) {
      setError('Verification code should only contain numbers');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setIsLoading(false);
      return;
    }

    // Simulate error for demo (check if code is "123456")
    if (code !== '123456') {
      setError('This code doesn\'t match. Please check your messages and try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    // Show success celebration
    setShowSuccess(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    onVerify();
  };

  const handleResend = async () => {
    setCanResend(false);
    setCountdown(30);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();

    // Simulate resend
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const maskContact = (contact: string, type: 'phone' | 'email') => {
    if (type === 'phone') {
      // (555) 123-4567 -> (•••) •••-4567
      const parts = contact.match(/\((\d{3})\)\s(\d{3})-(\d{4})/);
      if (parts) {
        return `(•••) •••-${parts[3]}`;
      }
    } else {
      // email@domain.com -> e••••@domain.com
      const [local, domain] = contact.split('@');
      return `${local[0]}${'•'.repeat(Math.min(local.length - 1, 4))}@${domain}`;
    }
    return contact;
  };

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: '100%',
        maxWidth: 'var(--container-max-width)',
        minHeight: '100vh',
        backgroundColor: '#FAFAFB',
        margin: '0 auto',
      }}
    >
      {/* Skip to Home Button - DEV ONLY */}
      {onSkipToHome && (
        <button
          onClick={onSkipToHome}
          className="absolute top-4 right-4 z-50 transition-smooth hover:opacity-60"
          style={{
            padding: '6px 12px',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12px',
            fontWeight: 'var(--weight-regular)',
            border: '1px solid var(--neutral-200)',
          }}
        >
          Skip to Home
        </button>
      )}

      {/* AppBar */}
      <div
        className="shrink-0"
        style={{
          height: '56px',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--elevation-1)',
        }}
      >
        <div className="flex items-center px-4 h-full">
          <button
            onClick={onBack}
            className="flex items-center justify-center transition-smooth hover:opacity-70"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--neutral-100)',
            }}
            aria-label="Back"
          >
            <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-12 pb-6">
          {/* Title */}
          <h1 className="mb-3 text-center">Enter Verification Code</h1>

          {/* Prominent Contact Display */}
          <div
            className="mb-8 p-4 text-center"
            style={{
              backgroundColor: 'rgba(125, 182, 248, 0.08)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--text-body-sm)',
                color: 'var(--text-secondary)',
                marginBottom: '4px',
              }}
            >
              Code sent to
            </p>
            <p
              style={{
                fontSize: 'var(--text-body-lg)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-primary)',
              }}
            >
              {maskContact(contact, type)}
            </p>
          </div>

          {/* OTP Input Boxes */}
          <div
            className={`flex justify-center gap-2 mb-6 ${shake ? 'shake' : ''}`}
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input transition-all"
                style={{
                  width: '48px',
                  height: '56px',
                  fontSize: '24px',
                  fontWeight: 'var(--weight-medium)',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  border: error
                    ? '2px solid #F97316'
                    : digit
                      ? '2px solid var(--brand-primary)'
                      : '1px solid var(--neutral-200)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  boxShadow: error
                    ? '0 0 0 3px rgba(249, 115, 22, 0.1)'
                    : digit
                      ? '0 0 0 3px rgba(125, 182, 248, 0.1)'
                      : 'none',
                }}
              />
            ))}
          </div>

          {/* Paste Confirmation */}
          {showPasteConfirm && (
            <div
              className="mb-4 p-3 text-center animate-fade-in"
              style={{
                backgroundColor: 'rgba(179, 230, 197, 0.15)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <p
                style={{
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--brand-accent)',
                }}
              >
                ✓ Code pasted!
              </p>
            </div>
          )}

          {/* Softer Error Message with Pulse Border */}
          {error && (
            <div
              className="mb-4 animate-fade-in pulse-border"
              style={{
                padding: '12px',
                backgroundColor: 'rgba(249, 115, 22, 0.08)',
                borderRadius: 'var(--radius-md)',
                borderLeft: '3px solid #F97316',
              }}
            >
              <p
                style={{
                  fontSize: 'var(--text-body-sm)',
                  color: '#F97316',
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Prominent Resend Timer */}
          <div className="text-center mb-6">
            {canResend ? (
              <button
                onClick={handleResend}
                className="transition-smooth hover:opacity-70"
                style={{
                  fontSize: 'var(--text-body-md)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--brand-primary)',
                }}
              >
                Resend Code
              </button>
            ) : (
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--brand-primary)',
                }}
              >
                Resend in {countdown}s
              </p>
            )}
          </div>

          {/* Use Different Contact */}
          <div className="text-center">
            <button
              onClick={onUseDifferent}
              className="transition-smooth hover:opacity-70"
              style={{
                fontSize: 'var(--text-body-sm)',
                color: 'var(--text-muted)',
              }}
            >
              Use a different {type === 'phone' ? 'number' : 'email'}
            </button>
          </div>

          {/* Loading Indicator */}
          {isLoading && !showSuccess && (
            <div className="text-center mt-6">
              <div className="inline-block spinner" />
              <p
                className="mt-2"
                style={{
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--text-muted)',
                }}
              >
                Verifying...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Success Celebration */}
      {showSuccess && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            className="text-center animate-scale-in"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: 'var(--elevation-3)',
            }}
          >
            <div
              className="mb-4 mx-auto"
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(179, 230, 197, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={48} style={{ color: 'var(--brand-accent)' }} />
            </div>
            <h2 className="mb-2">Verified!</h2>
            <p
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              Welcome to ChildStory
            </p>
          </div>

          {/* Confetti */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: '10px',
                height: '10px',
                backgroundColor: ['#7DB6F8', '#F6A6D7', '#B3E6C5', '#C8C5FF'][i % 4],
                borderRadius: i % 3 === 0 ? '50%' : '0',
                animation: `confetti-fall ${1.5 + Math.random()}s linear`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid var(--neutral-200);
          border-top-color: var(--brand-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .shake {
          animation: shake 0.6s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        .pulse-border {
          animation: pulse-border 0.5s ease-out;
        }

        @keyframes pulse-border {
          0% {
            border-left-width: 3px;
          }
          50% {
            border-left-width: 6px;
          }
          100% {
            border-left-width: 3px;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes confetti-fall {
          to {
            transform: translateY(900px) rotate(720deg);
            opacity: 0;
          }
        }

        /* iOS numeric keyboard */
        input[inputmode="numeric"] {
          -webkit-appearance: none;
        }
      `}</style>
    </div>
  );
}
