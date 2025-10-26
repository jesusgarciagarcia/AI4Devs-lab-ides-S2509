/**
 * Jest Configuration - Unit Tests (Frontend)
 * Fast tests for components, hooks, utils
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  displayName: 'unit',
  roots: ['<rootDir>/tests/unit'],
  testMatch: [
    '**/*.test.+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/unit',
};