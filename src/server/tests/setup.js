// Test setup file
const mongoose = require('mongoose');

// Set test environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

// Increase timeout for async operations
jest.setTimeout(10000);

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Cleanup after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
