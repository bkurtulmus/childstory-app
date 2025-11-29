import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck, Play, Pause, ChevronLeft, ChevronRight, Volume2, Moon, Sun, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Breadcrumb } from './navigation/Breadcrumb';

interface StoryPage {
  id: string;
  type: 'text-first' | 'illustration-first';
  illustration?: string;
  text?: string;
  caption?: string;
}

interface StoryReaderProps {
  story: {
    id: string;
    title: string;
    childName: string;
    content: string;
    createdDate: string;
    duration: string;
    isFavorite?: boolean;
    audioUrl?: string;
  };
  lesson?: {
    title: string;
    description: string;
  };
  isPremiumUser?: boolean;
  onBack: () => void;
  onToggleFavorite?: () => void;
  onShare?: () => void;
}

export function StoryReader({ story, lesson, isPremiumUser = false, onBack, onToggleFavorite, onShare }: StoryReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isBedtimeMode, setIsBedtimeMode] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [highlightMode, setHighlightMode] = useState<'word' | 'sentence'>('word');
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const readingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Reader preferences
  const [fontSize, setFontSize] = useState<number>(20);
  const [useDyslexicFont, setUseDyslexicFont] = useState<boolean>(false);

  // Mock story pages - In production, this would come from the API
  const storyPages: StoryPage[] = [
    {
      id: '1',
      type: 'illustration-first',
      illustration: '🌟',
      caption: `The Space Adventure of ${story.childName}`,
    },
    {
      id: '2',
      type: 'text-first',
      illustration: '🚀',
      text: `Once upon a time, there was a curious child named ${story.childName} who loved looking at the stars every night.`,
    },
    {
      id: '3',
      type: 'text-first',
      illustration: '🌙',
      text: `One magical evening, ${story.childName} made a wish upon a shooting star. "I wish I could travel to space and meet friendly aliens!"`,
    },
    {
      id: '4',
      type: 'illustration-first',
      illustration: '✨',
      caption: 'Suddenly, something magical happened...',
    },
    {
      id: '5',
      type: 'text-first',
      illustration: '🛸',
      text: `A beautiful spaceship appeared in the backyard! The door opened, and out came three friendly aliens with big smiles.`,
    },
    {
      id: '6',
      type: 'text-first',
      illustration: '👽',
      text: `"Hello ${story.childName}!" they said. "We heard your wish! Would you like to come on an adventure with us?"`,
    },
    {
      id: '7',
      type: 'illustration-first',
      illustration: '🌌',
      caption: 'They zoomed through the galaxy together!',
    },
    {
      id: '8',
      type: 'text-first',
      illustration: '🪐',
      text: `They visited colorful planets, danced among the stars, and learned that friendship can happen anywhere in the universe.`,
    },
    {
      id: '9',
      type: 'text-first',
      illustration: '🏠',
      text: `After the wonderful adventure, the aliens brought ${story.childName} safely home. "Remember," they said, "the universe is full of friends waiting to meet you!"`,
    },
    {
      id: '10',
      type: 'illustration-first',
      illustration: '💫',
      caption: 'The End',
    },
  ];

  const totalPages = storyPages.length;
  const progress = ((currentPage + 1) / totalPages) * 100;

  // Load reader preferences and saved progress
  useEffect(() => {
    try {
      const prefsRaw = localStorage.getItem('reader:preferences');
      if (prefsRaw) {
        const prefs = JSON.parse(prefsRaw);
        if (typeof prefs.fontSize === 'number') setFontSize(prefs.fontSize);
        if (typeof prefs.useDyslexicFont === 'boolean') setUseDyslexicFont(prefs.useDyslexicFont);
      }
    } catch { }
    try {
      const savedIndex = localStorage.getItem(`reader:progress:${story.id}`);
      if (savedIndex) {
        const idx = parseInt(savedIndex, 10);
        if (!isNaN(idx) && idx >= 0 && idx < totalPages) {
          setCurrentPage(idx);
        }
      }
    } catch { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story.id]);

  // Persist reading progress
  useEffect(() => {
    try {
      localStorage.setItem(`reader:progress:${story.id}`, String(currentPage));
    } catch { }
  }, [currentPage, story.id]);

  // Persist reader preferences
  useEffect(() => {
    try {
      localStorage.setItem('reader:preferences', JSON.stringify({ fontSize, useDyslexicFont }));
    } catch { }
  }, [fontSize, useDyslexicFont]);

  // Split text into words for highlighting
  const getWords = (text: string) => {
    return text.split(' ').map((word, index) => ({
      word,
      index,
    }));
  };

  // Simulate TTS word highlighting
  useEffect(() => {
    if (isPlaying && storyPages[currentPage].text) {
      const words = storyPages[currentPage].text!.split(' ');
      let wordIndex = 0;

      readingIntervalRef.current = setInterval(() => {
        setCurrentWordIndex(wordIndex);
        wordIndex++;

        if (wordIndex >= words.length) {
          if (isAutoPlay && currentPage < totalPages - 1) {
            // Auto-advance to next page
            setTimeout(() => {
              setCurrentPage(currentPage + 1);
              setCurrentWordIndex(-1);
              wordIndex = 0;
            }, 1000);
          } else {
            setIsPlaying(false);
            setCurrentWordIndex(-1);
          }
        }
      }, 500); // 500ms per word (adjust for natural reading speed)

      return () => {
        if (readingIntervalRef.current) {
          clearInterval(readingIntervalRef.current);
        }
      };
    }
  }, [isPlaying, currentPage, isAutoPlay]);

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next page
      handleNextPage();
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right - previous page
      handlePreviousPage();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setCurrentWordIndex(-1);
      setIsPlaying(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setCurrentWordIndex(-1);
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCurrentWordIndex(-1);
    }
  };

  const renderWord = (word: string, index: number, isHighlighted: boolean) => {
    return (
      <motion.span
        key={index}
        className="inline-block mr-2"
        animate={{
          backgroundColor: isHighlighted
            ? isBedtimeMode
              ? 'rgba(246, 166, 215, 0.3)'
              : 'rgba(125, 182, 248, 0.3)'
            : 'transparent',
          scale: isHighlighted ? 1.05 : 1,
        }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
        style={{
          padding: isHighlighted ? '2px 6px' : '2px 0',
          borderRadius: 'var(--radius-sm)',
          display: 'inline-block',
        }}
      >
        {word}
      </motion.span>
    );
  };

  const renderTextWithHighlighting = (text: string) => {
    const words = text.split(' ');
    return (
      <div style={{ lineHeight: 'var(--line-height-relaxed)' }}>
        {words.map((word, index) => renderWord(word, index, currentWordIndex === index))}
      </div>
    );
  };

  const currentPageData = storyPages[currentPage];

  return (
    <div
      className="mobile-container"
      style={{
        backgroundColor: isBedtimeMode ? '#2D2838' : '#FAFAFB',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: isBedtimeMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--neutral-200)',
          zIndex: 50,
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: isBedtimeMode
              ? 'linear-gradient(90deg, #F6A6D7 0%, #C8C5FF 100%)'
              : 'linear-gradient(90deg, #7DB6F8 0%, #C8C5FF 100%)',
          }}
        />
      </div>

      {/* Top Navigation - Minimal */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 'max(var(--safe-area-top), 12px)',
          paddingBottom: '12px',
          paddingLeft: 'var(--screen-padding)',
          paddingRight: 'var(--screen-padding)',
          backgroundColor: isBedtimeMode ? 'rgba(45, 40, 56, 0.95)' : 'rgba(250, 250, 251, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <button
          onClick={onBack}
          className="transition-smooth active:scale-press"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: isBedtimeMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--neutral-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Back"
        >
          <ArrowLeft size={20} style={{ color: isBedtimeMode ? '#FFFFFF' : 'var(--text-primary)' }} />
        </button>

        {/* Page Counter */}
        <div
          style={{
            fontSize: 'var(--text-caption)',
            fontWeight: 'var(--weight-medium)',
            color: isBedtimeMode ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-muted)',
          }}
        >
          {currentPage + 1} / {totalPages}
        </div>

        <div className="flex items-center gap-2">
          {/* Bedtime Mode Toggle */}
          <button
            onClick={() => setIsBedtimeMode(!isBedtimeMode)}
            className="transition-smooth active:scale-press"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: isBedtimeMode ? 'rgba(246, 166, 215, 0.2)' : 'rgba(125, 182, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={isBedtimeMode ? 'Disable bedtime mode' : 'Enable bedtime mode'}
          >
            {isBedtimeMode ? (
              <Moon size={18} style={{ color: '#F6A6D7' }} />
            ) : (
              <Sun size={18} style={{ color: '#7DB6F8' }} />
            )}
          </button>

          {/* Bookmark Toggle */}
          <button
            onClick={onToggleFavorite}
            className="transition-smooth active:scale-press"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: isBedtimeMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--neutral-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={story.isFavorite ? 'Remove bookmark' : 'Add bookmark'}
          >
            {story.isFavorite ? (
              <BookmarkCheck size={18} style={{ color: isBedtimeMode ? '#F6A6D7' : 'var(--brand-secondary)' }} />
            ) : (
              <Bookmark size={18} style={{ color: isBedtimeMode ? 'rgba(255, 255, 255, 0.5)' : 'var(--text-muted)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div
        style={{
          paddingLeft: 'var(--screen-padding)',
          paddingRight: 'var(--screen-padding)',
          paddingTop: '8px',
          paddingBottom: '8px',
          backgroundColor: isBedtimeMode ? 'rgba(45, 40, 56, 0.95)' : 'rgba(250, 250, 251, 0.95)',
        }}
      >
        <Breadcrumb
          items={[{ label: story.title }]}
          onHomeClick={onBack}
        />
      </div>

      {/* Main Story Content */}
      <div
        className="flex-1"
        style={{
          overflowY: 'auto',
          paddingLeft: 'var(--screen-padding)',
          paddingRight: 'var(--screen-padding)',
          paddingBottom: '140px', // Space for bottom controls
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              paddingTop: 'var(--section-gap-normal)',
              paddingBottom: 'var(--section-gap-normal)',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {currentPageData.type === 'text-first' && (
              <>
                {/* Illustration */}
                <div
                  className="mx-auto mb-6"
                  style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: 'var(--radius-xl)',
                    background: isBedtimeMode
                      ? 'linear-gradient(135deg, rgba(246, 166, 215, 0.15) 0%, rgba(200, 197, 255, 0.15) 100%)'
                      : 'linear-gradient(135deg, rgba(125, 182, 248, 0.1) 0%, rgba(200, 197, 255, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '80px',
                    boxShadow: isBedtimeMode ? 'none' : 'var(--elevation-2)',
                  }}
                >
                  {currentPageData.illustration}
                </div>

                {/* Text Content */}
                <div
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: 'var(--line-height-relaxed)',
                    color: isBedtimeMode ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-primary)',
                    textAlign: 'center',
                    fontFamily: useDyslexicFont
                      ? "'OpenDyslexic', 'Atkinson Hyperlegible', system-ui, -apple-system, sans-serif"
                      : "'Nunito', system-ui, -apple-system, sans-serif",
                    fontWeight: '500',
                    padding: '0 16px',
                  }}
                >
                  {isPlaying && currentPageData.text ? (
                    renderTextWithHighlighting(currentPageData.text)
                  ) : (
                    currentPageData.text
                  )}
                </div>
              </>
            )}

            {currentPageData.type === 'illustration-first' && (
              <div className="flex flex-col items-center justify-center">
                {/* Full Illustration */}
                <div
                  className="mx-auto mb-4"
                  style={{
                    width: '280px',
                    height: '280px',
                    borderRadius: 'var(--radius-xl)',
                    background: isBedtimeMode
                      ? 'linear-gradient(135deg, rgba(246, 166, 215, 0.15) 0%, rgba(200, 197, 255, 0.15) 100%)'
                      : 'linear-gradient(135deg, rgba(125, 182, 248, 0.1) 0%, rgba(200, 197, 255, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '120px',
                    boxShadow: isBedtimeMode ? 'none' : 'var(--elevation-3)',
                  }}
                >
                  {currentPageData.illustration}
                </div>

                {/* Caption */}
                {currentPageData.caption && (
                  <p
                    style={{
                      fontSize: '24px',
                      fontFamily: "'Nunito', system-ui, -apple-system, sans-serif",
                      fontWeight: '700',
                      color: isBedtimeMode ? 'rgba(255, 255, 255, 0.95)' : 'var(--text-primary)',
                      textAlign: 'center',
                      padding: '0 24px',
                    }}
                  >
                    {currentPageData.caption}
                  </p>
                )}

                {/* Sparkle decoration for key pages */}
                {(currentPage === 0 || currentPage === totalPages - 1) && (
                  <div className="mt-4 flex items-center gap-2">
                    <Sparkles size={20} style={{ color: isBedtimeMode ? '#F6A6D7' : '#C8C5FF' }} />
                    <Sparkles size={16} style={{ color: isBedtimeMode ? '#C8C5FF' : '#7DB6F8' }} />
                    <Sparkles size={20} style={{ color: isBedtimeMode ? '#F6A6D7' : '#C8C5FF' }} />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action Bar - Floating */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 40,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 'var(--container-max-width)',
            paddingBottom: 'max(var(--safe-area-bottom), 16px)',
            paddingTop: '16px',
            paddingLeft: 'var(--screen-padding)',
            paddingRight: 'var(--screen-padding)',
            backgroundColor: isBedtimeMode ? 'rgba(45, 40, 56, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: `1px solid ${isBedtimeMode ? 'rgba(255, 255, 255, 0.1)' : 'var(--neutral-200)'}`,
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.08)',
            pointerEvents: 'auto',
          }}
        >
          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="transition-smooth active:scale-press"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor:
                  currentPage === 0
                    ? isBedtimeMode
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'var(--neutral-100)'
                    : isBedtimeMode
                      ? 'rgba(125, 182, 248, 0.2)'
                      : 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentPage === 0 ? 0.3 : 1,
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              }}
              aria-label="Previous page"
            >
              <ChevronLeft size={24} style={{ color: currentPage === 0 ? 'var(--text-muted)' : 'white' }} />
            </button>

            {/* Play/Pause Button - Large and Central */}
            {currentPageData.text && (
              <button
                onClick={handlePlayPause}
                className="transition-smooth active:scale-press"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: isBedtimeMode
                    ? 'linear-gradient(135deg, #F6A6D7 0%, #C8C5FF 100%)'
                    : 'linear-gradient(135deg, #7DB6F8 0%, #C8C5FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--elevation-3)',
                }}
                aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
              >
                {isPlaying ? (
                  <Pause size={28} style={{ color: 'white', fill: 'white' }} />
                ) : (
                  <Play size={28} style={{ color: 'white', fill: 'white', marginLeft: '3px' }} />
                )}
              </button>
            )}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="transition-smooth active:scale-press"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor:
                  currentPage === totalPages - 1
                    ? isBedtimeMode
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'var(--neutral-100)'
                    : isBedtimeMode
                      ? 'rgba(125, 182, 248, 0.2)'
                      : 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentPage === totalPages - 1 ? 0.3 : 1,
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
              }}
              aria-label="Next page"
            >
              <ChevronRight
                size={24}
                style={{ color: currentPage === totalPages - 1 ? 'var(--text-muted)' : 'white' }}
              />
            </button>
          </div>

          {/* Auto-play Toggle */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="flex items-center gap-2 px-4 py-2 transition-smooth active:scale-press"
              style={{
                borderRadius: 'var(--radius-pill)',
                backgroundColor: isAutoPlay
                  ? isBedtimeMode
                    ? 'rgba(246, 166, 215, 0.2)'
                    : 'rgba(125, 182, 248, 0.15)'
                  : 'transparent',
                border: `1px solid ${isAutoPlay
                  ? isBedtimeMode
                    ? 'rgba(246, 166, 215, 0.4)'
                    : 'rgba(125, 182, 248, 0.3)'
                  : isBedtimeMode
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'var(--neutral-300)'
                  }`,
              }}
            >
              <Volume2
                size={16}
                style={{
                  color: isAutoPlay
                    ? isBedtimeMode
                      ? '#F6A6D7'
                      : 'var(--brand-primary)'
                    : isBedtimeMode
                      ? 'rgba(255, 255, 255, 0.5)'
                      : 'var(--text-muted)',
                }}
              />
              <span
                style={{
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--weight-medium)',
                  color: isAutoPlay
                    ? isBedtimeMode
                      ? '#F6A6D7'
                      : 'var(--brand-primary)'
                    : isBedtimeMode
                      ? 'rgba(255, 255, 255, 0.7)'
                      : 'var(--text-muted)',
                }}
              >
                Auto-play {isAutoPlay ? 'On' : 'Off'}
              </span>
            </button>
          </div>

          {/* Reader Preferences */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <label htmlFor="reader-font-size" style={{ fontSize: 'var(--text-caption)', color: isBedtimeMode ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-muted)' }}>Text size</label>
            <input
              id="reader-font-size"
              type="range"
              min={18}
              max={26}
              step={1}
              value={fontSize}
              onChange={(e) => setFontSize(Number((e.target as HTMLInputElement).value))}
              aria-label="Text size"
              style={{ flex: 1 }}
            />
            <button
              onClick={() => setUseDyslexicFont(!useDyslexicFont)}
              className="px-3 py-1 transition-smooth"
              style={{
                borderRadius: 'var(--radius-pill)',
                border:
                  '1px solid ' +
                  (useDyslexicFont
                    ? (isBedtimeMode ? 'rgba(246, 166, 215, 0.5)' : 'rgba(125, 182, 248, 0.5)')
                    : (isBedtimeMode ? 'rgba(255, 255, 255, 0.2)' : 'var(--neutral-300)')),
                backgroundColor: useDyslexicFont
                  ? (isBedtimeMode ? 'rgba(246,166,215,0.2)' : 'rgba(125,182,248,0.12)')
                  : 'transparent',
                color: isBedtimeMode ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-primary)',
                fontSize: 'var(--text-caption)'
              }}
              aria-pressed={useDyslexicFont}
            >
              Dyslexic font
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}