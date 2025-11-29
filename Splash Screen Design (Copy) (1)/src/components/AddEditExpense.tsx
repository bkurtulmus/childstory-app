import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Book, Box, Sparkles, Activity } from 'lucide-react';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

interface AddEditExpenseProps {
  expense?: Expense;
  onSave: (expense: Omit<Expense, 'id'> | Expense) => void;
  onDelete?: () => void;
  onBack: () => void;
}

// Category configuration with ChildStory styling
const CATEGORIES = [
  { name: 'Stories', icon: Book, color: '#7DB6F8', bgColor: 'rgba(125, 182, 248, 0.12)' },
  { name: 'Books', icon: Book, color: '#7DB6F8', bgColor: 'rgba(125, 182, 248, 0.12)' },
  { name: 'Toys', icon: Box, color: '#F6A6D7', bgColor: 'rgba(246, 166, 215, 0.12)' },
  { name: 'Activities', icon: Activity, color: '#B3E6C5', bgColor: 'rgba(179, 230, 197, 0.12)' },
  { name: 'Education', icon: Sparkles, color: '#C8C5FF', bgColor: 'rgba(200, 197, 255, 0.12)' },
];

export function AddEditExpense({ expense, onSave, onDelete, onBack }: AddEditExpenseProps) {
  const isEditMode = !!expense;

  const [amount, setAmount] = useState(expense?.amount.toString() || '');
  const [title, setTitle] = useState(expense?.title || '');
  const [category, setCategory] = useState(expense?.category || 'Stories');
  const [date, setDate] = useState(expense?.date || 'Nov 16');
  const [notes, setNotes] = useState(expense?.notes || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Validation errors
  const [amountError, setAmountError] = useState('');
  const [titleError, setTitleError] = useState('');

  const maxNotesLength = 200;
  const isFormValid = amount && parseFloat(amount) > 0 && title.trim().length > 0;

  useEffect(() => {
    setIsDirty(true);
  }, [amount, title, category, date, notes]);

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value) || value === '') {
      setAmount(value);
      setAmountError('');
      setIsDirty(true);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setAmountError('Amount must be greater than 0');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const expenseData = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date,
      notes: notes.trim(),
    };

    if (isEditMode) {
      onSave({ ...expense, ...expenseData });
    } else {
      onSave(expenseData);
    }
  };

  const handleBack = () => {
    if (isDirty) {
      const confirmed = window.confirm('Discard changes?');
      if (!confirmed) return;
    }
    onBack();
  };

  const getCategoryConfig = (categoryName: string) => {
    return CATEGORIES.find((c) => c.name === categoryName) || CATEGORIES[0];
  };

  const selectedCategoryConfig = getCategoryConfig(category);

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
        <h3>{isEditMode ? 'Edit Expense' : 'Add Expense'}</h3>
        {isEditMode && onDelete ? (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center transition-smooth hover:opacity-70"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: 'transparent',
            }}
            aria-label="Delete"
          >
            <Trash2 size={24} style={{ color: 'var(--semantic-error)' }} />
          </button>
        ) : (
          <div style={{ width: '44px' }} />
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '96px' }}>
        <div className="px-6 py-6">
          {/* Amount Input - Large & Prominent */}
          <div className="mb-6">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-muted)',
                marginBottom: '12px',
              }}
            >
              Amount
            </label>
            <div
              className="flex items-center"
              style={{
                padding: '24px',
                backgroundColor: selectedCategoryConfig.bgColor,
                borderRadius: '20px',
                border: `2px solid ${amountError ? 'var(--semantic-error)' : `${selectedCategoryConfig.color}30`}`,
              }}
            >
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 'var(--weight-heading)',
                  color: selectedCategoryConfig.color,
                  marginRight: '8px',
                }}
              >
                $
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="flex-1 outline-none bg-transparent"
                style={{
                  fontSize: '36px',
                  fontWeight: 'var(--weight-heading)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            {amountError && (
              <p
                style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--semantic-error)',
                  marginTop: '8px',
                }}
              >
                {amountError}
              </p>
            )}
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-muted)',
                marginBottom: '8px',
              }}
            >
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError('');
                setIsDirty(true);
              }}
              placeholder="e.g., Story credits, Books"
              className="w-full px-4 outline-none"
              style={{
                height: '48px',
                border: `1px solid ${titleError ? 'var(--semantic-error)' : 'var(--neutral-200)'}`,
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-primary)',
                backgroundColor: '#FFFFFF',
              }}
            />
            {titleError && (
              <p
                style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--semantic-error)',
                  marginTop: '4px',
                }}
              >
                {titleError}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-muted)',
                marginBottom: '12px',
              }}
            >
              Category
            </label>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.name;

                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setCategory(cat.name);
                      setIsDirty(true);
                    }}
                    className="w-full flex items-center gap-3 transition-smooth active:scale-press"
                    style={{
                      padding: '16px',
                      backgroundColor: isSelected ? cat.bgColor : '#FFFFFF',
                      borderRadius: '16px',
                      border: isSelected ? `2px solid ${cat.color}` : '1px solid var(--neutral-200)',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#FFFFFF' : cat.bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={20} style={{ color: cat.color }} />
                    </div>
                    <div
                      className="flex-1 text-left"
                      style={{
                        fontSize: 'var(--text-body-md)',
                        fontWeight: isSelected ? 'var(--weight-medium)' : 'var(--weight-regular)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {cat.name}
                    </div>
                    {isSelected && (
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: cat.color,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Input */}
          <div className="mb-6">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-muted)',
                marginBottom: '8px',
              }}
            >
              Date
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Nov 16"
              className="w-full px-4 outline-none"
              style={{
                height: '48px',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-primary)',
                backgroundColor: '#FFFFFF',
              }}
            />
          </div>

          {/* Notes Input */}
          <div className="mb-6">
            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-muted)',
                marginBottom: '8px',
              }}
            >
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => {
                if (e.target.value.length <= maxNotesLength) {
                  setNotes(e.target.value);
                  setIsDirty(true);
                }
              }}
              placeholder="Add details about this expense..."
              className="w-full px-4 py-3 outline-none resize-none"
              rows={4}
              style={{
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-primary)',
                backgroundColor: '#FFFFFF',
              }}
            />
            <div
              className="text-right mt-1"
              style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--text-muted)',
              }}
            >
              {notes.length}/{maxNotesLength}
            </div>
          </div>
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
            backgroundColor: selectedCategoryConfig.color,
            color: 'white',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 'var(--weight-medium)',
            fontSize: 'var(--text-body-lg)',
            boxShadow: 'var(--elevation-2)',
          }}
        >
          {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Expense'}
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
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            <h3 className="mb-3 text-center">Delete expense?</h3>
            <p
              className="text-center mb-6"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              This action cannot be undone
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  if (onDelete) onDelete();
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
    </div>
  );
}
