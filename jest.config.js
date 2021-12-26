/**
 * @type {import('@jest/types').Config.InitialOptions}
 **/
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  modulePathIgnorePatterns: ['<rootDir>/e2e/'],
  moduleNameMapper: { 'src/(.*)': '<rootDir>/src/$1' }, // Handle module aliases (this will be automatically configured for you soon)
};

module.exports = createJestConfig(customJestConfig);
