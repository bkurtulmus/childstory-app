import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Search, Plus, ChevronRight, MoreVertical, Edit, BookOpen, Trash2, Heart, ArrowLeft } from 'lucide-react';
import { ConfirmDialog } from './ui/ConfirmDialog';

interface Child {
  id: string;
  name: string;
  age: number;
  interests: string[];
  avatar: string;
  avatarColor: string;
}

interface ChildrenListProps {
  children: Child[];
  onAddChild: () => void;
  onEditChild: (childId: string) => void;
  onDeleteChild: (childId: string) => void;
  onCreateStoryForChild: (childId: string) => void;
  onBack: () => void;
}

export function ChildrenList({
  children,
  onAddChild,
  onEditChild,
  onDeleteChild,
  onCreateStoryForChild,
  onBack,
}: ChildrenListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showActionsSheet, setShowActionsSheet] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [pressedChildId, setPressedChildId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [childToDelete, setChildToDelete] = useState<string | null>(null);

  const filters = ['Age 3-5', 'Age 6-8', 'Age 9-12', 'English', 'Spanish'];

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const handleLongPress = (childId: string) => {
    setSelectedChildId(childId);
    setShowActionsSheet(true);
  };

  const handleCardPress = (childId: string) => {
    setPressedChildId(childId);
    setTimeout(() => setPressedChildId(null), 200);
  };

  const handleCardActivate = (childId: string) => {
    handleCardPress(childId);
    onEditChild(childId);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, childId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardActivate(childId);
    }
  };

  const filteredChildren = children.filter((child) => {
    if (searchQuery && !child.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const avatarColors = [
    'var(--brand-primary)',
    'var(--brand-secondary)',
    'var(--brand-accent)',
    'var(--brand-enchant)',
  ];

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
          onClick={onBack}
          className="flex items-center justify-center transition-smooth hover:opacity-70"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--neutral-100)',
          }}
        >
          <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
        </button>

        <h2>Children</h2>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex items-center justify-center transition-smooth hover:opacity-70"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: showSearch ? 'rgba(125, 182, 248, 0.12)' : 'var(--neutral-100)',
          }}
        >
          <Search
            size={20}
            style={{
              color: showSearch ? 'var(--brand-primary)' : 'var(--text-primary)',
            }}
          />
        </button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-6 py-3" style={{ backgroundColor: '#FFFFFF' }}>
          <input
            type="text"
            placeholder="Search children..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            style={{
              height: '44px',
              paddingLeft: '16px',
              paddingRight: '16px',
              backgroundColor: 'var(--neutral-100)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--text-body-md)',
              outline: 'none',
            }}
          />
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6" style={{ paddingTop: '24px', paddingBottom: '96px' }}>
        {/* Children List */}
        {filteredChildren.length === 0 ? (
          // Empty State
          <div className="text-center pt-16">
            <div
              className="mx-auto mb-6"
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: 'rgba(200, 197, 255, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Heart size={56} style={{ color: 'var(--brand-enchant)' }} />
            </div>
            <h3 className="mb-3">No children yet</h3>
            <p
              className="mb-6"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              Add a child to start creating personalized stories
            </p>
            <button
              onClick={onAddChild}
              className="transition-smooth active:scale-press"
              style={{
                height: '48px',
                paddingLeft: '32px',
                paddingRight: '32px',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-md)',
              }}
            >
              Add Child
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChildren.map((child, index) => (
              <div
                key={child.id}
                role="button"
                tabIndex={0}
                onClick={() => handleCardActivate(child.id)}
                onKeyDown={(event) => handleCardKeyDown(event, child.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleLongPress(child.id);
                }}
                className="w-full transition-smooth active:scale-press"
                style={{
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: pressedChildId === child.id ? 'var(--elevation-2)' : 'var(--elevation-1)',
                  textAlign: 'left',
                  border: pressedChildId === child.id ? '2px solid var(--brand-primary)' : '2px solid transparent',
                  transform: pressedChildId === child.id ? 'scale(0.98)' : 'scale(1)',
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Standardized 64px Avatar */}
                  <div
                    className="shrink-0"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: avatarColors[index % 4],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--text-h2)',
                      fontWeight: 'var(--weight-heading)',
                      color: 'white',
                    }}
                  >
                    {child.name.charAt(0)}
                  </div>

                  {/* Child Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="mb-1"
                      style={{
                        fontSize: 'var(--text-body-lg)',
                        fontWeight: 'var(--weight-subheading)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {child.name}
                    </h3>
                    <p
                      className="mb-2"
                      style={{
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {child.age} years old
                    </p>

                    {/* Limited Interests Display - Max 2 lines */}
                    {child.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {child.interests.slice(0, 3).map((interest, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: 'var(--text-caption)',
                              color: 'var(--brand-primary)',
                              backgroundColor: 'rgba(125, 182, 248, 0.1)',
                              padding: '4px 8px',
                              borderRadius: 'var(--radius-pill)',
                            }}
                          >
                            {interest}
                          </span>
                        ))}
                        {child.interests.length > 3 && (
                          <span
                            style={{
                              fontSize: 'var(--text-caption)',
                              color: 'var(--text-muted)',
                              padding: '4px 8px',
                            }}
                          >
                            +{child.interests.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Icon */}
                  <div className="shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLongPress(child.id);
                      }}
                      className="flex items-center justify-center transition-smooth hover:opacity-70"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--neutral-100)',
                      }}
                    >
                      <MoreVertical size={20} style={{ color: 'var(--text-primary)' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Child Card with Cute Icon */}
            <button
              onClick={onAddChild}
              className="w-full transition-smooth active:scale-press"
              style={{
                padding: '20px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '2px dashed var(--neutral-300)',
                textAlign: 'center',
              }}
            >
              <div
                className="mx-auto mb-3"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(179, 230, 197, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart size={24} style={{ color: 'var(--brand-accent)' }} />
              </div>
              <p
                style={{
                  fontSize: 'var(--text-body-md)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--text-primary)',
                }}
              >
                Add Another Child
              </p>
            </button>
          </div>
        )}
      </div>

      {/* Actions Bottom Sheet */}
      {showActionsSheet && selectedChildId && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowActionsSheet(false)}
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
            <h3 className="mb-4 text-center">Child Actions</h3>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onCreateStoryForChild(selectedChildId);
                  setShowActionsSheet(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 transition-colors hover:bg-gray-50"
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                }}
              >
                <BookOpen size={20} style={{ color: 'var(--brand-primary)' }} />
                <span
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Create Story
                </span>
              </button>

              <button
                onClick={() => {
                  onEditChild(selectedChildId);
                  setShowActionsSheet(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 transition-colors hover:bg-gray-50"
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                }}
              >
                <Edit size={20} style={{ color: 'var(--text-primary)' }} />
                <span
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Edit Child
                </span>
              </button>

              <button
                onClick={() => {
                  setChildToDelete(selectedChildId);
                  setShowDeleteConfirm(true);
                  setShowActionsSheet(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 transition-colors hover:bg-gray-50"
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                }}
              >
                <Trash2 size={20} style={{ color: 'var(--semantic-error)' }} />
                <span
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--semantic-error)',
                  }}
                >
                  Delete Child
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Child?"
        message="This child and all their stories will be permanently deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={() => {
          if (childToDelete) {
            onDeleteChild(childToDelete);
            setChildToDelete(null);
          }
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}