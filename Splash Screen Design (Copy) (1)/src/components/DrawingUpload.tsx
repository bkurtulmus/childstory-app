import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { ImageWithLoader } from './figma/ImageWithLoader';

interface Drawing {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
}

interface DrawingUploadProps {
  storyId: string;
  storyTitle: string;
  existingDrawings?: Drawing[];
  onClose: () => void;
  onSave: (drawing: { file: File; url: string }) => void;
  onDelete?: (drawingId: string) => void;
  onSetCover?: (drawingId: string) => void;
}

export function DrawingUpload({
  storyId,
  storyTitle,
  existingDrawings = [],
  onClose,
  onSave,
  onDelete,
  onSetCover,
}: DrawingUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSave = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    onSave({ file: selectedFile, url: previewUrl });
    setIsUploading(false);
    setShowSuccess(true);

    // Reset after success
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedFile(null);
      setPreviewUrl('');
    }, 1500);
  };

  const handleDeleteDrawing = (drawingId: string) => {
    if (onDelete) {
      onDelete(drawingId);
    }
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
          maxHeight: '90vh',
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
          <div>
            <h3>Add Drawing</h3>
            <p
              style={{
                fontSize: 'var(--text-body-sm)',
                color: 'var(--text-secondary)',
                marginTop: '4px',
              }}
            >
              {storyTitle}
            </p>
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
            maxHeight: 'calc(90vh - 80px)',
          }}
        >
          {/* Upload Area */}
          <div className="mb-6">
            <h4
              className="mb-3"
              style={{
                fontSize: 'var(--text-body-md)',
                fontWeight: 'var(--weight-subheading)',
              }}
            >
              Upload Drawing
            </h4>

            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer transition-all"
                style={{
                  padding: '32px',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px dashed ${isDragging ? 'var(--brand-primary)' : 'var(--neutral-300)'}`,
                  backgroundColor: isDragging ? 'rgba(125, 182, 248, 0.08)' : 'var(--neutral-50)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(125, 182, 248, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Upload size={28} style={{ color: 'var(--brand-primary)' }} />
                </div>
                <p
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  Drop your drawing here
                </p>
                <p
                  style={{
                    fontSize: 'var(--text-body-sm)',
                    color: 'var(--text-muted)',
                  }}
                >
                  or click to browse files
                </p>
                <p
                  style={{
                    fontSize: 'var(--text-caption)',
                    color: 'var(--text-muted)',
                    marginTop: '8px',
                  }}
                >
                  Supports JPG, PNG, GIF up to 10MB
                </p>
              </div>
            ) : (
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--neutral-100)',
                }}
              >
                <ImageWithLoader
                  src={previewUrl}
                  alt="Preview"
                  aspectRatio="16/9"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '300px',
                    objectFit: 'contain',
                  }}
                />
                <button
                  onClick={() => {
                    setPreviewUrl('');
                    setSelectedFile(null);
                  }}
                  className="absolute top-2 right-2 transition-opacity hover:opacity-70"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} style={{ color: 'white' }} />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />

            {/* Save Button */}
            {previewUrl && (
              <button
                onClick={handleSave}
                disabled={isUploading || showSuccess}
                className="w-full mt-4 transition-all active:scale-98"
                style={{
                  height: '48px',
                  backgroundColor: showSuccess
                    ? 'var(--semantic-success)'
                    : isUploading
                      ? 'var(--neutral-200)'
                      : 'var(--brand-primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 'var(--weight-medium)',
                  fontSize: 'var(--text-body-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                }}
              >
                {showSuccess ? (
                  <>
                    <Check size={20} />
                    Drawing Saved!
                  </>
                ) : isUploading ? (
                  'Uploading...'
                ) : (
                  'Save Drawing'
                )}
              </button>
            )}
          </div>

          {/* Existing Drawings Gallery */}
          {existingDrawings.length > 0 && (
            <div>
              <h4
                className="mb-3"
                style={{
                  fontSize: 'var(--text-body-md)',
                  fontWeight: 'var(--weight-subheading)',
                }}
              >
                Saved Drawings ({existingDrawings.length})
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                }}
              >
                {existingDrawings.map((drawing) => (
                  <div
                    key={drawing.id}
                    style={{
                      position: 'relative',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      backgroundColor: 'var(--neutral-100)',
                      aspectRatio: '1',
                    }}
                  >
                    <ImageWithLoader
                      src={drawing.url}
                      alt={drawing.filename}
                      aspectRatio="1/1"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <div
                      className="absolute top-2 right-2 flex gap-1"
                    >
                      {onSetCover && (
                        <button
                          onClick={() => onSetCover(drawing.id)}
                          className="transition-opacity hover:opacity-70"
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Set as cover"
                        >
                          <ImageIcon size={14} style={{ color: 'white' }} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => handleDeleteDrawing(drawing.id)}
                          className="transition-opacity hover:opacity-70"
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Delete"
                        >
                          <X size={14} style={{ color: 'white' }} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
