/**
 * UNIT TESTS - Phone Value Object (Domain Layer)
 */

import { Phone } from '../../../../../src/candidates/domain/value-objects/Phone';

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
