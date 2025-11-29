import { useState } from 'react';
import { HelpCircle, Phone, Mail, Lock, Users, CheckCircle2, Sparkles } from 'lucide-react';

interface AuthRequestOTPProps {
  onSendCode: (contact: string, type: 'phone' | 'email') => void;
  onHelp: () => void;
  onSkipToHome?: () => void;
}

export function AuthRequestOTP({ onSendCode, onHelp, onSkipToHome }: AuthRequestOTPProps) {
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);

  const handleSendCode = async () => {
    setError('');

    // Validation
    if (mode === 'phone') {
      const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
      if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
        setError('Please enter a valid phone number');
        return;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    // Show success animation
    setShowSuccess(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    onSendCode(mode === 'phone' ? phoneNumber : email, mode);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendCode();
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-16 pb-6">
          {/* Helper Illustration - More Prominent */}
          <div className="flex justify-center mb-6">
            <div
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: 'rgba(200, 197, 255, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Mail size={56} style={{ color: 'var(--brand-enchant)' }} />

              {/* Sparkle decorations */}
              <Sparkles
                size={20}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '15px',
                  color: 'var(--brand-accent)',
                }}
              />
            </div>
          </div>

          {/* Title and Description */}
          <h1 className="mb-3 text-center">Welcome to ChildStory</h1>
          <p
            className="mb-8 text-center"
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
            }}
          >
            Sign in to create magical stories for your little ones
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Integrated Phone/Email Toggle */}
            <div
              className="mb-6"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '6px',
                display: 'flex',
                gap: '6px',
              }}
            >
              <button
                type="button"
                onClick={() => setMode('phone')}
                className="flex-1 flex items-center justify-center gap-2 transition-smooth"
                style={{
                  height: '44px',
                  backgroundColor: mode === 'phone' ? 'var(--brand-primary)' : 'transparent',
                  color: mode === 'phone' ? 'white' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 'var(--weight-medium)',
                }}
              >
                <Phone size={18} />
                Phone
              </button>
              <button
                type="button"
                onClick={() => setMode('email')}
                className="flex-1 flex items-center justify-center gap-2 transition-smooth"
                style={{
                  height: '44px',
                  backgroundColor: mode === 'email' ? 'var(--brand-primary)' : 'transparent',
                  color: mode === 'email' ? 'white' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 'var(--weight-medium)',
                }}
              >
                <Mail size={18} />
                Email
              </button>
            </div>

            {/* Input Field with Softer Focus Glow */}
            <div className="mb-2 relative">
              <label
                htmlFor="contact-input"
                style={{
                  display: 'block',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                {mode === 'phone' ? 'Phone Number' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  id="contact-input"
                  type={mode === 'phone' ? 'tel' : 'email'}
                  value={mode === 'phone' ? phoneNumber : email}
                  onChange={mode === 'phone' ? handlePhoneChange : handleEmailChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={mode === 'phone' ? '(555) 123-4567' : 'you@example.com'}
                  className="w-full transition-all duration-200"
                  style={{
                    height: '52px',
                    paddingLeft: '48px',
                    paddingRight: '16px',
                    backgroundColor: '#FFFFFF',
                    border: error ? '2px solid #F97316' : isFocused ? '2px solid var(--brand-primary)' : '1px solid var(--neutral-200)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--text-body-md)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    boxShadow: isFocused ? '0 0 0 4px rgba(125, 182, 248, 0.15)' : error ? '0 0 0 4px rgba(249, 115, 22, 0.1)' : 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: isFocused ? 'var(--brand-primary)' : 'var(--text-muted)',
                    transition: 'color 0.2s',
                  }}
                >
                  {mode === 'phone' ? <Phone size={20} /> : <Mail size={20} />}
                </div>

                {/* Contextual Help Tooltip */}
                {isFocused && (
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onMouseEnter={() => setShowHelpTooltip(true)}
                    onMouseLeave={() => setShowHelpTooltip(false)}
                  >
                    <button
                      type="button"
                      onClick={onHelp}
                      className="transition-smooth hover:opacity-70"
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <HelpCircle size={20} style={{ color: 'var(--text-muted)' }} />
                    </button>

                    {showHelpTooltip && (
                      <div
                        className="absolute right-0 top-8 z-10 animate-fade-in"
                        style={{
                          width: '200px',
                          padding: '8px 12px',
                          backgroundColor: 'var(--text-primary)',
                          color: 'white',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-caption)',
                          boxShadow: 'var(--elevation-2)',
                        }}
                      >
                        We'll send you a verification code
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Gentle Error Message */}
            {error && (
              <div
                className="mb-4 animate-fade-in"
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

            {/* Trust Indicators */}
            <div
              className="mb-6 p-4"
              style={{
                backgroundColor: 'rgba(125, 182, 248, 0.06)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <Lock size={18} style={{ color: 'var(--brand-primary)', marginTop: '2px' }} />
                <div>
                  <p
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      fontWeight: 'var(--weight-medium)',
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                    }}
                  >
                    Your data is encrypted
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-caption)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    We use industry-standard encryption to keep your family safe
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users size={18} style={{ color: 'var(--brand-primary)', marginTop: '2px' }} />
                <div>
                  <p
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      fontWeight: 'var(--weight-medium)',
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                    }}
                  >
                    Join 10,000+ families
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-caption)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Creating magical stories every day
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || showSuccess}
              className="w-full transition-smooth active:scale-press disabled:opacity-70"
              style={{
                height: '52px',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--text-body-lg)',
                fontWeight: 'var(--weight-medium)',
                boxShadow: 'var(--elevation-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Sending...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle2 size={20} />
                  Code Sent!
                </>
              ) : (
                'Send Code'
              )}
            </button>
          </form>

          {/* Help Link */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={onHelp}
              className="transition-smooth hover:opacity-70"
              style={{
                fontSize: 'var(--text-body-sm)',
                color: 'var(--text-muted)',
              }}
            >
              Need help signing in?
            </button>
          </div>
        </div>
      </div>

      {/* Success Confetti Animation */}
      {showSuccess && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: '8px',
                height: '8px',
                backgroundColor: ['#7DB6F8', '#F6A6D7', '#B3E6C5', '#C8C5FF'][i % 4],
                borderRadius: '50%',
                animation: `confetti-fall ${1 + Math.random()}s linear`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes confetti-fall {
          to {
            transform: translateY(900px) rotate(360deg);
            opacity: 0;
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
      `}</style>
    </div>
  );
}
