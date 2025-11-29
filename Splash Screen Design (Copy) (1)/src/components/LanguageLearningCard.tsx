import { Volume2, BookOpen } from 'lucide-react';

interface LanguageLearningCardProps {
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  onPlayPronunciation?: () => void;
}

export function LanguageLearningCard({
  word,
  translation,
  pronunciation,
  example,
  onPlayPronunciation,
}: LanguageLearningCardProps) {
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'rgba(125, 182, 248, 0.08)',
        border: '1px solid rgba(125, 182, 248, 0.2)',
        marginBottom: '16px',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4
            style={{
              fontSize: 'var(--text-body-lg)',
              fontWeight: 'var(--weight-subheading)',
              color: 'var(--brand-primary)',
              marginBottom: '4px',
            }}
          >
            {word}
          </h4>
          <p
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-primary)',
              marginBottom: '4px',
            }}
          >
            {translation}
          </p>
          <p
            style={{
              fontSize: 'var(--text-body-sm)',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
            }}
          >
            {pronunciation}
          </p>
        </div>

        {onPlayPronunciation && (
          <button
            onClick={onPlayPronunciation}
            className="transition-opacity hover:opacity-70"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Volume2 size={18} style={{ color: 'white' }} />
          </button>
        )}
      </div>

      {/* Example Sentence */}
      <div
        style={{
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          borderLeft: '3px solid var(--brand-primary)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={14} style={{ color: 'var(--brand-primary)' }} />
          <span
            style={{
              fontSize: 'var(--text-caption)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Example
          </span>
        </div>
        <p
          style={{
            fontSize: 'var(--text-body-sm)',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
          }}
        >
          {example}
        </p>
      </div>
    </div>
  );
}

// Tooltip component for inline translations
export function TranslationTooltip({
  word,
  translation,
  show,
}: {
  word: string;
  translation: string;
  show: boolean;
}) {
  if (!show) return null;

  return (
    <div
      className="absolute z-50"
      style={{
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '8px',
        minWidth: '200px',
        padding: '12px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--elevation-3)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontSize: 'var(--text-body-sm)',
          fontWeight: 'var(--weight-medium)',
          color: 'var(--brand-primary)',
          marginBottom: '4px',
        }}
      >
        {word}
      </div>
      <div
        style={{
          fontSize: 'var(--text-body-sm)',
          color: 'white',
        }}
      >
        {translation}
      </div>

      {/* Arrow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid rgba(0, 0, 0, 0.9)',
        }}
      />
    </div>
  );
}
