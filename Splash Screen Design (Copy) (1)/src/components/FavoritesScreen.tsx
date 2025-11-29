import { useState } from 'react';
import { ArrowLeft, Heart, Search, Grid, List, Plus } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  childName: string;
  date: string;
  duration: string;
  thumbnail: string;
  isFavorite: boolean;
}

interface FavoritesScreenProps {
  onBack: () => void;
  onViewStory: (storyId: string) => void;
  onToggleFavorite: (storyId: string) => void;
  onCreateStory?: () => void;
}

export function FavoritesScreen({
  onBack,
  onViewStory,
  onToggleFavorite,
  onCreateStory,
}: FavoritesScreenProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock favorite stories - empty for demo
  const [stories] = useState<Story[]>([]);

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--neutral-100)',
        }}
      >
        <button
          onClick={onBack}
          className="transition-smooth hover:opacity-70"
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

        <h3>Favorites</h3>

        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="transition-smooth hover:opacity-70"
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
          {viewMode === 'grid' ? (
            <List size={20} style={{ color: 'var(--text-primary)' }} />
          ) : (
            <Grid size={20} style={{ color: 'var(--text-primary)' }} />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredStories.length === 0 ? (
          /* Empty State - Unique to Favorites */
          <div
            className="flex flex-col items-center justify-center px-6"
            style={{
              minHeight: '100%',
            }}
          >
            {/* Unique Heart with Stars Illustration */}
            <HeartWithStarsIllustration />

            <h2 className="mb-2 text-center mt-6">No favorites yet</h2>
            <p
              className="text-center mb-8"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
                maxWidth: '280px',
              }}
            >
              Stories you love will appear here
            </p>

            {onCreateStory && (
              <button
                onClick={onCreateStory}
                className="transition-smooth active:scale-press"
                style={{
                  height: '48px',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  backgroundColor: 'var(--brand-primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 'var(--weight-medium)',
                  fontSize: 'var(--text-body-lg)',
                  boxShadow: 'var(--elevation-2)',
                }}
              >
                Create a Story
              </button>
            )}
          </div>
        ) : (
          /* Stories Grid/List */
          <div className="px-6 py-6">
            {viewMode === 'grid' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                }}
              >
                {filteredStories.map((story) => (
                  <button
                    key={story.id}
                    onClick={() => onViewStory(story.id)}
                    className="text-left transition-smooth hover:opacity-70 active:scale-press"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--elevation-1)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className="relative"
                      style={{
                        aspectRatio: '4/3',
                        backgroundColor: 'rgba(246, 166, 215, 0.2)',
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(story.id);
                        }}
                        className="absolute top-2 right-2 transition-smooth active:scale-press"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Heart
                          size={16}
                          style={{
                            color: '#F6A6D7',
                            fill: '#F6A6D7',
                          }}
                        />
                      </button>
                    </div>
                    <div style={{ padding: '12px' }}>
                      <h4
                        style={{
                          fontSize: 'var(--text-body-md)',
                          fontWeight: 'var(--weight-medium)',
                          color: 'var(--text-primary)',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {story.title}
                      </h4>
                      <p
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {story.childName} • {story.duration}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStories.map((story) => (
                  <button
                    key={story.id}
                    onClick={() => onViewStory(story.id)}
                    className="w-full flex items-center gap-3 p-3 transition-smooth hover:opacity-70 active:scale-press"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--neutral-200)',
                      borderRadius: 'var(--radius-lg)',
                    }}
                  >
                    <div
                      className="shrink-0"
                      style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'rgba(246, 166, 215, 0.2)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div
                        className="line-clamp-1 mb-1"
                        style={{
                          fontSize: 'var(--text-body-lg)',
                          fontWeight: 'var(--weight-medium)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {story.title}
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {story.childName} • {story.date}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(story.id);
                      }}
                      className="shrink-0 transition-smooth active:scale-press"
                    >
                      <Heart
                        size={20}
                        style={{
                          color: '#F6A6D7',
                          fill: '#F6A6D7',
                        }}
                      />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Unique Heart with Stars Illustration (140x140px)
function HeartWithStarsIllustration() {
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Heart */}
      <path
        d="M70 110 C 50 95, 30 80, 30 60 C 30 45, 40 35, 52 35 C 60 35, 65 40, 70 47 C 75 40, 80 35, 88 35 C 100 35, 110 45, 110 60 C 110 80, 90 95, 70 110 Z"
        fill="#F6A6D7"
        opacity="0.25"
      />
      
      {/* Star 1 - Top Left */}
      <g opacity="0.6">
        <path
          d="M35 30 L37 36 L43 38 L37 40 L35 46 L33 40 L27 38 L33 36 Z"
          fill="#C8C5FF"
        >
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </path>
      </g>
      
      {/* Star 2 - Top Right */}
      <g opacity="0.8">
        <path
          d="M105 35 L107.5 42 L114.5 44.5 L107.5 47 L105 54 L102.5 47 L95.5 44.5 L102.5 42 Z"
          fill="#B3E6C5"
        >
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
        </path>
      </g>
      
      {/* Star 3 - Bottom Right */}
      <g opacity="0.7">
        <path
          d="M100 100 L101.5 105 L106.5 106.5 L101.5 108 L100 113 L98.5 108 L93.5 106.5 L98.5 105 Z"
          fill="#7DB6F8"
        >
          <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
      
      {/* Star 4 - Left Side */}
      <g opacity="0.6">
        <path
          d="M25 70 L26.5 75 L31.5 76.5 L26.5 78 L25 83 L23.5 78 L18.5 76.5 L23.5 75 Z"
          fill="#F6A6D7"
        >
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" />
        </path>
      </g>
      
      {/* Small sparkle inside heart */}
      <circle cx="70" cy="65" r="2" fill="#FFFFFF" opacity="0.8">
        <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
