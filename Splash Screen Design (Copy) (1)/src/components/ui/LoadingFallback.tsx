import React from 'react';
import { CircularProgress } from './ProgressIndicator';

/**
 * Loading fallback component for lazy-loaded screens
 */
export function LoadingFallback() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'var(--neutral-50)',
                gap: '16px',
            }}
        >
            <CircularProgress size={48} strokeWidth={4} />
            <p
                style={{
                    fontSize: 'var(--text-body-md)',
                    color: 'var(--text-muted)',
                    margin: 0,
                }}
            >
                Loading...
            </p>
        </div>
    );
}
