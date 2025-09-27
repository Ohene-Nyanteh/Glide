import Header from "@/components/General/Header";
import SongMiniModal from "@/components/General/SongMiniModal";
import TabsComponent from "@/components/General/TabsComponent";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

function TabLayout() {
  const linklists = ["for-you", "albums", "artists", "playlist"];
  const [current, setCurrent] = useState(0);

  const navigate = (side: "left" | "right") => {
    if (side === "left") {
      if (current === 0) return;
      const newIndex = current - 1;
      setCurrent(newIndex);
      router.navigate(linklists[newIndex] as any);
    } else {
      if (current === linklists.length - 1) return;
      const newIndex = current + 1;
      setCurrent(newIndex);
      router.navigate(linklists[newIndex] as any);
    }
  };

  const slideRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(navigate)("right");
    });

  const slideLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      runOnJS(navigate)("left");
    });

  const gestures = Gesture.Race(slideLeft, slideRight);

  return (
    <GestureDetector gesture={gestures}>
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
    </GestureDetector>
  );
}

export default TabLayout;
