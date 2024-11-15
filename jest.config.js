module.exports = {
    preset: 'react-native',
    setupFiles: [
      './jest/setup.js',  // Custom setup file for globals (includes __DEV__)
    ],
    setupFilesAfterEnv: [
      '@testing-library/jest-native/extend-expect',  // Extends Jest matchers
      'react-native-gesture-handler/jestSetup',    // If using gesture handler
    ],
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',  // Ensure Jest transforms JSX and TSX files correctly
    },
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|@react-native|react-native-calendars|expo-notifications)/)',
    ],
    moduleNameMapper: {
      '\\.svg': 'jest-transform-stub',  // Handle SVG imports in tests
      '^@app/(.*)$': '<rootDir>/app/$1',  // Resolves paths starting with @app
      '^@/(.*)$': '<rootDir>/$1',  // Resolves paths starting with @
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    testPathIgnorePatterns: ['node_modules', '.expo'],  // Ignore certain paths
  };
  