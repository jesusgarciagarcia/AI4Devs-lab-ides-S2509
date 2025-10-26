/**
 * PHONE VALUE OBJECT - DOMAIN LAYER
 *
 * Representa un teléfono válido en formato E.164
 */

export class Phone {
  private readonly value: string;

  private constructor(phone: string) {
    this.value = phone;
  }

  static create(phone: string): Phone {
    const cleaned = phone.trim();
    if (!Phone.isValid(cleaned)) {
      throw new Error('Invalid phone format');
    }
    return new Phone(cleaned);
  }

  static isValid(phone: string): boolean {
    // E.164 format: + followed by 7-15 digits
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    return phoneRegex.test(phone.trim());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Phone): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
