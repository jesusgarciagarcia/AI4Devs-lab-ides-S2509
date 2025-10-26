/**
 * Jest Configuration - Integration Tests (Frontend)
 * Tests with API calls, complex interactions
 */
const baseConfig = require('./jest.config');

module.exports = {
    ...baseConfig,
    displayName: 'integration',
    roots: ['<rootDir>/tests/integration', '<rootDir>/src'],
    coverageDirectory: '<rootDir>/coverage/integration',
    testTimeout: 15000,
};
