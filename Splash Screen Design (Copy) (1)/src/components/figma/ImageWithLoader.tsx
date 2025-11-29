import React, { useState, useEffect } from 'react';

const ERROR_IMG_SRC =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

type LoadingState = 'loading' | 'loaded' | 'error';

export interface ImageWithLoaderProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
    src: string;
    alt: string;
    aspectRatio?: string; // e.g., "16/9", "1/1", "4/3"
    showSkeleton?: boolean;
    fadeInDuration?: number; // in milliseconds
    skeletonClassName?: string;
    onLoadComplete?: () => void;
    onLoadError?: () => void;
}

/**
 * Enhanced image component with loading states
 * - Shows skeleton loader while loading
 * - Smooth fade-in animation when loaded
 * - Error fallback with icon
 * - Prevents layout shift with aspect ratio
 */
export function ImageWithLoader({
    src,
    alt,
    aspectRatio,
    showSkeleton = true,
    fadeInDuration = 300,
    className = '',
    style,
    skeletonClassName = '',
    onLoadComplete,
    onLoadError,
    ...rest
}: ImageWithLoaderProps) {
    const [loadingState, setLoadingState] = useState<LoadingState>('loading');

    // Reset loading state when src changes
    useEffect(() => {
        setLoadingState('loading');
    }, [src]);

    const handleLoad = () => {
        setLoadingState('loaded');
        onLoadComplete?.();
    };

    const handleError = () => {
        setLoadingState('error');
        onLoadError?.();
    };

    // Container styles
    const containerStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        ...(aspectRatio && { aspectRatio }),
        ...style,
    };

    // Image styles with fade-in animation
    const imageStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: loadingState === 'loaded' ? 1 : 0,
        transition: `opacity ${fadeInDuration}ms ease-in-out`,
    };

    // Skeleton styles
    const skeletonStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        backgroundImage: 'linear-gradient(90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite',
    };

    return (
        <div className={`image-with-loader ${className}`} style={containerStyle}>
            {/* Skeleton loader */}
            {loadingState === 'loading' && showSkeleton && (
                <div
                    className={`skeleton ${skeletonClassName}`}
                    style={skeletonStyle}
                    aria-label="Loading image"
                    role="status"
                />
            )}

            {/* Actual image */}
            {loadingState !== 'error' && (
                <img
                    src={src}
                    alt={alt}
                    style={imageStyle}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading="lazy"
                    {...rest}
                />
            )}

            {/* Error fallback */}
            {loadingState === 'error' && (
                <div
                    className="error-fallback"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                    }}
                >
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                        <img
                            src={ERROR_IMG_SRC}
                            alt="Error loading image"
                            style={{ width: '64px', height: '64px', opacity: 0.3 }}
                            data-original-url={src}
                        />
                        <p
                            style={{
                                marginTop: '8px',
                                fontSize: '12px',
                                color: '#999',
                            }}
                        >
                            Image unavailable
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Re-export for backward compatibility
export { ImageWithLoader as ImageWithFallback };
