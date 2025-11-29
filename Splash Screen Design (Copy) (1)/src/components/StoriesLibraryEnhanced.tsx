import { useState } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
  Share2,
  Star,
  Trash2,
  ArrowLeft,
  Heart,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';
import { toast } from '../utils/toast';

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
  length: 'short' | 'medium' | 'long';
  duration: string;
  themes: string[];
  seriesId?: string;
  isInteractive?: boolean;
  content?: string;
}

interface StoriesLibraryEnhancedProps {
  onBack: () => void;
  onViewStory: (storyId: string) => void;
}

type ViewMode = 'list' | 'grid';
type DateRange = 'today' | 'week' | 'month' | 'all';
type SortBy = 'recent' | 'alphabetical' | 'favorites';

export function StoriesLibraryEnhanced({
  onBack,
  onViewStory,
}: StoriesLibraryEnhancedProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showInteractiveOnly, setShowInteractiveOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedStories, setSelectedStories] = useState<string[]>([]);

  const searchHistory = ['space adventure', 'bedtime story', 'Emma'];

  const mockStories: Story[] = [
    {
      id: '1',
      title: 'The Space Adventure',
      childName: 'Emma',
      childAvatar: '0',
      date: 'Nov 15',
      excerpt: 'Once upon a time in a magical galaxy...',
      tone: 'Adventure',
      language: 'English',
      isFavorite: true,
      length: 'medium',
      duration: '5 min',
      themes: ['Space', 'Adventure'],
      isInteractive: true,
    },
    {
      id: '2',
      title: 'Bedtime in the Forest',
      childName: 'Emma',
      childAvatar: '0',
      date: 'Nov 14',
      excerpt: 'In a peaceful forest...',
      tone: 'Gentle',
      language: 'English',
      isFavorite: false,
      length: 'short',
      duration: '3 min',
      themes: ['Bedtime', 'Animals'],
    },
    {
      id: '3',
      title: 'The Pirate\'s Treasure',
      childName: 'Liam',
      childAvatar: '1',
      date: 'Nov 13',
      excerpt: 'On the high seas...',
      tone: 'Adventure',
      language: 'English',
      isFavorite: true,
      length: 'long',
      duration: '8 min',
      themes: ['Pirates', 'Adventure'],
      seriesId: 'pirate-series',
    },
    {
      id: '4',
      title: 'Magical Unicorn Dreams',
      childName: 'Emma',
      childAvatar: '0',
      date: 'Nov 12',
      excerpt: 'In a land of rainbows...',
      tone: 'Magical',
      language: 'English',
      isFavorite: false,
      length: 'medium',
      duration: '5 min',
      themes: ['Fantasy', 'Magical'],
      isInteractive: true,
    },
  ];

  const filteredStories = mockStories.filter(story => {
    if (searchQuery && !story.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (showFavoritesOnly && !story.isFavorite) return false;
    if (showInteractiveOnly && !story.isInteractive) return false;
    if (selectedThemes.length > 0 && !selectedThemes.some(t => story.themes.includes(t))) {
      return false;
    }
    return true;
  });

  const handleToggleSelection = (storyId: string) => {
    setSelectedStories(prev =>
      prev.includes(storyId) ? prev.filter(id => id !== storyId) : [...prev, storyId]
    );
  };

  const handleBulkFavorite = () => {
    toast.success('Added to favorites', `${selectedStories.length} stories added to favorites.`);
    setSelectionMode(false);
    setSelectedStories([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedStories.length} stories?`)) {
      toast.success('Stories deleted', `${selectedStories.length} stories have been deleted.`);
      setSelectionMode(false);
      setSelectedStories([]);
    }
  };

  const activeFilters = [
    showFavoritesOnly && 'favorites',
    showInteractiveOnly && 'interactive',
    selectedThemes.length > 0 && 'themes',
  ].filter(Boolean);

  return (
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
      {/* Header */}
      <div
        className="shrink-0"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--elevation-1)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
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

          <h2>{selectionMode ? `${selectedStories.length} selected` : 'Your Stories'}</h2>

          <div className="flex items-center gap-2">
            {!selectionMode && (
              <>
                <button
                  onClick={() => setShowFilterSheet(true)}
                  className="transition-smooth hover:opacity-70"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor:
                      activeFilters.length > 0
                        ? 'rgba(125, 182, 248, 0.12)'
                        : 'var(--neutral-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Filter
                    size={20}
                    style={{
                      color:
                        activeFilters.length > 0
                          ? 'var(--brand-primary)'
                          : 'var(--text-primary)',
                    }}
                  />
                  {activeFilters.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-primary)',
                      }}
                    />
                  )}
                </button>

                <button
                  onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
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
                  {viewMode === 'list' ? (
                    <Grid size={20} style={{ color: 'var(--text-primary)' }} />
                  ) : (
                    <List size={20} style={{ color: 'var(--text-primary)' }} />
                  )}
                </button>
              </>
            )}
            {selectionMode && (
              <button
                onClick={() => {
                  setSelectionMode(false);
                  setSelectedStories([]);
                }}
                className="transition-smooth hover:opacity-70"
                style={{
                  width: '40px',
                  height: '40px',
                }}
              >
                <X size={20} style={{ color: 'var(--text-primary)' }} />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar with Autocomplete */}
        {!selectionMode && (
          <div className="px-6 py-3 relative">
            <div
              className="flex items-center gap-3 px-4"
              style={{
                height: '44px',
                backgroundColor: 'var(--neutral-100)',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <Search size={20} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                className="flex-1 bg-transparent outline-none"
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--text-primary)',
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="transition-smooth">
                  <X size={16} style={{ color: 'var(--text-muted)' }} />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showSearchSuggestions && searchHistory.length > 0 && !searchQuery && (
              <div
                className="absolute left-6 right-6 mt-2 z-10"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--elevation-2)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                <div
                  className="px-4 py-2"
                  style={{
                    fontSize: 'var(--text-caption)',
                    color: 'var(--text-muted)',
                    fontWeight: 'var(--weight-medium)',
                    borderBottom: '1px solid var(--neutral-100)',
                  }}
                >
                  Recent Searches
                </div>
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(query)}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50"
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {query}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Filter Chips */}
        {!selectionMode && (
          <div className="px-6 pb-3 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="shrink-0 flex items-center gap-2 px-3 py-1.5 transition-smooth"
              style={{
                backgroundColor: showFavoritesOnly ? 'rgba(246, 166, 215, 0.15)' : '#FFFFFF',
                border: showFavoritesOnly ? '1px solid #F6A6D7' : '1px solid var(--neutral-200)',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <Heart
                size={14}
                style={{
                  color: showFavoritesOnly ? '#F6A6D7' : 'var(--text-muted)',
                  fill: showFavoritesOnly ? '#F6A6D7' : 'none',
                }}
              />
              <span
                style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--weight-medium)',
                  color: showFavoritesOnly ? '#F6A6D7' : 'var(--text-primary)',
                }}
              >
                Favorites
              </span>
            </button>

            <button
              onClick={() => setShowInteractiveOnly(!showInteractiveOnly)}
              className="shrink-0 flex items-center gap-2 px-3 py-1.5 transition-smooth"
              style={{
                backgroundColor: showInteractiveOnly ? 'rgba(200, 197, 255, 0.15)' : '#FFFFFF',
                border: showInteractiveOnly ? '1px solid #C8C5FF' : '1px solid var(--neutral-200)',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <Sparkles
                size={14}
                style={{
                  color: showInteractiveOnly ? '#C8C5FF' : 'var(--text-muted)',
                }}
              />
              <span
                style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--weight-medium)',
                  color: showInteractiveOnly ? '#C8C5FF' : 'var(--text-primary)',
                }}
              >
                Interactive
              </span>
            </button>

            <button
              className="shrink-0 px-3 py-1.5"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--text-caption)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-muted)',
              }}
            >
              Sort: {sortBy === 'recent' ? 'Most Recent' : sortBy === 'alphabetical' ? 'A-Z' : 'Favorites First'}
            </button>
          </div>
        )}
      </div>

      {/* Stories Content */}
      <div className="flex-1 overflow-y-auto px-6" style={{ paddingTop: '16px', paddingBottom: '96px' }}>
        {viewMode === 'grid' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}
          >
            {filteredStories.map((story) => (
              <GridStoryCard
                key={story.id}
                story={story}
                selectionMode={selectionMode}
                isSelected={selectedStories.includes(story.id)}
                onSelect={() => handleToggleSelection(story.id)}
                onView={() => onViewStory(story.id)}
                onLongPress={() => {
                  setSelectionMode(true);
                  handleToggleSelection(story.id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStories.map((story) => (
              <ListStoryCard
                key={story.id}
                story={story}
                selectionMode={selectionMode}
                isSelected={selectedStories.includes(story.id)}
                onSelect={() => handleToggleSelection(story.id)}
                onView={() => onViewStory(story.id)}
                onLongPress={() => {
                  setSelectionMode(true);
                  handleToggleSelection(story.id);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectionMode && selectedStories.length > 0 && (
        <div
          className="shrink-0"
          style={{
            padding: '16px 24px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 -2px 8px rgba(16, 24, 40, 0.06)',
          }}
        >
          <div className="flex gap-3">
            <button
              onClick={handleBulkFavorite}
              className="flex-1 transition-smooth active:scale-press"
              style={{
                height: '44px',
                backgroundColor: 'rgba(246, 166, 215, 0.15)',
                border: '1px solid #F6A6D7',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-sm)',
                color: '#F6A6D7',
              }}
            >
              <Heart size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Favorite
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex-1 transition-smooth active:scale-press"
              style={{
                height: '44px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--semantic-error)',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--semantic-error)',
              }}
            >
              <Trash2 size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Filter Sheet */}
      {showFilterSheet && (
        <FilterSheet
          dateRange={dateRange}
          selectedThemes={selectedThemes}
          sortBy={sortBy}
          onDateRangeChange={setDateRange}
          onThemesChange={setSelectedThemes}
          onSortByChange={setSortBy}
          onClose={() => setShowFilterSheet(false)}
        />
      )}
    </div>
  );
}

// Grid Story Card
function GridStoryCard({
  story,
  selectionMode,
  isSelected,
  onSelect,
  onView,
  onLongPress,
}: {
  story: Story;
  selectionMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onLongPress: () => void;
}) {
  return (
    <button
      onClick={selectionMode ? onSelect : onView}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress();
      }}
      className="transition-smooth active:scale-press"
      style={{
        position: 'relative',
        textAlign: 'left',
      }}
    >
      {/* Thumbnail - Standardized 160x160 */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          backgroundColor: 'rgba(200, 197, 255, 0.2)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '8px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {selectionMode && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: isSelected ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.9)',
              border: isSelected ? 'none' : '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isSelected && <CheckCircle2 size={16} style={{ color: 'white' }} />}
          </div>
        )}
        {story.isFavorite && !selectionMode && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
            }}
          >
            <Heart size={16} style={{ color: '#F6A6D7', fill: '#F6A6D7' }} />
          </div>
        )}
        {story.isInteractive && !selectionMode && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              padding: '4px 8px',
              backgroundColor: 'rgba(200, 197, 255, 0.9)',
              borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--text-caption)',
              color: 'white',
              fontWeight: 'var(--weight-medium)',
            }}
          >
            Interactive
          </div>
        )}
      </div>

      {/* Title */}
      <h4
        className="line-clamp-2 mb-1"
        style={{
          fontSize: 'var(--text-body-sm)',
          fontWeight: 'var(--weight-medium)',
          color: 'var(--text-primary)',
        }}
      >
        {story.title}
      </h4>

      {/* Metadata */}
      <div
        style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--text-muted)',
        }}
      >
        {story.duration}
      </div>
    </button>
  );
}

// List Story Card - Minimized Design
function ListStoryCard({
  story,
  selectionMode,
  isSelected,
  onSelect,
  onView,
  onLongPress,
}: {
  story: Story;
  selectionMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onLongPress: () => void;
}) {
  return (
    <button
      onClick={selectionMode ? onSelect : onView}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress();
      }}
      className="w-full transition-smooth active:scale-press"
      style={{
        padding: '12px',
        backgroundColor: isSelected ? 'rgba(125, 182, 248, 0.08)' : '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'left',
      }}
    >
      <div className="flex items-center gap-3">
        {selectionMode && (
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: isSelected ? 'var(--brand-primary)' : 'var(--neutral-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isSelected && <CheckCircle2 size={16} style={{ color: 'white' }} />}
          </div>
        )}

        {/* Thumbnail */}
        <div
          className="shrink-0"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(200, 197, 255, 0.2)',
          }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4
            className="line-clamp-1 mb-1"
            style={{
              fontSize: 'var(--text-body-md)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--text-primary)',
            }}
          >
            {story.title}
          </h4>
          <div
            style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--text-muted)',
            }}
          >
            {story.childName} • {story.date} • {story.duration}
          </div>
        </div>

        {/* Icons */}
        {!selectionMode && (
          <div className="flex items-center gap-2 shrink-0">
            {story.isFavorite && (
              <Heart size={16} style={{ color: '#F6A6D7', fill: '#F6A6D7' }} />
            )}
            {story.isInteractive && (
              <Sparkles size={16} style={{ color: '#C8C5FF' }} />
            )}
          </div>
        )}
      </div>
    </button>
  );
}

// Categorized Filter Sheet
function FilterSheet({
  dateRange,
  selectedThemes,
  sortBy,
  onDateRangeChange,
  onThemesChange,
  onSortByChange,
  onClose,
}: {
  dateRange: DateRange;
  selectedThemes: string[];
  sortBy: SortBy;
  onDateRangeChange: (range: DateRange) => void;
  onThemesChange: (themes: string[]) => void;
  onSortByChange: (sort: SortBy) => void;
  onClose: () => void;
}) {
  const themes = ['Adventure', 'Bedtime', 'Fantasy', 'Space', 'Animals', 'Pirates'];
  const dateRanges: { value: DateRange; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ];
  const sortOptions: { value: SortBy; label: string }[] = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'favorites', label: 'Favorites First' },
  ];

  const handleThemeToggle = (theme: string) => {
    onThemesChange(
      selectedThemes.includes(theme)
        ? selectedThemes.filter((t) => t !== theme)
        : [...selectedThemes, theme]
    );
  };

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
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
          maxHeight: '75vh',
          overflowY: 'auto',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3>Filters & Sort</h3>
          <button onClick={onClose} className="transition-smooth hover:opacity-70">
            <X size={24} style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>

        {/* Time Section */}
        <div className="mb-6">
          <h4 className="mb-3">Time</h4>
          <div className="space-y-2">
            {dateRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => onDateRangeChange(range.value)}
                className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50"
                style={{
                  backgroundColor: dateRange === range.value ? 'rgba(125, 182, 248, 0.08)' : 'transparent',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-body-md)',
                    color: 'var(--text-primary)',
                    fontWeight: dateRange === range.value ? 'var(--weight-medium)' : 'var(--weight-regular)',
                  }}
                >
                  {range.label}
                </span>
                {dateRange === range.value && (
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand-primary)',
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Themes Section */}
        <div className="mb-6">
          <h4 className="mb-3">Themes</h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
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
                    padding: '12px',
                    backgroundColor: isSelected ? 'var(--brand-accent)' : '#FFFFFF',
                    border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--neutral-200)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: isSelected ? 'var(--weight-medium)' : 'var(--weight-regular)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {theme}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort Section */}
        <div className="mb-4">
          <h4 className="mb-3">Sort By</h4>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onSortByChange(option.value)}
                className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50"
                style={{
                  backgroundColor: sortBy === option.value ? 'rgba(125, 182, 248, 0.08)' : 'transparent',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-body-md)',
                    color: 'var(--text-primary)',
                    fontWeight: sortBy === option.value ? 'var(--weight-medium)' : 'var(--weight-regular)',
                  }}
                >
                  {option.label}
                </span>
                {sortBy === option.value && (
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand-primary)',
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
