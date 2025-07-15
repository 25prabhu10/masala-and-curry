import { MoonStar } from '@mac/mobile-ui/icons/moon'
import { Sun } from '@mac/mobile-ui/icons/sun'
import { Pressable, View } from 'react-native'

import { useColorScheme } from '@/hooks/use-color-scheme'

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme()

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? 'light' : 'dark'
    setColorScheme(newTheme)
    // setAndroidNavigationBar(newTheme);
  }

  return (
    <Pressable
      className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 active:opacity-70"
      onPress={toggleColorScheme}
    >
      <View className="aspect-square pt-0.5 justify-center items-start web:px-5">
        {isDarkColorScheme ? (
          <MoonStar className="text-foreground" size={24} />
        ) : (
          <Sun className="text-foreground" size={24} />
        )}
      </View>
    </Pressable>
  )
}
