import { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, AlertCircle } from 'lucide-react';
import { ImageWithLoader } from './figma/ImageWithLoader';

interface SharedStoryViewProps {
  shareToken?: string;
  onClose: () => void;
  onGetApp: () => void;
  onSignIn: () => void;
}

interface SharedStory {
  id: string;
  title: string;
  childName?: string;
  content: string;
  images?: string[];
  createdDate: string;
  isValid: boolean;
  isExpired: boolean;
}

export function SharedStoryView({
  shareToken,
  onClose,
  onGetApp,
  onSignIn,
}: SharedStoryViewProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock story data - in real app would fetch based on shareToken
  const [story] = useState<SharedStory>({
    id: '1',
    title: 'The Space Adventure of Emma and the Friendly Aliens',
    childName: 'Emma',
    content: `Once upon a time in a magical galaxy far away, there lived a curious little girl named Emma who dreamed of exploring the stars.

One night, as Emma gazed at the twinkling lights above, a gentle beam of colorful light descended from the sky. To her amazement, a friendly group of aliens emerged, their spaceship glowing with all the colors of the rainbow.

"Hello, Emma!" they chirped in cheerful voices. "We've been watching you from afar and noticed your love for adventure. Would you like to join us on a journey through the cosmos?"

Emma's eyes sparkled with excitement. Without hesitation, she nodded and stepped aboard their magical spacecraft. Together, they soared past planets, danced among the stars, and discovered wonders beyond imagination.

When it was time to return home, Emma hugged her new alien friends goodbye. "Thank you for the most magical adventure," she whispered. As she drifted off to sleep that night, Emma smiled, knowing that the universe was full of friendship and wonder.`,
    images: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
      'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800',
    ],
    createdDate: 'Nov 15, 2025',
    isValid: true,
    isExpired: false,
  });

  // Simulate loading
  useState(() => {
    setTimeout(() => setIsLoading(false), 1000);
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: 'Check out this story created with ChildStory!',
        url: window.location.href,
      });
    } else {
      handleCopyLink();
    }
  };

  // Error state: Invalid token
  if (!story.isValid) {
    return (
      <div
        className="relative flex flex-col items-center justify-center px-6"
        style={{
          width: '100%',
          maxWidth: 'var(--container-max-width)',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          margin: '0 auto',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-opacity hover:opacity-70"
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
          <X size={20} style={{ color: 'var(--text-primary)' }} />
        </button>

        <div
          className="mb-6"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertCircle size={40} style={{ color: 'var(--semantic-error)' }} />
        </div>

        <h2 className="mb-3 text-center">Story Not Found</h2>
        <p
          className="mb-8 text-center"
          style={{
            fontSize: 'var(--text-body-md)',
            color: 'var(--text-secondary)',
            maxWidth: '280px',
          }}
        >
          This story link is invalid or has been removed by the owner.
        </p>

        <button
          onClick={onGetApp}
          className="w-full max-w-xs transition-all active:scale-98"
          style={{
            height: '48px',
            backgroundColor: 'var(--brand-primary)',
            color: 'white',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 'var(--weight-medium)',
            fontSize: 'var(--text-body-lg)',
          }}
        >
          Get the App
        </button>
      </div>
    );
  }

  // Error state: Expired token
  if (story.isExpired) {
    return (
      <div
        className="relative flex flex-col items-center justify-center px-6"
        style={{
          width: '100%',
          maxWidth: 'var(--container-max-width)',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          margin: '0 auto',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-opacity hover:opacity-70"
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
          <X size={20} style={{ color: 'var(--text-primary)' }} />
        </button>

        <div
          className="mb-6"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(251, 191, 36, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertCircle size={40} style={{ color: '#F59E0B' }} />
        </div>

        <h2 className="mb-3 text-center">Link Expired</h2>
        <p
          className="mb-8 text-center"
          style={{
            fontSize: 'var(--text-body-md)',
            color: 'var(--text-secondary)',
            maxWidth: '280px',
          }}
        >
          This share link has expired. Ask the story owner to share it again.
        </p>

        <button
          onClick={onGetApp}
          className="w-full max-w-xs transition-all active:scale-98"
          style={{
            height: '48px',
            backgroundColor: 'var(--brand-primary)',
            color: 'white',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 'var(--weight-medium)',
            fontSize: 'var(--text-body-lg)',
          }}
        >
          Get the App
        </button>
      </div>
    );
  }

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
      {/* Simplified Header */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: '1px solid var(--neutral-100)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <span
            style={{
              fontSize: 'var(--text-body-md)',
              fontWeight: 'var(--weight-subheading)',
              color: 'var(--text-primary)',
            }}
          >
            ChildStory
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
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
            <Share2 size={18} style={{ color: 'var(--text-primary)' }} />
          </button>

          <button
            onClick={onClose}
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
            <X size={20} style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Story Header */}
        <div className="mb-6">
          <h2 className="mb-2">{story.title}</h2>
          {story.childName && (
            <p
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-muted)',
              }}
            >
              A story for {story.childName}
            </p>
          )}
          <p
            style={{
              fontSize: 'var(--text-body-sm)',
              color: 'var(--text-muted)',
              marginTop: '4px',
            }}
          >
            {story.createdDate}
          </p>
        </div>

        {/* Get the App Banner */}
        <div
          className="mb-6"
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(125, 182, 248, 0.08) 0%, rgba(200, 197, 255, 0.08) 100%)',
            border: '1px solid rgba(125, 182, 248, 0.2)',
          }}
        >
          <h3
            className="mb-2"
            style={{
              fontSize: 'var(--text-body-lg)',
              fontWeight: 'var(--weight-subheading)',
            }}
          >
            Create Your Own Stories
          </h3>
          <p
            className="mb-4"
            style={{
              fontSize: 'var(--text-body-sm)',
              color: 'var(--text-secondary)',
            }}
          >
            Download ChildStory to create personalized stories for your children
          </p>
          <button
            onClick={onGetApp}
            className="w-full transition-all active:scale-98 flex items-center justify-center gap-2"
            style={{
              height: '44px',
              backgroundColor: 'var(--brand-primary)',
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-md)',
            }}
          >
            <ExternalLink size={18} />
            Get the App
          </button>
        </div>

        {/* Image Gallery */}
        {story.images && story.images.length > 0 && (
          <div className="mb-6">
            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{
                scrollbarWidth: 'none',
              }}
            >
              {story.images.map((image, index) => (
                <div
                  key={index}
                  className="shrink-0"
                  style={{
                    width: '240px',
                    height: '180px',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--neutral-100)',
                  }}
                >
                  <ImageWithLoader
                    src={image}
                    alt={`Story illustration ${index + 1}`}
                    aspectRatio="4/3"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Story Content */}
        <div
          className="mb-8"
          style={{
            fontSize: 'var(--text-body-lg)',
            lineHeight: '1.8',
            color: 'var(--text-primary)',
          }}
        >
          {story.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Share Options */}
        <div
          className="mb-6"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--neutral-50)',
          }}
        >
          <h4
            className="mb-3"
            style={{
              fontSize: 'var(--text-body-md)',
              fontWeight: 'var(--weight-subheading)',
            }}
          >
            Share this story
          </h4>

          <button
            onClick={handleCopyLink}
            className="w-full transition-all active:scale-98 flex items-center justify-center gap-2"
            style={{
              height: '44px',
              backgroundColor: copied ? 'var(--semantic-success)' : 'var(--neutral-100)',
              color: copied ? 'white' : 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-md)',
              border: 'none',
            }}
          >
            {copied ? (
              <>
                <Check size={18} />
                Link Copied!
              </>
            ) : (
              <>
                <Copy size={18} />
                Copy Link
              </>
            )}
          </button>
        </div>

        {/* CTA Section */}
        <div
          className="mb-6 text-center"
          style={{
            padding: '24px 20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(179, 230, 197, 0.08)',
          }}
        >
          <h3
            className="mb-2"
            style={{
              fontSize: 'var(--text-body-lg)',
              fontWeight: 'var(--weight-subheading)',
            }}
          >
            Want to create stories like this?
          </h3>
          <p
            className="mb-4"
            style={{
              fontSize: 'var(--text-body-sm)',
              color: 'var(--text-secondary)',
            }}
          >
            Sign in to start creating personalized tales for your little ones
          </p>
          <button
            onClick={onSignIn}
            className="w-full transition-all active:scale-98"
            style={{
              height: '48px',
              backgroundColor: 'transparent',
              border: '2px solid var(--brand-primary)',
              color: 'var(--brand-primary)',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-lg)',
            }}
          >
            Sign In to Create Stories
          </button>
        </div>

        {/* Attribution */}
        <div
          className="text-center py-4"
          style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--text-muted)',
          }}
        >
          Created with{' '}
          <span style={{ fontWeight: 'var(--weight-medium)', color: 'var(--brand-primary)' }}>
            ChildStory
          </span>
        </div>

        {/* Bottom spacing */}
        <div style={{ height: '32px' }} />
      </div>
    </div>
  );
}
