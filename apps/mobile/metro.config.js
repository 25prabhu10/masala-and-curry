// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config')
const { FileStore } = require('metro-cache')
const { withNativeWind } = require('nativewind/metro')

const path = require('node:path')

const config = withTurborepoManagedCache(
  withNativeWind(getDefaultConfig(__dirname), {
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
