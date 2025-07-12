import { Button } from '@mac/mobile-ui'
import { useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'

import { Text } from '@/components/text'
import { ThemeToggle } from '@/components/theme-toggle'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function Home() {
  const navigation = useNavigation()
  const { isDarkColorScheme } = useColorScheme()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <View className="flex-1 justify-center items-center bg-background gap-5 p-6">
      <View className="mb-8 items-center space-y-10">
        <Text>🍜Welcome to Masala and Curry🍛</Text>
        <ThemeToggle />
        <Text className="text-4xl">
          {`${isDarkColorScheme}`} : {isDarkColorScheme ? 'Dark Mode' : 'Light Mode'}
        </Text>
      </View>
      <Button size="lg">
        <Text>Get Started</Text>
      </Button>
    </View>
  )
}
