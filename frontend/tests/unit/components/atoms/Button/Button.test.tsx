/**
 * Button Component Tests
 * Testing all variants, sizes, and states
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../../../../src/components/atoms/Button/Button';

describe('Button Component', () => {
    describe('Rendering', () => {
        it('renders button with text', () => {
            render(<Button>Click me</Button>);
            expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
        });

        it('renders primary variant by default', () => {
            render(<Button>Primary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn--primary');
        });

        it('renders secondary variant', () => {
            render(<Button variant="secondary">Secondary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn--secondary');
        });

        it('renders ghost variant', () => {
            render(<Button variant="ghost">Ghost</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn--ghost');
        });

        it('renders danger variant', () => {
            render(<Button variant="danger">Danger</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn--danger');
        });
    });

    describe('Sizes', () => {
        it('renders medium size by default', () => {
            render(<Button>Medium</Button>);
            expect(screen.getByRole('button')).toHaveClass('btn--medium');
        });

        it('renders small size', () => {
            render(<Button size="small">Small</Button>);
            expect(screen.getByRole('button')).toHaveClass('btn--small');
        });

        it('renders large size', () => {
            render(<Button size="large">Large</Button>);
            expect(screen.getByRole('button')).toHaveClass('btn--large');
        });
    });

    describe('States', () => {
        it('shows loading spinner when isLoading is true', () => {
            render(<Button isLoading>Loading</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('btn--loading');
            expect(button).toHaveAttribute('aria-busy', 'true');
            expect(button).toBeDisabled();
        });

        it('is disabled when disabled prop is true', () => {
            render(<Button disabled>Disabled</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('renders full width when fullWidth is true', () => {
            render(<Button fullWidth>Full Width</Button>);
            expect(screen.getByRole('button')).toHaveClass('btn--full-width');
        });
    });

    describe('Icons', () => {
        it('renders left icon', () => {
            render(
                <Button leftIcon={<span data-testid="left-icon">←</span>}>
                    With Left Icon
                </Button>
            );
            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        });

        it('renders right icon', () => {
            render(
                <Button rightIcon={<span data-testid="right-icon">→</span>}>
                    With Right Icon
                </Button>
            );
            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });

        it('hides icons when loading', () => {
            render(
                <Button
                    isLoading
                    leftIcon={<span data-testid="left-icon">←</span>}
                    rightIcon={<span data-testid="right-icon">→</span>}
                >
                    Loading
                </Button>
            );
            expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
            expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        it('calls onClick handler when clicked', async () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole('button');
            await userEvent.click(button);

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('does not call onClick when disabled', async () => {
            const handleClick = jest.fn();
            render(
                <Button onClick={handleClick} disabled>
                    Disabled
                </Button>
            );

            const button = screen.getByRole('button');
            await userEvent.click(button);

            expect(handleClick).not.toHaveBeenCalled();
        });

        it('does not call onClick when loading', async () => {
            const handleClick = jest.fn();
            render(
                <Button onClick={handleClick} isLoading>
                    Loading
                </Button>
            );

            const button = screen.getByRole('button');
            await userEvent.click(button);

            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('Accessibility', () => {
        it('has correct aria attributes when loading', () => {
            render(<Button isLoading>Loading</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-busy', 'true');
        });

        it('can be focused with keyboard', () => {
            render(<Button>Focus me</Button>);
            const button = screen.getByRole('button');
            button.focus();
            expect(button).toHaveFocus();
        });
    });
});
