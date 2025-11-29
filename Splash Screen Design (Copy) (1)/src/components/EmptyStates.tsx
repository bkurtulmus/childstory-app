import { Book, Users, PiggyBank, Search, Filter } from 'lucide-react';

export function EmptyStatesLibrary() {
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
        <h1 className="mb-2">Empty States</h1>
        <p
          className="mb-6"
          style={{
            fontSize: 'var(--text-body-md)',
            color: 'var(--text-muted)',
          }}
        >
          Reusable empty templates
        </p>

        {/* Variant 1: No Children */}
        <div className="py-10">
          <div
            className="mx-auto"
            style={{
              maxWidth: '400px',
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--surface-muted)',
              textAlign: 'center',
            }}
          >
            <div className="flex justify-center mb-6">
              <TeddyBearIllustration />
            </div>
            <h3 className="mb-2">Add your first child</h3>
            <p
              className="mb-8"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              Personalize stories just for them.
            </p>
            <button
              className="w-full mb-3 transition-all active:scale-98"
              style={{
                height: '48px',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-lg)',
              }}
            >
              Add Child
            </button>
            <button
              className="transition-opacity hover:opacity-70"
              style={{
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--brand-primary)',
                backgroundColor: 'transparent',
              }}
            >
              Learn more
            </button>
          </div>
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 2: No Stories */}
        <div className="py-10">
          <div
            className="mx-auto"
            style={{
              maxWidth: '400px',
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--surface-muted)',
              textAlign: 'center',
            }}
          >
            <div className="flex justify-center mb-6">
              <BookIllustration />
            </div>
            <h3 className="mb-2">No stories yet</h3>
            <p
              className="mb-8"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              Create your first magical tale.
            </p>
            <button
              className="w-full mb-3 transition-all active:scale-98"
              style={{
                height: '48px',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-lg)',
              }}
            >
              Create a Story
            </button>
            <button
              className="transition-opacity hover:opacity-70"
              style={{
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--brand-primary)',
                backgroundColor: 'transparent',
              }}
            >
              Browse examples
            </button>
          </div>
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 3: No Expenses */}
        <div className="py-10">
          <div
            className="mx-auto"
            style={{
              maxWidth: '400px',
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--surface-muted)',
              textAlign: 'center',
            }}
          >
            <div className="flex justify-center mb-6">
              <PiggyBankIllustration />
            </div>
            <h3 className="mb-2">No expenses yet</h3>
            <p
              className="mb-8"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              Track your child-related spending.
            </p>
            <button
              className="w-full transition-all active:scale-98"
              style={{
                height: '48px',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-lg)',
              }}
            >
              Add Expense
            </button>
          </div>
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 4: Search No Results */}
        <div className="py-10 text-center">
          <div className="flex justify-center mb-6">
            <SearchIllustration />
          </div>
          <h3 className="mb-2">No results found</h3>
          <p
            className="mb-8 mx-auto"
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-secondary)',
              maxWidth: '280px',
            }}
          >
            Try adjusting your search or filters.
          </p>
          <button
            className="mb-3 transition-all active:scale-98"
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
            Clear Filters
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
            Reset search
          </button>
        </div>

        <div style={{ height: '2px', backgroundColor: 'var(--neutral-200)', margin: '48px 0' }} />

        {/* Variant 5: Filter No Results */}
        <div className="py-10 text-center">
          <div className="flex justify-center mb-6">
            <FilterIllustration />
          </div>
          <h3 className="mb-2">No matches</h3>
          <p
            className="mb-8 mx-auto"
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-secondary)',
              maxWidth: '280px',
            }}
          >
            No items match your current filters.
          </p>
          <button
            className="transition-all active:scale-98"
            style={{
              width: '200px',
              height: '48px',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-lg)',
            }}
          >
            Clear All Filters
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
            <li>Use specific empty states per context</li>
            <li>Provide clear primary action</li>
            <li>Keep messaging encouraging, not negative</li>
            <li>Illustrations should be friendly and magical</li>
            <li>Optional secondary actions for help</li>
          </ul>
        </div>

        <div style={{ height: '48px' }} />
      </div>
    </div>
  );
}

