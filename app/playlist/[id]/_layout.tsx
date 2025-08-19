import { Stack } from "expo-router";
import { View } from "react-native";

function PlaylistLayout() {
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
        <Stack.Screen
          name="addSongs"
          options={{ presentation: "modal", animation: "slide_from_bottom"}}
        />
      </Stack>
    </View>
  );
}
export default PlaylistLayout;
