import { Button, Text } from '@mac/mobile-ui'
import { useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'

export default function Home() {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <View className="mb-8 items-center">
        <Text>🍜Welcome to Masala and Curry🍛</Text>
      </View>
      <Button size="lg">
        <Text>Get Started</Text>
      </Button>
    </View>
  )
}
