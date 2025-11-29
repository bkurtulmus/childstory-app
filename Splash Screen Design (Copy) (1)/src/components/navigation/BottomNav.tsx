import { Home, Sparkles, BookOpen, Users, Settings } from 'lucide-react';
import { useState } from 'react';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: 'home' | 'story-create' | 'stories-library' | 'children-list' | 'settings') => void;
  badges?: {
    home?: number;
    library?: number;
  };
}

export function BottomNav({ currentScreen, onNavigate, badges }: BottomNavProps) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      screen: 'home' as const,
      badge: badges?.home,
    },
    {
      id: 'library',
      label: 'Library',
      icon: BookOpen,
      screen: 'stories-library' as const,
      badge: badges?.library,
    },
    {
      id: 'create',
      label: 'Create',
      icon: Sparkles,
      screen: 'story-create' as const,
      isSpecial: true,
    },
    {
      id: 'family',
      label: 'Family',
      icon: Users,
      screen: 'children-list' as const,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      screen: 'settings' as const,
    },
  ];

  const isActive = (screen: string) => {
    // Handle active states for related screens
    if (screen === 'home') {
      return currentScreen === 'home';
    }
    if (screen === 'story-create') {
      return currentScreen === 'story-create' || currentScreen === 'story-result';
    }
    if (screen === 'stories-library') {
      return currentScreen === 'stories-library' || 
             currentScreen === 'story-reader' || 
             currentScreen === 'story-series' ||
             currentScreen === 'favorites';
    }
    if (screen === 'children-list') {
      return currentScreen === 'children-list' || 
             currentScreen === 'child-create' || 
             currentScreen === 'child-edit';
    }
    if (screen === 'settings') {
      return currentScreen === 'settings' || 
             currentScreen === 'voice-cloning' ||
             currentScreen === 'subscription-status' ||
             currentScreen === 'subscription-plans' ||
             currentScreen === 'checkout' ||
             currentScreen === 'stats' ||
             currentScreen === 'expenses' ||
             currentScreen === 'expense-add' ||
             currentScreen === 'expense-edit';
    }
    return false;
  };

  // Haptic feedback (if supported)
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // 10ms gentle vibration
    }
  };

  const handleTabPress = (screen: 'home' | 'story-create' | 'stories-library' | 'children-list' | 'settings') => {
    triggerHaptic();
    onNavigate(screen);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-center z-40"
      role="navigation"
      aria-label="Bottom navigation"
      style={{
        backgroundColor: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <div
        className="relative flex justify-around items-center safe-bottom-padding"
        style={{
          width: '100%',
          maxWidth: 'var(--container-max-width)',
          height: 'calc(64px + var(--safe-area-bottom))',
          paddingBottom: 'var(--safe-area-bottom)',
          paddingLeft: 'var(--safe-area-left)',
          paddingRight: 'var(--safe-area-right)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderTop: '1px solid var(--neutral-200)',
          boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.06)',
          pointerEvents: 'auto',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.screen);

          // Special styling for Create tab
          if (tab.isSpecial) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabPress(tab.screen)}
                className="flex flex-col items-center justify-center transition-all relative hit-48"
                style={{
                  minWidth: '68px',
                  minHeight: '48px',
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label={tab.label}
                aria-current={active ? 'page' : undefined}
              >
                {/* Special Create Button */}
                <div
                  className="transition-all"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: active
                      ? 'linear-gradient(135deg, #7DB6F8 0%, #C8C5FF 100%)'
                      : 'var(--brand-primary)',
                    boxShadow: active ? 'var(--elevation-3)' : 'var(--elevation-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: active ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  }}
                >
                  <Icon
                    size={24}
                    aria-hidden="true"
                    focusable="false"
                    style={{
                      color: 'white',
                      strokeWidth: 2.5,
                    }}
                  />
                </div>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabPress(tab.screen)}
              className="flex flex-col items-center justify-center transition-all relative hit-48"
              style={{
                minWidth: '64px',
                minHeight: '48px',
                padding: '6px 12px',
                backgroundColor: active ? 'rgba(125, 182, 248, 0.08)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              {/* Badge Indicator */}
              {tab.badge && tab.badge > 0 && (
                <div
                  className="absolute"
                  style={{
                    top: '4px',
                    right: '8px',
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                    backgroundColor: 'var(--semantic-error)',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'var(--weight-medium)',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {tab.badge > 9 ? '9+' : tab.badge}
                </div>
              )}

              <Icon
                size={22}
                aria-hidden="true"
                focusable="false"
                style={{
                  color: active ? 'var(--brand-primary)' : 'var(--text-muted)',
                  strokeWidth: active ? 2.5 : 2,
                  marginBottom: '4px',
                  transition: 'all 0.2s ease',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: active ? 'var(--weight-medium)' : 'var(--weight-body)',
                  color: active ? 'var(--brand-primary)' : 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
