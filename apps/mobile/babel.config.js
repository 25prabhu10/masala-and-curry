module.exports = function exports(api) {
  api.cache(true)
  return {
    plugins: ['react-native-reanimated/plugin'],
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  }
}
