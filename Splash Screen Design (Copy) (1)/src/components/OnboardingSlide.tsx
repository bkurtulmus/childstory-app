import { ReactNode, useState } from 'react';

interface OnboardingSlideProps {
  illustration: ReactNode;
  title: string;
  body: string;
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onSkip: () => void;
  isLastSlide?: boolean;
  gradientColors: string;
  onSkipToHome?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function OnboardingSlide({
  illustration,
  title,
  body,
  currentSlide,
  totalSlides,
  onNext,
  onSkip,
  isLastSlide = false,
  gradientColors,
  onSkipToHome,
  onSwipeLeft,
  onSwipeRight,
}: OnboardingSlideProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  const handleSkip = () => {
    if (currentSlide === 3 && !showSkipConfirm) {
      setShowSkipConfirm(true);
    } else {
      onSkip();
    }
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
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-16 pb-6">
          {/* Illustration Card - Softer Design with Animated Illustration */}
          <div
            className="relative overflow-hidden mb-6"
            style={{
              width: '100%',
              height: '360px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              position: 'relative',
            }}
          >
            {/* Illustration with Animation */}
            <div
              className="absolute inset-0 flex items-center justify-center animate-float"
              style={{
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              {illustration}
            </div>
          </div>

          {/* Text Content - Increased Spacing */}
          <div className="text-center mb-6">
            <h2
              className="mb-5"
              style={{
                fontSize: 'var(--text-h1)',
                fontWeight: 'var(--weight-heading)',
                color: 'var(--text-primary)',
                lineHeight: '1.3',
              }}
            >
              {title}
            </h2>
            <p
              style={{
                fontSize: 'var(--text-body-md)',
                fontWeight: 'var(--weight-regular)',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
              }}
            >
              {body}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Section */}
      <div
        className="px-6 pb-8 pt-4 shrink-0"
        style={{
          backgroundColor: '#FAFAFB',
        }}
      >
        {/* Dot Indicators - Centered Above Buttons */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className="transition-spring"
              style={{
                width: currentSlide === dot ? '24px' : '8px',
                height: '8px',
                backgroundColor:
                  currentSlide === dot ? 'var(--brand-primary)' : 'var(--neutral-300)',
                borderRadius: '4px',
              }}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Next/Get Started button - Primary */}
          <button
            onClick={onNext}
            className="w-full transition-smooth active:scale-press"
            style={{
              height: '52px',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--text-body-lg)',
              fontWeight: 'var(--weight-medium)',
              boxShadow: 'var(--elevation-2)',
            }}
          >
            {isLastSlide ? 'Get Started' : 'Next'}
          </button>

          {/* Skip button - Bottom, Less Prominent */}
          <button
            onClick={handleSkip}
            className="w-full transition-smooth hover:opacity-60"
            style={{
              height: '44px',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 'var(--weight-regular)',
            }}
          >
            Skip
          </button>
        </div>

        {/* Swipe Hint */}
        {currentSlide === 1 && (
          <div
            className="text-center mt-4 animate-fade-in"
            style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--text-muted)',
            }}
          >
            Swipe to navigate →
          </div>
        )}
      </div>

      {/* Skip Confirmation Modal */}
      {showSkipConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            className="w-full"
            style={{
              maxWidth: '320px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            <h3 className="mb-3 text-center">Almost done!</h3>
            <p
              className="text-center mb-6"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              You're on the last slide. Continue to complete the tour?
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSkipConfirm(false);
                  onNext();
                }}
                className="w-full transition-smooth active:scale-press"
                style={{
                  height: '48px',
                  backgroundColor: 'var(--brand-primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 'var(--weight-medium)',
                  fontSize: 'var(--text-body-md)',
                }}
              >
                Continue
              </button>
              <button
                onClick={() => {
                  setShowSkipConfirm(false);
                  onSkip();
                }}
                className="w-full transition-smooth active:scale-press"
                style={{
                  height: '48px',
                  backgroundColor: 'var(--neutral-100)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 'var(--weight-medium)',
                  fontSize: 'var(--text-body-md)',
                }}
              >
                Skip Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .transition-spring {
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
}
