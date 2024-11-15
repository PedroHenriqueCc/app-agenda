module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      'babel-preset-expo', // Expo preset for React Native
      '@babel/preset-react', // React preset for JSX and React
      '@babel/preset-typescript', // TypeScript preset (if you're using TypeScript)
    ],
    plugins: [
      'react-native-reanimated/plugin', // For React Native Reanimated (if used in your project)
    ],
  };
};
