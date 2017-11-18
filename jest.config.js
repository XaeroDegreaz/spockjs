module.exports = {
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testRegex: '.*\\.(test|spec)\\.(j|t)sx?$',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
};
