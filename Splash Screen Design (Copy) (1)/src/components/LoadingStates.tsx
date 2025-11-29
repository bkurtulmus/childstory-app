export function LoadingStatesLibrary() {
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
        <h1 className="mb-2">Loading States</h1>
        <p
          className="mb-6"
          style={{
            fontSize: 'var(--text-body-md)',
            color: 'var(--text-muted)',
          }}
        >
          Skeleton loaders and spinners
        </p>

        {/* Variant 1: List Row Skeleton */}
        <div className="mb-12">
          <h3 className="mb-4">List Row Skeleton</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <ListRowSkeleton key={i} />
            ))}
          </div>
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 2: Card Grid Skeleton */}
        <div className="mb-12">
          <h3 className="mb-4">Card Grid Skeleton</h3>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 3: Chart Block Skeleton */}
        <div className="mb-12">
          <h3 className="mb-4">Chart Block Skeleton</h3>
          <ChartSkeleton />
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 4: Spinner (fallback for short ops only) */}
        <div className="mb-12">
          <h3 className="mb-4">Spinner (Short Ops Fallback)</h3>
          <p className="mb-3" style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)' }}>
            Use only for very short operations (< 300ms). Prefer skeletons and staged loaders otherwise.
          </p>
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 5: Staged Story Generation Loader */}
        <div className="mb-12">
          <h3 className="mb-4">Story Generation (Staged)</h3>
          <StagedStoryLoader />
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 6: Progress Bar */}
        <div className="mb-12">
          <h3 className="mb-4">Progress Bar (Indeterminate)</h3>
          <ProgressBar />
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 6: Text Loading */}
        <div className="mb-12">
          <h3 className="mb-4">Text Loading (Inline)</h3>
          <div className="text-center py-4">
            <TextLoading />
          </div>
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Reduced Motion Variant */}
        <div
          className="mb-12"
          style={{
            padding: '24px',
            backgroundColor: 'var(--surface-muted)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h3 className="mb-4">Reduced Motion Variant</h3>
          <p
            className="mb-4"
            style={{
              fontSize: 'var(--text-body-sm)',
              color: 'var(--text-secondary)',
            }}
          >
            For users with reduced motion preference, replace pulse/spin with simple fade (opacity 0.6)
          </p>
          <ListRowSkeleton reducedMotion />
        </div>

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
            <li>Use skeletons for predictable content structures</li>
            <li>Match skeleton layout to actual content</li>
            <li>Prefer gentle pulse over aggressive shimmer</li>
            <li>Respect reduced motion settings</li>
            <li>Provide accessible label: "Loading"</li>
            <li>Show skeleton for operations > 300ms</li>
          </ul>
        </div>

        <div style={{ height: '48px' }} />
      </div>
    </div>
  );
}

// List Row Skeleton Component
export function ListRowSkeleton({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div
      className="w-full flex items-center"
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--elevation-1)',
        backgroundColor: '#FFFFFF',
      }}
      role="status"
      aria-label="Loading"
    >
      <div
        className={!reducedMotion ? 'animate-pulse' : ''}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--neutral-200)',
          opacity: reducedMotion ? 0.6 : 1,
        }}
      />
      <div className="flex-1 ml-4">
        <div
          className={!reducedMotion ? 'animate-pulse' : ''}
          style={{
            width: '60%',
            height: '18px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--neutral-200)',
            marginBottom: '8px',
            opacity: reducedMotion ? 0.6 : 1,
          }}
        />
        <div
          className={!reducedMotion ? 'animate-pulse' : ''}
          style={{
            width: '80%',
            height: '14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--neutral-100)',
            opacity: reducedMotion ? 0.6 : 1,
          }}
        />
      </div>
    </div>
  );
}

// Card Skeleton Component
export function CardSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{
        padding: '12px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--elevation-1)',
        backgroundColor: '#FFFFFF',
      }}
      role="status"
      aria-label="Loading"
    >
      <div
        style={{
          width: '100%',
          height: '140px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--neutral-200)',
          marginBottom: '12px',
        }}
      />
      <div
        style={{
          width: '90%',
          height: '16px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--neutral-200)',
          marginBottom: '8px',
        }}
      />
      <div
        style={{
          width: '60%',
          height: '12px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--neutral-100)',
        }}
      />
    </div>
  );
}

