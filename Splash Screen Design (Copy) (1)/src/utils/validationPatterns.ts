/**
 * Common validation patterns for form fields
 * Reusable regex patterns for consistent validation across the app
 */

export const validationPatterns = {
    // Email pattern - RFC 5322 simplified
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    // Phone pattern - international format with optional + and common separators
    phone: /^\+?[\d\s\-()]{10,}$/,

    // Name pattern - letters, spaces, hyphens, and apostrophes
    name: /^[a-zA-Z\s\-']+$/,

    // Digits only
    digits: /^\d+$/,

    // Alphanumeric
    alphanumeric: /^[a-zA-Z0-9]+$/,

    // Strong password - at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

    // URL pattern
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,

    // Username - alphanumeric, underscore, hyphen, 3-20 chars
    username: /^[a-zA-Z0-9_-]{3,20}$/,

    // Age - 1 to 3 digits
    age: /^[1-9]\d{0,2}$/,

    // OTP/Verification code - 4-6 digits
    otp: /^\d{4,6}$/,
};

/**
 * Validation helper functions
 */
export const validators = {
    /**
     * Check if email is valid
     */
    isValidEmail: (email: string): boolean => {
        return validationPatterns.email.test(email);
    },

    /**
     * Check if phone number is valid
     */
    isValidPhone: (phone: string): boolean => {
        return validationPatterns.phone.test(phone);
    },

    /**
     * Check if name is valid
     */
    isValidName: (name: string): boolean => {
        return validationPatterns.name.test(name) && name.trim().length >= 2;
    },

    /**
     * Check if age is valid (1-150)
     */
    isValidAge: (age: string | number): boolean => {
        const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
        return !isNaN(ageNum) && ageNum >= 1 && ageNum <= 150;
    },

    /**
     * Check if password is strong
     */
    isStrongPassword: (password: string): boolean => {
        return validationPatterns.strongPassword.test(password);
    },

    /**
     * Check if OTP code is valid format
     */
    isValidOTP: (code: string, length: number = 6): boolean => {
        return validationPatterns.digits.test(code) && code.length === length;
    },

    /**
     * Check if string contains only digits
     */
    isDigitsOnly: (value: string): boolean => {
        return validationPatterns.digits.test(value);
    },

    /**
     * Check if value is within length range
     */
    isValidLength: (value: string, min?: number, max?: number): boolean => {
        const length = value.trim().length;
        if (min !== undefined && length < min) return false;
        if (max !== undefined && length > max) return false;
        return true;
    },
};