// Reusable Empty State Component
export function EmptyState({
  type = 'generic',
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  type?: 'children' | 'stories' | 'expenses' | 'search' | 'filter' | 'generic';
  title?: string;
  message?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  const config = {
    children: {
      illustration: <TeddyBearIllustration />,
      defaultTitle: 'Add your first child',
      defaultMessage: 'Personalize stories just for them.',
      defaultPrimaryLabel: 'Add Child',
    },
    stories: {
      illustration: <BookIllustration />,
      defaultTitle: 'No stories yet',
      defaultMessage: 'Create your first magical tale.',
      defaultPrimaryLabel: 'Create a Story',
    },
    expenses: {
      illustration: <PiggyBankIllustration />,
      defaultTitle: 'No expenses yet',
      defaultMessage: 'Track your child-related spending.',
      defaultPrimaryLabel: 'Add Expense',
    },
    search: {
      illustration: <SearchIllustration />,
      defaultTitle: 'No results found',
      defaultMessage: 'Try adjusting your search or filters.',
      defaultPrimaryLabel: 'Clear Filters',
    },
    filter: {
      illustration: <FilterIllustration />,
      defaultTitle: 'No matches',
      defaultMessage: 'No items match your current filters.',
      defaultPrimaryLabel: 'Clear All Filters',
    },
    generic: {
      illustration: <BookIllustration />,
      defaultTitle: 'Nothing here yet',
      defaultMessage: 'Get started by adding something new.',
      defaultPrimaryLabel: 'Get Started',
    },
  };

  const {
    illustration,
    defaultTitle,
    defaultMessage,
    defaultPrimaryLabel,
  } = config[type];

  const showCard = ['children', 'stories', 'expenses'].includes(type);

  const content = (
    <>
      <div className="flex justify-center mb-6">{illustration}</div>
      <h3 className="mb-2">{title || defaultTitle}</h3>
      <p
        className="mb-8"
        style={{
          fontSize: 'var(--text-body-md)',
          color: 'var(--text-secondary)',
          maxWidth: '280px',
          margin: showCard ? '0 0 32px' : '0 auto 32px',
        }}
      >
        {message || defaultMessage}
      </p>
      {onPrimary && (
        <button
          onClick={onPrimary}
          className={`transition-all active:scale-98 ${showCard ? 'w-full mb-3' : 'mb-3'}`}
          style={{
            width: showCard ? '100%' : '180px',
            height: '48px',
            backgroundColor: 'var(--brand-primary)',
            color: 'white',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 'var(--weight-medium)',
            fontSize: 'var(--text-body-lg)',
          }}
        >
          {primaryLabel || defaultPrimaryLabel}
        </button>
      )}
      {!showCard && <br />}
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
    </>
  );

  if (showCard) {
    return (
      <div className="flex items-center justify-center py-10 px-6">
        <div
          style={{
            maxWidth: '400px',
            width: '100%',
            padding: '32px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--surface-muted)',
            textAlign: 'center',
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10 px-6 text-center">
      <div style={{ maxWidth: '400px' }}>{content}</div>
    </div>
  );
}

// Illustrations
function TeddyBearIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      <circle cx="80" cy="90" r="40" fill="#F6A6D7" opacity="0.3" />
      <circle cx="50" cy="60" r="15" fill="#F6A6D7" opacity="0.5" />
      <circle cx="110" cy="60" r="15" fill="#F6A6D7" opacity="0.5" />
      <circle cx="75" cy="85" r="3" fill="#333" />
      <circle cx="85" cy="85" r="3" fill="#333" />
      <path d="M75 95 Q80 98 85 95" stroke="#333" strokeWidth="2" fill="none" />
      <path
        d="M120 40 L122 45 L127 47 L122 49 L120 54 L118 49 L113 47 L118 45 Z"
        fill="#C8C5FF"
        opacity="0.8"
      >
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function BookIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      <rect x="50" y="60" width="60" height="50" rx="4" fill="#7DB6F8" opacity="0.3" />
      <line x1="80" y1="60" x2="80" y2="110" stroke="#7DB6F8" strokeWidth="2" opacity="0.5" />
      <path
        d="M40 50 L42 55 L47 57 L42 59 L40 64 L38 59 L33 57 L38 55 Z"
        fill="#B3E6C5"
      >
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </path>
      <path
        d="M120 70 L121.5 74 L125.5 75.5 L121.5 77 L120 81 L118.5 77 L114.5 75.5 L118.5 74 Z"
        fill="#F6A6D7"
      >
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function PiggyBankIllustration() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      <ellipse cx="80" cy="90" rx="35" ry="30" fill="#F6A6D7" opacity="0.4" />
      <circle cx="70" cy="85" r="3" fill="#333" />
      <ellipse cx="80" cy="70" rx="8" ry="6" fill="#F6A6D7" opacity="0.6" />
      <circle cx="100" cy="60" r="12" fill="#B3E6C5" opacity="0.5" />
      <path
        d="M30 80 L32 85 L37 87 L32 89 L30 94 L28 89 L23 87 L28 85 Z"
        fill="#C8C5FF"
      >
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function SearchIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="50" cy="50" r="25" stroke="#7DB6F8" strokeWidth="4" opacity="0.5" />
      <line x1="68" y1="68" x2="85" y2="85" stroke="#7DB6F8" strokeWidth="4" opacity="0.5" />
      <path
        d="M90 40 L91.5 44 L95.5 45.5 L91.5 47 L90 51 L88.5 47 L84.5 45.5 L88.5 44 Z"
        fill="#B3E6C5"
      >
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function FilterIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <path
        d="M30 35 L90 35 L70 60 L70 85 L50 85 L50 60 Z"
        fill="#7DB6F8"
        opacity="0.3"
        stroke="#7DB6F8"
        strokeWidth="2"
      />
      <path
        d="M25 30 L27 35 L32 37 L27 39 L25 44 L23 39 L18 37 L23 35 Z"
        fill="#F6A6D7"
      >
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}
