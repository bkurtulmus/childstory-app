import { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Check,
  Play,
  Trash2,
  Mic,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { toast } from '../utils/toast';

interface VoiceClone {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  qualityScore?: number;
  usageCount: number;
  isDefault: boolean;
  createdDate: string;
}

interface VoiceCloningProps {
  onBack: () => void;
}

export function VoiceCloning({ onBack }: VoiceCloningProps) {
  const [voices, setVoices] = useState<VoiceClone[]>([
    {
      id: '1',
      name: 'Mom',
      status: 'ready',
      qualityScore: 95,
      usageCount: 12,
      isDefault: true,
      createdDate: 'Nov 10, 2025',
    },
    {
      id: '2',
      name: 'Dad',
      status: 'ready',
      qualityScore: 88,
      usageCount: 8,
      isDefault: false,
      createdDate: 'Nov 12, 2025',
    },
    {
      id: '3',
      name: 'Grandma',
      status: 'processing',
      usageCount: 0,
      isDefault: false,
      createdDate: 'Nov 15, 2025',
    },
  ]);

  const [showUploadFlow, setShowUploadFlow] = useState(false);

  const handleSetDefault = (voiceId: string) => {
    setVoices((prev) =>
      prev.map((voice) => ({
        ...voice,
        isDefault: voice.id === voiceId,
      }))
    );
  };

  const handleDelete = (voiceId: string) => {
    if (confirm('Are you sure you want to delete this voice clone?')) {
      setVoices((prev) => prev.filter((voice) => voice.id !== voiceId));
    }
  };

  const handleTestVoice = (voiceId: string) => {
    toast.info('Playing test sample', `Testing voice ${voiceId}`);
  };

  const getStatusColor = (status: VoiceClone['status']) => {
    switch (status) {
      case 'ready':
        return 'var(--semantic-success)';
      case 'processing':
        return 'var(--brand-primary)';
      case 'pending':
        return 'var(--neutral-400)';
      case 'failed':
        return 'var(--semantic-error)';
    }
  };

  const getStatusText = (status: VoiceClone['status']) => {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'processing':
        return 'Processing...';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
    }
  };

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
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: '1px solid var(--neutral-100)',
        }}
      >
        <button
          onClick={onBack}
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
          <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
        </button>

        <h2>Voice Cloning</h2>

        <div style={{ width: '40px' }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Info Banner */}
        <div
          className="mb-6 flex items-start gap-3"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(125, 182, 248, 0.08)',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(125, 182, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Mic size={18} style={{ color: 'var(--brand-primary)' }} />
          </div>
          <div>
            <h4
              style={{
                fontSize: 'var(--text-body-md)',
                fontWeight: 'var(--weight-subheading)',
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}
            >
              Create personalized voices
            </h4>
            <p
              style={{
                fontSize: 'var(--text-body-sm)',
                color: 'var(--text-muted)',
              }}
            >
              Record a voice to use for story narration
            </p>
          </div>
        </div>

        {/* Add Voice Button */}
        <button
          onClick={() => setShowUploadFlow(true)}
          className="w-full mb-6 transition-all active:scale-98 flex items-center justify-center gap-2"
          style={{
            height: '48px',
            backgroundColor: 'var(--brand-primary)',
            color: 'white',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 'var(--weight-medium)',
            fontSize: 'var(--text-body-lg)',
          }}
        >
          <Plus size={20} />
          Add Voice
        </button>

        {/* Voice List */}
        <div>
          <h3 className="mb-4">Your Voices ({voices.length})</h3>

          <div className="space-y-3">
            {voices.map((voice) => (
              <div
                key={voice.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#FFFFFF',
                  border: voice.isDefault
                    ? '2px solid var(--brand-primary)'
                    : '1px solid var(--neutral-200)',
                  boxShadow: 'var(--elevation-1)',
                }}
              >
                {/* Voice Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        style={{
                          fontSize: 'var(--text-body-lg)',
                          fontWeight: 'var(--weight-subheading)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {voice.name}
                      </h4>
                      {voice.isDefault && (
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(125, 182, 248, 0.12)',
                            fontSize: 'var(--text-caption)',
                            fontWeight: 'var(--weight-medium)',
                            color: 'var(--brand-primary)',
                          }}
                        >
                          Default
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: getStatusColor(voice.status),
                          }}
                        />
                        <span
                          style={{
                            fontSize: 'var(--text-body-sm)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {getStatusText(voice.status)}
                        </span>
                      </div>

                      {voice.status === 'ready' && voice.qualityScore && (
                        <>
                          <span style={{ color: 'var(--text-muted)' }}>•</span>
                          <span
                            style={{
                              fontSize: 'var(--text-body-sm)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            Quality: {voice.qualityScore}%
                          </span>
                        </>
                      )}

                      <span style={{ color: 'var(--text-muted)' }}>•</span>
                      <span
                        style={{
                          fontSize: 'var(--text-body-sm)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        Used {voice.usageCount}x
                      </span>
                    </div>
                  </div>

                  {voice.status === 'processing' && (
                    <Loader
                      size={20}
                      className="animate-spin"
                      style={{ color: 'var(--brand-primary)' }}
                    />
                  )}
                  {voice.status === 'failed' && (
                    <AlertCircle size={20} style={{ color: 'var(--semantic-error)' }} />
                  )}
                </div>

                {/* Actions */}
                {voice.status === 'ready' && (
                  <div className="flex gap-2">
                    {!voice.isDefault && (
                      <button
                        onClick={() => handleSetDefault(voice.id)}
                        className="flex-1 transition-all hover:opacity-90"
                        style={{
                          height: '36px',
                          backgroundColor: 'transparent',
                          border: '1px solid var(--brand-primary)',
                          color: 'var(--brand-primary)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 'var(--text-body-sm)',
                          fontWeight: 'var(--weight-medium)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <Check size={16} />
                        Set Default
                      </button>
                    )}

                    <button
                      onClick={() => handleTestVoice(voice.id)}
                      className="flex-1 transition-all hover:opacity-90"
                      style={{
                        height: '36px',
                        backgroundColor: 'var(--neutral-100)',
                        border: 'none',
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-body-sm)',
                        fontWeight: 'var(--weight-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Play size={16} />
                      Test
                    </button>

                    <button
                      onClick={() => handleDelete(voice.id)}
                      className="transition-all hover:opacity-90"
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--neutral-200)',
                        color: 'var(--semantic-error)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                {voice.status === 'processing' && (
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(125, 182, 248, 0.08)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        style={{
                          fontSize: 'var(--text-body-sm)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        Creating voice model...
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--text-body-sm)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        ~2 min
                      </span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        backgroundColor: 'var(--neutral-200)',
                        borderRadius: 'var(--radius-pill)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        className="animate-pulse"
                        style={{
                          width: '60%',
                          height: '100%',
                          backgroundColor: 'var(--brand-primary)',
                        }}
                      />
                    </div>
                  </div>
                )}

                {voice.status === 'failed' && (
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: 'var(--text-body-sm)',
                        color: 'var(--semantic-error)',
                        marginBottom: '8px',
                      }}
                    >
                      Voice creation failed. Please try again.
                    </p>
                    <button
                      onClick={() => handleDelete(voice.id)}
                      className="transition-opacity hover:opacity-70"
                      style={{
                        fontSize: 'var(--text-body-sm)',
                        fontWeight: 'var(--weight-medium)',
                        color: 'var(--semantic-error)',
                        textDecoration: 'underline',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom spacing */}
        <div style={{ height: '32px' }} />
      </div>

      {/* Voice Upload Flow Modal */}
      {showUploadFlow && (
        <VoiceUploadFlow
          onClose={() => setShowUploadFlow(false)}
          onComplete={(voiceData) => {
            const newVoice: VoiceClone = {
              id: Date.now().toString(),
              name: voiceData.name,
              status: 'processing',
              usageCount: 0,
              isDefault: false,
              createdDate: 'Just now',
            };
            setVoices((prev) => [...prev, newVoice]);
            setShowUploadFlow(false);
          }}
        />
      )}
    </div>
  );
}

// Voice Upload Flow Component
function VoiceUploadFlow({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: (voiceData: { name: string; audioFile?: File }) => void;
}) {
  const [step, setStep] = useState<'name' | 'record' | 'upload' | 'consent'>('name');
  const [voiceName, setVoiceName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasConsent, setHasConsent] = useState(false);

  const handleNext = () => {
    if (step === 'name' && voiceName.trim()) {
      setStep('record');
    } else if (step === 'record') {
      setStep('consent');
    } else if (step === 'consent' && hasConsent) {
      onComplete({ name: voiceName });
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          maxwidth: '100%',
          maxWidth: 'var(--container-max-width)',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px 24px 0 0',
          maxHeight: '85vh',
          boxShadow: 'var(--elevation-4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: '1px solid var(--neutral-100)',
          }}
        >
          <h3>
            {step === 'name' && 'Name Your Voice'}
            {step === 'record' && 'Record Voice Sample'}
            {step === 'consent' && 'Consent Required'}
          </h3>
          <button
            onClick={onClose}
            className="transition-opacity hover:opacity-70"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--neutral-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto px-6 py-6"
          style={{
            maxHeight: 'calc(85vh - 160px)',
          }}
        >
          {/* Step 1: Name */}
          {step === 'name' && (
            <div>
              <p
                className="mb-4"
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--text-secondary)',
                }}
              >
                Give this voice a memorable name
              </p>
              <input
                type="text"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                placeholder="e.g., Mom, Dad, Grandma"
                className="w-full px-4 py-3 outline-none"
                style={{
                  height: '56px',
                  border: '1px solid var(--neutral-200)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-body-lg)',
                  backgroundColor: '#FFFFFF',
                }}
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Record */}
          {step === 'record' && (
            <div>
              <div
                className="mb-6"
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(125, 182, 248, 0.08)',
                }}
              >
                <h4
                  className="mb-3"
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-subheading)',
                  }}
                >
                  Recording Tips:
                </h4>
                <ul className="space-y-2">
                  <li
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--text-secondary)',
                      paddingLeft: '20px',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: '0',
                        color: 'var(--brand-primary)',
                      }}
                    >
                      •
                    </span>
                    Record at least 30 seconds
                  </li>
                  <li
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--text-secondary)',
                      paddingLeft: '20px',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: '0',
                        color: 'var(--brand-primary)',
                      }}
                    >
                      •
                    </span>
                    Find a quiet environment
                  </li>
                  <li
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--text-secondary)',
                      paddingLeft: '20px',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: '0',
                        color: 'var(--brand-primary)',
                      }}
                    >
                      •
                    </span>
                    Speak clearly and naturally
                  </li>
                </ul>
              </div>

              {/* Waveform Visualization */}
              <div
                className="mb-6 flex items-center justify-center"
                style={{
                  height: '120px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--neutral-100)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {!isRecording ? (
                  <Mic size={48} style={{ color: 'var(--neutral-400)' }} />
                ) : (
                  <div className="flex items-center gap-1 h-full">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse"
                        style={{
                          width: '4px',
                          height: `${20 + Math.random() * 80}%`,
                          backgroundColor: 'var(--brand-primary)',
                          borderRadius: 'var(--radius-sm)',
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Recording duration */}
              {isRecording && (
                <p
                  className="text-center mb-4"
                  style={{
                    fontSize: 'var(--text-body-lg)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--brand-primary)',
                  }}
                >
                  {Math.floor(recordingDuration / 60)}:
                  {(recordingDuration % 60).toString().padStart(2, '0')}
                </p>
              )}

              {/* Record Button */}
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className="w-full transition-all active:scale-98"
                style={{
                  height: '56px',
                  backgroundColor: isRecording ? 'var(--semantic-error)' : 'var(--brand-primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 'var(--weight-medium)',
                  fontSize: 'var(--text-body-lg)',
                }}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            </div>
          )}

          {/* Step 3: Consent */}
          {step === 'consent' && (
            <div>
              <div
                className="mb-6"
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(200, 197, 255, 0.08)',
                  border: '1px solid rgba(200, 197, 255, 0.2)',
                }}
              >
                <h4
                  className="mb-3"
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-subheading)',
                  }}
                >
                  Important Legal Notice
                </h4>
                <p
                  style={{
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                  }}
                >
                  By uploading this voice, you confirm that you are the owner of this voice or
                  have explicit permission to use it for AI voice cloning purposes.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                  className="mt-1"
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: 'var(--brand-primary)',
                  }}
                />
                <span
                  style={{
                    fontSize: 'var(--text-body-md)',
                    color: 'var(--text-primary)',
                  }}
                >
                  I confirm that I own this voice or have permission to use it
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4"
          style={{
            borderTop: '1px solid var(--neutral-100)',
          }}
        >
          <button
            onClick={handleNext}
            disabled={
              (step === 'name' && !voiceName.trim()) ||
              (step === 'consent' && !hasConsent)
            }
            className="w-full transition-all active:scale-98 disabled:opacity-40"
            style={{
              height: '48px',
              backgroundColor:
                (step === 'name' && voiceName.trim()) ||
                  step === 'record' ||
                  (step === 'consent' && hasConsent)
                  ? 'var(--brand-primary)'
                  : 'var(--neutral-300)',
              color: 'white',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-body-lg)',
            }}
          >
            {step === 'consent' ? 'Create Voice' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
