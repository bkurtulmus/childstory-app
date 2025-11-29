import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    onHomeClick: () => void;
}

/**
 * Breadcrumb navigation component
 */
export function Breadcrumb({ items, onHomeClick }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 0',
                fontSize: 'var(--text-body-sm)',
            }}
        >
            {/* Home button */}
            <button
                type="button"
                onClick={onHomeClick}
                aria-label="Go to home"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                }}
                className="hover:bg-neutral-100"
            >
                <Home size={16} />
                <span>Home</span>
            </button>

            {/* Breadcrumb items */}
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={index}>
                        <ChevronRight
                            size={16}
                            style={{ color: 'var(--text-muted)' }}
                            aria-hidden="true"
                        />

                        {isLast ? (
                            <span
                                aria-current="page"
                                style={{
                                    padding: '4px 8px',
                                    color: 'var(--text-primary)',
                                    fontWeight: 'var(--weight-medium)',
                                }}
                            >
                                {item.label}
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={item.onClick}
                                style={{
                                    padding: '4px 8px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                className="hover:bg-neutral-100"
                            >
                                {item.label}
                            </button>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
