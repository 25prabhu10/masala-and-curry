import { Button } from '@mac/mobile-ui/button'
import { Text } from '@mac/mobile-ui/text'
import { Stack, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { Image, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const HERO_IMAGE = require('../../assets/icons/splash-icon-light.png')
const LOGO_IMAGE = require('../../assets/icons/icon.png')

export default function Home() {
  const navigation = useNavigation()

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
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-between px-6 py-12">
          <View className="w-full items-center">
            <Image
              accessibilityLabel="Chef presenting dishes from Masala and Curry"
              accessibilityRole="image"
              className="h-60 w-60"
              resizeMode="contain"
              source={HERO_IMAGE}
            />
            <View className="mt-10 items-center space-y-4">
              <Image
                accessibilityIgnoresInvertColors
                accessibilityLabel="Masala and Curry logo"
                accessibilityRole="image"
                className="h-20 w-20"
                resizeMode="contain"
                source={LOGO_IMAGE}
              />
              <Text className="text-center text-3xl font-semibold">Masala and Curry</Text>
              <Text className="text-center text-base text-foreground/80">
                Flavorful Indian meals prepared with care and delivered fresh.
              </Text>
            </View>
          </View>
          <Button className="w-full" size="lg">
            <Text>Get Started</Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  )
}
