module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  // verbose: true,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: ['<rootDir>/src/**'],
  roots: ['<rootDir>/test/'],
  testMatch: ['<rootDir>/test/**/*.(test|spec).(js|ts)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [], // 不能忽略
  // Setup Enzyme
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupTestFrameworkScriptFile: '<rootDir>/test/setupEnzyme.ts'
};
