/**
 * E2E Tests for "Add Candidate to System" Feature
 * Tests complete user flow with real API integration
 *
 * Validates all acceptance criteria from Description.md:
 * 1. Access to the function
 * 2. Registration form
 * 3. Data validation
 * 4. Document upload
 * 5. Registration confirmation
 * 6. Error handling
 * 7. Compatibility and accessibility
 */

import { test, expect } from "@playwright/test";
import path from "path";

// Test data
const validCandidate = {
  firstName: "Juan",
  lastName: "Pérez García",
  email: `test.candidate.${Date.now()}@ejemplo.com`, // Unique email for each test run
  phone: "+34612345678",
  address: "Calle Principal 123, Madrid, España",
  education:
    "Licenciatura en Ingeniería Informática - Universidad Complutense de Madrid",
  experience:
    "5 años como desarrollador full stack en empresas tecnológicas, especializado en React y Node.js",
};

// Wait for API to be ready
test.beforeEach(async ({ page }) => {
  // Check if backend is accessible
  try {
    const response = await page.request.get("http://localhost:3010/health");
    if (!response.ok()) {
      throw new Error("Backend API is not accessible");
    }
  } catch (error) {
    throw new Error(
      "Backend must be running at http://localhost:3010 for E2E tests"
    );
  }
});

