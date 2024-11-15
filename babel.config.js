module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',  // Preset for Expo (including React Native)
      '@babel/preset-react', // Preset for React (JSX support)
      '@babel/preset-typescript', // TypeScript preset
    ],
    plugins: [
      'react-native-reanimated/plugin', // If using Reanimated (ensure you have this plugin if needed)
    ],
  };
};
