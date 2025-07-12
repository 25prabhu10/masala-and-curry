// oxlint-disable style-prop-object
import '@/styles/global.css'

import { DarkTheme, DefaultTheme, type Theme, ThemeProvider } from '@react-navigation/native'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useLayoutEffect, useRef, useState } from 'react'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'

import { useColorScheme } from '@/hooks/use-color-scheme'
import { NAV_THEME } from '@/lib/constants'

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
}
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
}

// SplashScreen.preventAutoHideAsync()

function App() {
  return (
    <Stack>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
    </Stack>
  )
}

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme()
  const hasMounted = useRef(false)
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false)

  useLayoutEffect(() => {
    if (hasMounted.current) {
      return
    }

    setIsColorSchemeLoaded(true)
    hasMounted.current = true
    SplashScreen.hideAsync()
  }, [])

  if (!isColorSchemeLoaded) {
    return null
  }

  console.log('isDarkColorScheme', isDarkColorScheme)

  return (
    <SafeAreaProvider className="flex-1" initialMetrics={initialWindowMetrics}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <App />
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'
