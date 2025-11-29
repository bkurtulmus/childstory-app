import { useState, useEffect } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner@2.0.3';
import { BottomNav } from './components/navigation/BottomNav';
import { CircularProgress } from './components/ui/ProgressIndicator';
import './styles/globals.css';

// Import screen components directly
import { OnboardingSlide } from './components/OnboardingSlide';
import { AuthRequestOTP } from './components/AuthRequestOTP';
import { VerifyOTP } from './components/VerifyOTP';
import { HomeDashboard } from './components/HomeDashboard';
import { ChildrenList } from './components/ChildrenList';
import { ChildCreate } from './components/ChildCreate';
import { ChildEdit } from './components/ChildEdit';
import { StoryCreate } from './components/StoryCreate';
import { StoryResult } from './components/StoryResult';
import { StoriesLibrary } from './components/StoriesLibrary';
import { StoryReader } from './components/StoryReader';
import { Settings } from './components/Settings';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { Checkout } from './components/Checkout';
import { SubscriptionStatus } from './components/SubscriptionStatus';

// Import illustrations directly (small files)
import {
  BookIllustration,
  AIIllustration,
  ShieldIllustration,
} from './components/OnboardingIllustrations';

type AppScreen =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'verify'
  | 'home'
  | 'children-list'
  | 'child-create'
  | 'child-edit'
  | 'story-create'
  | 'story-result'
  | 'stories-library'
  | 'story-reader'
  | 'settings'
  | 'subscription-plans'
  | 'checkout'
  | 'subscription-status';

interface Child {
  id: string;
  name: string;
  age: number;
  interests: string[];
  avatar: string;
  avatarColor: string;
}

interface Story {
  id: string;
  title: string;
  childName: string;
  childId?: string;
  childAvatar?: string;
  date: string;
  duration: string;
  thumbnail: string;
  createdAt: string;
  lesson?: string;
  tone?: string;
  language?: string;
  themes?: string[];
  content?: string;
  isFavorite?: boolean;
  excerpt?: string;
}

const PLAN_CATALOG: Record<
  string,
  {
    name: string;
    monthlyPrice: number;
    annualPrice: number;
    hasTrial?: boolean;
    monthlyStoryLimit: number;
    retentionHours: number;
    dailyStoryLimit: number;
  }
> = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    monthlyStoryLimit: 30,
    retentionHours: 24,
    dailyStoryLimit: 1,
  },
  premium: {
    name: 'Premium',
    monthlyPrice: 9.99,
    annualPrice: 7.99,
    hasTrial: true,
    monthlyStoryLimit: 300,
    retentionHours: 24 * 365,
    dailyStoryLimit: 10,
  },
  family: {
    name: 'Family',
    monthlyPrice: 14.99,
    annualPrice: 11.99,
    monthlyStoryLimit: 600,
    retentionHours: 24 * 365,
    dailyStoryLimit: 15,
  },
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [authContact, setAuthContact] = useState('');
  const [authType, setAuthType] = useState<'phone' | 'email'>('phone');
  const [selectedChildIdForEdit, setSelectedChildIdForEdit] = useState<string | null>(null);
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isStoryReaderFavorite, setIsStoryReaderFavorite] = useState(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<{
    id: string;
    name: string;
    price: number;
    billingPeriod: 'monthly' | 'annual';
    hasTrial: boolean;
  } | null>(null);

  // App data
  const [userName, setUserName] = useState('Parent');
  const [children, setChildren] = useState<Child[]>([
    {
      id: '1',
      name: 'Emma',
      age: 7,
      interests: ['space', 'animals', 'adventure'],
      avatar: '0',
      avatarColor: '#7DB6F8',
    },
    {
      id: '2',
      name: 'Liam',
      age: 5,
      interests: ['dinosaurs', 'music', 'friendship'],
      avatar: '1',
      avatarColor: '#F6A6D7',
    },
  ]);
  const [libraryStories, setLibraryStories] = useState<Story[]>([
    {
      id: '1',
      title: 'The Space Adventure of Emma and the Friendly Aliens',
      childName: 'Emma',
      childId: '1',
      childAvatar: '0',
      date: 'Today',
      duration: '3 min',
      thumbnail: '',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      lesson: 'Sharing',
      tone: 'Adventure',
      language: 'English',
      themes: ['Space'],
      content:
        'Once upon a time in a sparkling galaxy, Emma met the friendliest group of aliens and learned how sharing lights up the universe.',
      excerpt: 'Emma meets friendly aliens and practices sharing among the stars.',
    },
    {
      id: '2',
      title: 'Liam and the Musical Dinosaurs',
      childName: 'Liam',
      childId: '2',
      childAvatar: '1',
      date: 'Yesterday',
      duration: '4 min',
      thumbnail: '',
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      lesson: 'Confidence',
      tone: 'Gentle',
      language: 'English',
      themes: ['Dinosaurs', 'Music'],
      content:
        'Deep in Harmony Valley, Liam joined a dinosaur band and discovered the joy of playing boldly and kindly.',
      excerpt: 'Liam forms a dino band and finds his brave voice.',
    },
  ]);
  const [currentPlanId, setCurrentPlanId] = useState<'free' | 'premium' | 'family'>('free');
  const [storiesUsedThisMonth, setStoriesUsedThisMonth] = useState(2);
  const [usageDateSignature, setUsageDateSignature] = useState(new Date().toDateString());
  const [storiesGeneratedToday, setStoriesGeneratedToday] = useState(0);
  const planDetails = PLAN_CATALOG[currentPlanId];
  const isPremiumUser = currentPlanId !== 'free';
  const subscriptionPlan = {
    name: planDetails.name,
    storiesUsed: storiesUsedThisMonth,
    storiesTotal: planDetails.monthlyStoryLimit,
    retentionHours: planDetails.retentionHours,
  };
  const todaySignatureForDisplay = new Date().toDateString();
  const storiesCreatedToday =
    todaySignatureForDisplay === usageDateSignature ? storiesGeneratedToday : 0;
  const dailyStoriesRemaining = Math.max(
    planDetails.dailyStoryLimit - storiesCreatedToday,
    0
  );
  const subscriptionStatusPlan = {
    name: planDetails.name,
    price: planDetails.monthlyPrice,
    status: isPremiumUser ? ('active' as const) : ('trial' as const),
    renewalDate: 'Dec 20, 2025',
    storiesUsed: storiesUsedThisMonth,
    storiesTotal: planDetails.monthlyStoryLimit,
  };
  const defaultPaymentMethod = {
    type: 'Visa',
    last4: '4242',
  };
  const recentStories = libraryStories.slice(0, 3);

  // Skip to home dashboard for testing
  const handleSkipToHome = () => {
    setIsLoading(false);
    setCurrentScreen('home');
  };

  useEffect(() => {
    // Simulate app initialization
    const initApp = async () => {
      try {
        // Simulate checking session/token
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simulate potential error (uncomment to test error state)
        // throw new Error('Connection failed');

        setIsLoading(false);
        // Navigate to onboarding or skip if completed
        setTimeout(() => {
          try {
            const completed = localStorage.getItem('onboarding:completed') === 'true';
            setCurrentScreen(completed ? 'auth' : 'onboarding');
          } catch {
            setCurrentScreen('onboarding');
          }
        }, 500);
      } catch (error) {
        setIsLoading(false);
        setHasError(true);
      }
    };

    initApp();
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);

    // Retry initialization
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('onboarding');
    }, 2000);
  };

  const handleNextSlide = () => {
    if (currentSlide < 3) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Last slide - navigate to auth, persist completion
      try { localStorage.setItem('onboarding:completed', 'true'); } catch { }
      setCurrentScreen('auth');
    }
  };

  const handleSkip = () => {
    try { localStorage.setItem('onboarding:completed', 'true'); } catch { }
    setCurrentScreen('auth');
  };

  const handleSendCode = (contact: string, type: 'phone' | 'email') => {
    setAuthContact(contact);
    setAuthType(type);
    setCurrentScreen('verify');
  };

  const handleVerifySuccess = () => {
    setCurrentScreen('home');
  };

  const handleBackToAuth = () => {
    setCurrentScreen('auth');
  };

  const handleUseDifferent = () => {
    setCurrentScreen('auth');
  };

  const handleHelp = () => {
    // Handle help action
    toast.info('Help center coming soon!');
  };

  // Home Dashboard handlers
  const handleCreateStory = () => {
    setCurrentScreen('story-create');
  };

  const handleAddChild = () => {
    setCurrentScreen('child-create');
  };

  const handleSeeAllChildren = () => {
    setCurrentScreen('children-list');
  };

  const handleSelectChild = (childId: string) => {
    setSelectedChildIdForEdit(childId);
    setCurrentScreen('child-edit');
  };

  const handleViewStory = (storyId: string) => {
    const story = libraryStories.find((s) => s.id === storyId);
    if (!story) {
      toast.error('Story not found.');
      return;
    }
    setActiveStory(story);
    setCurrentScreen('story-reader');
  };

  const handleManageSubscription = () => {
    setCurrentScreen('subscription-status');
  };

  const handleViewPlans = () => {
    setCurrentScreen('subscription-plans');
  };

  const handleNotifications = () => {
    toast.info('📬 Notifications coming soon!');
  };

  const handleSettings = () => {
    setCurrentScreen('settings');
  };

  // Children List handlers
  const handleEditChild = (childId: string) => {
    setSelectedChildIdForEdit(childId);
    setCurrentScreen('child-edit');
  };

  const handleDeleteChild = (childId: string) => {
    setChildren((prev) => prev.filter((child) => child.id !== childId));
  };

  const handleCreateStoryForChild = (childId: string) => {
    setSelectedChildIdForEdit(childId);
    setCurrentScreen('story-create');
  };

  // Child Create handlers
  const handleSaveChild = (childData: {
    name: string;
    age: number;
    language: string;
    interests: string[];
    avatar: string;
  }) => {
    const newChild: Child = {
      id: Date.now().toString(),
      name: childData.name,
      age: childData.age,
      interests: childData.interests,
      avatar: childData.avatar,
      avatarColor: '#B3E6C5',
    };
    setChildren((prev) => [...prev, newChild]);

    // Show success message
    toast.success(`✨ ${childData.name} added to your family!`);

    // Navigate back to children list
    setCurrentScreen('children-list');
  };

  // Child Edit handlers
  const handleUpdateChild = (updatedChild: Child) => {
    setChildren((prev) =>
      prev.map((child) => (child.id === updatedChild.id ? updatedChild : child))
    );
    toast.success('💾 Changes saved successfully!');
    setCurrentScreen('children-list');
  };

  const handleDeleteChildFromEdit = () => {
    if (selectedChildIdForEdit) {
      const childName = children.find(c => c.id === selectedChildIdForEdit)?.name || 'Child';
      setChildren((prev) => prev.filter((child) => child.id !== selectedChildIdForEdit));
      toast.success(`${childName} removed from your family`);
      setSelectedChildIdForEdit(null);
      setCurrentScreen('children-list');
    }
  };

  const handleViewStoriesForChild = () => {
    setCurrentScreen('stories-library');
  };

  // Story Create handlers
  const handleGenerateStory = (config: {
    childId: string;
    themes: string[];
    tone: string;
    length: 'short' | 'medium' | 'long';
    lesson: string;
  }) => {
    const todaySignature = new Date().toDateString();
    if (todaySignature !== usageDateSignature) {
      setUsageDateSignature(todaySignature);
      setStoriesGeneratedToday(0);
    }

    if (storiesGeneratedToday >= planDetails.dailyStoryLimit) {
      toast.error(
        `You've reached today's limit for the ${planDetails.name} plan. Upgrade to generate more stories.`
      );
      return;
    }

    if (storiesUsedThisMonth >= planDetails.monthlyStoryLimit) {
      toast.error('Monthly story limit reached. Please upgrade your plan.');
      return;
    }

    const selectedChild = children.find((c) => c.id === config.childId);
    if (!selectedChild) {
      toast.error('Please select a child before generating a story.');
      return;
    }

    const now = new Date();
    const storyLengthLabel =
      config.length === 'short' ? '3 min' : config.length === 'medium' ? '5 min' : '8 min';
    const newStory: Story = {
      id: `story-${Date.now()}`,
      title: `The ${config.themes[0]} Tale of ${selectedChild.name}`,
      childName: selectedChild.name,
      childId: selectedChild.id,
      childAvatar: selectedChild.avatar,
      date: 'Today',
      duration: storyLengthLabel,
      thumbnail: '',
      createdAt: now.toISOString(),
      lesson: config.lesson,
      tone: config.tone,
      language: 'English',
      themes: config.themes,
      content: `This personalized story teaches ${config.lesson.toLowerCase()} through a ${config.themes[0]} adventure starring ${selectedChild.name}.`,
      isFavorite: false,
      excerpt: `A ${config.themes[0].toLowerCase()} story showing ${selectedChild.name} how to practice ${config.lesson.toLowerCase()}.`,
    };

    setGeneratedStory(newStory);
    setStoriesGeneratedToday((prev) => prev + 1);
    setStoriesUsedThisMonth((prev) => prev + 1);
    setCurrentScreen('story-result');
  };

  // Story Result handlers
  const persistGeneratedStory = (silent = false) => {
    if (!generatedStory) {
      return false;
    }

    let didPersist = false;
    setLibraryStories((prev) => {
      const exists = prev.some((story) => story.id === generatedStory.id);
      if (exists) {
        return prev;
      }
      didPersist = true;
      return [generatedStory, ...prev];
    });

    if (didPersist && !silent) {
      toast.success(
        isPremiumUser
          ? '📚 Story saved to your library!'
          : '📚 Saved for 24 hours. Upgrade to keep it forever.'
      );
    }

    if (!isPremiumUser && didPersist && silent) {
      toast.info('Story saved for the next 24 hours. Upgrade to keep it forever.');
    }

    return didPersist;
  };

  const handleReadNow = () => {
    if (!generatedStory) {
      toast.error('No story ready to read.');
      return;
    }

    persistGeneratedStory(true);
    setActiveStory(generatedStory);
    setCurrentScreen('story-reader');
  };

  const handleSaveStory = () => {
    if (!generatedStory) {
      toast.error('No story to save.');
      return;
    }
    persistGeneratedStory();
  };

  const handleShareStory = (storyId?: string) => {
    const story = storyId ? libraryStories.find((s) => s.id === storyId) : generatedStory;
    toast.success(
      story
        ? `🔗 Share link for "${story.title}" copied!`
        : '🔗 Share link copied!'
    );
  };

  const handleDeleteStory = (storyId: string) => {
    setLibraryStories((prev) => prev.filter((story) => story.id !== storyId));
    if (activeStory?.id === storyId) {
      setActiveStory(null);
      setCurrentScreen('home');
    }
    toast.success('🗑️ Story removed from your library.');
  };

  const handleToggleFavoriteStory = (storyId: string) => {
    setLibraryStories((prev) =>
      prev.map((story) =>
        story.id === storyId ? { ...story, isFavorite: !story.isFavorite } : story
      )
    );
  };

  const handleRegenerateStory = () => {
    setCurrentScreen('story-create');
  };

  const handleQuickAdjust = (adjustment: string) => {
    toast.info(`Adjusting story: ${adjustment}...`);
    setCurrentScreen('story-create');
  };

  const handleViewAlternative = (storyId: string) => {
    toast.info('Loading alternative version...');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  // Helper function to determine if bottom nav should be shown
  const shouldShowBottomNav = (screen: AppScreen): boolean => {
    const screensWithBottomNav: AppScreen[] = [
      'home',
      'story-create',
      'story-result',
      'stories-library',
      'story-reader',
      'settings',
      'children-list',
      'child-create',
      'child-edit',
      'subscription-status',
      'subscription-plans',
      'checkout',
    ];
    return screensWithBottomNav.includes(screen);
  };

  // Navigation handler for bottom nav
  const handleBottomNavigation = (screen: 'home' | 'story-create' | 'stories-library' | 'settings') => {
    setCurrentScreen(screen);
    // Reset any related state if needed
    if (screen === 'story-create') {
      setSelectedChildIdForEdit(null);
    }
  };

  const handlePlanSelection = (planId: string, billingPeriod: 'monthly' | 'annual') => {
    const plan = PLAN_CATALOG[planId] ?? PLAN_CATALOG['premium'];
    const price = billingPeriod === 'annual' ? plan.annualPrice : plan.monthlyPrice;

    setSelectedCheckoutPlan({
      id: planId,
      name: plan.name,
      price,
      billingPeriod,
      hasTrial: Boolean(plan.hasTrial) && billingPeriod === 'monthly',
    });
    setCurrentScreen('checkout');
  };

  const handleCheckoutClose = () => {
    setSelectedCheckoutPlan(null);
    setCurrentScreen('subscription-plans');
  };

  // Splash Screen
  if (currentScreen === 'splash') {
    return (
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: '100%',
          maxWidth: 'var(--container-max-width)',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          margin: '0 auto',
        }}
      >
        {/* Skip Button - Less Prominent */}
        <button
          onClick={handleSkipToHome}
          className="absolute top-4 right-4 z-50 transition-smooth hover:opacity-60"
          style={{
            padding: '6px 12px',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-pill)',
            fontSize: '12px',
            fontWeight: 'var(--weight-regular)',
            border: '1px solid var(--neutral-200)',
          }}
        >
          Skip
        </button>

        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center top, rgba(200, 197, 255, 0.08) 0%, transparent 50%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6">
          {/* Logo with sparkles animation */}
          <div
            className="relative flex items-center justify-center mb-6"
            style={{
              width: '112px',
              height: '112px',
              backgroundColor: 'var(--brand-primary)',
              borderRadius: '50%',
            }}
          >
            {/* Sparkles around logo */}
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-enchant)',
                  top: `${50 + 45 * Math.cos((index * Math.PI) / 2)}%`,
                  left: `${50 + 45 * Math.sin((index * Math.PI) / 2)}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: `sparkle ${2 + index * 0.2}s ease-in-out infinite`,
                  animationDelay: `${index * 0.3}s`,
                }}
              />
            ))}
          </div>

          {/* App Name */}
          <h1 className="mb-2 text-center">ChildStory</h1>

          {/* Tagline */}
          <p
            className="mb-10 text-center"
            style={{
              fontSize: '16px',
              color: 'var(--text-muted)',
              letterSpacing: '0.5px',
            }}
          >
            Personalized tales for little dreamers
          </p>

          {/* Loading State */}
          {isLoading && !hasError && (
            <div className="flex flex-col items-center gap-3">
              <ShimmerLoader />
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="flex flex-col items-center gap-4">
              <AlertCircle
                size={48}
                style={{
                  color: 'var(--semantic-error)',
                }}
              />
              <h3 className="text-center">Couldn't connect</h3>
              <button
                onClick={handleRetry}
                className="px-6 py-3 transition-all active:scale-95"
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--elevation-2)',
                  minHeight: '44px',
                  minWidth: '44px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#6BA5E7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
                }}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Onboarding Screen
  if (currentScreen === 'onboarding') {
    const slides = [
      {
        illustration: <BookIllustration />,
        title: 'Personalized Stories',
        body: "Tailored to your child's age and interests.",
        gradientColors: 'linear-gradient(135deg, rgba(125, 182, 248, 0.12) 0%, rgba(246, 166, 215, 0.12) 100%)',
      },
      {
        illustration: <AIIllustration />,
        title: 'AI‑Powered Magic',
        body: 'Create enchanting tales in moments.',
        gradientColors: 'linear-gradient(135deg, rgba(125, 182, 248, 0.12) 0%, rgba(179, 230, 197, 0.12) 100%)',
      },
      {
        illustration: <ShieldIllustration />,
        title: 'Safe & Private',
        body: "Your family's data stays protected.",
        gradientColors: 'linear-gradient(135deg, rgba(179, 230, 197, 0.12) 0%, rgba(200, 197, 255, 0.12) 100%)',
      },
    ];

    const currentSlideData = slides[currentSlide - 1];

    const handleSwipeLeft = () => {
      if (currentSlide < 3) {
        handleNextSlide();
      }
    };

    const handleSwipeRight = () => {
      if (currentSlide > 1) {
        setCurrentSlide(currentSlide - 1);
      }
    };

    return (
      <OnboardingSlide
        illustration={slides[currentSlide - 1].illustration}
        title={slides[currentSlide - 1].title}
        body={slides[currentSlide - 1].body}
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onNext={handleNextSlide}
        onSkip={handleSkip}
        gradientColors={slides[currentSlide - 1].gradientColors}
      />
    );
  }

  // Auth Request OTP Screen
  if (currentScreen === 'auth') {
    return (
      <AuthRequestOTP
        onSendCode={handleSendCode}
        onHelp={handleHelp}
        onSkipToHome={handleSkipToHome}
      />
    );
  }

  // Verify OTP Screen
  if (currentScreen === 'verify') {
    return (
      <VerifyOTP
        contact={authContact}
        type={authType}
        onVerify={handleVerifySuccess}
        onBack={handleBackToAuth}
        onUseDifferent={handleUseDifferent}
        onSkipToHome={handleSkipToHome}
      />
    );
  }

  // Home Dashboard Screen
  if (currentScreen === 'home') {
    return (
      <>
        <HomeDashboard
          userName={userName}
          children={children}
          recentStories={recentStories}
          hasNotifications={false}
          subscriptionPlan={subscriptionPlan}
          onCreateStory={handleCreateStory}
          onAddChild={handleAddChild}
          onSeeAllChildren={handleSeeAllChildren}
          onSelectChild={handleSelectChild}
          onViewStory={handleViewStory}
          onManageSubscription={handleManageSubscription}
          onViewPlans={handleViewPlans}
          onNotifications={handleNotifications}
          onSettings={handleSettings}
          onViewAllStories={() => setCurrentScreen('stories-library')}
        />
        {shouldShowBottomNav(currentScreen) && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleBottomNavigation}
            badges={{
              home: 3, // Example: 3 new activities
              library: 2, // Example: 2 new stories
            }}
          />
        )}
      </>
    );
  }

  // Children List Screen
  if (currentScreen === 'children-list') {
    return (
      <>
        <ChildrenList
          children={children}
          onAddChild={handleAddChild}
          onEditChild={handleEditChild}
          onDeleteChild={handleDeleteChild}
          onCreateStoryForChild={handleCreateStoryForChild}
          onBack={handleBackToHome}
        />
        {shouldShowBottomNav(currentScreen) && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleBottomNavigation}
          />
        )}
      </>
    );
  }

  // Child Create Screen
  if (currentScreen === 'child-create') {
    return (
      <>
        <ChildCreate onSave={handleSaveChild} onBack={handleBackToHome} />
        {shouldShowBottomNav(currentScreen) && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleBottomNavigation}
          />
        )}
      </>
    );
  }

  // Child Edit Screen
  if (currentScreen === 'child-edit' && selectedChildIdForEdit) {
    const childToEdit = children.find((c) => c.id === selectedChildIdForEdit);
    if (!childToEdit) {
      setCurrentScreen('children-list');
      return null;
    }

    return (
      <>
        <ChildEdit
          child={childToEdit}
          onSave={handleUpdateChild}
          onDelete={handleDeleteChildFromEdit}
          onCreateStory={() => {
            setCurrentScreen('story-create');
          }}
          onViewStories={handleViewStoriesForChild}
          onBack={() => setCurrentScreen('children-list')}
        />
        {shouldShowBottomNav(currentScreen) && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleBottomNavigation}
          />
        )}
      </>
    );
  }

  // Story Create Screen
  if (currentScreen === 'story-create') {
    return (
      <>
        <StoryCreate
          children={children}
          preselectedChildId={selectedChildIdForEdit || undefined}
          planSummary={{
            name: planDetails.name,
            storiesUsed: storiesUsedThisMonth,
            storiesTotal: planDetails.monthlyStoryLimit,
            dailyRemaining: dailyStoriesRemaining,
            isPremium: isPremiumUser,
            retentionHours: planDetails.retentionHours,
          }}
          onGenerate={handleGenerateStory}
          onAddChild={handleAddChild}
          onViewPlans={handleViewPlans}
          onBack={handleBackToHome}
        />
        {shouldShowBottomNav(currentScreen) && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleBottomNavigation}
          />
        )}
      </>
    );
  }

  // Story Result Screen
  if (currentScreen === 'story-result' && generatedStory) {
    return (
      <>
        <StoryResult
          story={generatedStory}
          lesson={generatedStory.lesson}
          isPremiumUser={isPremiumUser}
          alternatives={[
            { id: 'alt-1', title: 'Alternative Version: The Shorter Adventure' },
            { id: 'alt-2', title: 'Alternative Version: The Funnier Tale' },
          ]}
          onBack={() => setCurrentScreen('story-create')}
          onReadNow={handleReadNow}
          onSave={handleSaveStory}
          onShare={handleShareStory}
          onRegenerate={handleRegenerateStory}
          onQuickAdjust={handleQuickAdjust}
          onViewAlternative={handleViewAlternative}
        />
        {shouldShowBottomNav(currentScreen) && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleBottomNavigation}
          />
        )}
      </>
    );
  }

  // Stories Library Screen
  if (currentScreen === 'stories-library') {
    return (
      <>
        <StoriesLibrary
          stories={libraryStories}
          children={children}
          isPremiumUser={isPremiumUser}
          freeRetentionHours={PLAN_CATALOG.free.retentionHours}
          onUpgrade={handleViewPlans}
          onReadStory={handleViewStory}
          onShareStory={(storyId) => handleShareStory(storyId)}
          onDeleteStory={handleDeleteStory}
          onToggleFavorite={handleToggleFavoriteStory}
          onCreateStory={handleCreateStory}
          onBack={handleBackToHome}
        />
        {shouldShowBottomNav(currentScreen) && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleBottomNavigation}
          />
        )}
      </>
    );
  }

  // Story Reader Screen
  if (currentScreen === 'story-reader') {
    if (!activeStory) {
      setCurrentScreen('home');
      return null;
    }

    return (
      // No BottomNav for immersive reading experience
      <StoryReader
        story={activeStory}
        lesson={activeStory.lesson}
        isPremiumUser={isPremiumUser}
        onBack={handleBackToHome}
        onToggleFavorite={() => {
          setIsStoryReaderFavorite(!isStoryReaderFavorite);
          toast.success(
            isStoryReaderFavorite ? '💔 Removed from favorites' : '❤️ Added to favorites'
          );
        }}
        onShare={() => toast.success('🔗 Share link copied to clipboard!')}
      />
    );
  }

  // Settings Screen
  if (currentScreen === 'settings') {
    return (
      <>
        <Settings
          userName={userName}
          userContact="+1 (555) 123-4567"
          onBack={handleBackToHome}
          onSignOut={() => {
            toast.success('Signed Out', 'You have been successfully signed out.');
            setCurrentScreen('auth');
          }}
          onVoiceCloning={() => setCurrentScreen('voice-cloning')}
        />
        {shouldShowBottomNav(currentScreen) && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleBottomNavigation}
          />
        )}
      </>
    );
  }

  // Subscription Plans Screen
  if (currentScreen === 'subscription-plans') {
    return (
      <>
        <SubscriptionPlans
          onSelectPlan={handlePlanSelection}
          onBack={handleBackToHome}
          onRestorePurchase={() => toast.success('Restore Purchases', 'Your purchases have been restored successfully.')}
        />
        {shouldShowBottomNav(currentScreen) && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleBottomNavigation}
          />
        )}
      </>
    );
  }

  // Checkout Screen
  if (currentScreen === 'checkout') {
    const checkoutDetails =
      selectedCheckoutPlan || {
        id: 'premium',
        name: PLAN_CATALOG.premium.name,
        price: PLAN_CATALOG.premium.monthlyPrice,
        billingPeriod: 'monthly' as const,
        hasTrial: Boolean(PLAN_CATALOG.premium.hasTrial),
      };

    return (
      <>
        <Checkout
          planName={checkoutDetails.name}
          planPrice={checkoutDetails.price}
          billingPeriod={checkoutDetails.billingPeriod}
          hasTrial={checkoutDetails.hasTrial}
          onClose={handleCheckoutClose}
          onSuccess={() => {
            toast.success('✨ Subscription activated!');
            if (selectedCheckoutPlan) {
              setCurrentPlanId(selectedCheckoutPlan.id as 'free' | 'premium' | 'family');
            }
            setSelectedCheckoutPlan(null);
            setCurrentScreen('home');
          }}
          onChangePlan={() => {
            setCurrentScreen('subscription-plans');
          }}
        />
        {shouldShowBottomNav(currentScreen) && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleBottomNavigation}
          />
        )}
      </>
    );
  }

  // Subscription Status Screen
  if (currentScreen === 'subscription-status') {
    return (
      <>
        <SubscriptionStatus
          plan={subscriptionStatusPlan}
          paymentMethod={defaultPaymentMethod}
          onBack={handleBackToHome}
          onManagePlan={() => setCurrentScreen('subscription-plans')}
          onCancel={() => toast.info('Subscription cancellation flow coming soon!')}
          onUpgrade={() => setCurrentScreen('subscription-plans')}
          onChangePayment={() => toast.info('Payment settings coming soon!')}
          onViewHistory={() => toast.info('Billing history coming soon!')}
        />
        {shouldShowBottomNav(currentScreen) && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleBottomNavigation}
          />
        )}
      </>
    );
  }

  // Default fallback
  return (
    <>
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: 'var(--text-primary)',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-body-md)',
            fontWeight: 'var(--weight-medium)',
            padding: '16px',
            boxShadow: 'var(--elevation-2)',
          },
          success: {
            style: {
              border: '1px solid var(--brand-accent)',
              backgroundColor: 'rgba(179, 230, 197, 0.1)',
            },
            iconTheme: {
              primary: 'var(--brand-accent)',
              secondary: '#FFFFFF',
            },
          },
          error: {
            style: {
              border: '1px solid var(--semantic-error)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
            iconTheme: {
              primary: 'var(--semantic-error)',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      <div
        className="relative flex items-center justify-center"
        style={{
          width: '390px',
          height: '844px',
          backgroundColor: '#FFFFFF',
          margin: '0 auto',
        }}
      >
        <div className="text-center px-6">
          <h2 className="mb-4">Welcome to ChildStory!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            You've successfully signed in.
          </p>
        </div>
      </div>
    </>
  );
}

// Sparkling Loader Component
function SparklingLoader() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: '40px', height: '40px' }}>
      <svg
        className="animate-spin"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: 'spin 2s linear infinite',
        }}
      >
        {/* Sparkling dots orbiting */}
        <circle cx="20" cy="4" r="3" fill="var(--brand-primary)" opacity="1">
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="31.5" cy="11.5" r="2.5" fill="var(--brand-primary)" opacity="0.8">
          <animate
            attributeName="opacity"
            values="0.8;0.3;0.8"
            dur="1.5s"
            begin="0.2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="36" cy="20" r="2" fill="var(--brand-primary)" opacity="0.6">
          <animate
            attributeName="opacity"
            values="0.6;0.3;0.6"
            dur="1.5s"
            begin="0.4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="31.5" cy="28.5" r="2.5" fill="var(--brand-primary)" opacity="0.5">
          <animate
            attributeName="opacity"
            values="0.5;0.3;0.5"
            dur="1.5s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="20" cy="36" r="3" fill="var(--brand-primary)" opacity="0.4">
          <animate
            attributeName="opacity"
            values="0.4;0.3;0.4"
            dur="1.5s"
            begin="0.8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="8.5" cy="28.5" r="2.5" fill="var(--brand-primary)" opacity="0.5">
          <animate
            attributeName="opacity"
            values="0.5;0.3;0.5"
            dur="1.5s"
            begin="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="4" cy="20" r="2" fill="var(--brand-primary)" opacity="0.6">
          <animate
            attributeName="opacity"
            values="0.6;0.3;0.6"
            dur="1.5s"
            begin="1.2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="8.5" cy="11.5" r="2.5" fill="var(--brand-primary)" opacity="0.8">
          <animate
            attributeName="opacity"
            values="0.8;0.3;0.8"
            dur="1.5s"
            begin="1.4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// Shimmer Loader Component
function ShimmerLoader() {
  return (
    <div style={{ width: '200px' }}>
      <div
        className="relative overflow-hidden"
        style={{
          width: '200px',
          height: '4px',
          backgroundColor: 'rgba(125, 182, 248, 0.2)',
          borderRadius: 'var(--radius-pill)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '50%',
            background: 'linear-gradient(90deg, transparent, var(--brand-primary), transparent)',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
        />
      </div>
      <p
        className="mt-4 text-center"
        style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--text-muted)',
        }}
      >
        Loading...
      </p>
    </div>
  );
}