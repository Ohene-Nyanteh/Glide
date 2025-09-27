import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function ArtistIDLayout() {
  return (
    <View className="w-full h-full">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="view"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
      </Stack>
    </View>
  )
}