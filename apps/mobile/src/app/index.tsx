import { Button } from '@mac/mobile-ui/button'
import { Text } from '@mac/mobile-ui/text'
import { Stack, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'

import { ThemeToggle } from '@/components/theme-toggle'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function Home() {
  const navigation = useNavigation()
  const { isDarkColorScheme } = useColorScheme()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <View className="flex-1 justify-center items-center bg-background gap-5 p-6">
        <View className="mb-8 items-center space-y-10">
          <Text>🍜Welcome to 012345 ಮಸಾಲೆ Masala मुखपृष्ठ and Curry🍛</Text>
          <ThemeToggle />
          <Text className="text-4xl">
            {`${isDarkColorScheme}`} : {isDarkColorScheme ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Text className="text-2xl">{process.env.NODE_ENV}</Text>
        </View>
        <Button size="lg">
          <Text>Get Started</Text>
        </Button>
      </View>
    </>
  )
}
