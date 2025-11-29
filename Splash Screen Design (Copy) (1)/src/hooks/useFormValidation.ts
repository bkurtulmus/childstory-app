import { useState, useCallback } from 'react';

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
    message?: string | ((value: any, rule: ValidationRule) => string);
    fieldType?: 'name' | 'email' | 'phone' | 'age' | 'password' | 'otp' | 'general';
}

export interface ValidationSchema {
    [field: string]: ValidationRule;
}

export interface FormErrors {
    [field: string]: string;
}

export interface TouchedFields {
    [field: string]: boolean;
}

/**
 * Hook for real-time form validation
 * Provides field-level validation with debouncing and enhanced error messages
 */
export function useFormValidation(schema: ValidationSchema) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});

    const validateField = useCallback(
        (name: string, value: any): string | null => {
            const rules = schema[name];
            if (!rules) return null;

            // Required validation
            if (rules.required && (!value || value.toString().trim() === '')) {
                if (typeof rules.message === 'function') {
                    return rules.message(value, rules);
                }
                return rules.message || `${name} is required`;
            }

            // Skip other validations if empty and not required
            if (!value) return null;

            const valueStr = value.toString();
            const valueLength = valueStr.length;

            // Min length validation
            if (rules.minLength && valueLength < rules.minLength) {
                if (typeof rules.message === 'function') {
                    return rules.message(value, rules);
                }
                return rules.message || `Minimum ${rules.minLength} characters required`;
            }

            // Max length validation
            if (rules.maxLength && valueLength > rules.maxLength) {
                if (typeof rules.message === 'function') {
                    return rules.message(value, rules);
                }
                return rules.message || `Maximum ${rules.maxLength} characters allowed`;
            }

            // Min value validation (for numbers)
            if (rules.min !== undefined) {
                const numValue = typeof value === 'number' ? value : parseFloat(value);
                if (!isNaN(numValue) && numValue < rules.min) {
                    if (typeof rules.message === 'function') {
                        return rules.message(value, rules);
                    }
                    return rules.message || `Minimum value is ${rules.min}`;
                }
            }

            // Max value validation (for numbers)
            if (rules.max !== undefined) {
                const numValue = typeof value === 'number' ? value : parseFloat(value);
                if (!isNaN(numValue) && numValue > rules.max) {
                    if (typeof rules.message === 'function') {
                        return rules.message(value, rules);
                    }
                    return rules.message || `Maximum value is ${rules.max}`;
                }
            }

            // Pattern validation
            if (rules.pattern && !rules.pattern.test(valueStr)) {
                if (typeof rules.message === 'function') {
                    return rules.message(value, rules);
                }
                return rules.message || 'Invalid format';
            }

            // Custom validation
            if (rules.custom && !rules.custom(value)) {
                if (typeof rules.message === 'function') {
                    return rules.message(value, rules);
                }
                return rules.message || 'Validation failed';
            }

            return null;
        },
        [schema]
    );

    const validate = useCallback(
        (name: string, value: any) => {
            const error = validateField(name, value);
            setErrors((prev) => ({
                ...prev,
                [name]: error || '',
            }));
            return error === null;
        },
        [validateField]
    );

    const validateAll = useCallback(
        (values: { [key: string]: any }): boolean => {
            const newErrors: FormErrors = {};
            let isValid = true;

            Object.keys(schema).forEach((field) => {
                const error = validateField(field, values[field]);
                if (error) {
                    newErrors[field] = error;
                    isValid = false;
                }
            });

            setErrors(newErrors);
            return isValid;
        },
        [schema, validateField]
    );

    const touch = useCallback((name: string) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
    }, []);

    const touchAll = useCallback(() => {
        const allTouched: TouchedFields = {};
        Object.keys(schema).forEach((field) => {
            allTouched[field] = true;
        });
        setTouched(allTouched);
    }, [schema]);

    const reset = useCallback(() => {
        setErrors({});
        setTouched({});
    }, []);

    return {
        errors,
        touched,
        validate,
        validateAll,
        touch,
        touchAll,
        reset,
    };
}
