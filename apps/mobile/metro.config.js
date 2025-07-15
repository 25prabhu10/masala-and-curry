// Learn more https://docs.expo.io/guides/customizing-metro
// const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config')
const { getDefaultConfig } = require('expo/metro-config')
const { FileStore } = require('metro-cache')
const { withNativeWind } = require('nativewind/metro')

const path = require('node:path')

const defaultConfig = getDefaultConfig(__dirname)

defaultConfig.transformer.getTransformOptions = async () => {
  return {
    transform: {
      // Inline requires are very useful for deferring loading of large dependencies/components.
      // For example, we use it in app.tsx to conditionally load Reactotron.
      // However, this comes with some gotchas.
      // Read more here: https://reactnative.dev/docs/optimizing-javascript-loading
      // And here: https://github.com/expo/expo/issues/27279#issuecomment-1971610698
      inlineRequires: true,
    },
  }
}

// Enabled by default in RN 0.79+, but this breaks Lingui + others
defaultConfig.resolver.unstable_enablePackageExports = false

const config = withTurborepoManagedCache(
  withNativeWind(defaultConfig, {
    configPath: './tailwind.config.ts',
    input: './src/styles/global.css',
  })
)
module.exports = config

/**
 * Move the Metro cache to the `.cache/metro` folder.
 * If you have any environment variables, you can configure Turborepo to invalidate it when needed.
 *
 * @see https://turborepo.com/docs/reference/configuration#env
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withTurborepoManagedCache(config) {
  config.cacheStores = [new FileStore({ root: path.join(__dirname, '.cache/metro') })]
  return config
}
