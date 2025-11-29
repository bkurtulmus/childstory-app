import { useState } from 'react';
import { ArrowLeft, Share2, ChevronDown, ChevronUp } from 'lucide-react';

interface StoryResultProps {
  story: {
    id: string;
    title: string;
    childName: string;
    childAvatar?: string;
    theme?: string;
    length?: string;
    tone?: string;
    language?: string;
    createdDate?: string;
    summary?: string;
    coverImage?: string;
  };
  lesson?: string;
  isPremiumUser?: boolean;
  alternatives?: Array<{
    id: string;
    title: string;
    coverImage?: string;
  }>;
  onBack: () => void;
  onReadNow: () => void;
  onSave: () => void;
  onShare: () => void;
  onRegenerate: () => void;
  onQuickAdjust: (adjustment: string) => void;
  onViewAlternative: (storyId: string) => void;
}

export function StoryResult({
  story,
  lesson,
  isPremiumUser = false,
  alternatives = [],
  onBack,
  onReadNow,
  onSave,
  onShare,
  onRegenerate,
  onQuickAdjust,
  onViewAlternative,
}: StoryResultProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const primaryTheme = story.theme ?? story.themes?.[0] ?? 'Bedtime';
  const storyTone = story.tone ?? 'Gentle';
  const storyLength = story.length ?? story.duration ?? '5 min';
  const storyLanguage = story.language ?? 'English';
  const storySummary =
    story.summary ||
    'A personalized bedtime story crafted just for your child with calming narration and gentle imagery.';
  const createdDate = story.createdDate || 'Just now';

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
          className="flex items-center justify-center transition-smooth hover:opacity-70"
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: 'transparent',
          }}
          aria-label="Back"
        >
          <ArrowLeft size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
        <h3>Your Story</h3>
        <button
          onClick={onShare}
          className="flex items-center justify-center transition-smooth hover:opacity-70"
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: 'transparent',
          }}
          aria-label="Share"
        >
          <Share2 size={22} style={{ color: 'var(--text-primary)' }} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8">
          {/* Story Cover Preview */}
          <div
            className="relative overflow-hidden mb-6"
            style={{
              width: '100%',
              height: '240px',
              backgroundColor: 'var(--brand-enchant)',
              borderRadius: 'var(--radius-lg)',
              opacity: 0.3,
              boxShadow: 'var(--elevation-2)',
            }}
          >
            {/* Placeholder for story cover */}
          </div>

          {/* Story Title */}
          <h1 className="mb-3 text-center">{story.title}</h1>

          {/* Metadata */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
            <MetadataBadge text={primaryTheme} />
            <MetadataBadge text={storyTone} />
            <MetadataBadge text={storyLength} />
          </div>

          {lesson && (
            <div
              className="mb-4 text-center"
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(179, 230, 197, 0.18)',
                color: 'var(--brand-accent)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              Lesson focus: <strong style={{ color: 'var(--text-primary)' }}>{lesson}</strong>
            </div>
          )}

          {/* Story Summary */}
          <p
            className="mb-6 text-center"
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: 'var(--text-secondary)',
            }}
          >
            {storySummary}
          </p>

          {/* Save CTA */}
          <button
            onClick={onSave}
            className="w-full mb-4 transition-smooth active:scale-press"
            style={{
              height: '48px',
              backgroundColor: isPremiumUser ? 'var(--brand-primary)' : 'rgba(125, 182, 248, 0.15)',
              color: isPremiumUser ? 'white' : 'var(--brand-primary)',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: '16px',
              border: isPremiumUser ? 'none' : '1px solid var(--brand-primary)',
            }}
          >
            {isPremiumUser ? 'Save to Library' : 'Save for 24 Hours'}
          </button>

          {!isPremiumUser && (
            <p
              className="mb-4 text-center"
              style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--text-muted)',
              }}
            >
              Upgrade to keep every story forever and unlock more daily generations.
            </p>
          )}

          {/* Primary CTA - Read Now Button (LARGE & PROMINENT) */}
          <button
            onClick={onReadNow}
            className="w-full mb-6 transition-smooth active:scale-press"
            style={{
              height: '56px',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: '18px',
              boxShadow: 'var(--elevation-3)',
            }}
          >
            Read Now
          </button>

          {/* Quick Adjustments */}
          <div className="mb-6">
            <div
              className="mb-2"
              style={{
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-primary)',
              }}
            >
              Quick adjustments
            </div>
            <div className="flex flex-wrap gap-2">
              {['Make it sillier', 'Add a friend', 'Shorter ending'].map((option) => (
                <button
                  key={option}
                  onClick={() => onQuickAdjust(option)}
                  className="px-3 py-1.5 transition-smooth text-sm"
                  style={{
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--neutral-200)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {option}
                </button>
              ))}
              <button
                onClick={onRegenerate}
                className="px-3 py-1.5 transition-smooth text-sm"
                style={{
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--brand-primary)',
                  color: 'var(--brand-primary)',
                  backgroundColor: 'rgba(125, 182, 248, 0.1)',
                }}
              >
                Regenerate story
              </button>
            </div>
          </div>

          {/* Alternative Versions - Collapsible */}
          {alternatives.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="w-full flex items-center justify-between p-4 transition-smooth hover:opacity-70"
                style={{
                  backgroundColor: '#FAFAFB',
                  border: '1px solid var(--neutral-200)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                  }}
                >
                  View Alternatives ({alternatives.length})
                </span>
                {showAlternatives ? (
                  <ChevronUp size={20} style={{ color: 'var(--text-muted)' }} />
                ) : (
                  <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />
                )}
              </button>

              {showAlternatives && (
                <div className="mt-3 space-y-3 fade-in">
                  {alternatives.map((alt) => (
                    <button
                      key={alt.id}
                      onClick={() => onViewAlternative(alt.id)}
                      className="w-full flex items-center gap-3 p-4 transition-smooth hover:opacity-70 active:scale-press"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--neutral-200)',
                        borderRadius: 'var(--radius-lg)',
                      }}
                    >
                      {/* Thumbnail */}
                      <div
                        className="shrink-0"
                        style={{
                          width: '56px',
                          height: '56px',
                          backgroundColor: 'var(--brand-enchant)',
                          borderRadius: 'var(--radius-md)',
                          opacity: 0.3,
                        }}
                      />
                      
                      {/* Title */}
                      <div
                        className="flex-1 text-left"
                        style={{
                          fontSize: 'var(--text-body-md)',
                          fontWeight: 'var(--weight-medium)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {alt.title}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Story Details */}
          <div
            className="p-4"
            style={{
              backgroundColor: '#FAFAFB',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--neutral-200)',
            }}
          >
            <div
              className="mb-2"
              style={{
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-muted)',
              }}
            >
              Story Details
            </div>
            <div className="space-y-2">
              <DetailRow label="Created for" value={story.childName} />
              <DetailRow label="Language" value={storyLanguage} />
              <DetailRow label="Created" value={createdDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metadata Badge Component
function MetadataBadge({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: '6px 12px',
        backgroundColor: 'var(--neutral-100)',
        borderRadius: 'var(--radius-pill)',
        fontSize: 'var(--text-caption)',
        fontWeight: 'var(--weight-medium)',
        color: 'var(--text-muted)',
      }}
    >
      {text}
    </div>
  );
}

// Detail Row Component
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span
        style={{
          fontSize: 'var(--text-body-sm)',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 'var(--text-body-sm)',
          fontWeight: 'var(--weight-medium)',
          color: 'var(--text-primary)',
        }}
      >
        {value}
      </span>
    </div>
  );
}
