import { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
} from 'lucide-react';
import { ImageWithLoader } from './figma/ImageWithLoader';

interface Slide {
  id: string;
  imageUrl: string;
  text: string;
  duration: number; // in seconds
}

interface StorySlideshowProps {
  storyTitle: string;
  slides: Slide[];
  onClose: () => void;
}

interface SlideshowSettings {
  transitionSpeed: number; // in seconds
  showText: boolean;
  autoPlay: boolean;
  loop: boolean;
}

export function StorySlideshow({
  storyTitle,
  slides,
  onClose,
}: StorySlideshowProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState<SlideshowSettings>({
    transitionSpeed: 3,
    showText: true,
    autoPlay: true,
    loop: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = slides[currentSlideIndex];
  const totalSlides = slides.length;

  useEffect(() => {
    if (isPlaying) {
      startProgress();
    } else {
      stopProgress();
    }

    return () => stopProgress();
  }, [isPlaying, currentSlideIndex]);

  const startProgress = () => {
    stopProgress();
    setProgress(0);
    const interval = 50; // Update every 50ms
    const duration = (currentSlide?.duration || settings.transitionSpeed) * 1000;
    const increment = (interval / duration) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          handleNext();
          return 0;
        }
        return next;
      });
    }, interval);
  };

  const stopProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setProgress(0);
    } else if (settings.loop) {
      setCurrentSlideIndex(0);
      setProgress(0);
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setProgress(0);
    }
  };

  const handleSlideClick = (index: number) => {
    setCurrentSlideIndex(index);
    setProgress(0);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundColor: '#000000',
        maxWidth: isFullscreen ? '100%' : '390px',
        margin: isFullscreen ? '0' : '0 auto',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <div>
          <h3
            style={{
              color: 'white',
              fontSize: 'var(--text-body-lg)',
              fontWeight: 'var(--weight-subheading)',
            }}
          >
            {storyTitle}
          </h3>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 'var(--text-caption)',
              marginTop: '2px',
            }}
          >
            Slide {currentSlideIndex + 1} of {totalSlides}
          </p>
        </div>
        <button
          onClick={onClose}
          className="transition-opacity hover:opacity-70"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} style={{ color: 'white' }} />
        </button>
      </div>

      {/* Main Slide Content */}
      <div
        className="flex-1 flex items-center justify-center relative"
        style={{
          padding: '60px 0',
        }}
      >
        {/* Slide Image */}
        {currentSlide && (
          <div
            className="relative w-full h-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageWithLoader
              src={currentSlide.imageUrl || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800'}
              alt={`Slide ${currentSlideIndex + 1}`}
              aspectRatio="16/9"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />

            {/* Text Overlay */}
            {settings.showText && currentSlide.text && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  padding: '16px 20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderRadius: 'var(--radius-md)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <p
                  style={{
                    color: 'white',
                    fontSize: 'var(--text-body-md)',
                    lineHeight: '1.6',
                    textAlign: 'center',
                  }}
                >
                  {currentSlide.text}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        style={{
          background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingBottom: '20px',
        }}
      >
        {/* Progress Bar */}
        <div
          onClick={handleProgressClick}
          className="cursor-pointer px-4 mb-3"
        >
          <div
            style={{
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: 'var(--brand-primary)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentSlideIndex === 0}
              className="transition-opacity hover:opacity-70"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentSlideIndex === 0 ? 0.3 : 1,
              }}
            >
              <SkipBack size={20} style={{ color: 'white' }} />
            </button>

            <button
              onClick={handlePlayPause}
              className="transition-opacity hover:opacity-70"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isPlaying ? (
                <Pause size={24} style={{ color: 'white' }} />
              ) : (
                <Play size={24} style={{ color: 'white', marginLeft: '2px' }} />
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentSlideIndex === totalSlides - 1 && !settings.loop}
              className="transition-opacity hover:opacity-70"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentSlideIndex === totalSlides - 1 && !settings.loop ? 0.3 : 1,
              }}
            >
              <SkipForward size={20} style={{ color: 'white' }} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="transition-opacity hover:opacity-70"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isMuted ? (
                <VolumeX size={18} style={{ color: 'white' }} />
              ) : (
                <Volume2 size={18} style={{ color: 'white' }} />
              )}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="transition-opacity hover:opacity-70"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: showSettings
                  ? 'var(--brand-primary)'
                  : 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Settings size={18} style={{ color: 'white' }} />
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="transition-opacity hover:opacity-70"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Maximize size={18} style={{ color: 'white' }} />
            </button>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div
          className="overflow-x-auto px-4"
          style={{
            display: 'flex',
            gap: '8px',
            scrollbarWidth: 'none',
          }}
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => handleSlideClick(index)}
              className="shrink-0 transition-all"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: `2px solid ${index === currentSlideIndex
                    ? 'var(--brand-primary)'
                    : 'rgba(255, 255, 255, 0.3)'
                  }`,
                opacity: index === currentSlideIndex ? 1 : 0.6,
              }}
            >
              <ImageWithLoader
                src={slide.imageUrl || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200'}
                alt={`Thumbnail ${index + 1}`}
                aspectRatio="1/1"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div
          style={{
            position: 'absolute',
            bottom: '180px',
            right: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            minWidth: '240px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h4
            style={{
              color: 'white',
              fontSize: 'var(--text-body-md)',
              fontWeight: 'var(--weight-subheading)',
              marginBottom: '16px',
            }}
          >
            Slideshow Settings
          </h4>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 'var(--text-body-sm)',
                }}
              >
                Show Text
              </span>
              <input
                type="checkbox"
                checked={settings.showText}
                onChange={(e) =>
                  setSettings({ ...settings, showText: e.target.checked })
                }
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--brand-primary)',
                }}
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 'var(--text-body-sm)',
                }}
              >
                Auto-play
              </span>
              <input
                type="checkbox"
                checked={settings.autoPlay}
                onChange={(e) =>
                  setSettings({ ...settings, autoPlay: e.target.checked })
                }
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--brand-primary)',
                }}
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 'var(--text-body-sm)',
                }}
              >
                Loop
              </span>
              <input
                type="checkbox"
                checked={settings.loop}
                onChange={(e) =>
                  setSettings({ ...settings, loop: e.target.checked })
                }
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--brand-primary)',
                }}
              />
            </label>

            <div>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 'var(--text-body-sm)',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Transition Speed: {settings.transitionSpeed}s
              </label>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={settings.transitionSpeed}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    transitionSpeed: parseInt(e.target.value),
                  })
                }
                style={{
                  width: '100%',
                  accentColor: 'var(--brand-primary)',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
