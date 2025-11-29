import { useState } from 'react';
import { Plus, ArrowLeft, Book, Palette, Heart, Sparkles, PieChart, Calendar, Filter } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  childName?: string;
}

interface ExpensesProps {
  onAddExpense: () => void;
  onEditExpense: (expenseId: string) => void;
  onBack?: () => void;
}

// Category configuration with whimsical ChildStory styling
const CATEGORIES = [
  { name: 'Stories', icon: Book, color: '#7DB6F8', bgColor: 'rgba(125, 182, 248, 0.12)' },
  { name: 'Books', icon: Book, color: '#7DB6F8', bgColor: 'rgba(125, 182, 248, 0.12)' },
  { name: 'Toys', icon: Heart, color: '#F6A6D7', bgColor: 'rgba(246, 166, 215, 0.12)' },
  { name: 'Activities', icon: Palette, color: '#B3E6C5', bgColor: 'rgba(179, 230, 197, 0.12)' },
  { name: 'Education', icon: Sparkles, color: '#C8C5FF', bgColor: 'rgba(200, 197, 255, 0.12)' },
];

export function Expenses({ onAddExpense, onEditExpense, onBack }: ExpensesProps) {
  const [selectedMonth, setSelectedMonth] = useState('Nov 2025');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const expenses: Expense[] = [
    {
      id: '1',
      title: 'Story Generation Credits',
      amount: 12.99,
      category: 'Stories',
      date: 'Nov 14',
      notes: '50 story credits',
      childName: 'Emma',
    },
    {
      id: '2',
      title: "Children's books",
      amount: 45.99,
      category: 'Books',
      date: 'Nov 12',
      notes: '3 new storybooks',
      childName: 'Emma',
    },
    {
      id: '3',
      title: 'Educational toy set',
      amount: 89.99,
      category: 'Toys',
      date: 'Nov 10',
      childName: 'Liam',
    },
    {
      id: '4',
      title: 'Art class registration',
      amount: 120.0,
      category: 'Activities',
      date: 'Nov 8',
      notes: 'Monthly art classes',
      childName: 'Emma',
    },
    {
      id: '5',
      title: 'Premium Subscription',
      amount: 9.99,
      category: 'Stories',
      date: 'Nov 1',
      notes: 'Monthly ChildStory Premium',
    },
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getCategoryConfig = (categoryName: string) => {
    return CATEGORIES.find((c) => c.name === categoryName) || CATEGORIES[0];
  };

  // Calculate category spending for pie chart
  const categoryData = CATEGORIES.map((cat) => {
    const total = expenses
      .filter((exp) => exp.category === cat.name)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return {
      name: cat.name,
      value: total,
      color: cat.color,
    };
  }).filter((d) => d.value > 0);

  // Filter expenses by category
  const filteredExpenses = selectedCategory
    ? expenses.filter((exp) => exp.category === selectedCategory)
    : expenses;

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
        {onBack ? (
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
        ) : (
          <div style={{ width: '40px' }} />
        )}

        <h2>Expenses</h2>

        <button
          onClick={onAddExpense}
          className="flex items-center justify-center transition-smooth hover:opacity-70"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-primary)',
          }}
        >
          <Plus size={20} style={{ color: 'white' }} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6" style={{ paddingTop: '24px', paddingBottom: '96px' }}>
        {/* Visual Summary Card with Pie Chart */}
        <div
          className="mb-6 p-5"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            boxShadow: 'var(--elevation-1)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p
                style={{
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--text-muted)',
                  marginBottom: '4px',
                }}
              >
                Total Expenses
              </p>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 'var(--weight-heading)',
                  color: 'var(--text-primary)',
                }}
              >
                ${totalExpenses.toFixed(2)}
              </h2>
            </div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(125, 182, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PieChart size={24} style={{ color: 'var(--brand-primary)' }} />
            </div>
          </div>

          {/* Pie Chart */}
          {categoryData.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height={180}>
                <RechartsPie>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>

              {/* Category Legend */}
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: cat.color,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 'var(--text-caption)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {cat.name} ${cat.value.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Category Filters */}
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className="shrink-0 transition-smooth active:scale-press"
              style={{
                padding: '8px 16px',
                backgroundColor: !selectedCategory ? 'var(--brand-primary)' : '#FFFFFF',
                color: !selectedCategory ? 'white' : 'var(--text-primary)',
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--text-body-sm)',
                fontWeight: 'var(--weight-medium)',
                border: !selectedCategory ? 'none' : '1px solid var(--neutral-200)',
              }}
            >
              All
            </button>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                  className="shrink-0 flex items-center gap-2 transition-smooth active:scale-press"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: isSelected ? cat.bgColor : '#FFFFFF',
                    color: isSelected ? cat.color : 'var(--text-primary)',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: 'var(--weight-medium)',
                    border: isSelected ? `1px solid ${cat.color}` : '1px solid var(--neutral-200)',
                  }}
                >
                  <Icon size={16} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Expense List with Context */}
        <div className="space-y-3">
          {filteredExpenses.map((expense) => {
            const config = getCategoryConfig(expense.category);
            const Icon = config.icon;

            return (
              <button
                key={expense.id}
                onClick={() => onEditExpense(expense.id)}
                className="w-full transition-smooth active:scale-press"
                style={{
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  boxShadow: 'var(--elevation-1)',
                  textAlign: 'left',
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Whimsical Category Icon */}
                  <div
                    className="shrink-0"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '16px',
                      backgroundColor: config.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={24} style={{ color: config.color }} />
                  </div>

                  {/* Expense Details */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="mb-1"
                      style={{
                        fontSize: 'var(--text-body-md)',
                        fontWeight: 'var(--weight-medium)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {expense.title}
                    </h4>
                    
                    {/* Context: Child name and notes */}
                    <div
                      style={{
                        fontSize: 'var(--text-caption)',
                        color: 'var(--text-muted)',
                        marginBottom: '4px',
                      }}
                    >
                      {expense.childName && (
                        <span>For {expense.childName}</span>
                      )}
                      {expense.childName && expense.notes && ' • '}
                      {expense.notes}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {expense.date}
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        •
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--text-caption)',
                          color: config.color,
                          fontWeight: 'var(--weight-medium)',
                        }}
                      >
                        {expense.category}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p
                      style={{
                        fontSize: 'var(--text-body-lg)',
                        fontWeight: 'var(--weight-subheading)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      ${expense.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredExpenses.length === 0 && (
          <div className="text-center py-16">
            <div
              className="mx-auto mb-4"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(125, 182, 248, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Filter size={40} style={{ color: 'var(--brand-primary)' }} />
            </div>
            <p
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              No expenses in this category
            </p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div
        className="absolute bottom-6 right-6"
        style={{
          zIndex: 10,
        }}
      >
        <button
          onClick={onAddExpense}
          className="transition-smooth active:scale-press"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-primary)',
            boxShadow: 'var(--elevation-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Plus size={28} style={{ color: 'white' }} />
        </button>
      </div>
    </div>
  );
}
