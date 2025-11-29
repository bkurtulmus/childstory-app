import { ArrowLeft, Link2, Calendar, Clock } from 'lucide-react';
import { ImageWithLoader } from './figma/ImageWithLoader';

interface SeriesStory {
  id: string;
  title: string;
  partNumber: number;
  createdDate: string;
  duration: string;
  thumbnail?: string;
  isCurrent?: boolean;
}

interface StorySeriesViewProps {
  seriesTitle: string;
  stories: SeriesStory[];
  onBack: () => void;
  onSelectStory: (storyId: string) => void;
}

export function StorySeriesView({
  seriesTitle,
  stories,
  onBack,
  onSelectStory,
}: StorySeriesViewProps) {
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
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: '1px solid var(--neutral-100)',
        }}
      >
        <button
          onClick={onBack}
          className="transition-opacity hover:opacity-70"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--neutral-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
        </button>

        <div className="flex items-center gap-2">
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(125, 182, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link2 size={16} style={{ color: 'var(--brand-primary)' }} />
          </div>
          <span
            style={{
              fontSize: 'var(--text-body-md)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--text-primary)',
            }}
          >
            Story Series
          </span>
        </div>

        <div style={{ width: '40px' }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Series Header */}
        <div className="mb-6">
          <h2 className="mb-2">{seriesTitle}</h2>
          <p
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-muted)',
            }}
          >
            {stories.length} {stories.length === 1 ? 'story' : 'stories'} in this series
          </p>
        </div>

        {/* Timeline View */}
        <div className="space-y-0">
          {stories.map((story, index) => (
            <div key={story.id} className="relative">
              {/* Timeline connector line */}
              {index < stories.length - 1 && (
                <div
                  className="absolute left-8 top-20 bottom-0"
                  style={{
                    width: '2px',
                    backgroundColor: 'var(--neutral-200)',
                    zIndex: 0,
                  }}
                />
              )}

              {/* Story Card */}
              <button
                onClick={() => onSelectStory(story.id)}
                className="relative w-full text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    backgroundColor: story.isCurrent
                      ? 'rgba(125, 182, 248, 0.08)'
                      : '#FFFFFF',
                    border: story.isCurrent
                      ? '2px solid var(--brand-primary)'
                      : '1px solid var(--neutral-200)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    boxShadow: story.isCurrent
                      ? 'var(--elevation-2)'
                      : 'var(--elevation-1)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <div className="flex gap-4">
                    {/* Part Number Badge */}
                    <div
                      className="shrink-0"
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: story.isCurrent
                          ? 'var(--brand-primary)'
                          : 'var(--neutral-100)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {story.thumbnail ? (
                        <>
                          <ImageWithLoader
                            src={story.thumbnail}
                            alt={`Part ${story.partNumber}`}
                            aspectRatio="1/1"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-md)',
                            }}
                          />
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                              backgroundColor: 'rgba(0, 0, 0, 0.6)',
                              borderRadius: 'var(--radius-md)',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '20px',
                                fontWeight: 'var(--weight-bold)',
                                color: 'white',
                              }}
                            >
                              {story.partNumber}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span
                            style={{
                              fontSize: 'var(--text-caption)',
                              fontWeight: 'var(--weight-medium)',
                              color: story.isCurrent
                                ? 'rgba(255, 255, 255, 0.8)'
                                : 'var(--text-muted)',
                            }}
                          >
                            Part
                          </span>
                          <span
                            style={{
                              fontSize: '24px',
                              fontWeight: 'var(--weight-bold)',
                              color: story.isCurrent ? 'white' : 'var(--text-primary)',
                            }}
                          >
                            {story.partNumber}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Story Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="mb-2"
                        style={{
                          fontSize: 'var(--text-body-lg)',
                          fontWeight: 'var(--weight-subheading)',
                          color: story.isCurrent
                            ? 'var(--brand-primary)'
                            : 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {story.title}
                      </h3>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar
                            size={14}
                            style={{ color: 'var(--text-muted)' }}
                          />
                          <span
                            style={{
                              fontSize: 'var(--text-body-sm)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {story.createdDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock
                            size={14}
                            style={{ color: 'var(--text-muted)' }}
                          />
                          <span
                            style={{
                              fontSize: 'var(--text-body-sm)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {story.duration}
                          </span>
                        </div>
                      </div>

                      {story.isCurrent && (
                        <div
                          className="mt-2 inline-block px-2 py-1"
                          style={{
                            backgroundColor: 'rgba(125, 182, 248, 0.12)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--text-caption)',
                            fontWeight: 'var(--weight-medium)',
                            color: 'var(--brand-primary)',
                          }}
                        >
                          Currently Reading
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Horizontal Scrollable View (Alternative) - Hidden by default */}
        {/* Uncomment to show horizontal view instead
        <div
          className="overflow-x-auto pb-4"
          style={{
            display: 'flex',
            gap: '12px',
            scrollbarWidth: 'none',
          }}
        >
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => onSelectStory(story.id)}
              className="shrink-0 transition-all hover:scale-105 active:scale-95"
              style={{
                width: '200px',
                backgroundColor: story.isCurrent
                  ? 'rgba(125, 182, 248, 0.08)'
                  : '#FFFFFF',
                border: story.isCurrent
                  ? '2px solid var(--brand-primary)'
                  : '1px solid var(--neutral-200)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                boxShadow: 'var(--elevation-1)',
                textAlign: 'left',
              }}
            >
              <div
                className="mb-3"
                style={{
                  width: '100%',
                  height: '120px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--neutral-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 'var(--weight-bold)',
                    color: story.isCurrent ? 'var(--brand-primary)' : 'var(--text-muted)',
                  }}
                >
                  {story.partNumber}
                </span>
              </div>
              <h4
                style={{
                  fontSize: 'var(--text-body-md)',
                  fontWeight: 'var(--weight-medium)',
                  marginBottom: '8px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {story.title}
              </h4>
              <p
                style={{
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--text-muted)',
                }}
              >
                {story.createdDate}
              </p>
            </button>
          ))}
        </div>
        */}

        {/* Bottom spacing */}
        <div style={{ height: '32px' }} />
      </div>
    </div>
  );
}
