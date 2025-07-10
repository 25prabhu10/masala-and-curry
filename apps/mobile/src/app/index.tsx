import { Button, Text } from '@mac/mobile-ui'
import { Stack, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { SafeAreaView, View } from 'react-native'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <SafeAreaView>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Stack.Screen
          options={{
            title: 'Home',
            headerRight: () => <ThemeToggle />,
            headerStyle: { backgroundColor: '#f4511e' },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <View>
          <Text>🍜Welcome to Masala and Curry🍛</Text>
        </View>
        <View className="flex flex-row rounded-lg bg-muted p-4">
          <Text>Welcome to Nativewind!</Text>
        </View>
        <Button size="lg">
          <Text>Get Started</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}
