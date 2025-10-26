/**
 * UNIT TESTS - Email Value Object (Domain Layer)
 */

import { Email } from '../../../../../src/candidates/domain/value-objects/Email';

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
