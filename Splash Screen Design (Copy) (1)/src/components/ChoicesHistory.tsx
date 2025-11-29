import { useState } from 'react';
import { ArrowLeft, GitBranch, AlertTriangle, Copy, Bookmark } from 'lucide-react';
import { toast } from '../utils/toast';

interface Choice {
  id: string;
  question: string;
  selectedOption: string;
  timestamp: string;
  branchType: 'main' | 'branch-a' | 'branch-b';
  chapterTitle: string;
}

interface ChoicesHistoryProps {
  choices: Choice[];
  onBack: () => void;
  onClearHistory: () => void;
  onJumpToPoint: (choiceId: string) => void;
}

export function ChoicesHistory({
  choices,
  onBack,
  onClearHistory,
  onJumpToPoint,
}: ChoicesHistoryProps) {
  const [showClearModal, setShowClearModal] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const handleClearConfirm = () => {
    setShowClearModal(false);
    onClearHistory();
  };

  const handleLongPress = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
    setShowActionSheet(true);
  };

  // Group choices by chapter
  const groupedChoices = choices.reduce((acc, choice) => {
    if (!acc[choice.chapterTitle]) {
      acc[choice.chapterTitle] = [];
    }
    acc[choice.chapterTitle].push(choice);
    return acc;
  }, {} as Record<string, Choice[]>);

  const totalBranches = new Set(choices.map((c) => c.branchType)).size;

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
        <h2>Choices History</h2>
        <button
          onClick={() => setShowClearModal(true)}
          className="transition-opacity hover:opacity-70"
          style={{
            padding: '8px 12px',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            fontWeight: 'var(--weight-medium)',
            fontSize: 'var(--text-body-md)',
            minHeight: '44px',
          }}
        >
          Clear
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {choices.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full px-6">
            <BookQuestionIllustration />
            <h3 className="mb-2 mt-6 text-center">No choices yet</h3>
            <p
              className="text-center mb-6"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              Start reading to shape the story.
            </p>
            <button
              onClick={onBack}
              className="transition-all active:scale-98"
              style={{
                width: '160px',
                height: '48px',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-lg)',
              }}
            >
              Read now
            </button>
          </div>
        ) : (
          <>
            {/* Summary Pill */}
            <div className="px-6 py-4">
              <div
                className="flex items-center gap-3"
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: '#F8FAFC',
                }}
              >
                <GitBranch size={20} style={{ color: 'var(--brand-primary)' }} />
                <span
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-subheading)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {choices.length} choices made • {totalBranches} branches explored
                </span>
              </div>
            </div>

            {/* Timeline Content */}
            <div className="px-6 pb-6">
              {Object.entries(groupedChoices).map(([chapterTitle, chapterChoices], chapterIndex) => (
                <div key={chapterTitle}>
                  {/* Chapter Sticky Header */}
                  <div
                    className="sticky top-0 z-10 mb-4"
                    style={{
                      backgroundColor: '#F8FAFC',
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--neutral-200)',
                      marginLeft: '-24px',
                      marginRight: '-24px',
                      paddingLeft: '24px',
                    }}
                  >
                    <h3>{chapterTitle}</h3>
                  </div>

                  {/* Choice Node Cards */}
                  <div className="space-y-4">
                    {chapterChoices.map((choice, index) => {
                      const isMainPath = choice.branchType === 'main';
                      return (
                        <button
                          key={choice.id}
                          onClick={() => handleLongPress(choice.id)}
                          className="w-full text-left transition-opacity hover:opacity-80"
                          style={{
                            padding: '20px',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--elevation-1)',
                            backgroundColor: isMainPath
                              ? 'rgba(125, 182, 248, 0.16)'
                              : '#FFFFFF',
                            border: `2px solid ${isMainPath ? 'var(--brand-primary)' : 'var(--neutral-200)'
                              }`,
                            position: 'relative',
                          }}
                        >
                          {/* Timeline connector */}
                          <div
                            className="absolute left-6 top-0"
                            style={{
                              width: '2px',
                              height: '100%',
                              backgroundColor: 'var(--brand-primary)',
                            }}
                          />
                          <div
                            className="absolute left-3.5 top-6"
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--brand-primary)',
                            }}
                          />

                          {/* Content */}
                          <div style={{ paddingLeft: '32px' }}>
                            <p
                              className="mb-2"
                              style={{
                                fontSize: 'var(--text-body-md)',
                                fontWeight: 'var(--weight-subheading)',
                                color: 'var(--text-primary)',
                              }}
                            >
                              {choice.question}
                            </p>
                            <p
                              className="mb-2"
                              style={{
                                fontSize: 'var(--text-body-md)',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {choice.selectedOption}
                            </p>
                            <div className="flex items-center gap-2">
                              <span
                                style={{
                                  fontSize: 'var(--text-caption)',
                                  color: 'var(--text-muted)',
                                }}
                              >
                                {choice.timestamp}
                              </span>
                              <span style={{ color: 'var(--text-muted)' }}>•</span>
                              <span
                                style={{
                                  fontSize: 'var(--text-caption)',
                                  color: isMainPath ? 'var(--brand-primary)' : 'var(--text-muted)',
                                  fontWeight: isMainPath ? 'var(--weight-medium)' : 'var(--weight-regular)',
                                }}
                              >
                                {isMainPath ? 'Main path' : choice.branchType}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Spacing between chapters */}
                  {chapterIndex < Object.keys(groupedChoices).length - 1 && (
                    <div style={{ height: '24px' }} />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center px-8"
          style={{
            backgroundColor: 'rgba(16, 24, 40, 0.4)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '327px',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#FFFFFF',
              textAlign: 'center',
            }}
          >
            <div className="flex justify-center mb-4">
              <AlertTriangle size={48} style={{ color: 'var(--semantic-warning)' }} />
            </div>
            <h3 className="mb-3">Clear all choices?</h3>
            <p
              className="mb-6"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              This will reset the story to the beginning.
            </p>
            <button
              onClick={handleClearConfirm}
              className="w-full mb-3 transition-all active:scale-98"
              style={{
                height: '48px',
                backgroundColor: 'var(--semantic-warning)',
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-lg)',
              }}
            >
              Clear History
            </button>
            <button
              onClick={() => setShowClearModal(false)}
              className="w-full transition-opacity hover:opacity-70"
              style={{
                height: '44px',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-body-md)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Sheet */}
      {showActionSheet && selectedChoiceId && (
        <div
          className="absolute inset-0 z-50"
          onClick={() => setShowActionSheet(false)}
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
            }}
          >
            <div className="space-y-2 mb-4">
              <button
                onClick={() => {
                  onJumpToPoint(selectedChoiceId);
                  setShowActionSheet(false);
                }}
                className="flex items-center gap-4 w-full p-4 transition-opacity hover:opacity-70"
              >
                <Bookmark size={24} style={{ color: 'var(--text-primary)' }} />
                <span
                  style={{
                    fontSize: 'var(--text-body-lg)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Jump to this point
                </span>
              </button>
              <button
                onClick={() => {
                  const choice = choices.find((c) => c.id === selectedChoiceId);
                  if (choice) {
                    navigator.clipboard.writeText(choice.selectedOption);
                    toast.success('Copied!', 'Choice text copied to clipboard.');
                  }
                  setShowActionSheet(false);
                }}
                className="flex items-center gap-4 w-full p-4 transition-opacity hover:opacity-70"
              >
                <Copy size={24} style={{ color: 'var(--text-primary)' }} />
                <span
                  style={{
                    fontSize: 'var(--text-body-lg)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Copy choice text
                </span>
              </button>
            </div>
            <button
              onClick={() => setShowActionSheet(false)}
              className="w-full transition-all active:scale-98"
              style={{
                height: '48px',
                backgroundColor: 'var(--neutral-200)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-lg)',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Book with question mark illustration
function BookQuestionIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book */}
      <rect x="30" y="40" width="60" height="50" rx="4" fill="#7DB6F8" opacity="0.2" />
      <line x1="60" y1="40" x2="60" y2="90" stroke="#7DB6F8" strokeWidth="2" opacity="0.3" />

      {/* Question mark */}
      <text
        x="60"
        y="75"
        fontSize="32"
        fontWeight="700"
        fill="#667085"
        textAnchor="middle"
      >
        ?
      </text>

      {/* Sparkle */}
      <path
        d="M85 30 L86.5 34 L90.5 35.5 L86.5 37 L85 41 L83.5 37 L79.5 35.5 L83.5 34 Z"
        fill="#C8C5FF"
      >
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}
