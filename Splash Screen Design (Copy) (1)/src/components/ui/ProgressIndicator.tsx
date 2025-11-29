import React from 'react';

interface ProgressIndicatorProps {
    progress: number; // 0-100
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    showPercentage?: boolean;
}

/**
 * Progress indicator component for long-running operations
 */
export function ProgressIndicator({
    progress,
    label,
    size = 'md',
    showPercentage = true,
}: ProgressIndicatorProps) {
    const heights = {
        sm: '4px',
        md: '8px',
        lg: '12px',
    };

    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div style={{ width: '100%' }}>
            {(label || showPercentage) && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                    }}
                >
                    {label && (
                        <span
                            style={{
                                fontSize: 'var(--text-body-sm)',
                                fontWeight: 'var(--weight-medium)',
                                color: 'var(--text-primary)',
                            }}
                        >
                            {label}
                        </span>
                    )}
                    {showPercentage && (
                        <span
                            style={{
                                fontSize: 'var(--text-body-sm)',
                                fontWeight: 'var(--weight-medium)',
                                color: 'var(--brand-primary)',
                            }}
                        >
                            {Math.round(clampedProgress)}%
                        </span>
                    )}
                </div>
            )}

            <div
                style={{
                    width: '100%',
                    height: heights[size],
                    backgroundColor: 'var(--neutral-200)',
                    borderRadius: 'var(--radius-pill)',
                    overflow: 'hidden',
                }}
                role="progressbar"
                aria-valuenow={clampedProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={label || 'Progress'}
            >
                <div
                    style={{
                        width: `${clampedProgress}%`,
                        height: '100%',
                        backgroundColor: 'var(--brand-primary)',
                        borderRadius: 'var(--radius-pill)',
                        transition: 'width 0.3s ease',
                    }}
                />
            </div>
        </div>
    );
}

interface CircularProgressProps {
    size?: number;
    strokeWidth?: number;
    progress?: number; // 0-100, undefined for indeterminate
}

/**
 * Circular progress indicator (spinner)
 */
export function CircularProgress({
    size = 40,
    strokeWidth = 4,
    progress,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = progress !== undefined
        ? circumference - (progress / 100) * circumference
        : 0;

    return (
        <svg
            width={size}
            height={size}
            style={{
                animation: progress === undefined ? 'spin 1s linear infinite' : 'none',
            }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            {/* Background circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--neutral-200)"
                strokeWidth={strokeWidth}
            />

            {/* Progress circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--brand-primary)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%',
                    transition: 'stroke-dashoffset 0.3s ease',
                }}
            />
        </svg>
    );
}
