import { useState, useEffect } from 'react';
import { Plus, Settings, User, Baby } from 'lucide-react';
import { Bell, ChevronRight, Plus, Sparkles, Book, Star, TrendingUp, Clock, Play } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  age: number;
  interests: string[];
  avatar: string;
  avatarColor?: string;
}

interface Story {
  id: string;
  title: string;
  childName: string;
  date: string;
  duration: string;
  thumbnail: string;
  progress?: number; // 0-100
}

interface SubscriptionPlan {
  name: string;
  storiesUsed: number;
  storiesTotal: number;
}

interface HomeDashboardProps {
  userName?: string;
  children: Child[];
  recentStories: Story[];
  hasNotifications?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  onCreateStory: () => void;
  onAddChild: () => void;
  onSeeAllChildren: () => void;
  onSelectChild: (childId: string) => void;
  onViewStory: (storyId: string) => void;
  onNotifications: () => void;
  onSettings: () => void;
  onViewAllStories?: () => void;
  onManageSubscription?: () => void;
  onViewPlans?: () => void;
}

export function HomeDashboard({
  userName = 'Parent',
  children,
  recentStories,
  hasNotifications = false,
  subscriptionPlan,
  onCreateStory,
  onAddChild,
  onSeeAllChildren,
  onSelectChild,
  onViewStory,
  onNotifications,
  onSettings,
  onViewAllStories,
  onManageSubscription,
  onViewPlans,
}: HomeDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasChildren = children.length > 0;
  const hasStories = recentStories.length > 0;
  const continueStory = recentStories[0];

  // Get time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Pull to refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Avatar colors
  const getAvatarColor = (child: Child) => {
    return child.avatarColor || '#7DB6F8';
  };

  return (
    <div className="mobile-container">
      {/* Header - Fixed */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--neutral-200)',
          paddingTop: 'max(var(--safe-area-top), 16px)',
          paddingBottom: '12px',
          paddingLeft: 'var(--screen-padding)',
          paddingRight: 'var(--screen-padding)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: '20px', marginBottom: '2px' }}>ChildStory</h1>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>
              {getGreeting()}, {userName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNotifications}
              className="relative transition-smooth active:scale-press"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--neutral-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Notifications"
            >
              <Bell size={20} style={{ color: 'var(--text-primary)' }} />
              {hasNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--semantic-error)',
                  }}
                />
              )}
            </button>

            <button
              onClick={onSettings}
              className="transition-smooth active:scale-press"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--neutral-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
              aria-label="Settings"
            >
              <Settings size={20} style={{ color: 'var(--text-primary)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingLeft: 'var(--screen-padding)',
          paddingRight: 'var(--screen-padding)',
          paddingBottom: 'calc(var(--safe-area-bottom) + 96px)', // Space for bottom nav
        }}
      >
        {isLoading ? (
          // Loading Skeletons
          <div style={{ paddingTop: 'var(--section-gap-normal)' }}>
            <div className="skeleton skeleton-card" style={{ marginBottom: '16px' }} />
            <div className="skeleton skeleton-card" style={{ marginBottom: '16px' }} />
            <div className="skeleton skeleton-title" />
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ marginBottom: '24px' }}>
              <div className="skeleton skeleton-avatar shrink-0" />
              <div className="skeleton skeleton-avatar shrink-0" />
              <div className="skeleton skeleton-avatar shrink-0" />
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section - Quick Stats */}
            <div style={{ paddingTop: 'var(--section-gap-normal)' }}>
              <div
                className="transition-smooth active:scale-press"
                style={{
                  padding: 'var(--card-padding-lg)',
                  background: 'linear-gradient(135deg, rgba(125, 182, 248, 0.08) 0%, rgba(200, 197, 255, 0.08) 100%)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '16px',
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>
                      {getGreeting()}, {userName}
                    </h2>
                    <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>
                      Let's create some magic today
                    </p>
                  </div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7DB6F8 0%, #C8C5FF 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sparkles size={24} style={{ color: 'white' }} />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Stories today
                    </p>
                    <p style={{ fontSize: '24px', fontWeight: 'var(--weight-heading)', color: 'var(--brand-primary)' }}>
                      {recentStories.filter(s => s.date === 'Today').length}
                    </p>
                  </div>
                  {subscriptionPlan && (
                    <div className="flex-1">
                      <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {subscriptionPlan.name}
                      </p>
                      <p style={{ fontSize: '16px', fontWeight: 'var(--weight-medium)' }}>
                        {subscriptionPlan.storiesUsed}/{subscriptionPlan.storiesTotal}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Continue Story Card */}
              {continueStory && (
                <button
                  onClick={() => onViewStory(continueStory.id)}
                  className="w-full transition-smooth active:scale-press"
                  style={{
                    padding: 'var(--card-padding-md)',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--elevation-1)',
                    textAlign: 'left',
                    marginBottom: '16px',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, rgba(125, 182, 248, 0.2) 0%, rgba(246, 166, 215, 0.2) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Play size={28} style={{ color: 'var(--brand-primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Continue reading
                      </p>
                      <h4 className="truncate mb-1">{continueStory.title}</h4>
                      <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>
                        {continueStory.childName} • {continueStory.duration}
                      </p>
                    </div>
                    <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  {continueStory.progress && continueStory.progress > 0 && (
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: 'var(--neutral-200)',
                        borderRadius: '2px',
                        marginTop: '12px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${continueStory.progress}%`,
                          height: '100%',
                          backgroundColor: 'var(--brand-primary)',
                          borderRadius: '2px',
                        }}
                      />
                    </div>
                  )}
                </button>
              )}

              {/* Quick Create Story CTA */}
              <button
                onClick={onCreateStory}
                className="w-full transition-smooth active:scale-press"
                style={{
                  height: '64px',
                  padding: '0 var(--card-padding-md)',
                  background: 'linear-gradient(135deg, #7DB6F8 0%, #C8C5FF 100%)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--elevation-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--section-gap-major)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sparkles size={22} style={{ color: 'white' }} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 'var(--text-body-lg)', fontWeight: 'var(--weight-subheading)', color: 'white', marginBottom: '2px' }}>
                      Start Quick Story
                    </p>
                    <p style={{ fontSize: 'var(--text-caption)', color: 'rgba(255, 255, 255, 0.9)' }}>
                      Generate in seconds
                    </p>
                  </div>
                </div>
                <ChevronRight size={24} style={{ color: 'white' }} />
              </button>
            </div>

            {/* Family Carousel */}
            <div style={{ marginBottom: 'var(--section-gap-major)' }}>
              <div className="flex items-center justify-between mb-3">
                <h3>Family</h3>
                {hasChildren && (
                  <button
                    onClick={onSeeAllChildren}
                    className="transition-smooth active:scale-press"
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--brand-primary)',
                      fontWeight: 'var(--weight-medium)',
                    }}
                  >
                    Manage
                  </button>
                )}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="shrink-0"
                    style={{ width: '120px' }}
                  >
                    <button
                      onClick={() => onSelectChild(child.id)}
                      className="w-full transition-smooth active:scale-avatar"
                      style={{
                        padding: '16px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--elevation-1)',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        className="mx-auto mb-2"
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          backgroundColor: getAvatarColor(child),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '28px',
                        }}
                      >
                        {child.avatar || <User size={20} style={{ color: 'var(--text-muted)' }} />}
                      </div>
                      <p style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)', marginBottom: '2px' }}>
                        {child.name}
                      </p>
                      <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>
                        {child.age} years
                      </p>
                      {/* Progress Badge */}
                      <div
                        className="mx-auto mt-2"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          backgroundColor: 'rgba(125, 182, 248, 0.1)',
                          borderRadius: 'var(--radius-pill)',
                        }}
                      >
                        <Star size={12} style={{ color: 'var(--brand-primary)' }} />
                        <span style={{ fontSize: '11px', color: 'var(--brand-primary)', fontWeight: 'var(--weight-medium)' }}>
                          {Math.floor(Math.random() * 20) + 10}
                        </span>
                      </div>
                    </button>
                  </div>
                ))}

                {/* Add Child Card */}
                <div className="shrink-0" style={{ width: '120px' }}>
                  <button
                    onClick={onAddChild}
                    className="w-full h-full transition-smooth active:scale-press"
                    style={{
                      padding: '16px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      border: '2px dashed var(--neutral-300)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '160px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--neutral-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <Plus size={24} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Add Child
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Stories / Magic Queue */}
            {hasStories && (
              <div style={{ marginBottom: 'var(--section-gap-major)' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3>Recent Stories</h3>
                  <button
                    onClick={onViewAllStories}
                    className="transition-smooth active:scale-press"
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--brand-primary)',
                      fontWeight: 'var(--weight-medium)',
                    }}
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {recentStories.slice(0, 3).map((story) => (
                    <button
                      key={story.id}
                      onClick={() => onViewStory(story.id)}
                      className="w-full transition-smooth active:scale-press"
                      style={{
                        padding: 'var(--card-padding-md)',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--elevation-1)',
                        textAlign: 'left',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(135deg, rgba(125, 182, 248, 0.2) 0%, rgba(200, 197, 255, 0.2) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Book size={24} style={{ color: 'var(--brand-primary)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate mb-1">{story.title}</h4>
                          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>
                            {story.childName} • {story.date} • {story.duration}
                          </p>
                        </div>
                        <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Insights / Plan Status */}
            {subscriptionPlan && onManageSubscription && (
              <div style={{ marginBottom: 'var(--section-gap-major)' }}>
                <h3 className="mb-3">Plan Status</h3>
                <button
                  onClick={onManageSubscription}
                  className="w-full transition-smooth active:scale-press"
                  style={{
                    padding: 'var(--card-padding-md)',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--elevation-1)',
                    textAlign: 'left',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4>{subscriptionPlan.name}</h4>
                      <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-muted)' }}>
                        {subscriptionPlan.storiesUsed} of {subscriptionPlan.storiesTotal} stories used
                      </p>
                    </div>
                    <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: 'var(--neutral-200)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${(subscriptionPlan.storiesUsed / subscriptionPlan.storiesTotal) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--brand-primary) 0%, var(--brand-enchant) 100%)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </button>
              </div>
            )}

            {/* Empty States */}
            {!hasStories && hasChildren && (
              <div
                style={{
                  padding: 'var(--card-padding-lg)',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center',
                  marginBottom: 'var(--section-gap-major)',
                }}
              >
                <div
                  className="mx-auto mb-4"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(125, 182, 248, 0.1) 0%, rgba(200, 197, 255, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={40} style={{ color: 'var(--brand-primary)' }} />
                </div>
                <h3 className="mb-2">Ready to create magic?</h3>
                <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Start your first story for {children[0].name}
                </p>
                <button
                  onClick={onCreateStory}
                  className="transition-smooth active:scale-press"
                  style={{
                    height: '48px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    backgroundColor: 'var(--brand-primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 'var(--weight-medium)',
                  }}
                >
                  Create Story
                </button>
              </div>
            )}

            {!hasChildren && (
              <div
                style={{
                  padding: 'var(--card-padding-lg)',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center',
                  marginBottom: 'var(--section-gap-major)',
                }}
              >
                <div
                  className="mx-auto mb-4"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(125, 182, 248, 0.1) 0%, rgba(200, 197, 255, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                  }}
                >
                  <Baby size={40} style={{ color: 'var(--brand-primary)' }} />
                </div>
                <h3 className="mb-2">Add your first child</h3>
                <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Create a profile to start generating personalized stories
                </p>
                <button
                  onClick={onAddChild}
                  className="transition-smooth active:scale-press"
                  style={{
                    height: '48px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    backgroundColor: 'var(--brand-primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 'var(--weight-medium)',
                  }}
                >
                  Add Child Profile
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
