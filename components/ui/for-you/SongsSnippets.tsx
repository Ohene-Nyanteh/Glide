import SongCard from "@/components/General/SongCard";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import { AntDesign } from "@expo/vector-icons";
import { musicDelta } from "@ohene/flow-player";
import { useTheme } from "@/utils/contexts/ThemeContext";
import { FlashList } from "@shopify/flash-list";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import SongRow from "@/components/General/SongRow";

function SongsSnippets() {
  const PlayerContext = usePlayer();
  const songs = PlayerContext?.player.getSongs().slice(0, 5);
  const { theme } = useTheme();

  return (
    <View className="w-full h-auto">
      <View className="flex flex-row justify-between items-center px-4 py-1">
        <Text className="text-lg font-semibold dark:text-white">
          Songs
        </Text>
        <Text className="text-sm dark:text-blue-600">View All</Text>
      </View>
      <View className="w-full h-auto">
        <FlashList
          data={songs}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={
            <View className="flex flex-row gap-4 w-full justify-center items-center h-60 px-10">
              <AntDesign
                name="exclamationcircle"
                size={24}
                color={theme.theme === "dark" ? "white" : "black"}
              />
              <Text className="text-white">No Songs Found</Text>
            </View>
          }
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          estimatedItemSize={148}
          renderItem={({ item }) => <SongRow song={item} />}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>
    </View>
  );
}

export default SongsSnippets;