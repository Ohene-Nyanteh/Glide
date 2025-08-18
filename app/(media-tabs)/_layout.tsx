import Header from "@/components/General/Header";
import Sort from "@/components/General/Sort";
import TabsComponent from "@/components/General/TabsComponent";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";
import { View } from "react-native";

function TabLayout() {
  return (
    <View className="w-full h-full">
      <Stack
        screenOptions={{
          header: () => (
            <View
              className="w-full"
            >
              <Header />
              <TabsComponent />
            </View>
          ),
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="for-you" />
        <Stack.Screen name="albums" />
        <Stack.Screen name="artists" />
        <Stack.Screen name="playlist" />
      </Stack>
    </View>
  );
}
export default TabLayout;
