/**
 * AddCandidateForm Unit Tests
 * Testing form rendering, validation, and user interactions
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddCandidateForm } from '../../../../../src/components/organisms/AddCandidateForm/AddCandidateForm';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
    __esModule: true,
    default: {
        success: jest.fn(),
        error: jest.fn(),
    },
    Toaster: () => null,
}));

// Mock fetch globally for this test file
const mockFetch = jest.fn();

beforeAll(() => {
    global.fetch = mockFetch;
});

afterEach(() => {
    mockFetch.mockClear();
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe('AddCandidateForm Unit Tests', () => {
    describe('Form Rendering', () => {
        it('renders all form sections', () => {
            render(<AddCandidateForm />);

            expect(screen.getByText(/información personal/i)).toBeInTheDocument();
            expect(screen.getByText(/ubicación/i)).toBeInTheDocument();
            expect(screen.getByText(/formación académica/i)).toBeInTheDocument();
            expect(screen.getByText(/experiencia profesional/i)).toBeInTheDocument();
            expect(screen.getByText(/documentación/i)).toBeInTheDocument();
        });

        it('renders all required fields', () => {
            render(<AddCandidateForm />);

            expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/educación/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/experiencia laboral/i)).toBeInTheDocument();
        });

        it('renders action buttons', () => {
            render(<AddCandidateForm />);

            expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /guardar candidato/i })).toBeInTheDocument();
        });
    });

    describe('Form Validation', () => {
        it('shows validation errors for empty required fields on submit', async () => {
            const user = userEvent.setup();
            render(<AddCandidateForm />);

            const submitButton = screen.getByRole('button', { name: /guardar candidato/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument();
            });
        });

        it('validates email format on blur', async () => {
            const user = userEvent.setup();
            render(<AddCandidateForm />);

            const emailInput = screen.getByLabelText(/correo electrónico/i);
            await user.type(emailInput, 'invalid-email');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument();
            });
        });

        it('validates phone format on blur', async () => {
            const user = userEvent.setup();
            render(<AddCandidateForm />);

            const phoneInput = screen.getByLabelText(/teléfono/i);
            await user.type(phoneInput, '123');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/el teléfono debe tener al menos 8 dígitos/i)).toBeInTheDocument();
            });
        });

        it('validates minimum character length on blur', async () => {
            const user = userEvent.setup();
            render(<AddCandidateForm />);

            const addressInput = screen.getByLabelText(/dirección/i);
            await user.type(addressInput, 'Short');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/la dirección debe tener al menos 10 caracteres/i)).toBeInTheDocument();
            });
        });
    });

    describe('Form Submission', () => {
        const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
            const nameInput = screen.getByLabelText(/nombre/i);
            const lastNameInput = screen.getByLabelText(/apellido/i);
            const emailInput = screen.getByLabelText(/correo electrónico/i);
            const phoneInput = screen.getByLabelText(/teléfono/i);
            const addressInput = screen.getByLabelText(/dirección/i);
            const educationInput = screen.getByLabelText(/educación/i);
            const experienceInput = screen.getByLabelText(/experiencia laboral/i);

            await user.type(nameInput, 'Juan');
            await user.type(lastNameInput, 'Pérez');
            await user.type(emailInput, 'juan.perez@ejemplo.com');
            await user.type(phoneInput, '+34612345678');
            await user.type(addressInput, 'Calle Principal 123, Madrid');
            await user.type(educationInput, 'Licenciatura en Ingeniería Informática');
            await user.type(experienceInput, '5 años como desarrollador full stack en empresas tech');

            // Wait for all state updates to complete
            await waitFor(() => {
                expect(nameInput).toHaveValue('Juan');
            });
        };

        beforeEach(() => {
            // Setup successful mock response by default
            mockFetch.mockResolvedValue({
                ok: true,
                status: 201,
                statusText: 'Created',
                headers: new Headers(),
                json: async () => ({
                    success: true,
                    data: {
                        id: 'test-candidate-123',
                        firstName: 'Juan',
                        lastName: 'Pérez'
                    }
                }),
            } as unknown as Response);
        });

        it('submits form with valid data', async () => {
            const user = userEvent.setup();
            const onSuccess = jest.fn();
            render(<AddCandidateForm onSuccess={onSuccess} />);

            await fillValidForm(user);

            const submitButton = screen.getByRole('button', { name: /guardar candidato/i });
            await user.click(submitButton);

            // Wait for the API call to complete
            await waitFor(() => {
                expect(mockFetch).toHaveBeenCalledTimes(1);
            });

            // Verify the fetch was called with correct data
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/candidates'),
                expect.objectContaining({
                    method: 'POST',
                })
            );

            // Wait for success callback
            await waitFor(() => {
                expect(onSuccess).toHaveBeenCalled();
            });
        });

        it('shows loading state during submission', async () => {
            // Mock an unresolved promise that we control
            let resolvePromise: (value: any) => void;
            const delayedPromise = new Promise(resolve => {
                resolvePromise = resolve;
            });

            mockFetch.mockReturnValue(delayedPromise as any);

            const user = userEvent.setup();
            render(<AddCandidateForm />);

            await fillValidForm(user);

            const submitButton = screen.getByRole('button', { name: /guardar candidato/i });

            // Click submit
            await user.click(submitButton);

            // Check for loading state - button text changes to "Guardando..."
            await waitFor(() => {
                expect(screen.getByText(/guardando\.\.\./i)).toBeInTheDocument();
            });

            // Resolve the promise to complete the test
            resolvePromise!({
                ok: true,
                status: 201,
                statusText: 'Created',
                json: async () => ({ success: true, data: { id: '123' } })
            } as unknown as Response);
        });

        it('disables form during submission', async () => {
            // Mock an unresolved promise that we control
            let resolvePromise: (value: any) => void;
            const delayedPromise = new Promise(resolve => {
                resolvePromise = resolve;
            });

            mockFetch.mockReturnValue(delayedPromise as any);

            const user = userEvent.setup();
            render(<AddCandidateForm />);

            await fillValidForm(user);

            const submitButton = screen.getByRole('button', { name: /guardar candidato/i });
            const cancelButton = screen.getByRole('button', { name: /cancelar/i });

            // Click submit
            await user.click(submitButton);

            // Check that buttons are disabled during submission
            await waitFor(() => {
                expect(submitButton).toBeDisabled();
            });

            expect(cancelButton).toBeDisabled();

            // Resolve the promise to complete the test
            resolvePromise!({
                ok: true,
                status: 201,
                statusText: 'Created',
                json: async () => ({ success: true, data: { id: '123' } })
            } as unknown as Response);
        });

        it('handles API errors gracefully', async () => {
            // Mock error response
            mockFetch.mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
                json: async () => ({
                    error: 'Internal server error'
                }),
            } as unknown as Response);

            const user = userEvent.setup();
            render(<AddCandidateForm />);

            await fillValidForm(user);

            const submitButton = screen.getByRole('button', { name: /guardar candidato/i });
            await user.click(submitButton);

            // Wait for error to be displayed
            await waitFor(() => {
                expect(mockFetch).toHaveBeenCalled();
            });

            // Form should be re-enabled after error
            await waitFor(() => {
                expect(submitButton).not.toBeDisabled();
            });
        });
    });

    describe('Form Actions', () => {
        it('calls onCancel when cancel button is clicked', async () => {
            const user = userEvent.setup();
            const onCancel = jest.fn();
            render(<AddCandidateForm onCancel={onCancel} />);

            const cancelButton = screen.getByRole('button', { name: /cancelar/i });
            await user.click(cancelButton);

            expect(onCancel).toHaveBeenCalled();
        });

        it('shows confirmation when canceling with data', async () => {
            const user = userEvent.setup();
            // Mock window.confirm
            const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

            const onCancel = jest.fn();
            render(<AddCandidateForm onCancel={onCancel} />);

            // Fill some data
            const nameInput = screen.getByLabelText(/nombre/i);
            await user.type(nameInput, 'Juan');

            const cancelButton = screen.getByRole('button', { name: /cancelar/i });
            await user.click(cancelButton);

            expect(confirmSpy).toHaveBeenCalled();
            expect(onCancel).not.toHaveBeenCalled();

            confirmSpy.mockRestore();
        });
    });

    describe('Accessibility', () => {
        it('has proper heading hierarchy', () => {
            render(<AddCandidateForm />);

            const h1 = screen.getByRole('heading', { level: 1 });
            expect(h1).toHaveTextContent(/añadir nuevo candidato/i);

            const h2Elements = screen.getAllByRole('heading', { level: 2 });
            expect(h2Elements.length).toBeGreaterThan(0);
        });

        it('has proper form structure with noValidate', () => {
            const { container } = render(<AddCandidateForm />);
            const form = container.querySelector('form');
            expect(form).toHaveAttribute('novalidate');
        });

        it('all inputs are keyboard navigable', async () => {
            const user = userEvent.setup();
            render(<AddCandidateForm />);

            const nameInput = screen.getByLabelText(/nombre/i);
            nameInput.focus();
            expect(nameInput).toHaveFocus();

            // Tab to next input
            await user.tab();
            const lastNameInput = screen.getByLabelText(/apellido/i);
            expect(lastNameInput).toHaveFocus();
        });
    });
});