import React, { useState, useId } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    error?: string;
    touched?: boolean;
    required?: boolean;
    placeholder?: string;
    helpText?: string;
    icon?: React.ReactNode;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Enhanced form field component with validation feedback
 */
export function FormField({
    label,
    name,
    type = 'text',
    value,
    error,
    touched,
    required,
    placeholder,
    helpText,
    icon,
    onChange,
    onBlur,
    onFocus,
}: FormFieldProps) {
    const [isFocused, setIsFocused] = useState(false);
    const fieldId = useId();
    const errorId = useId();
    const helpId = useId();

    const showError = touched && error;
    const showSuccess = touched && !error && value;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    return (
        <div className="form-field" style={{ marginBottom: '16px' }}>
            {/* Label */}
            <label
                htmlFor={fieldId}
                style={{
                    display: 'block',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                }}
            >
                {label}
                {required && (
                    <span
                        style={{ color: 'var(--semantic-error)', marginLeft: '4px' }}
                        aria-label="required"
                    >
                        *
                    </span>
                )}
            </label>

            {/* Input Container */}
            <div style={{ position: 'relative' }}>
                {/* Icon */}
                {icon && (
                    <div
                        style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: isFocused
                                ? 'var(--brand-primary)'
                                : showError
                                    ? 'var(--semantic-error)'
                                    : 'var(--text-muted)',
                            transition: 'color 0.2s',
                            pointerEvents: 'none',
                        }}
                    >
                        {icon}
                    </div>
                )}

                {/* Input */}
                <input
                    id={fieldId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    aria-invalid={showError ? 'true' : 'false'}
                    aria-describedby={
                        showError ? errorId : helpText ? helpId : undefined
                    }
                    aria-required={required}
                    className="w-full transition-all duration-200"
                    style={{
                        height: '52px',
                        paddingLeft: icon ? '48px' : '16px',
                        paddingRight: showSuccess || showError ? '48px' : '16px',
                        backgroundColor: '#FFFFFF',
                        border: showError
                            ? '2px solid var(--semantic-error)'
                            : isFocused
                                ? '2px solid var(--brand-primary)'
                                : '1px solid var(--neutral-200)',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: 'var(--text-body-md)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        boxShadow: isFocused
                            ? '0 0 0 4px rgba(125, 182, 248, 0.15)'
                            : showError
                                ? '0 0 0 4px rgba(239, 68, 68, 0.1)'
                                : 'none',
                    }}
                />

                {/* Success/Error Icon */}
                {(showSuccess || showError) && (
                    <div
                        style={{
                            position: 'absolute',
                            right: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                        }}
                    >
                        {showSuccess && (
                            <Check size={20} style={{ color: 'var(--semantic-success)' }} />
                        )}
                        {showError && (
                            <AlertCircle size={20} style={{ color: 'var(--semantic-error)' }} />
                        )}
                    </div>
                )}
            </div>

            {/* Help Text */}
            {helpText && !showError && (
                <p
                    id={helpId}
                    style={{
                        marginTop: '6px',
                        fontSize: 'var(--text-caption)',
                        color: 'var(--text-muted)',
                    }}
                >
                    {helpText}
                </p>
            )}

            {/* Error Message */}
            {showError && (
                <div
                    id={errorId}
                    role="alert"
                    className="animate-fade-in"
                    style={{
                        marginTop: '6px',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '3px solid var(--semantic-error)',
                    }}
                >
                    <p
                        style={{
                            fontSize: 'var(--text-caption)',
                            color: 'var(--semantic-error)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <AlertCircle size={14} />
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
}
