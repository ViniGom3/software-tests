module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/context.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
};
