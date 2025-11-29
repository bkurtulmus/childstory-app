import { Cloud, Server, AlertTriangle, Search } from 'lucide-react';

export function ErrorStatesLibrary() {
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
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Title */}
        <h1 className="mb-2">Error States</h1>
        <p
          className="mb-6"
          style={{
            fontSize: 'var(--text-body-md)',
            color: 'var(--text-muted)',
          }}
        >
          Reusable error templates
        </p>

        {/* Variant 1: Network Error */}
        <div className="py-10 text-center">
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center"
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
              }}
            >
              <Cloud size={64} style={{ color: 'rgba(239, 68, 68, 0.6)' }} />
            </div>
          </div>
          <h3 className="mb-2">No internet connection</h3>
          <p
            className="mb-8 mx-auto"
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-secondary)',
              maxWidth: '280px',
            }}
          >
            Check your connection and try again.
          </p>
          <button
            className="transition-all active:scale-98 mb-3"
            style={{
              width: '180px',
              height: '48px',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-lg)',
            }}
          >
            Retry
          </button>
          <br />
          <button
            className="transition-opacity hover:opacity-70"
            style={{
              fontSize: 'var(--text-body-sm)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--brand-primary)',
              backgroundColor: 'transparent',
            }}
          >
            Contact support
          </button>
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 2: Server Error */}
        <div className="py-10 text-center">
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center"
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
              }}
            >
              <Server size={64} style={{ color: 'rgba(239, 68, 68, 0.6)' }} />
            </div>
          </div>
          <h3 className="mb-2">Something went wrong</h3>
          <p
            className="mb-8 mx-auto"
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-secondary)',
              maxWidth: '280px',
            }}
          >
            We're working on it. Please try again in a moment.
          </p>
          <button
            className="transition-all active:scale-98 mb-3"
            style={{
              width: '180px',
              height: '48px',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-lg)',
            }}
          >
            Retry
          </button>
          <br />
          <button
            className="transition-all active:scale-98"
            style={{
              width: '140px',
              height: '44px',
              backgroundColor: 'transparent',
              border: '1px solid var(--neutral-300)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-md)',
            }}
          >
            Go back
          </button>
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 3: Generic Error */}
        <div className="py-10 text-center">
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center"
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                backgroundColor: 'rgba(251, 191, 36, 0.12)',
              }}
            >
              <AlertTriangle size={64} style={{ color: 'rgba(251, 191, 36, 0.8)' }} />
            </div>
          </div>
          <h3 className="mb-2">Oops!</h3>
          <p
            className="mb-8 mx-auto"
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-secondary)',
              maxWidth: '280px',
            }}
          >
            Something unexpected happened.
          </p>
          <button
            className="transition-all active:scale-98 mb-3"
            style={{
              width: '180px',
              height: '48px',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-lg)',
            }}
          >
            Try Again
          </button>
          <br />
          <button
            className="transition-opacity hover:opacity-70"
            style={{
              fontSize: 'var(--text-body-sm)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--brand-primary)',
              backgroundColor: 'transparent',
            }}
          >
            Contact support
          </button>
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 4: Not Found */}
        <div className="py-10 text-center">
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center"
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
              }}
            >
              <Search size={64} style={{ color: 'rgba(59, 130, 246, 0.6)' }} />
            </div>
          </div>
          <h3 className="mb-2">Page not found</h3>
          <p
            className="mb-8 mx-auto"
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-secondary)',
              maxWidth: '280px',
            }}
          >
            The page you're looking for doesn't exist.
          </p>
          <button
            className="transition-all active:scale-98"
            style={{
              width: '180px',
              height: '48px',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-lg)',
            }}
          >
            Go Home
          </button>
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Usage Guidelines */}
        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--surface-muted)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h3 className="mb-4">Usage Guidelines</h3>
          <ul
            style={{
              fontSize: 'var(--text-body-sm)',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              paddingLeft: '20px',
            }}
          >
            <li>Use network error when offline or timeout</li>
            <li>Use server error for 500-level responses</li>
            <li>Use generic error as fallback</li>
            <li>Provide actionable retry buttons</li>
            <li>Keep messaging friendly and calm</li>
            <li>Avoid technical jargon</li>
          </ul>
        </div>

        <div style={{ height: '48px' }} />
      </div>
    </div>
  );
}

// Reusable Error State Component
export function ErrorState({
  type = 'generic',
  title,
  message,
  onRetry,
  onSecondary,
  secondaryLabel,
}: {
  type?: 'network' | 'server' | 'generic' | 'notfound';
  title?: string;
  message?: string;
  onRetry?: () => void;
  onSecondary?: () => void;
  secondaryLabel?: string;
}) {
  const config = {
    network: {
      icon: Cloud,
      iconBg: 'rgba(239, 68, 68, 0.08)',
      iconColor: 'rgba(239, 68, 68, 0.6)',
      defaultTitle: 'No internet connection',
      defaultMessage: 'Check your connection and try again.',
    },
    server: {
      icon: Server,
      iconBg: 'rgba(239, 68, 68, 0.08)',
      iconColor: 'rgba(239, 68, 68, 0.6)',
      defaultTitle: 'Something went wrong',
      defaultMessage: "We're working on it. Please try again in a moment.",
    },
    generic: {
      icon: AlertTriangle,
      iconBg: 'rgba(251, 191, 36, 0.12)',
      iconColor: 'rgba(251, 191, 36, 0.8)',
      defaultTitle: 'Oops!',
      defaultMessage: 'Something unexpected happened.',
    },
    notfound: {
      icon: Search,
      iconBg: 'rgba(59, 130, 246, 0.08)',
      iconColor: 'rgba(59, 130, 246, 0.6)',
      defaultTitle: 'Page not found',
      defaultMessage: "The page you're looking for doesn't exist.",
    },
  };

  const { icon: Icon, iconBg, iconColor, defaultTitle, defaultMessage } = config[type];

  return (
    <div className="flex items-center justify-center py-10 px-6 text-center">
      <div style={{ maxWidth: '400px' }}>
        <div className="flex justify-center mb-6">
          <div
            className="flex items-center justify-center"
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              backgroundColor: iconBg,
            }}
          >
            <Icon size={64} style={{ color: iconColor }} />
          </div>
        </div>
        <h3 className="mb-2">{title || defaultTitle}</h3>
        <p
          className="mb-8"
          style={{
            fontSize: 'var(--text-body-md)',
            color: 'var(--text-secondary)',
            maxWidth: '280px',
            margin: '0 auto 32px',
          }}
        >
          {message || defaultMessage}
        </p>
        {onRetry && (
          <>
            <button
              onClick={onRetry}
              className="transition-all active:scale-98 mb-3"
              style={{
                width: '180px',
                height: '48px',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-lg)',
              }}
            >
              Retry
            </button>
            <br />
          </>
        )}
        {onSecondary && secondaryLabel && (
          <button
            onClick={onSecondary}
            className="transition-opacity hover:opacity-70"
            style={{
              fontSize: 'var(--text-body-sm)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--brand-primary)',
              backgroundColor: 'transparent',
            }}
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