// Chart Skeleton Component
export function ChartSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--elevation-1)',
        backgroundColor: '#FFFFFF',
      }}
      role="status"
      aria-label="Loading"
    >
      <div
        style={{
          width: '40%',
          height: '18px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--neutral-200)',
          marginBottom: '16px',
        }}
      />
      <div
        style={{
          width: '100%',
          height: '200px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--neutral-100)',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          padding: '20px',
        }}
      >
        {[60, 80, 50, 90, 70].map((height, i) => (
          <div
            key={i}
            style={{
              width: '40px',
              height: `${height}%`,
              backgroundColor: 'var(--neutral-200)',
              borderRadius: 'var(--radius-sm)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Spinner Component
export function Spinner({ size = 40 }: { size?: number }) {
  return (
    <div
      className="animate-spin"
      role="status"
      aria-label="Loading"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: '4px solid var(--neutral-200)',
        borderTopColor: 'var(--brand-primary)',
        borderRadius: '50%',
      }}
    />
  );
}

// Sparkle Spinner Component (Alternative)
export function SparkleSpinner() {
  return (
    <div className="relative" style={{ width: '40px', height: '40px' }} role="status" aria-label="Loading">
      <svg
        className="animate-spin"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
      >
        <circle cx="20" cy="4" r="3" fill="var(--brand-primary)" opacity="1">
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="31.5" cy="11.5" r="2.5" fill="var(--brand-primary)" opacity="0.8">
          <animate
            attributeName="opacity"
            values="0.8;0.3;0.8"
            dur="1.5s"
            begin="0.2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="36" cy="20" r="2" fill="var(--brand-primary)" opacity="0.6">
          <animate
            attributeName="opacity"
            values="0.6;0.3;0.6"
            dur="1.5s"
            begin="0.4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// Progress Bar Component
export function ProgressBar() {
  return (
    <div
      style={{
        width: '100%',
        height: '4px',
        backgroundColor: 'var(--neutral-200)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        position: 'relative',
      }}
      role="progressbar"
      aria-label="Loading"
    >
      <div
        className="animate-progress"
        style={{
          width: '40%',
          height: '100%',
          backgroundColor: 'var(--brand-primary)',
          borderRadius: 'var(--radius-sm)',
          position: 'absolute',
          left: 0,
        }}
      />
      <style>{`
        @keyframes progress {
          0% {
            left: -40%;
          }
          100% {
            left: 100%;
          }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Staged/determinate loader for story generation
export function StagedStoryLoader() {
  // Pseudo staged steps
  const steps = [
    { key: 'prepare', label: 'Preparing your magical story', duration: 1200 },
    { key: 'generate', label: 'Weaving chapters and adventures', duration: 1800 },
    { key: 'polish', label: 'Polishing illustrations and details', duration: 1200 },
  ];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Generating story"
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--elevation-1)',
        backgroundColor: '#FFFFFF',
      }}
    >
      <ol style={{ listStyle: 'none' }}>
        {steps.map((s, idx) => (
          <li key={s.key} className="flex items-center mb-3">
            <div
              className="shrink-0"
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: idx === 0 ? 'var(--brand-primary)' : 'var(--neutral-300)',
                marginRight: '12px',
              }}
              aria-hidden="true"
            />
            <span style={{ fontSize: 'var(--text-body-md)', color: 'var(--text-secondary)' }}>{s.label}</span>
          </li>
        ))}
      </ol>
      <div className="mt-4">
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--neutral-200)',
            borderRadius: 'var(--radius-pill)',
            overflow: 'hidden',
          }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={33}
        >
          <div
            className="transition-smooth"
            style={{
              width: '33%',
              height: '100%',
              background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-enchant))',
            }}
          />
        </div>
        <p className="mt-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>
          Tip: You can continue browsing your library while we generate.
        </p>
      </div>
    </div>
  );
}

// Text Loading Component
export function TextLoading() {
  return (
    <div
      className="animate-dots"
      style={{
        fontSize: 'var(--text-body-md)',
        color: 'var(--text-muted)',
      }}
      role="status"
      aria-label="Loading"
    >
      Loading
      <span className="dot1">.</span>
      <span className="dot2">.</span>
      <span className="dot3">.</span>
      <style>{`
        @keyframes blink {
          0%, 20% { opacity: 0; }
          40%, 100% { opacity: 1; }
        }
        .animate-dots .dot1 {
          animation: blink 1.4s infinite;
        }
        .animate-dots .dot2 {
          animation: blink 1.4s infinite 0.2s;
        }
        .animate-dots .dot3 {
          animation: blink 1.4s infinite 0.4s;
        }
      `}</style>
    </div>
  );
}

// Loading Overlay Component
export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Spinner />
        </div>
        <p
          style={{
            fontSize: 'var(--text-body-lg)',
            fontWeight: 'var(--weight-medium)',
            color: 'var(--text-primary)',
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
