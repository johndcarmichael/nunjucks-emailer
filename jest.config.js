module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'ts',
    'tsx'
  ],

  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  coverageDirectory: 'coverage',

  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
    '/build/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '**/__tests__/*.ts',
  ],
  testURL: 'http://localhost/',
}
