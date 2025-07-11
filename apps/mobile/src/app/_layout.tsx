import '@/styles/global.css'
import { DarkTheme, DefaultTheme, type Theme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ThemeToggle } from '@/components/theme-toggle'
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

function App() {
  return (
    <Stack>
      <Stack.Screen
        options={{
          title: 'Home',
          headerRight: () => <ThemeToggle />,
        }}
      />
    </Stack>
  )
}

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'dark' : 'light'} />
      <App />
    </ThemeProvider>
  )
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'
