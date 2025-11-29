import { useState } from 'react';
import { X, FileText, Download, Check } from 'lucide-react';

interface PDFExportOptionsProps {
  storyTitle: string;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

export interface ExportOptions {
  includeImages: boolean;
  includeAudioTranscript: boolean;
  pageSize: 'A4' | 'Letter';
  fontSize: 'Small' | 'Medium' | 'Large';
  includeMetadata: boolean;
}

export function PDFExportOptions({
  storyTitle,
  onClose,
  onExport,
}: PDFExportOptionsProps) {
  const [options, setOptions] = useState<ExportOptions>({
    includeImages: true,
    includeAudioTranscript: false,
    pageSize: 'A4',
    fontSize: 'Medium',
    includeMetadata: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate PDF generation with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setIsComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownload = () => {
    onExport(options);
    // Reset and close after a short delay
    setTimeout(() => {
      setIsComplete(false);
      setProgress(0);
      onClose();
    }, 500);
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
          maxWidth: '390px',
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
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(125, 182, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={20} style={{ color: 'var(--brand-primary)' }} />
            </div>
            <div>
              <h3>Export as PDF</h3>
              <p
                style={{
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--text-secondary)',
                  marginTop: '2px',
                }}
              >
                {storyTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="transition-opacity hover:opacity-70"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--neutral-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto px-6 py-6"
          style={{
            maxHeight: 'calc(85vh - 80px - 80px)',
          }}
        >
          {/* Export Options */}
          {!isGenerating && !isComplete && (
            <div className="space-y-6">
              {/* Include Images */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeImages}
                  onChange={(e) =>
                    setOptions({ ...options, includeImages: e.target.checked })
                  }
                  className="mt-1"
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: 'var(--brand-primary)',
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 'var(--text-body-md)',
                      fontWeight: 'var(--weight-medium)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Include Images
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    Add story illustrations to PDF
                  </p>
                </div>
              </label>

              {/* Include Audio Transcript */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeAudioTranscript}
                  onChange={(e) =>
                    setOptions({ ...options, includeAudioTranscript: e.target.checked })
                  }
                  className="mt-1"
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: 'var(--brand-primary)',
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 'var(--text-body-md)',
                      fontWeight: 'var(--weight-medium)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Include Audio Transcript
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    Add narration text at the end
                  </p>
                </div>
              </label>

              {/* Include Metadata */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeMetadata}
                  onChange={(e) =>
                    setOptions({ ...options, includeMetadata: e.target.checked })
                  }
                  className="mt-1"
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: 'var(--brand-primary)',
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 'var(--text-body-md)',
                      fontWeight: 'var(--weight-medium)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Include Child's Name & Date
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--text-body-sm)',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}
                  >
                    Show story details on cover page
                  </p>
                </div>
              </label>

              {/* Divider */}
              <div
                style={{
                  height: '1px',
                  backgroundColor: 'var(--neutral-100)',
                  margin: '8px 0',
                }}
              />

              {/* Page Size */}
              <div>
                <label
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-subheading)',
                    color: 'var(--text-primary)',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  Page Size
                </label>
                <div className="flex gap-3">
                  {(['A4', 'Letter'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setOptions({ ...options, pageSize: size })}
                      className="flex-1 transition-all"
                      style={{
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${
                          options.pageSize === size
                            ? 'var(--brand-primary)'
                            : 'var(--neutral-200)'
                        }`,
                        backgroundColor:
                          options.pageSize === size
                            ? 'rgba(125, 182, 248, 0.08)'
                            : 'transparent',
                        color:
                          options.pageSize === size
                            ? 'var(--brand-primary)'
                            : 'var(--text-primary)',
                        fontWeight: 'var(--weight-medium)',
                        fontSize: 'var(--text-body-md)',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-subheading)',
                    color: 'var(--text-primary)',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  Font Size
                </label>
                <div className="flex gap-3">
                  {(['Small', 'Medium', 'Large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setOptions({ ...options, fontSize: size })}
                      className="flex-1 transition-all"
                      style={{
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${
                          options.fontSize === size
                            ? 'var(--brand-primary)'
                            : 'var(--neutral-200)'
                        }`,
                        backgroundColor:
                          options.fontSize === size
                            ? 'rgba(125, 182, 248, 0.08)'
                            : 'transparent',
                        color:
                          options.fontSize === size
                            ? 'var(--brand-primary)'
                            : 'var(--text-primary)',
                        fontWeight: 'var(--weight-medium)',
                        fontSize: 'var(--text-body-md)',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Generating State */}
          {isGenerating && (
            <div className="text-center py-8">
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(125, 182, 248, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <FileText size={28} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <h3 className="mb-2">Generating PDF...</h3>
              <p
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--text-secondary)',
                  marginBottom: '24px',
                }}
              >
                {progress}% complete
              </p>
              {/* Progress Bar */}
              <div
                style={{
                  height: '8px',
                  backgroundColor: 'var(--neutral-200)',
                  borderRadius: 'var(--radius-pill)',
                  overflow: 'hidden',
                  maxWidth: '240px',
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: 'var(--brand-primary)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          )}

          {/* Success State */}
          {isComplete && (
            <div className="text-center py-8">
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(179, 230, 197, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <Check size={32} style={{ color: 'var(--semantic-success)' }} />
              </div>
              <h3 className="mb-2">PDF Ready!</h3>
              <p
                style={{
                  fontSize: 'var(--text-body-md)',
                  color: 'var(--text-secondary)',
                }}
              >
                Your PDF has been generated successfully
              </p>
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
          {!isGenerating && !isComplete && (
            <button
              onClick={handleGenerate}
              className="w-full transition-all active:scale-98"
              style={{
                height: '48px',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-lg)',
              }}
            >
              Generate PDF
            </button>
          )}

          {isComplete && (
            <button
              onClick={handleDownload}
              className="w-full transition-all active:scale-98 flex items-center justify-center gap-2"
              style={{
                height: '48px',
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 'var(--weight-medium)',
                fontSize: 'var(--text-body-lg)',
              }}
            >
              <Download size={20} />
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
