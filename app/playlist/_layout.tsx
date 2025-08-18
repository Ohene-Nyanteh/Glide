import { Stack } from "expo-router";
import { View } from "react-native";

function PlaylistsMedia() {
  return (
    <View className="w-full h-full">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="addPlaylist"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
      </Stack>
    </View>
  );
}
export default PlaylistsMedia;
