import { useState } from 'react';
import { ArrowLeft, Check, X, Zap } from 'lucide-react';
import { CircularProgress } from './ui/ProgressIndicator';

interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
}

interface PlanSummary {
  name: string;
  storiesUsed: number;
  storiesTotal: number;
  dailyRemaining: number;
  isPremium: boolean;
  retentionHours: number;
}

interface StoryCreateProps {
  children: Child[];
  preselectedChildId?: string;
  onGenerate: (config: StoryConfig) => void;
  onAddChild: () => void;
  onBack: () => void;
  onViewPlans?: () => void;
  planSummary?: PlanSummary;
}

interface StoryConfig {
  childId: string;
  themes: string[];
  tone: string;
  length: 'short' | 'medium' | 'long';
  lesson: string;
}

export function StoryCreate({
  children,
  preselectedChildId,
  onGenerate,
  onAddChild,
  onBack,
  onViewPlans,
  planSummary,
}: StoryCreateProps) {
  const [showChildSheet, setShowChildSheet] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(
    preselectedChildId || null
  );
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState('Gentle');
  const [storyLength, setStoryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [selectedLesson, setSelectedLesson] = useState('Sharing');
  const [isGenerating, setIsGenerating] = useState(false);

  const themes = [
    'Bedtime',
    'Adventure',
    'Friendship',
    'Animals',
    'Space',
    'Fairy tales',
    'Mystery',
    'Pirates',
  ];

  const tones = ['Gentle', 'Funny', 'Magical'];
  const lessons = ['Sharing', 'Kindness', 'Bravery', 'Brushing Teeth', 'Patience', 'Tidying Up'];

  const handleThemeToggle = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const handleQuickStart = () => {
    // Simulate using last settings
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
    setSelectedThemes(['Adventure']);
    setSelectedTone('Gentle');
    setStoryLength('medium');
    setSelectedLesson('Kindness');
  };

  const handleGenerate = async () => {
    if (!selectedChildId || selectedThemes.length === 0) {
      return; // Form validation prevents this
    }

    setIsGenerating(true);

    try {
      // Simulate story generation with timeout handling
      const generationPromise = new Promise((resolve) => setTimeout(resolve, 2000));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Story generation timed out')), 30000) // 30 second timeout
      );

      await Promise.race([generationPromise, timeoutPromise]);

      const config: StoryConfig = {
        childId: selectedChildId,
        themes: selectedThemes,
        tone: selectedTone,
        length: storyLength,
        lesson: selectedLesson,
      };

      onGenerate(config);
    } catch (error) {
      setIsGenerating(false);
      // Error will be shown via toast in the parent component
      console.error('Story generation failed:', error);
    }
  };

  const selectedChild = children.find((c) => c.id === selectedChildId);

  const isChildComplete = selectedChildId !== null;
  const isThemesComplete = selectedThemes.length > 0;
  const isLessonComplete = Boolean(selectedLesson);
  const isToneComplete = selectedTone !== '';
  const isFormValid = isChildComplete && isThemesComplete && isLessonComplete;
  const reachedDailyLimit = planSummary ? planSummary.dailyRemaining <= 0 : false;

  // Calculate progress
  const completedSteps = [isChildComplete, isThemesComplete, isLessonComplete, isToneComplete].filter(Boolean).length;
  const totalSteps = 4;
  const progressPercent = (completedSteps / totalSteps) * 100;

  // Length slider value (0-2 mapping to short/medium/long)
  const lengthValue = storyLength === 'short' ? 0 : storyLength === 'medium' ? 1 : 2;
  const handleLengthChange = (value: number) => {
    setStoryLength(value === 0 ? 'short' : value === 1 ? 'medium' : 'long');
  };

  if (isGenerating) {
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
        <GeneratingAnimation />
        <h2 className="mb-3 mt-8 text-center">Creating your story…</h2>
        <p
          className="text-center mb-6"
          style={{
            fontSize: 'var(--text-body-md)',
            color: 'var(--text-muted)',
          }}
        >
          This usually takes 10-15 seconds
        </p>

        {/* Progress Indicator */}
        <div className="flex justify-center">
          <CircularProgress
            progress={75}
            size={80}
            strokeWidth={6}
          />
        </div>
      </div>
    );
  }

  return (
    <>
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
        {/* AppBar with Progress */}
        <div
          className="shrink-0 sticky top-0 z-20"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: 'var(--elevation-1)',
          }}
        >
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={onBack}
              className="flex items-center justify-center transition-smooth hover:opacity-70"
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
              }}
              aria-label="Back"
            >
              <ArrowLeft size={24} />
            </button>
            <h3>Create Story</h3>
            <div style={{ width: '44px' }} />
          </div>

          {/* Progress Bar */}
          <div
            style={{
              height: '4px',
              backgroundColor: 'var(--neutral-100)',
            }}
          >
            <div
              className="transition-all duration-300"
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: 'var(--brand-primary)',
              }}
            />
          </div>

          {/* Step Indicator */}
          <div
            className="px-6 py-2"
            style={{
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid var(--neutral-100)',
            }}
          >
            <div
              style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--text-muted)',
                fontWeight: 'var(--weight-medium)',
              }}
            >
              Step {completedSteps} of {totalSteps}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 'calc(80px + var(--safe-area-bottom))' }}>
          {planSummary && (
            <div className="px-6 pt-4">
              <PlanUsageCard
                planSummary={planSummary}
                onViewPlans={onViewPlans}
              />
            </div>
          )}

          {reachedDailyLimit && (
            <div
              className="px-6 pt-2"
              style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--semantic-warning)',
              }}
            >
              Daily limit reached. Upgrade or wait until tomorrow to generate another story.
            </div>
          )}

          {/* Quick Start Option */}
          {!isChildComplete && !isThemesComplete && (
            <div className="px-6 pt-4 pb-6">
              <button
                onClick={handleQuickStart}
                className="w-full transition-smooth active:scale-press"
                style={{
                  padding: '16px',
                  backgroundColor: 'rgba(200, 197, 255, 0.1)',
                  border: '1px solid rgba(200, 197, 255, 0.3)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div className="flex items-center gap-3">
                  <Zap size={20} style={{ color: 'var(--brand-enchant)' }} />
                  <div className="flex-1 text-left">
                    <div
                      style={{
                        fontSize: 'var(--text-body-sm)',
                        fontWeight: 'var(--weight-medium)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      Quick Start
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--text-caption)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Use recommended settings
                    </div>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Child Selection */}
          <div className="px-6 pb-6">
            <SectionHeader
              title="Select Child"
              isComplete={isChildComplete}
              stepNumber={1}
            />

            <button
              onClick={() => setShowChildSheet(true)}
              className="w-full transition-smooth active:scale-press"
              style={{
                padding: '16px',
                backgroundColor: selectedChild ? '#FFFFFF' : '#FFFFFF',
                border: `2px ${selectedChild ? 'solid var(--brand-primary)' : 'dashed var(--neutral-300)'}`,
                borderRadius: 'var(--radius-lg)',
                textAlign: 'left',
              }}
            >
              {selectedChild ? (
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: 'var(--brand-primary)',
                      borderRadius: '50%',
                      fontSize: 'var(--text-h3)',
                      fontWeight: 'var(--weight-heading)',
                      color: 'white',
                    }}
                  >
                    {selectedChild.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div
                      style={{
                        fontSize: 'var(--text-body-lg)',
                        fontWeight: 'var(--weight-medium)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {selectedChild.name}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--text-caption)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Age {selectedChild.age}
                    </div>
                  </div>
                  {isChildComplete && (
                    <Check size={20} style={{ color: 'var(--brand-primary)' }} />
                  )}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    padding: '16px 0',
                  }}
                >
                  Tap to select a child
                </div>
              )}
            </button>

            {!isChildComplete && (
              <p
                className="mt-2"
                style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--text-muted)',
                }}
              >
                Select which child this story is for
              </p>
            )}
          </div>

          {/* Themes Selection */}
          <div className="px-6 pb-6">
            <SectionHeader
              title="Choose Themes"
              isComplete={isThemesComplete}
              stepNumber={2}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }}
            >
              {themes.map((theme) => {
                const isSelected = selectedThemes.includes(theme);
                return (
                  <button
                    key={theme}
                    onClick={() => handleThemeToggle(theme)}
                    className="transition-smooth active:scale-press"
                    style={{
                      padding: '16px',
                      backgroundColor: isSelected ? 'var(--brand-accent)' : '#FFFFFF',
                      border: isSelected
                        ? '2px solid var(--brand-primary)'
                        : '1px solid var(--neutral-200)',
                      borderRadius: 'var(--radius-lg)',
                      position: 'relative',
                      transform: isSelected ? 'scale(1)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'var(--text-body-md)',
                        fontWeight: isSelected ? 'var(--weight-medium)' : 'var(--weight-regular)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {theme}
                    </div>
                    {isSelected && (
                      <div
                        className="absolute top-2 right-2"
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: 'var(--brand-primary)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={12} style={{ color: 'white' }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedThemes.length > 0 && (
              <div
                className="mt-3 p-3"
                style={{
                  backgroundColor: 'rgba(125, 182, 248, 0.08)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <p
                  style={{
                    fontSize: 'var(--text-caption)',
                    color: 'var(--brand-primary)',
                    fontWeight: 'var(--weight-medium)',
                  }}
                >
                  ✓ {selectedThemes.length} theme{selectedThemes.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            {!isThemesComplete && (
              <p
                className="mt-2"
                style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--text-muted)',
                }}
              >
                Pick one or more themes for the story
              </p>
            )}
          </div>

          {/* Lesson Selection */}
          <div className="px-6 pb-6">
            <SectionHeader
              title="Behavior Lesson"
              isComplete={isLessonComplete}
              stepNumber={3}
            />
            <div className="space-y-2">
              {lessons.map((lessonOption) => (
                <button
                  key={lessonOption}
                  onClick={() => setSelectedLesson(lessonOption)}
                  className="w-full transition-smooth active:scale-press"
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-lg)',
                    border:
                      selectedLesson === lessonOption
                        ? '2px solid var(--brand-primary)'
                        : '1px solid var(--neutral-200)',
                    backgroundColor:
                      selectedLesson === lessonOption ? 'rgba(179, 230, 197, 0.3)' : '#FFFFFF',
                    textAlign: 'left',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      style={{
                        fontSize: 'var(--text-body-md)',
                        fontWeight:
                          selectedLesson === lessonOption
                            ? 'var(--weight-medium)'
                            : 'var(--weight-regular)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {lessonOption}
                    </div>
                    {selectedLesson === lessonOption && (
                      <Check size={20} style={{ color: 'var(--brand-primary)' }} />
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--text-caption)',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    Encourage {lessonOption.toLowerCase()} through the story arc.
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="px-6 pb-6">
            <SectionHeader
              title="Story Tone"
              isComplete={isToneComplete}
              stepNumber={4}
            />

            <div className="space-y-2">
              {tones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className="w-full transition-smooth active:scale-press"
                  style={{
                    padding: '16px',
                    backgroundColor: selectedTone === tone ? 'var(--brand-accent)' : '#FFFFFF',
                    border:
                      selectedTone === tone
                        ? '2px solid var(--brand-primary)'
                        : '1px solid var(--neutral-200)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'left',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      style={{
                        fontSize: 'var(--text-body-md)',
                        fontWeight:
                          selectedTone === tone ? 'var(--weight-medium)' : 'var(--weight-regular)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {tone}
                    </div>
                    {selectedTone === tone && (
                      <Check size={20} style={{ color: 'var(--brand-primary)' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Story Length */}
          <div className="px-6 pb-6">
            <h4
              className="mb-4"
              style={{
                fontSize: 'var(--text-body-md)',
                fontWeight: 'var(--weight-subheading)',
                color: 'var(--text-primary)',
              }}
            >
              Story Length
            </h4>

            <div className="px-2">
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={lengthValue}
                onChange={(e) => handleLengthChange(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  outline: 'none',
                  opacity: 0.8,
                  transition: 'opacity 0.2s',
                }}
              />

              {/* Slider Labels */}
              <div className="flex justify-between mt-3">
                <span
                  style={{
                    fontSize: 'var(--text-caption)',
                    color: storyLength === 'short' ? 'var(--brand-primary)' : 'var(--text-muted)',
                    fontWeight: storyLength === 'short' ? 'var(--weight-medium)' : 'var(--weight-regular)',
                  }}
                >
                  Short
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-caption)',
                    color: storyLength === 'medium' ? 'var(--brand-primary)' : 'var(--text-muted)',
                    fontWeight: storyLength === 'medium' ? 'var(--weight-medium)' : 'var(--weight-regular)',
                  }}
                >
                  Medium
                </span>
                <span
                  style={{
                    fontSize: 'var(--text-caption)',
                    color: storyLength === 'long' ? 'var(--brand-primary)' : 'var(--text-muted)',
                    fontWeight: storyLength === 'long' ? 'var(--weight-medium)' : 'var(--weight-regular)',
                  }}
                >
                  Long
                </span>
              </div>

              <p
                className="mt-3 text-center"
                style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--text-muted)',
                }}
              >
                {storyLength === 'short' && '~3 minutes'}
                {storyLength === 'medium' && '~5 minutes'}
                {storyLength === 'long' && '~8 minutes'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="shrink-0"
          style={{
            padding: '16px 24px 24px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 -2px 8px rgba(16, 24, 40, 0.06)',
          }}
        >
          <button
            onClick={handleGenerate}
            disabled={!isFormValid || reachedDailyLimit || isGenerating}
            className="w-full transition-smooth active:scale-press disabled:opacity-40 btn-center"
            style={{
              height: '48px',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-lg)',
              boxShadow: 'var(--elevation-2)',
            }}
          >
            {reachedDailyLimit ? 'Limit Reached' : isGenerating ? 'Preparing...' : 'Generate Story'}
          </button>
        </div>
      </div>

      {/* Child Selection Bottom Sheet */}
      {showChildSheet && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowChildSheet(false)}
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
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
          >
            <h3 className="mb-4 text-center">Select Child</h3>

            <div className="space-y-2">
              {children.map((child, index) => (
                <button
                  key={child.id}
                  onClick={() => {
                    setSelectedChildId(child.id);
                    setShowChildSheet(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 transition-colors hover:bg-gray-50"
                  style={{
                    backgroundColor:
                      selectedChildId === child.id ? 'rgba(125, 182, 248, 0.08)' : 'transparent',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: ['#7DB6F8', '#F6A6D7', '#B3E6C5', '#C8C5FF'][index % 4],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--text-h3)',
                      fontWeight: 'var(--weight-heading)',
                      color: 'white',
                    }}
                  >
                    {child.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <div
                      style={{
                        fontSize: 'var(--text-body-md)',
                        fontWeight: 'var(--weight-medium)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {child.name}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--text-caption)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Age {child.age}
                    </div>
                  </div>
                  {selectedChildId === child.id && (
                    <Check size={20} style={{ color: 'var(--brand-primary)' }} />
                  )}
                </button>
              ))}

              <button
                onClick={() => {
                  setShowChildSheet(false);
                  onAddChild();
                }}
                className="w-full flex items-center justify-center gap-2 p-4 transition-colors hover:bg-gray-50"
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: 'var(--radius-md)',
                  border: '2px dashed var(--neutral-300)',
                  marginTop: '12px',
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-muted)',
                  }}
                >
                  + Add New Child
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PlanUsageCard({
  planSummary,
  onViewPlans,
}: {
  planSummary: PlanSummary;
  onViewPlans?: () => void;
}) {
  const usagePercent =
    planSummary.storiesTotal > 0
      ? Math.min(
        (planSummary.storiesUsed / planSummary.storiesTotal) * 100,
        100
      )
      : 0;

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--elevation-1)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p
            style={{
              fontSize: 'var(--text-body-sm)',
              color: 'var(--text-muted)',
            }}
          >
            Current plan
          </p>
          <h4>{planSummary.name}</h4>
        </div>
        {!planSummary.isPremium && onViewPlans && (
          <button
            onClick={onViewPlans}
            className="transition-smooth"
            style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--brand-primary)',
              fontWeight: 'var(--weight-medium)',
            }}
          >
            Upgrade
          </button>
        )}
      </div>
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--neutral-100)',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: `${usagePercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-accent))',
          }}
        />
      </div>
      <div
        className="flex items-center justify-between"
        style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--text-muted)',
        }}
      >
        <span>
          {planSummary.storiesUsed}/{planSummary.storiesTotal} stories this month
        </span>
        <span>{planSummary.dailyRemaining} daily left</span>
      </div>
      {!planSummary.isPremium && (
        <p
          style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--text-muted)',
            marginTop: '8px',
          }}
        >
          Stories are kept for {planSummary.retentionHours} hours on the Free plan.
        </p>
      )}
    </div>
  );
}

// Section Header Component
function SectionHeader({
  title,
  isComplete,
  stepNumber,
}: {
  title: string;
  isComplete: boolean;
  stepNumber: number;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="shrink-0"
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: isComplete ? 'var(--brand-primary)' : 'var(--neutral-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        {isComplete ? (
          <Check size={16} style={{ color: 'white' }} />
        ) : (
          <span
            style={{
              fontSize: 'var(--text-caption)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--text-muted)',
            }}
          >
            {stepNumber}
          </span>
        )}
      </div>
      <h4
        style={{
          fontSize: 'var(--text-body-md)',
          fontWeight: 'var(--weight-subheading)',
          color: isComplete ? 'var(--brand-primary)' : 'var(--text-primary)',
        }}
      >
        {title}
      </h4>
    </div>
  );
}

// Generating Animation Component
function GeneratingAnimation() {
  return (
    <div style={{ position: 'relative', width: '120px', height: '120px' }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="var(--brand-primary)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="314"
          strokeDashoffset="314"
          style={{
            animation: 'dash 1.5s ease-in-out infinite',
          }}
        />
        <circle cx="60" cy="60" r="35" fill="rgba(125, 182, 248, 0.1)" />

        {/* Sparkles */}
        {[0, 120, 240].map((rotation, index) => (
          <g key={index} transform={`rotate(${rotation} 60 60)`}>
            <path
              d="M 60 15 L 62 20 L 67 22 L 62 24 L 60 29 L 58 24 L 53 22 L 58 20 Z"
              fill="var(--brand-enchant)"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="1.5s"
                repeatCount="indefinite"
                begin={`${index * 0.5}s`}
              />
            </path>
          </g>
        ))}
      </svg>

      <style>{`
        @keyframes dash {
          0% {
            stroke-dashoffset: 314;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -314;
          }
        }
      `}</style>
    </div>
  );
}