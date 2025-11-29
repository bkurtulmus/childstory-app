import { useState } from 'react';
import { ArrowLeft, Minus, Plus, Check, MoreVertical, Trash2, Map, Leaf, Sparkles, BookOpen, Heart } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  age: number;
  language: string;
  interests: string[];
  avatar: string;
}

interface ChildEditProps {
  child: Child;
  onSave: (childData: Child) => void;
  onDelete: () => void;
  onCreateStory: () => void;
  onViewStories: () => void;
  onBack: () => void;
}

// Categorized interests (same as ChildCreate)
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

export function ChildEdit({
  child,
  onSave,
  onDelete,
  onCreateStory,
  onViewStories,
  onBack,
}: ChildEditProps) {
  const [name, setName] = useState(child.name);
  const [age, setAge] = useState(child.age);
  const [language, setLanguage] = useState(child.language);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(child.interests);
  const [selectedAvatar, setSelectedAvatar] = useState(child.avatar);
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const languages = ['English', 'Spanish', 'French', 'German', 'Italian'];

  const avatars = ['🐻', '🦊', '🐰', '🦁', '🐼', '🐨', '🦄', '🐸'];

  const handleInterestToggle = (interest: string) => {
    setIsDirty(true);
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleAvatarSelect = (avatar: string) => {
    setIsDirty(true);
    setSelectedAvatar(avatar);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSave({
      ...child,
      name: name.trim(),
      age,
      language,
      interests: selectedInterests,
      avatar: selectedAvatar,
    });
  };

  const handleBack = () => {
    if (isDirty) {
      const confirmed = window.confirm('Discard changes?');
      if (!confirmed) return;
    }
    onBack();
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(true);
    setShowOverflowMenu(false);
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
        <h3>Edit Child</h3>
        <button
          onClick={() => setShowOverflowMenu(!showOverflowMenu)}
          className="flex items-center justify-center transition-smooth hover:opacity-70"
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: 'transparent',
          }}
          aria-label="More options"
        >
          <MoreVertical size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
      </div>

      {/* Overflow Menu */}
      {showOverflowMenu && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowOverflowMenu(false)}
          />
          <div
            className="absolute right-4 top-14 z-40"
            style={{
              width: '200px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--elevation-3)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => {
                onCreateStory();
                setShowOverflowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <span
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--text-primary)',
                }}
              >
                Create Story
              </span>
            </button>
            <button
              onClick={() => {
                onViewStories();
                setShowOverflowMenu(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <span
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--text-primary)',
                }}
              >
                View Stories
              </span>
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <Trash2 size={18} style={{ color: 'var(--semantic-error)' }} />
              <span
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--semantic-error)',
                }}
              >
                Delete
              </span>
            </button>
          </div>
        </>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6" style={{ paddingBottom: '96px' }}>
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="mb-4">Basic Information</h3>

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

          {/* Age Picker */}
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
              Age
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (age > 1) {
                    setAge(age - 1);
                    setIsDirty(true);
                  }
                }}
                disabled={age <= 1}
                className="transition-smooth active:scale-press disabled:opacity-30"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--neutral-100)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Minus size={20} style={{ color: 'var(--text-primary)' }} />
              </button>

              <div
                className="flex-1 text-center"
                style={{
                  fontSize: 'var(--text-h1)',
                  fontWeight: 'var(--weight-heading)',
                  color: 'var(--text-primary)',
                }}
              >
                {age}
              </div>

              <button
                onClick={() => {
                  if (age < 18) {
                    setAge(age + 1);
                    setIsDirty(true);
                  }
                }}
                disabled={age >= 18}
                className="transition-smooth active:scale-press disabled:opacity-30"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'var(--neutral-100)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={20} style={{ color: 'var(--text-primary)' }} />
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-secondary)',
                marginBottom: '8px',
              }}
            >
              Primary Language
            </label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setIsDirty(true);
              }}
              className="w-full px-4 outline-none"
              style={{
                height: '48px',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-primary)',
                backgroundColor: '#FFFFFF',
              }}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Avatar Selection with Winning Animation */}
        <div className="mb-8">
          <h3 className="mb-4">Choose Avatar</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
            }}
          >
            {avatars.map((avatar, index) => (
              <button
                key={index}
                onClick={() => handleAvatarSelect(index.toString())}
                className={`transition-smooth active:scale-press ${selectedAvatar === index.toString() ? 'avatar-selected' : ''
                  }`}
                style={{
                  aspectRatio: '1',
                  backgroundColor:
                    selectedAvatar === index.toString()
                      ? 'var(--brand-accent)'
                      : 'var(--neutral-100)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border:
                    selectedAvatar === index.toString()
                      ? '2px solid var(--brand-primary)'
                      : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {avatar}
                {selectedAvatar === index.toString() && (
                  <>
                    {/* Halo/Glow Effect */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: 'rgba(125, 182, 248, 0.15)',
                        borderRadius: 'var(--radius-lg)',
                        animation: 'pulse 2s ease-in-out infinite',
                      }}
                    />
                    {/* Checkmark */}
                    <div
                      className="absolute top-1 right-1"
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'var(--brand-primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'scaleIn 0.3s ease-out',
                      }}
                    >
                      <Check size={12} style={{ color: 'white' }} />
                    </div>
                  </>
                )}
              </button>
            ))}
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
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            className="w-full"
            style={{
              maxWidth: '320px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
            }}
          >
            <h3 className="mb-3 text-center">Delete {name}?</h3>
            <p
              className="text-center mb-6"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              This will permanently delete {name} and all associated stories.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  onDelete();
                  setShowDeleteModal(false);
                }}
                className="w-full transition-smooth active:scale-press"
                style={{
                  height: '48px',
                  backgroundColor: 'var(--semantic-error)',
                  color: 'white',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 'var(--weight-medium)',
                  fontSize: 'var(--text-body-md)',
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full transition-smooth active:scale-press"
                style={{
                  height: '48px',
                  backgroundColor: 'var(--neutral-100)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 'var(--weight-medium)',
                  fontSize: 'var(--text-body-md)',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
