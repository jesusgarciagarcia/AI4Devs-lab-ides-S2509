/**
 * EMAIL VALUE OBJECT - DOMAIN LAYER
 *
 * Representa un email válido con su lógica de validación
 */

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  static create(email: string): Email {
    const trimmed = email.trim();
    if (!Email.isValid(trimmed)) {
      throw new Error('Invalid email format');
    }
    return new Email(trimmed.toLowerCase());
  }

  static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
