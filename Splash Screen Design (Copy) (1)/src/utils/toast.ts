import { toast as sonnerToast } from 'sonner';

/**
 * Toast notification utilities
 * Wrapper around sonner for consistent toast notifications
 */

export const toast = {
    success: (message: string, description?: string) => {
        sonnerToast.success(message, {
            description,
            duration: 3000,
        });
    },

    error: (message: string, description?: string) => {
        sonnerToast.error(message, {
            description,
            duration: 4000,
        });
    },

    info: (message: string, description?: string) => {
        sonnerToast.info(message, {
            description,
            duration: 3000,
        });
    },

    warning: (message: string, description?: string) => {
        sonnerToast.warning(message, {
            description,
            duration: 3500,
        });
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return sonnerToast.promise(promise, messages);
    },
};

/**
 * Timeout utility for async operations
 */
export async function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutMessage = 'Operation timed out'
): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
}
