/**
 * Button component - Atom level
 * Reusable button with multiple variants and states
 * Follows SOLID principles - Single Responsibility
 */

import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import './Button.css';

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

/**
 * Button sizes
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button component props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Button component
 *
 * @example
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Submit Form
 * </Button>
 *
 * <Button variant="secondary" isLoading disabled>
 *   Loading...
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'medium',
            isLoading = false,
            fullWidth = false,
            leftIcon,
            rightIcon,
            children,
            className,
            disabled,
            ...rest
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    'btn',
                    `btn--${variant}`,
                    `btn--${size}`,
                    {
                        'btn--loading': isLoading,
                        'btn--full-width': fullWidth,
                        'btn--disabled': disabled || isLoading,
                    },
                    className
                )}
                disabled={disabled || isLoading}
                aria-busy={isLoading}
                {...rest}
            >
                {isLoading && (
                    <span className="btn__spinner" aria-hidden="true">
                        <svg
                            className="btn__spinner-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="btn__spinner-circle"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="btn__spinner-path"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </span>
                )}

                {!isLoading && leftIcon && (
                    <span className="btn__left-icon" aria-hidden="true">
                        {leftIcon}
                    </span>
                )}

                <span className="btn__text">{children}</span>

                {!isLoading && rightIcon && (
                    <span className="btn__right-icon" aria-hidden="true">
                        {rightIcon}
                    </span>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';
