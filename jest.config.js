module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns - focus on unit tests for now
  testMatch: [
    '**/test/unit/**/*.test.js',
    '**/test/unit/**/*.spec.js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js', // Exclude main entry point from coverage
    '!**/node_modules/**'
  ],
  
  // Coverage thresholds (starting with what we have, will increase)
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1
    }
  },
  
  // Coverage output
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Setup files
  setupFilesAfterEnv: [],
  
  // Module paths
  moduleFileExtensions: ['js', 'json'],
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true
};