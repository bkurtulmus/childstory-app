import { useState } from 'react';
import { Search, Filter, Grid, List, ChevronRight, MoreVertical, Share2, Star, Trash2, BookOpen, X, ArrowLeft } from 'lucide-react';
import { ConfirmDialog } from './ui/ConfirmDialog';

interface Story {
  id: string;
  title: string;
  childName: string;
  childAvatar: string;
  date: string;
  excerpt: string;
  tone: string;
  language: string;
  coverImage?: string;
  isFavorite: boolean;
  createdAt?: string;
  lesson?: string;
  childId?: string;
  hoursLeft?: number;
  isExpired?: boolean;
}

interface Child {
  id: string;
  name: string;
  avatar: string;
}

interface StoriesLibraryProps {
  stories: Story[];
  children: Child[];
  onReadStory: (storyId: string) => void;
  onShareStory: (storyId: string) => void;
  onDeleteStory: (storyId: string) => void;
  onToggleFavorite: (storyId: string) => void;
  onCreateStory: () => void;
  onUpgrade: () => void;
  isPremiumUser: boolean;
  freeRetentionHours: number;
  onBack?: () => void;
}

type ViewMode = 'list' | 'grid';
type SortBy = 'recent' | 'longest' | 'shortest' | 'favorites';

export function StoriesLibrary({
  stories,
  children,
  onReadStory,
  onShareStory,
  onDeleteStory,
  onToggleFavorite,
  onCreateStory,
  onUpgrade,
  isPremiumUser,
  freeRetentionHours,
  onBack,
}: StoriesLibraryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);

  // Filter states
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('recent');

  const tags = ['Gentle', 'Funny', 'Adventure', 'Bedtime'];

  const now = Date.now();

  const normalizedStories = stories.map((story) => {
    const createdAt = story.createdAt ? new Date(story.createdAt).getTime() : now;
    const hoursAlive = (now - createdAt) / (60 * 60 * 1000);
    const isExpired = !isPremiumUser && hoursAlive > freeRetentionHours;
    const hoursLeft = Math.max(freeRetentionHours - hoursAlive, 0);
    return {
      ...story,
      createdAt,
      isExpired,
      hoursLeft,
    };
  });

  const handleChildFilterToggle = (childId: string) => {
    setSelectedChildren((prev) =>
      prev.includes(childId) ? prev.filter((id) => id !== childId) : [...prev, childId]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleClearFilters = () => {
    setSelectedChildren([]);
    setTimeRange('all');
    setSelectedTags([]);
    setSortBy('recent');
  };

  const hasActiveFilters =
    selectedChildren.length > 0 || timeRange !== 'all' || selectedTags.length > 0;

  // Filter stories
  const visibleStories = normalizedStories.filter((story) => !story.isExpired);
  const expiredCount = normalizedStories.length - visibleStories.length;

  const filteredStories = visibleStories.filter((story) => {
    if (searchQuery && !story.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedChildren.length > 0 && story.childId && !selectedChildren.includes(story.childId)) {
      return false;
    }
    if (selectedTags.length > 0 && !selectedTags.includes(story.tone)) {
      return false;
    }
    return true;
  });

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
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center transition-opacity hover:opacity-70"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--neutral-100)',
              }}
              aria-label="Back"
            >
              <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
            </button>
          )}
          <h2>Your Stories</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center justify-center transition-opacity hover:opacity-70"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: 'transparent',
            }}
            aria-label="Search"
          >
            <Search size={24} style={{ color: 'var(--text-primary)' }} />
          </button>
          <button
            onClick={() => setShowFilterSheet(true)}
            className="flex items-center justify-center transition-opacity hover:opacity-70"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: 'transparent',
            }}
            aria-label="Filter"
          >
            <Filter size={24} style={{ color: 'var(--text-primary)' }} />
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="flex items-center justify-center transition-opacity hover:opacity-70"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: 'transparent',
            }}
            aria-label={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
          >
            {viewMode === 'list' ? (
              <Grid size={24} style={{ color: 'var(--text-primary)' }} />
            ) : (
              <List size={24} style={{ color: 'var(--text-primary)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Story?"
        message="This story will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={() => {
          if (storyToDelete) {
            onDeleteStory(storyToDelete);
            setStoryToDelete(null);
          }
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {!isPremiumUser && (
        <div
          className="px-6 py-3"
          style={{
            backgroundColor: 'rgba(179, 230, 197, 0.2)',
            borderBottom: '1px solid var(--neutral-200)',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <p
              style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--text-secondary)',
              }}
            >
              Stories older than {freeRetentionHours} hours disappear on the Free plan.
            </p>
            <button
              onClick={onUpgrade}
              className="transition-smooth"
              style={{
                fontSize: 'var(--text-caption)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--brand-primary)',
              }}
            >
              Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {showSearch && (
        <div className="px-6 py-4 shrink-0" style={{ backgroundColor: '#FFFFFF' }}>
          <div
            className="flex items-center px-4 gap-3"
            style={{
              height: '56px',
              border: '1px solid var(--neutral-200)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Search size={20} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories…"
              className="flex-1 outline-none bg-transparent"
              style={{
                fontSize: 'var(--text-body-lg)',
                fontWeight: 'var(--weight-regular)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      )}

      {/* Filter Active Indicator */}
      {hasActiveFilters && (
        <div className="px-6 py-2 shrink-0">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2"
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--neutral-200)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--text-primary)',
                }}
              >
                Filtered • {filteredStories.length} results
              </span>
              <button onClick={handleClearFilters} aria-label="Clear filters">
                <X size={16} style={{ color: 'var(--text-primary)' }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6" style={{ paddingBottom: 'calc(120px + var(--safe-area-bottom))' }}>
        {expiredCount > 0 && !isPremiumUser && (
          <div
            className="mb-4"
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(125, 182, 248, 0.12)',
              fontSize: 'var(--text-caption)',
              color: 'var(--text-secondary)',
            }}
          >
            {expiredCount} older stor{expiredCount === 1 ? 'y has' : 'ies have'} been removed.
            Upgrade to keep everything forever.
          </div>
        )}
        {visibleStories.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full">
            <BookStarsIllustration />
            <h3 className="mb-2 mt-6 text-center">No stories yet</h3>
            <p
              className="text-center mb-6"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              Create your first magical tale
            </p>
            <button
              onClick={onCreateStory}
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
              Create a Story
            </button>
          </div>
        ) : viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {filteredStories.map((story) => (
              <button
                key={story.id}
                onClick={() => onReadStory(story.id)}
                className="w-full transition-opacity hover:opacity-80"
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--elevation-1)',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'left',
                  minHeight: '120px',
                }}
              >
                {/* Cover thumbnail */}
                <div
                  className="shrink-0"
                  style={{
                    width: '108px',
                    height: '108px',
                    backgroundColor: 'rgba(125, 182, 248, 0.2)',
                    borderRadius: 'var(--radius-md)',
                  }}
                />

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0" style={{ gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h3
                      className="line-clamp-2 mb-0"
                      style={{
                        fontSize: '16px',
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {story.title}
                    </h3>
                    <div className="flex items-center gap-2" style={{ flexWrap: 'nowrap' }}>
                      <div
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: 'var(--brand-primary)',
                          borderRadius: '50%',
                          fontSize: 'var(--text-caption)',
                          color: 'white',
                          opacity: 0.9,
                        }}
                      >
                        {story.childName.charAt(0)}
                      </div>
                      <span
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {story.childName}
                      </span>
                      <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>•</span>
                      <span
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--text-muted)',
                          flexShrink: 0,
                        }}
                      >
                        {story.date}
                      </span>
                    </div>
                    <p
                      className="line-clamp-2 mb-0"
                      style={{
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.5',
                      }}
                    >
                      {story.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: '4px' }}>
                    <div
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'var(--neutral-200)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-caption)',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {story.tone}
                    </div>
                    <div
                      style={{
                        padding: '4px 8px',
                        fontSize: 'var(--text-caption)',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      🇬🇧 {story.language || 'English'}
                    </div>
                    {!isPremiumUser && story.hoursLeft !== undefined && (
                      <div
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--semantic-warning)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Expires in {Math.max(1, Math.ceil(story.hoursLeft))}h
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col justify-between items-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStoryId(story.id);
                      setShowOverflowMenu(true);
                    }}
                    className="transition-opacity hover:opacity-70"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'transparent',
                    }}
                    aria-label="More options"
                  >
                    <MoreVertical size={20} style={{ color: 'var(--text-muted)' }} />
                  </button>
                  <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Grid View */
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
                onClick={() => onReadStory(story.id)}
                className="transition-opacity hover:opacity-80"
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--elevation-1)',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '140px',
                    marginBottom: '12px',
                    backgroundColor: 'rgba(125, 182, 248, 0.2)',
                    borderRadius: 'var(--radius-md)',
                  }}
                />
                <div
                  className="line-clamp-2 mb-1"
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-subheading)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {story.title}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'var(--brand-primary)',
                      borderRadius: '50%',
                      fontSize: '10px',
                      color: 'white',
                      opacity: 0.9,
                    }}
                  >
                    {story.childName.charAt(0)}
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--text-caption)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {story.date}
                  </span>
                </div>
                <div
                  style={{
                    padding: '4px 8px',
                    backgroundColor: 'var(--neutral-200)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-caption)',
                    color: 'var(--text-muted)',
                    display: 'inline-block',
                  }}
                >
                  {story.tone}
                </div>
                {!isPremiumUser && story.hoursLeft !== undefined && (
                  <div
                    style={{
                      marginTop: '6px',
                      fontSize: 'var(--text-caption)',
                      color: 'var(--semantic-warning)',
                    }}
                  >
                    Expires in {Math.max(1, Math.ceil(story.hoursLeft))}h
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet */}
      {showFilterSheet && (
        <div
          className="absolute inset-0 z-50"
          onClick={() => setShowFilterSheet(false)}
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
              maxHeight: '80%',
              overflow: 'auto',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2>Filter Stories</h2>
              <button onClick={() => setShowFilterSheet(false)} aria-label="Close">
                <X size={24} style={{ color: 'var(--text-primary)' }} />
              </button>
            </div>

            {/* Children Filter */}
            <div className="mb-6">
              <h3 className="mb-3">Children</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleChildFilterToggle(child.id)}
                    className="flex items-center gap-2 shrink-0 transition-all"
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: selectedChildren.includes(child.id)
                        ? 'var(--brand-accent)'
                        : 'transparent',
                      border: `1px solid ${selectedChildren.includes(child.id)
                        ? 'var(--brand-primary)'
                        : 'var(--neutral-200)'
                        }`,
                    }}
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: 'var(--brand-primary)',
                        borderRadius: '50%',
                        fontSize: '12px',
                        color: 'white',
                      }}
                    >
                      {child.name.charAt(0)}
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {child.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range */}
            <div className="mb-6">
              <h3 className="mb-3">Time Range</h3>
              <div className="flex gap-1">
                {(['7days', '30days', 'all'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className="flex-1 transition-all"
                    style={{
                      height: '44px',
                      backgroundColor:
                        timeRange === range ? 'var(--brand-primary)' : 'transparent',
                      color: timeRange === range ? 'white' : 'var(--text-primary)',
                      border: '1px solid var(--neutral-200)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-body-sm)',
                      fontWeight: 'var(--weight-medium)',
                    }}
                  >
                    {range === '7days' ? '7 days' : range === '30days' ? '30 days' : 'All time'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className="transition-all"
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: selectedTags.includes(tag)
                        ? 'var(--brand-accent)'
                        : 'transparent',
                      border: `1px solid ${selectedTags.includes(tag) ? 'var(--brand-primary)' : 'var(--neutral-200)'
                        }`,
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <h3 className="mb-3">Sort By</h3>
              <div className="space-y-2">
                {(['recent', 'longest', 'shortest', 'favorites'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className="w-full flex items-center justify-between p-4 transition-all"
                    style={{
                      backgroundColor:
                        sortBy === option ? 'var(--brand-accent)' : 'transparent',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--text-body-md)',
                        fontWeight: 'var(--weight-medium)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {option === 'recent'
                        ? 'Most recent'
                        : option === 'longest'
                          ? 'Longest'
                          : option === 'shortest'
                            ? 'Shortest'
                            : 'Favorites first'}
                    </span>
                    {sortBy === option && (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--brand-primary)',
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setShowFilterSheet(false)}
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
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Overflow Menu */}
      {showOverflowMenu && selectedStoryId && (
        <div
          className="absolute inset-0 z-50"
          onClick={() => setShowOverflowMenu(false)}
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
                  onReadStory(selectedStoryId);
                  setShowOverflowMenu(false);
                }}
                className="flex items-center gap-4 w-full p-4 transition-opacity hover:opacity-70"
              >
                <BookOpen size={24} style={{ color: 'var(--text-primary)' }} />
                <span
                  style={{
                    fontSize: 'var(--text-body-lg)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Read
                </span>
              </button>
              <button
                onClick={() => {
                  onShareStory(selectedStoryId);
                  setShowOverflowMenu(false);
                }}
                className="flex items-center gap-4 w-full p-4 transition-opacity hover:opacity-70"
              >
                <Share2 size={24} style={{ color: 'var(--text-primary)' }} />
                <span
                  style={{
                    fontSize: 'var(--text-body-lg)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Share
                </span>
              </button>
              <button
                onClick={() => {
                  onToggleFavorite(selectedStoryId);
                  setShowOverflowMenu(false);
                }}
                className="flex items-center gap-4 w-full p-4 transition-opacity hover:opacity-70"
              >
                <Star size={24} style={{ color: 'var(--text-primary)' }} />
                <span
                  style={{
                    fontSize: 'var(--text-body-lg)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Favorite
                </span>
              </button>
              <button
                onClick={() => {
                  setStoryToDelete(selectedStoryId);
                  setShowDeleteConfirm(true);
                  setShowOverflowMenu(false);
                }}
                className="flex items-center gap-4 w-full p-4 transition-opacity hover:opacity-70"
              >
                <Trash2 size={24} style={{ color: 'var(--semantic-error)' }} />
                <span
                  style={{
                    fontSize: 'var(--text-body-lg)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--semantic-error)',
                  }}
                >
                  Delete
                </span>
              </button>
            </div>
            <button
              onClick={() => setShowOverflowMenu(false)}
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

// Book with stars illustration
function BookStarsIllustration() {
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Open book */}
      <rect x="40" y="50" width="60" height="50" rx="4" fill="#7DB6F8" opacity="0.2" />
      <line x1="70" y1="50" x2="70" y2="100" stroke="#7DB6F8" strokeWidth="2" opacity="0.3" />

      {/* Stars */}
      <path
        d="M30 35 L32 41 L38 43 L32 45 L30 51 L28 45 L22 43 L28 41 Z"
        fill="#F6A6D7"
      >
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </path>
      <path
        d="M105 40 L106.5 44 L110.5 45.5 L106.5 47 L105 51 L103.5 47 L99.5 45.5 L103.5 44 Z"
        fill="#B3E6C5"
      >
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path
        d="M60 25 L61 28 L64 29 L61 30 L60 33 L59 30 L56 29 L59 28 Z"
        fill="#C8C5FF"
      >
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}