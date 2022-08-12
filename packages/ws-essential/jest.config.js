// eslint-disable-next-line unicorn/prefer-module
const { version } = require('./package.json');

// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.{js,ts,tsx}', '!**/*.d.ts', '!**/app.ts'],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 70,
      lines: 82,
      statements: 80
    }
  },
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    Version: version,
    'ts-jest': {
      // babelConfig: true,
      diagnostics: false,
      isolatedModules: true,
      tsconfig: '<rootDir>/tsconfig.test.json',
      useESM: true
    }
  },
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^lodash-es$': 'lodash'
  },
  rootDir: '.',
  roots: ['<rootDir>'],
  // setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['<rootDir>/src/**/*.spec.(js|jsx|ts|tsx)'],
  transform: {
    '\\.(ts|tsx)$': 'ts-jest'
    // '\\.(ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [],
  verbose: true
};
