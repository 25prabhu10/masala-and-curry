import { Stack, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

export default function Home() {
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Stack.Screen
          options={{
            title: 'Home',
            headerStyle: { backgroundColor: '#f4511e' },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Text>🍜Welcome to Masala and Curry🍛</Text>
        <View className="flex flex-row rounded-lg bg-muted p-4">
          <Text className="font-bold uppercase text-primary">Welcome to Nativewind!</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
})
