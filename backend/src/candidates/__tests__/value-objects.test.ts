/**
 * UNIT TESTS - Value Objects (Domain Layer)
 */

import { Email } from '../domain/value-objects/Email';
import { Phone } from '../domain/value-objects/Phone';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create valid email', () => {
      const email = Email.create('test@example.com');
      expect(email).toBeDefined();
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = Email.create('TEST@EXAMPLE.COM');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const email = Email.create('  test@example.com  ');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should throw error for invalid email', () => {
      expect(() => Email.create('invalid-email')).toThrow(
        'Invalid email format',
      );
      expect(() => Email.create('test@')).toThrow('Invalid email format');
      expect(() => Email.create('@example.com')).toThrow(
        'Invalid email format',
      );
      expect(() => Email.create('test@.com')).toThrow('Invalid email format');
    });
  });

  describe('isValid', () => {
    it('should validate correct emails', () => {
      expect(Email.isValid('test@example.com')).toBe(true);
      expect(Email.isValid('user.name@company.co.uk')).toBe(true);
      expect(Email.isValid('test+tag@example.com')).toBe(true);
    });

    it('should invalidate incorrect emails', () => {
      expect(Email.isValid('invalid')).toBe(false);
      expect(Email.isValid('test@')).toBe(false);
      expect(Email.isValid('@example.com')).toBe(false);
      expect(Email.isValid('')).toBe(false);
    });
  });

  describe('equals', () => {
    it('should compare emails correctly', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('test@example.com');
      const email3 = Email.create('other@example.com');

      expect(email1.equals(email2)).toBe(true);
      expect(email1.equals(email3)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const email = Email.create('test@example.com');
      expect(email.toString()).toBe('test@example.com');
    });
  });
});

describe('Phone Value Object', () => {
  describe('create', () => {
    it('should create valid phone', () => {
      const phone = Phone.create('+1234567890');
      expect(phone).toBeDefined();
      expect(phone.getValue()).toBe('+1234567890');
    });

    it('should accept various valid formats', () => {
      expect(() => Phone.create('+34612345678')).not.toThrow();
      expect(() => Phone.create('+442071234567')).not.toThrow();
      expect(() => Phone.create('+12025551234')).not.toThrow();
    });

    it('should throw error for invalid phone', () => {
      expect(() => Phone.create('123')).toThrow('Invalid phone format');
      expect(() => Phone.create('not-a-phone')).toThrow('Invalid phone format');
      expect(() => Phone.create('1234567890')).toThrow('Invalid phone format'); // Missing +
    });
  });

  describe('isValid', () => {
    it('should validate correct phones', () => {
      expect(Phone.isValid('+1234567890')).toBe(true);
      expect(Phone.isValid('+34612345678')).toBe(true);
      expect(Phone.isValid('+442071234567')).toBe(true);
    });

    it('should invalidate incorrect phones', () => {
      expect(Phone.isValid('123')).toBe(false);
      expect(Phone.isValid('invalid')).toBe(false);
      expect(Phone.isValid('')).toBe(false);
      expect(Phone.isValid('1234567890')).toBe(false); // Missing +
    });
  });

  describe('equals', () => {
    it('should compare phones correctly', () => {
      const phone1 = Phone.create('+1234567890');
      const phone2 = Phone.create('+1234567890');
      const phone3 = Phone.create('+9876543210');

      expect(phone1.equals(phone2)).toBe(true);
      expect(phone1.equals(phone3)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const phone = Phone.create('+1234567890');
      expect(phone.toString()).toBe('+1234567890');
    });
  });
});
