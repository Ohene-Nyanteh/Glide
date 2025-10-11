import Header from "@/components/General/Header";
import SongMiniModal from "@/components/General/SongMiniModal";
import TabsComponent from "@/components/General/TabsComponent";
import { Stack } from "expo-router";
import { View } from "react-native";

function TabLayout() {
  return (
    <View className="w-full h-full relative dark:bg-black bg-white">
      <View className="w-full">
        <Header />
        <TabsComponent />
      </View>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="for-you" />
        <Stack.Screen name="albums" />
        <Stack.Screen name="artists" />
        <Stack.Screen name="playlist" />
      </Stack>
      <SongMiniModal />
    </View>
  );
}

export default TabLayout;
