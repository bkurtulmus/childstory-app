import { useState } from 'react';
import { ArrowLeft, Map, Leaf, Sparkles, BookOpen, Heart } from 'lucide-react';

interface ChildCreateProps {
  onSave: (childData: {
    name: string;
    age: number;
    language: string;
    interests: string[];
    avatar: string;
  }) => void;
  onBack: () => void;
}

// Categorized interests
const INTEREST_CATEGORIES = [
  {
    category: 'Adventure',
    icon: Map,
    interests: ['Space', 'Pirates', 'Exploration', 'Treasure Hunt'],
  },
  {
    category: 'Nature',
    icon: Leaf,
    interests: ['Animals', 'Forest', 'Ocean', 'Garden'],
  },
  {
    category: 'Fantasy',
    icon: Sparkles,
    interests: ['Fairy Tales', 'Magic', 'Dragons', 'Unicorns'],
  },
  {
    category: 'Learning',
    icon: BookOpen,
    interests: ['Science', 'Numbers', 'Music', 'Art'],
  },
  {
    category: 'Friends & Family',
    icon: Heart,
    interests: ['Friendship', 'Family', 'Kindness', 'Sharing'],
  },
];

export function ChildCreate({ onSave, onBack }: ChildCreateProps) {
  const [name, setName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const avatars = ['🐻', '🦊', '🐰', '🦁', '🐼', '🐨', '🦄', '🐸'];

  const handleInterestToggle = (interest: string) => {
    setIsDirty(true);
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const randomAvatarIndex = Math.floor(Math.random() * avatars.length);

    onSave({
      name: name.trim(),
      age: 5,
      language: 'English',
      interests: selectedInterests,
      avatar: randomAvatarIndex.toString(),
    });
  };

  const handleBack = () => {
    if (isDirty) {
      const confirmed = window.confirm('Discard changes?');
      if (!confirmed) return;
    }
    onBack();
  };

  const isFormValid = name.trim().length > 0;

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
          onClick={handleBack}
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
        <h3>Add Child</h3>
        <div style={{ width: '44px' }} /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6" style={{ paddingBottom: '96px' }}>
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="mb-4">Child Details</h3>

          {/* Name Input */}
          <div className="mb-4">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-secondary)',
                marginBottom: '8px',
              }}
            >
              Child's Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError('');
                setIsDirty(true);
              }}
              placeholder="Enter name"
              className="w-full px-4 outline-none"
              style={{
                height: '48px',
                border: `1px solid ${nameError ? 'var(--semantic-error)' : 'var(--neutral-200)'}`,
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-primary)',
              }}
            />
            {nameError && (
              <p
                style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--semantic-error)',
                  marginTop: '4px',
                }}
              >
                {nameError}
              </p>
            )}
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--neutral-100)',
              fontSize: 'var(--text-caption)',
              color: 'var(--text-secondary)',
            }}
          >
            We'll automatically pick an avatar and reading voice style based on your interests.
          </div>
        </div>

        {/* Interests - Categorized */}
        <div className="mb-8">
          <h3 className="mb-2">Interests</h3>
          <p
            className="mb-4"
            style={{
              fontSize: 'var(--text-body-sm)',
              color: 'var(--text-muted)',
            }}
          >
            Select topics that interest your child
          </p>

          {INTEREST_CATEGORIES.map((category) => (
            <div key={category.category} className="mb-6">
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-3">
                <category.icon size={20} style={{ color: 'var(--brand-primary)' }} />
                <h4
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {category.category}
                </h4>
              </div>

              {/* Interest Tags */}
              <div className="flex flex-wrap gap-2">
                {category.interests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className="transition-smooth active:scale-press"
                      style={{
                        padding: '8px 16px',
                        backgroundColor: isSelected
                          ? 'var(--brand-accent)'
                          : 'var(--neutral-100)',
                        border: isSelected
                          ? '2px solid var(--brand-primary)'
                          : 'none',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: 'var(--text-body-sm)',
                        fontWeight: isSelected ? 'var(--weight-medium)' : 'var(--weight-regular)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {selectedInterests.length > 0 && (
            <div
              className="mt-4 p-3"
              style={{
                backgroundColor: 'rgba(125, 182, 248, 0.08)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(125, 182, 248, 0.2)',
              }}
            >
              <p
                style={{
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--brand-primary)',
                  fontWeight: 'var(--weight-medium)',
                }}
              >
                {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}
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
          onClick={handleSave}
          disabled={!isFormValid || isLoading}
          className="w-full transition-smooth active:scale-press disabled:opacity-40"
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
          {isLoading ? 'Saving...' : 'Save Child'}
        </button>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .avatar-selected {
          animation: selectWin 0.5s ease-out;
        }

        @keyframes selectWin {
          0% {
            transform: scale(1);
          }
          30% {
            transform: scale(1.15);
          }
          50% {
            transform: scale(0.95);
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
