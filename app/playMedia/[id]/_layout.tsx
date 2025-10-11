import { View, Text, Pressable } from "react-native";
import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { shortenText } from "@/lib/shortenText";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useTheme } from "@/utils/contexts/ThemeContext";
import { useAudioPlayerContext } from "@/utils/contexts/AudioContext";
import SongMenu from "@/components/General/SongMenu";

export default function PlayMediaLayout() {
  const { theme } = useTheme();
  const { song } = useAudioPlayerContext();

  return (
    <View className="w-full h-full">
      {/* Header */}
      <View className="flex flex-row justify-between items-center p-4 dark:bg-black">
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign
            name="arrow-left"
            size={20}
            color={theme.theme === "dark" ? "white" : "black"}
          />
        </Pressable>

        <View>
          <Text className="text-gray-400 text-xs text-center">Now Playing</Text>
          <Text className="dark:text-white text-center text-sm">
            {shortenText(song?.metadata?.name ?? "Unknown Song", 40)}
          </Text>
        </View>
        {song ? (
          <SongMenu song={song} song_id={song.id} theme={theme.theme} />
        ) : (
          <Pressable>
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={theme.theme === "dark" ? "white" : "black"}
            />
          </Pressable>
        )}
      </View>

      {/* Navigation Stack */}
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="lyrics"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
    </View>
  );
}
