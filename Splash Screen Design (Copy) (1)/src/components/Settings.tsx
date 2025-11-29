import { useState } from 'react';
import {
  ArrowLeft,
  User,
  LogOut,
  Globe,
  Moon,
  Bell,
  Shield,
  FileText,
  Download,
  Trash2,
  HelpCircle,
  Mail,
  Info,
  ChevronRight,
  Check,
  X,
  Mic,
  Sparkles,
  Sun
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { toast } from '../utils/toast';

interface SettingsProps {
  userName: string;
  userContact: string;
  onBack: () => void;
  onSignOut: () => void;
  onVoiceCloning?: () => void;
}

export function Settings({ userName, userContact, onBack, onSignOut, onVoiceCloning }: SettingsProps) {
  const { theme, toggleTheme } = useTheme();
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [showDeleteFlow, setShowDeleteFlow] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showAbout, setShowAbout] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'];

  const handleSignOut = () => {
    setShowSignOutModal(false);
    onSignOut();
  };

  const handleDeleteAccount = () => {
    if (deleteStep === 1) {
      setDeleteStep(2);
    } else if (deleteStep === 2 && deleteConfirmText === 'DELETE') {
      // Process deletion
      toast.success('Account deleted', 'Your account has been permanently deleted.');
      setShowDeleteFlow(false);
      onSignOut();
    }
  };

  const handleExportData = () => {
    toast.info('Export requested', 'You will receive an email with your data shortly.');
  };

  if (showAbout) {
    return <AboutScreen onBack={() => setShowAbout(false)} />;
  }

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
            width: '44px',
            height: '44px',
            backgroundColor: 'transparent',
          }}
          aria-label="Back"
        >
          <ArrowLeft size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
        <h2>Settings</h2>
        <div style={{ width: '44px' }} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '96px' }}>
        {/* Account Card with Friendly Illustration */}
        <div className="px-6 pt-6 pb-4">
          <div
            style={{
              padding: '20px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--elevation-1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Friendly Character Illustration - Top Right */}
            <div style={{ position: 'absolute', top: '12px', right: '12px', opacity: 0.6 }}>
              <FriendlyUserIllustration />
            </div>

            <div className="flex items-center">
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(125, 182, 248, 0.15)',
                  fontSize: '24px',
                  fontWeight: 'var(--weight-heading)',
                  color: 'var(--brand-primary)',
                  border: '2px solid rgba(125, 182, 248, 0.3)',
                }}
              >
                {userName.charAt(0)}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="mb-1">{userName}</h3>
                <p
                  style={{
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                  }}
                >
                  {userContact}
                </p>
                <button
                  className="transition-smooth hover:opacity-70"
                  style={{
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--brand-primary)',
                    backgroundColor: 'transparent',
                  }}
                >
                  Manage account →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Cloning CTA - Prominent & Exciting */}
        {onVoiceCloning && (
          <div className="px-6 pb-4">
            <button
              onClick={onVoiceCloning}
              className="w-full transition-smooth active:scale-press"
              style={{
                padding: '20px',
                backgroundColor: 'rgba(200, 197, 255, 0.15)',
                borderRadius: 'var(--radius-lg)',
                border: '2px solid rgba(200, 197, 255, 0.3)',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Badge - "New Feature" */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 12px',
                  backgroundColor: 'var(--brand-enchant)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(200, 197, 255, 0.4)',
                }}
              >
                ✨ New
              </div>

              {/* Content */}
              <div className="flex items-start gap-4">
                {/* Icon with glow */}
                <div
                  className="shrink-0"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(200, 197, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(200, 197, 255, 0.3)',
                  }}
                >
                  <Mic size={28} style={{ color: 'var(--brand-enchant)' }} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      style={{
                        fontSize: 'var(--text-body-lg)',
                        fontWeight: 'var(--weight-subheading)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      Voice Cloning
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                    }}
                  >
                    Create stories narrated in your own voice! A magical way to share bedtime stories.
                  </p>

                  {/* CTA Text */}
                  <div
                    className="mt-3 flex items-center gap-1"
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      fontWeight: 'var(--weight-medium)',
                      color: 'var(--brand-enchant)',
                    }}
                  >
                    Get started <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Settings Sections */}
        <div className="px-6 py-4">
          {/* Account Section */}
          <h4
            className="mb-3"
            style={{
              fontSize: 'var(--text-body-sm)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Account
          </h4>
          <div
            className="mb-6"
            style={{
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            <SettingsRow
              icon={<User size={20} style={{ color: 'var(--brand-primary)' }} />}
              label="Manage account"
              onClick={() => toast.info('Account management', 'This feature is coming soon.')}
            />
            <Divider />
            <SettingsRow
              icon={<LogOut size={20} style={{ color: 'var(--semantic-error)' }} />}
              label="Sign out"
              labelColor="var(--semantic-error)"
              showChevron={false}
              onClick={() => setShowSignOutModal(true)}
            />
          </div>

          {/* Preferences Section */}
          <h4
            className="mb-3"
            style={{
              fontSize: 'var(--text-body-sm)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Preferences
          </h4>
          <div
            className="mb-6"
            style={{
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            <SettingsRow
              icon={<Globe size={20} style={{ color: 'var(--brand-primary)' }} />}
              label="Language"
              trailing={selectedLanguage}
              onClick={() => setShowLanguageSheet(true)}
            />
            <Divider />
            <SettingsRow
              icon={theme === 'dark' ? <Sun size={20} style={{ color: 'var(--brand-primary)' }} /> : <Moon size={20} style={{ color: 'var(--brand-primary)' }} />}
              label="Dark Mode"
              showChevron={false}
              trailing={
                <ToggleSwitch
                  enabled={theme === 'dark'}
                  onChange={toggleTheme}
                />
              }
            />
            <Divider />
            <SettingsRow
              icon={<Bell size={20} style={{ color: 'var(--brand-primary)' }} />}
              label="Notifications"
              showChevron={false}
              trailing={
                <ToggleSwitch
                  enabled={notificationsEnabled}
                  onChange={setNotificationsEnabled}
                />
              }
            />
          </div>

          {/* Privacy & Data Section */}
          <h4
            className="mb-3"
            style={{
              fontSize: 'var(--text-body-sm)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Privacy & Data
          </h4>
          <div
            className="mb-6"
            style={{
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            <SettingsRow
              icon={<Shield size={20} style={{ color: 'var(--brand-accent)' }} />}
              label="Privacy policy"
              onClick={() => toast.info('Privacy Policy')}
            />
            <Divider />
            <SettingsRow
              icon={<FileText size={20} style={{ color: 'var(--brand-accent)' }} />}
              label="Terms of service"
              onClick={() => toast.info('Terms of Service')}
            />
            <Divider />
            <SettingsRow
              icon={<Download size={20} style={{ color: 'var(--brand-accent)' }} />}
              label="Export data"
              onClick={handleExportData}
            />
            <Divider />
            <SettingsRow
              icon={<Trash2 size={20} style={{ color: 'var(--semantic-error)' }} />}
              label="Delete account"
              labelColor="var(--semantic-error)"
              onClick={() => setShowDeleteFlow(true)}
            />
          </div>

          {/* Support Section */}
          <h4
            className="mb-3"
            style={{
              fontSize: 'var(--text-body-sm)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Support
          </h4>
          <div
            className="mb-6"
            style={{
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            <SettingsRow
              icon={<HelpCircle size={20} style={{ color: 'var(--brand-secondary)' }} />}
              label="Help center"
              onClick={() => toast.info('Help Center', 'Opening help documentation...')}
            />
            <Divider />
            <SettingsRow
              icon={<Mail size={20} style={{ color: 'var(--brand-secondary)' }} />}
              label="Contact us"
              onClick={() => toast.info('Contact Us', 'Opening contact form...')}
            />
            <Divider />
            <SettingsRow
              icon={<Info size={20} style={{ color: 'var(--brand-secondary)' }} />}
              label="About"
              onClick={() => setShowAbout(true)}
            />
          </div>

          {/* App Version */}
          <div
            className="text-center py-4"
            style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--text-muted)',
            }}
          >
            ChildStory v1.0.0
          </div>
        </div>
      </div>

      {/* Sign Out Modal */}
      {showSignOutModal && (
        <Modal
          title="Sign out?"
          message="You can always sign back in later"
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOutModal(false)}
          confirmText="Sign out"
          confirmColor="var(--semantic-error)"
        />
      )}

      {/* Language Sheet */}
      {showLanguageSheet && (
        <BottomSheet
          title="Language"
          onClose={() => setShowLanguageSheet(false)}
        >
          {languages.map((lang) => (
            <SheetOption
              key={lang}
              label={lang}
              selected={selectedLanguage === lang}
              onClick={() => {
                setSelectedLanguage(lang);
                setShowLanguageSheet(false);
              }}
            />
          ))}
        </BottomSheet>
      )}

      {/* Delete Account Flow */}
      {showDeleteFlow && (
        <DeleteAccountFlow
          step={deleteStep}
          confirmText={deleteConfirmText}
          onConfirmTextChange={setDeleteConfirmText}
          onNext={handleDeleteAccount}
          onCancel={() => {
            setShowDeleteFlow(false);
            setDeleteStep(1);
            setDeleteConfirmText('');
          }}
        />
      )}
    </div>
  );
}

// Friendly User Illustration
function FriendlyUserIllustration() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      {/* Happy character */}
      <circle cx="30" cy="25" r="12" fill="#7DB6F8" opacity="0.2" />
      <circle cx="27" cy="23" r="1.5" fill="#7DB6F8" />
      <circle cx="33" cy="23" r="1.5" fill="#7DB6F8" />
      <path d="M 25 27 Q 30 30 35 27" stroke="#7DB6F8" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Book */}
      <rect x="20" y="38" width="20" height="14" rx="2" fill="#B3E6C5" opacity="0.3" />
      <line x1="30" y1="38" x2="30" y2="52" stroke="#667085" strokeWidth="1" opacity="0.3" />

      {/* Sparkle */}
      <path
        d="M 48 15 L 49 18 L 52 19 L 49 20 L 48 23 L 47 20 L 44 19 L 47 18 Z"
        fill="#F6A6D7"
        opacity="0.6"
      >
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

// Settings Row Component
function SettingsRow({
  icon,
  label,
  labelColor,
  trailing,
  showChevron = true,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  labelColor?: string;
  trailing?: React.ReactNode;
  showChevron?: boolean;
  onClick?: () => void;
}) {
  const isInteractive = typeof onClick === 'function';

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className="w-full flex items-center gap-3 px-4 py-4 transition-colors hover:bg-gray-50"
      style={{
        backgroundColor: 'transparent',
        textAlign: 'left',
        cursor: isInteractive ? 'pointer' : 'default',
      }}
    >
      <div className="shrink-0">{icon}</div>
      <div
        className="flex-1"
        style={{
          fontSize: 'var(--text-body-md)',
          color: labelColor || 'var(--text-primary)',
          fontWeight: 'var(--weight-regular)',
        }}
      >
        {label}
      </div>
      {trailing && (
        <div
          style={{
            fontSize: 'var(--text-body-sm)',
            color: 'var(--text-muted)',
          }}
        >
          {trailing}
        </div>
      )}
      {showChevron && !trailing && (
        <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
      )}
    </div>
  );
}

// Divider
function Divider() {
  return (
    <div
      style={{
        height: '1px',
        backgroundColor: 'var(--neutral-100)',
        marginLeft: '52px',
      }}
    />
  );
}

// Toggle Switch
function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="transition-smooth"
      style={{
        width: '48px',
        height: '28px',
        borderRadius: '14px',
        backgroundColor: enabled ? 'var(--brand-accent)' : 'var(--neutral-200)',
        position: 'relative',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <div
        className="transition-smooth"
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          top: '2px',
          left: enabled ? '22px' : '2px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      />
    </button>
  );
}

// Modal
function Modal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  confirmColor,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  confirmColor?: string;
}) {
  return (
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
        <h3 className="mb-3 text-center">{title}</h3>
        <p
          className="text-center mb-6"
          style={{
            fontSize: 'var(--text-body-md)',
            color: 'var(--text-secondary)',
          }}
        >
          {message}
        </p>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full transition-smooth active:scale-press btn-center"
            style={{
              height: '48px',
              backgroundColor: confirmColor || 'var(--brand-primary)',
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-md)',
            }}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full transition-smooth active:scale-press btn-center"
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
  );
}

// Bottom Sheet
function BottomSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
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
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <h3 className="mb-4 text-center">{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
}

// Sheet Option
function SheetOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-4 transition-colors hover:bg-gray-50"
      style={{
        backgroundColor: selected ? 'rgba(125, 182, 248, 0.08)' : 'transparent',
        borderRadius: 'var(--radius-md)',
        marginBottom: '8px',
      }}
    >
      <span
        style={{
          fontSize: 'var(--text-body-md)',
          color: 'var(--text-primary)',
          fontWeight: selected ? 'var(--weight-medium)' : 'var(--weight-regular)',
        }}
      >
        {label}
      </span>
      {selected && <Check size={20} style={{ color: 'var(--brand-primary)' }} />}
    </button>
  );
}

// Delete Account Flow
function DeleteAccountFlow({
  step,
  confirmText,
  onConfirmTextChange,
  onNext,
  onCancel,
}: {
  step: number;
  confirmText: string;
  onConfirmTextChange: (val: string) => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: '340px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
        }}
      >
        {step === 1 ? (
          <>
            <h3 className="mb-3 text-center">Delete account?</h3>
            <p
              className="text-center mb-6"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              This will permanently delete your account and all your children's stories. This action cannot be undone.
            </p>

            <div className="space-y-3">
              <button
                onClick={onNext}
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
                Continue
              </button>
              <button
                onClick={onCancel}
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
          </>
        ) : (
          <>
            <h3 className="mb-3 text-center">Final confirmation</h3>
            <p
              className="text-center mb-4"
              style={{
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-secondary)',
              }}
            >
              Type <strong>DELETE</strong> to confirm
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => onConfirmTextChange(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 mb-6 outline-none"
              style={{
                height: '48px',
                border: '1px solid var(--neutral-200)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-body-md)',
                color: 'var(--text-primary)',
              }}
            />

            <div className="space-y-3">
              <button
                onClick={onNext}
                disabled={confirmText !== 'DELETE'}
                className="w-full transition-smooth active:scale-press disabled:opacity-40"
                style={{
                  height: '48px',
                  backgroundColor: 'var(--semantic-error)',
                  color: 'white',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 'var(--weight-medium)',
                  fontSize: 'var(--text-body-md)',
                }}
              >
                Delete Account
              </button>
              <button
                onClick={onCancel}
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
          </>
        )}
      </div>
    </div>
  );
}

// About Screen
function AboutScreen({ onBack }: { onBack: () => void }) {
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
            width: '44px',
            height: '44px',
            backgroundColor: 'transparent',
          }}
        >
          <ArrowLeft size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
        <h2>About</h2>
        <div style={{ width: '44px' }} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="text-center mb-6">
          <div className="mb-4">
            <Sparkles size={48} style={{ color: 'var(--brand-enchant)', margin: '0 auto' }} />
          </div>
          <h1 className="mb-2">ChildStory</h1>
          <p
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-secondary)',
            }}
          >
            Version 1.0.0
          </p>
        </div>

        <div
          className="mb-6 p-4"
          style={{
            backgroundColor: 'rgba(200, 197, 255, 0.1)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <p
            style={{
              fontSize: 'var(--text-body-md)',
              color: 'var(--text-primary)',
              lineHeight: '1.6',
              textAlign: 'center',
            }}
          >
            Creating magical, personalized stories for children around the world. Every story is crafted with love and care.
          </p>
        </div>

        <div className="space-y-4">
          <InfoRow label="Developer" value="ChildStory Inc." />
          <InfoRow label="Email" value="hello@childstory.app" />
          <InfoRow label="Website" value="childstory.app" />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3">
      <span
        style={{
          fontSize: 'var(--text-body-md)',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 'var(--text-body-md)',
          color: 'var(--text-primary)',
          fontWeight: 'var(--weight-medium)',
        }}
      >
        {value}
      </span>
    </div>
  );
}