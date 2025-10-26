/**
 * TextField component - Atom level
 * Reusable text input with validation states
 * WCAG 2.1 Level AA compliant
 */

import React, { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import './TextField.css';

/**
 * TextField component props
 */
export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isValid?: boolean;
}

/**
 * TextField component
 * Accessible input field with label, error messages, and icons
 *
 * @example
 * <TextField
 *   label="Email"
 *   type="email"
 *   error="Email inválido"
 *   required
 * />
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            isValid,
            className,
            id,
            required,
            ...rest
        },
        ref
    ) => {
        const inputId = id || `textfield-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = !!error;

        return (
            <div className={clsx('textfield-wrapper', className)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="textfield-label"
                    >
                        {label}
                        {required && <span className="textfield-required" aria-label="obligatorio">*</span>}
                    </label>
                )}

                <div className="textfield-input-container">
                    {leftIcon && (
                        <div className="textfield-left-icon" aria-hidden="true">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={clsx(
                            'textfield-input',
                            {
                                'textfield-input--error': hasError,
                                'textfield-input--valid': isValid && !hasError,
                                'textfield-input--with-left-icon': leftIcon,
                                'textfield-input--with-right-icon': rightIcon || isValid,
                            }
                        )}
                        aria-invalid={hasError}
                        aria-describedby={
                            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                        }
                        required={required}
                        {...rest}
                    />

                    {!hasError && isValid && (
                        <div className="textfield-valid-icon" aria-hidden="true">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M16.667 5L7.5 14.167 3.333 10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}

                    {rightIcon && !isValid && !hasError && (
                        <div className="textfield-right-icon" aria-hidden="true">
                            {rightIcon}
                        </div>
                    )}

                    {hasError && (
                        <div className="textfield-error-icon" aria-hidden="true">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 6v4m0 4h.01"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="textfield-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p id={`${inputId}-helper`} className="textfield-helper">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

TextField.displayName = 'TextField';
