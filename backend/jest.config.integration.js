/**
 * Jest Configuration - Integration Tests
 * Tests with database and external services
 */
const baseConfig = require('./jest.config');

module.exports = {
    ...baseConfig,
    displayName: 'integration',
    roots: ['<rootDir>/tests/integration', '<rootDir>/src'],
    coverageDirectory: '<rootDir>/coverage/integration',
    testTimeout: 30000,
    maxWorkers: 1, // Sequential execution for DB tests
    // Integration tests need to run sequentially to avoid DB conflicts
    maxConcurrency: 1,
};
