import { Text } from '@mac/mobile-ui'
import { Image, View } from 'react-native'

const welcomeLogo = require('@assets/images/logo.png')

export default function WelcomeScreen() {
  return (
    <View className="flex-1 w-full h-screen">
      <View className="items-stretch justify-end">
        <Image className="h-88 w-full mb-64" source={welcomeLogo} />
        <Text>🍜Welcome to Masala and Curry🍛</Text>
      </View>
    </View>
  )
}
