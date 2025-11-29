/**
 * Accessibility utility functions
 */

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
    return (
        element.getAttribute('aria-hidden') !== 'true' &&
        !element.hasAttribute('hidden') &&
        element.style.display !== 'none' &&
        element.style.visibility !== 'hidden'
    );
}

/**
 * Get accessible label for element
 */
export function getAccessibleLabel(element: HTMLElement): string {
    return (
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby') ||
        element.textContent ||
        ''
    );
}

/**
 * Generate unique ID for ARIA attributes
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
    return `${prefix}-${++idCounter}`;
}
