/**
 * Validation message templates with specific, actionable guidance
 * Provides user-friendly error messages for common form validations
 */

export const validationMessages = {
    // Name validations
    name: {
        required: 'Please enter a name',
        minLength: (min: number) => `Name must be at least ${min} characters`,
        maxLength: (max: number) => `Name must be ${max} characters or less`,
        pattern: 'Name can only contain letters, spaces, and hyphens',
    },

    // Email validations
    email: {
        required: 'Email address is required',
        pattern: 'Please enter a valid email address (e.g., name@example.com)',
        invalid: 'This email address doesn\'t look right. Please check and try again.',
    },

    // Phone validations
    phone: {
        required: 'Phone number is required',
        pattern: 'Please enter a valid phone number (e.g., +1 234 567 8900)',
        minLength: 'Phone number is too short',
        invalid: 'Please check your phone number and try again',
    },

    // Age validations
    age: {
        required: 'Please enter age',
        min: (min: number) => `Age must be at least ${min}`,
        max: (max: number) => `Age must be ${max} or less`,
        pattern: 'Please enter a valid age (numbers only)',
        invalid: 'Please enter a valid age between 1 and 18',
    },

    // Password validations
    password: {
        required: 'Password is required',
        minLength: (min: number) =>
            `Password must be at least ${min} characters for security`,
        pattern: 'Password must include uppercase, lowercase, number, and special character',
        weak: 'Try a stronger password with a mix of characters',
        mismatch: 'Passwords don\'t match. Please try again.',
    },

    // OTP/Verification code validations
    otp: {
        required: 'Please enter the verification code',
        length: (length: number) => `Verification code must be ${length} digits`,
        pattern: 'Verification code should only contain numbers',
        invalid: 'This code doesn\'t match. Please check your messages and try again.',
        expired: 'This code has expired. Please request a new one.',
    },

    // Interest/Tags validations
    interests: {
        required: 'Please add at least one interest',
        minItems: (min: number) => `Please add at least ${min} interest${min > 1 ? 's' : ''}`,
        maxItems: (max: number) => `You can add up to ${max} interests`,
    },

    // Story title validations
    storyTitle: {
        required: 'Please enter a story title',
        minLength: (min: number) => `Title should be at least ${min} characters`,
        maxLength: (max: number) => `Title is too long (max ${max} characters)`,
    },

    // General validations
    general: {
        required: (fieldName: string) => `${fieldName} is required`,
        minLength: (fieldName: string, min: number) =>
            `${fieldName} must be at least ${min} characters`,
        maxLength: (fieldName: string, max: number) =>
            `${fieldName} must be ${max} characters or less`,
        invalid: (fieldName: string) => `Please enter a valid ${fieldName.toLowerCase()}`,
    },
};

/**
 * Get a validation message with optional parameters
 */
export function getValidationMessage(
    category: keyof typeof validationMessages,
    type: string,
    ...params: any[]
): string {
    const messages = validationMessages[category] as any;
    if (!messages) return 'Invalid input';

    const message = messages[type];
    if (typeof message === 'function') {
        return message(...params);
    }
    return message || 'Invalid input';
}
