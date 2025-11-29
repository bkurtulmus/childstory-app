import React from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * Confirmation dialog for destructive actions
 */
export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const variantColors = {
        danger: {
            bg: 'rgba(239, 68, 68, 0.1)',
            border: 'var(--semantic-error)',
            button: 'var(--semantic-error)',
        },
        warning: {
            bg: 'rgba(245, 158, 11, 0.1)',
            border: 'var(--semantic-warning)',
            button: 'var(--semantic-warning)',
        },
        info: {
            bg: 'rgba(96, 165, 250, 0.1)',
            border: 'var(--semantic-info)',
            button: 'var(--semantic-info)',
        },
    };

    const colors = variantColors[variant];

    return (
        <>
            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 1000,
                    animation: 'fadeIn 0.2s ease-out',
                }}
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div
                role="alertdialog"
                aria-labelledby="dialog-title"
                aria-describedby="dialog-message"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '400px',
                    backgroundColor: 'var(--neutral-50)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--elevation-3)',
                    zIndex: 1001,
                    animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '24px 24px 16px',
                        borderBottom: `1px solid ${colors.border}`,
                        backgroundColor: colors.bg,
                    }}
                >
                    <h2
                        id="dialog-title"
                        style={{
                            fontSize: 'var(--text-h2)',
                            fontWeight: 'var(--weight-heading)',
                            color: 'var(--text-primary)',
                            margin: 0,
                        }}
                    >
                        {title}
                    </h2>
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                    <p
                        id="dialog-message"
                        style={{
                            fontSize: 'var(--text-body-md)',
                            color: 'var(--text-secondary)',
                            lineHeight: 'var(--line-height-relaxed)',
                            margin: 0,
                        }}
                    >
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '16px 24px 24px',
                        justifyContent: 'flex-end',
                    }}
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--neutral-300)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--text-body-md)',
                            fontWeight: 'var(--weight-medium)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        className="hover:bg-neutral-100"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: colors.button,
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--text-body-md)',
                            fontWeight: 'var(--weight-medium)',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                        className="active:scale-press"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
        </>
    );
}
