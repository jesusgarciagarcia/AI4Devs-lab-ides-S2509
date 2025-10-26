/**
 * TextField Component Tests
 * Testing validation states, accessibility, and user interactions
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from '../../../../../src/components/atoms/TextField/TextField';

describe('TextField Component', () => {
    describe('Rendering', () => {
        it('renders input field', () => {
            render(<TextField />);
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('renders with label', () => {
            render(<TextField label="Email" />);
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        });

        it('shows required indicator when required', () => {
            render(<TextField label="Name" required />);
            expect(screen.getByText('*')).toBeInTheDocument();
        });

        it('renders placeholder', () => {
            render(<TextField placeholder="Enter your email" />);
            expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
        });
    });

    describe('Validation States', () => {
        it('shows error message when error prop is provided', () => {
            render(<TextField label="Email" error="Invalid email format" />);
            expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
        });

        it('applies error styles when error exists', () => {
            render(<TextField label="Email" error="Error" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveClass('textfield-input--error');
            expect(input).toHaveAttribute('aria-invalid', 'true');
        });

        it('shows valid state when isValid is true', () => {
            render(<TextField label="Email" isValid />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveClass('textfield-input--valid');
        });

        it('shows helper text when provided', () => {
            render(<TextField helperText="Enter a valid email address" />);
            expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
        });

        it('prioritizes error over helper text', () => {
            render(
                <TextField
                    helperText="Helper text"
                    error="Error message"
                />
            );
            expect(screen.getByText(/error message/i)).toBeInTheDocument();
            expect(screen.queryByText(/helper text/i)).not.toBeInTheDocument();
        });
    });

    describe('Icons', () => {
        it('renders left icon', () => {
            render(
                <TextField
                    leftIcon={<span data-testid="left-icon">@</span>}
                />
            );
            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        });

        it('renders right icon', () => {
            render(
                <TextField
                    rightIcon={<span data-testid="right-icon">🔍</span>}
                />
            );
            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });

        it('shows checkmark icon when valid', () => {
            render(<TextField isValid />);
            const input = screen.getByRole('textbox');
            expect(input.parentElement?.querySelector('.textfield-valid-icon')).toBeInTheDocument();
        });
    });

    describe('User Interactions', () => {
        it('calls onChange when user types', async () => {
            const handleChange = jest.fn();
            render(<TextField onChange={handleChange} />);

            const input = screen.getByRole('textbox');
            await userEvent.type(input, 'test');

            expect(handleChange).toHaveBeenCalled();
            expect(input).toHaveValue('test');
        });

        it('calls onBlur when input loses focus', async () => {
            const handleBlur = jest.fn();
            render(<TextField onBlur={handleBlur} />);

            const input = screen.getByRole('textbox');
            input.focus();
            input.blur();

            expect(handleBlur).toHaveBeenCalledTimes(1);
        });

        it('can be disabled', () => {
            render(<TextField disabled />);
            const input = screen.getByRole('textbox');
            expect(input).toBeDisabled();
        });
    });

    describe('Accessibility', () => {
        it('associates label with input using htmlFor', () => {
            render(<TextField label="Email" id="email-input" />);
            const input = screen.getByLabelText(/email/i);
            expect(input).toHaveAttribute('id', 'email-input');
        });

        it('uses aria-describedby for error messages', () => {
            render(<TextField label="Email" error="Invalid email" />);
            const input = screen.getByRole('textbox');
            const errorId = input.getAttribute('aria-describedby');
            expect(errorId).toBeTruthy();
            expect(screen.getByText(/invalid email/i)).toHaveAttribute('id', errorId!);
        });

        it('uses aria-describedby for helper text', () => {
            render(<TextField helperText="Helper text" />);
            const input = screen.getByRole('textbox');
            const helperId = input.getAttribute('aria-describedby');
            expect(helperId).toBeTruthy();
            expect(screen.getByText(/helper text/i)).toHaveAttribute('id', helperId!);
        });

        it('marks error messages with role="alert"', () => {
            render(<TextField error="Error message" />);
            expect(screen.getByRole('alert')).toHaveTextContent(/error message/i);
        });

        it('indicates required fields with aria-label', () => {
            render(<TextField label="Name" required />);
            const requiredSpan = screen.getByText('*');
            expect(requiredSpan).toHaveAttribute('aria-label', 'obligatorio');
        });
    });

    describe('Input Types', () => {
        it('supports email type', () => {
            render(<TextField type="email" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
        });

        it('supports tel type', () => {
            render(<TextField type="tel" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel');
        });

        it('supports password type', () => {
            render(<TextField type="password" />);
            const input = screen.getByLabelText('', { selector: 'input' });
            expect(input).toHaveAttribute('type', 'password');
        });
    });
});
