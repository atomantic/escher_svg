module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    'lib/**/*.js',
    '!**/node_modules/**'
  ]
};