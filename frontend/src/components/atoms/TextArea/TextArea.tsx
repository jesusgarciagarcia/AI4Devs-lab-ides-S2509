/**
 * TextArea component - Atom level
 * Reusable textarea with validation states and character counter
 */

import React, { forwardRef, TextareaHTMLAttributes, useState, useEffect } from 'react';
import clsx from 'clsx';
import './TextArea.css';

/**
 * TextArea component props
 */
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    showCharacterCount?: boolean;
    isValid?: boolean;
}

/**
 * TextArea component
 * Accessible textarea field with label, error messages, and character counter
 *
 * @example
 * <TextArea
 *   label="Experiencia"
 *   maxLength={2000}
 *   showCharacterCount
 *   required
 * />
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            label,
            error,
            helperText,
            showCharacterCount = false,
            isValid,
            className,
            id,
            required,
            maxLength,
            value,
            onChange,
            ...rest
        },
        ref
    ) => {
        const [charCount, setCharCount] = useState(0);
        const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = !!error;

        useEffect(() => {
            if (typeof value === 'string') {
                setCharCount(value.length);
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCharCount(e.target.value.length);
            onChange?.(e);
        };

        return (
            <div className={clsx('textarea-wrapper', className)}>
                <div className="textarea-header">
                    {label && (
                        <label
                            htmlFor={textareaId}
                            className="textarea-label"
                        >
                            {label}
                            {required && <span className="textarea-required" aria-label="obligatorio">*</span>}
                        </label>
                    )}

                    {showCharacterCount && maxLength && (
                        <span
                            className={clsx('textarea-char-count', {
                                'textarea-char-count--warning': charCount > maxLength * 0.9,
                                'textarea-char-count--error': charCount >= maxLength,
                            })}
                            aria-live="polite"
                        >
                            {charCount}/{maxLength}
                        </span>
                    )}
                </div>

                <textarea
                    ref={ref}
                    id={textareaId}
                    className={clsx(
                        'textarea-input',
                        {
                            'textarea-input--error': hasError,
                            'textarea-input--valid': isValid && !hasError,
                        }
                    )}
                    aria-invalid={hasError}
                    aria-describedby={
                        error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
                    }
                    required={required}
                    maxLength={maxLength}
                    value={value}
                    onChange={handleChange}
                    {...rest}
                />

                {error && (
                    <p
                        id={`${textareaId}-error`}
                        className="textarea-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p id={`${textareaId}-helper`} className="textarea-helper">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';