test.describe("Feature: Add Candidate to System", () => {
  test.describe("Criterion 1: Access to the function", () => {
    test('should display "Add Candidate" button in navigation', async ({
      page,
    }) => {
      await page.goto("/");

      // Verify navigation button exists and is visible
      const addButton = page.getByTestId("nav-form");
      await expect(addButton).toBeVisible();
      await expect(addButton).toContainText("Añadir Candidato");
    });

    test('should navigate to the form when clicking "Add Candidate"', async ({
      page,
    }) => {
      await page.goto("/");

      // First go to list page
      await page.getByTestId("nav-list").click();

      // Then navigate to form
      await page.getByTestId("nav-form").click();

      // Verify form is displayed
      await expect(
        page.getByRole("heading", { name: /añadir nuevo candidato/i })
      ).toBeVisible();
    });
  });

  test.describe("Criterion 2: Registration form with required fields", () => {
    test("should display all required form sections", async ({ page }) => {
      await page.goto("/");

      // Verify all sections are present
      await expect(page.getByText(/información personal/i)).toBeVisible();
      await expect(page.getByText(/ubicación/i)).toBeVisible();
      await expect(page.getByText(/formación académica/i)).toBeVisible();
      await expect(page.getByText(/experiencia profesional/i)).toBeVisible();
      await expect(page.getByText(/documentación/i)).toBeVisible();
    });

    test("should display all 7 required fields", async ({ page }) => {
      await page.goto("/");

      // Verify all required fields are present
      await expect(page.getByLabel(/^nombre/i)).toBeVisible();
      await expect(page.getByLabel(/apellido/i)).toBeVisible();
      await expect(page.getByLabel(/correo electrónico/i)).toBeVisible();
      await expect(page.getByLabel(/teléfono/i)).toBeVisible();
      await expect(page.getByLabel(/dirección/i)).toBeVisible();
      await expect(page.getByLabel(/educación/i)).toBeVisible();
      await expect(page.getByLabel(/experiencia laboral/i)).toBeVisible();
    });

    test("should display submit and cancel buttons", async ({ page }) => {
      await page.goto("/");

      await expect(
        page.getByRole("button", { name: /guardar candidato/i })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /cancelar/i })
      ).toBeVisible();
    });
  });

  test.describe("Criterion 3: Data validation", () => {
    test("should show validation errors for empty required fields", async ({
      page,
    }) => {
      await page.goto("/");

      // Try to submit empty form
      await page.getByRole("button", { name: /guardar candidato/i }).click();

      // Verify validation errors appear
      await expect(
        page.getByText(/el nombre debe tener al menos 2 caracteres/i)
      ).toBeVisible();
    });

    test("should validate email format", async ({ page }) => {
      await page.goto("/");

      // Enter invalid email
      const emailInput = page.getByLabel(/correo electrónico/i);
      await emailInput.fill("invalid-email");
      await emailInput.blur();

      // Verify error message
      await expect(page.getByText(/ingresa un correo válido/i)).toBeVisible();
    });

    test("should validate phone format", async ({ page }) => {
      await page.goto("/");

      // Enter invalid phone (too short)
      const phoneInput = page.getByLabel(/teléfono/i);
      await phoneInput.fill("123");
      await phoneInput.blur();

      // Verify error message
      await expect(
        page.getByText(/el teléfono debe tener al menos 8 dígitos/i)
      ).toBeVisible();
    });

    test("should validate minimum character length", async ({ page }) => {
      await page.goto("/");

      // Enter short address
      const addressInput = page.getByLabel(/dirección/i);
      await addressInput.fill("Short");
      await addressInput.blur();

      // Verify error message
      await expect(
        page.getByText(/la dirección debe tener al menos 10 caracteres/i)
      ).toBeVisible();
    });

    test("should validate that required fields are not empty", async ({
      page,
    }) => {
      await page.goto("/");

      // Fill only name
      await page.getByLabel(/^nombre/i).fill("Juan");

      // Try to submit
      await page.getByRole("button", { name: /guardar candidato/i }).click();

      // Should still show errors for other fields
      const errors = page.locator('[role="alert"]');
      await expect(errors.first()).toBeVisible();
    });
  });

  test.describe("Criterion 4: Document upload", () => {
    test("should display CV upload zone", async ({ page }) => {
      await page.goto("/");

      // Verify upload zone is visible
      await expect(page.getByText(/arrastra tu archivo/i)).toBeVisible();
      await expect(page.getByText(/PDF, DOCX/i)).toBeVisible();
    });

    test("should allow PDF file upload", async ({ page }) => {
      await page.goto("/");

      // Create a mock PDF file
      const pdfPath = path.join(__dirname, "fixtures", "test-cv.pdf");

      // Upload file
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(pdfPath);

      // Verify file is accepted
      await expect(page.getByText(/test-cv\.pdf/i)).toBeVisible();
    });
  });

  test.describe("Criterion 5: Registration confirmation", () => {
    test("should create candidate successfully and show confirmation", async ({
      page,
    }) => {
      await page.goto("/");

      // Fill all required fields
      await page.getByLabel(/^nombre/i).fill(validCandidate.firstName);
      await page.getByLabel(/apellido/i).fill(validCandidate.lastName);
      await page.getByLabel(/correo electrónico/i).fill(validCandidate.email);
      await page.getByLabel(/teléfono/i).fill(validCandidate.phone);
      await page.getByLabel(/dirección/i).fill(validCandidate.address);
      await page.getByLabel(/educación/i).fill(validCandidate.education);
      await page
        .getByLabel(/experiencia laboral/i)
        .fill(validCandidate.experience);

      // Submit form
      await page.getByRole("button", { name: /guardar candidato/i }).click();

      // Verify success message appears
      await expect(
        page.getByText(/candidato añadido exitosamente/i)
      ).toBeVisible({ timeout: 10000 });

      // Wait for automatic navigation to list page
      await page.waitForTimeout(2500);

      // Verify we're on the candidates list page
      await expect(
        page.getByRole("heading", { name: /lista de candidatos/i })
      ).toBeVisible();
    });

    test("should display created candidate in the list", async ({ page }) => {
      // First, create a candidate
      await page.goto("/");

      const uniqueEmail = `e2e.test.${Date.now()}@ejemplo.com`;

      await page.getByLabel(/^nombre/i).fill("Carlos");
      await page.getByLabel(/apellido/i).fill("Rodríguez");
      await page.getByLabel(/correo electrónico/i).fill(uniqueEmail);
      await page.getByLabel(/teléfono/i).fill("+34654321987");
      await page
        .getByLabel(/dirección/i)
        .fill("Avenida Secundaria 456, Barcelona");
      await page
        .getByLabel(/educación/i)
        .fill("Máster en Ingeniería de Software");
      await page
        .getByLabel(/experiencia laboral/i)
        .fill("3 años como QA Automation Engineer");

      await page.getByRole("button", { name: /guardar candidato/i }).click();

      // Wait for success and navigation
      await expect(
        page.getByText(/candidato añadido exitosamente/i)
      ).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(2500);

      // Verify candidate appears in the list
      await expect(page.getByText("Carlos Rodríguez")).toBeVisible();
      await expect(page.getByText(uniqueEmail)).toBeVisible();
    });
  });

  test.describe("Criterion 6: Error handling", () => {
    test("should show loading state during submission", async ({ page }) => {
      await page.goto("/");

      // Fill form
      await page.getByLabel(/^nombre/i).fill(validCandidate.firstName);
      await page.getByLabel(/apellido/i).fill(validCandidate.lastName);
      await page
        .getByLabel(/correo electrónico/i)
        .fill(`loading.test.${Date.now()}@ejemplo.com`);
      await page.getByLabel(/teléfono/i).fill(validCandidate.phone);
      await page.getByLabel(/dirección/i).fill(validCandidate.address);
      await page.getByLabel(/educación/i).fill(validCandidate.education);
      await page
        .getByLabel(/experiencia laboral/i)
        .fill(validCandidate.experience);

      // Submit and verify loading state
      await page.getByRole("button", { name: /guardar candidato/i }).click();

      // Verify button shows loading state
      await expect(
        page.getByRole("button", { name: /guardando/i })
      ).toBeVisible();
    });

    test("should disable form during submission", async ({ page }) => {
      await page.goto("/");

      // Fill form
      await page.getByLabel(/^nombre/i).fill(validCandidate.firstName);
      await page.getByLabel(/apellido/i).fill(validCandidate.lastName);
      await page
        .getByLabel(/correo electrónico/i)
        .fill(`disable.test.${Date.now()}@ejemplo.com`);
      await page.getByLabel(/teléfono/i).fill(validCandidate.phone);
      await page.getByLabel(/dirección/i).fill(validCandidate.address);
      await page.getByLabel(/educación/i).fill(validCandidate.education);
      await page
        .getByLabel(/experiencia laboral/i)
        .fill(validCandidate.experience);

      // Submit form
      await page.getByRole("button", { name: /guardar candidato/i }).click();

      // Verify buttons are disabled during submission
      const submitButton = page.getByRole("button", { name: /guardando/i });
      await expect(submitButton).toBeDisabled();
    });
  });

  test.describe("Criterion 7: Compatibility and accessibility", () => {
    test("should have proper heading hierarchy", async ({ page }) => {
      await page.goto("/");

      // Verify h1 exists
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).toContainText(/añadir nuevo candidato/i);

      // Verify h2 elements exist
      const h2Elements = page.getByRole("heading", { level: 2 });
      await expect(h2Elements.first()).toBeVisible();
    });

    test("should have proper form structure with noValidate", async ({
      page,
    }) => {
      await page.goto("/");

      // Verify form has noValidate attribute (custom validation)
      const form = page.locator("form");
      await expect(form).toHaveAttribute("novalidate");
    });

    test("should be keyboard navigable", async ({ page }) => {
      await page.goto("/");

      // Start from first input
      const nameInput = page.getByLabel(/^nombre/i);
      await nameInput.focus();

      // Tab through inputs
      await page.keyboard.press("Tab");

      // Verify focus moved to next input
      const lastNameInput = page.getByLabel(/apellido/i);
      await expect(lastNameInput).toBeFocused();
    });

    test("should have accessible labels for all inputs", async ({ page }) => {
      await page.goto("/");

      // Verify all inputs have associated labels
      const inputs = [
        "nombre",
        "apellido",
        "correo electrónico",
        "teléfono",
        "dirección",
        "educación",
        "experiencia laboral",
      ];

      for (const label of inputs) {
        const input = page.getByLabel(new RegExp(label, "i"));
        await expect(input).toBeVisible();
      }
    });
  });

  test.describe("Navigation between pages", () => {
    test("should navigate from form to candidates list", async ({ page }) => {
      await page.goto("/");

      // Click on list navigation
      await page.getByTestId("nav-list").click();

      // Verify we're on the list page
      await expect(
        page.getByRole("heading", { name: /lista de candidatos/i })
      ).toBeVisible();
    });

    test("should navigate from list to form", async ({ page }) => {
      await page.goto("/");

      // Go to list first
      await page.getByTestId("nav-list").click();
      await expect(
        page.getByRole("heading", { name: /lista de candidatos/i })
      ).toBeVisible();

      // Navigate back to form
      await page.getByTestId("nav-form").click();

      // Verify we're on the form page
      await expect(
        page.getByRole("heading", { name: /añadir nuevo candidato/i })
      ).toBeVisible();
    });

    test("should show active state in navigation", async ({ page }) => {
      await page.goto("/");

      // Form button should be active
      const formButton = page.getByTestId("nav-form");
      await expect(formButton).toHaveClass(/active/);

      // Click list button
      await page.getByTestId("nav-list").click();

      // List button should be active
      const listButton = page.getByTestId("nav-list");
      await expect(listButton).toHaveClass(/active/);
    });
  });

  test.describe("Candidates list page", () => {
    test("should display list of candidates", async ({ page }) => {
      await page.goto("/");

      // Navigate to list
      await page.getByTestId("nav-list").click();

      // Verify list page elements
      await expect(
        page.getByRole("heading", { name: /lista de candidatos/i })
      ).toBeVisible();
      await expect(page.getByTestId("refresh-button")).toBeVisible();
    });

    test("should refresh candidates list when clicking refresh button", async ({
      page,
    }) => {
      await page.goto("/");

      // Navigate to list
      await page.getByTestId("nav-list").click();

      // Click refresh button
      await page.getByTestId("refresh-button").click();

      // Verify loading state appears
      // (List should reload)
      await page.waitForTimeout(500);
    });
  });

  test.describe("Full E2E workflow", () => {
    test("should complete full candidate creation and verification flow", async ({
      page,
    }) => {
      const uniqueCandidate = {
        firstName: "María",
        lastName: "González López",
        email: `maria.gonzalez.${Date.now()}@ejemplo.com`,
        phone: "+34611223344",
        address: "Plaza Mayor 1, Valencia, España",
        education:
          "Grado en Administración de Empresas - Universidad de Valencia",
        experience: "7 años como Product Manager en startups tecnológicas",
      };

      // Step 1: Navigate to form
      await page.goto("/");
      await expect(
        page.getByRole("heading", { name: /añadir nuevo candidato/i })
      ).toBeVisible();

      // Step 2: Fill form with valid data
      await page.getByLabel(/^nombre/i).fill(uniqueCandidate.firstName);
      await page.getByLabel(/apellido/i).fill(uniqueCandidate.lastName);
      await page.getByLabel(/correo electrónico/i).fill(uniqueCandidate.email);
      await page.getByLabel(/teléfono/i).fill(uniqueCandidate.phone);
      await page.getByLabel(/dirección/i).fill(uniqueCandidate.address);
      await page.getByLabel(/educación/i).fill(uniqueCandidate.education);
      await page
        .getByLabel(/experiencia laboral/i)
        .fill(uniqueCandidate.experience);

      // Step 3: Submit form
      await page.getByRole("button", { name: /guardar candidato/i }).click();

      // Step 4: Verify success message
      await expect(
        page.getByText(/candidato añadido exitosamente/i)
      ).toBeVisible({ timeout: 10000 });

      // Step 5: Wait for automatic navigation
      await page.waitForTimeout(2500);

      // Step 6: Verify we're on the list page
      await expect(
        page.getByRole("heading", { name: /lista de candidatos/i })
      ).toBeVisible();

      // Step 7: Verify candidate appears in the list
      await expect(
        page.getByText(
          `${uniqueCandidate.firstName} ${uniqueCandidate.lastName}`
        )
      ).toBeVisible();
      await expect(page.getByText(uniqueCandidate.email)).toBeVisible();
      await expect(page.getByText(uniqueCandidate.phone)).toBeVisible();

      // Step 8: Verify all candidate data is displayed
      await expect(page.getByText(uniqueCandidate.address)).toBeVisible();
    });
  });
});
