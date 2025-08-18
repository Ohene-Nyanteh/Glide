import SongRow from "@/components/General/SongRow";
import PlayerContext, { usePlayer } from "@/utils/contexts/PlayerContext";
import { AntDesign } from "@expo/vector-icons";
import { musicDelta } from "@ohene/flow-player";
import { useTheme } from "@/utils/contexts/ThemeContext";
import { FlashList } from "@shopify/flash-list";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import ArtistCard from "@/components/General/ArtistCard";

function Artists() {
  const PlayerContext = usePlayer();
  const songs = PlayerContext?.player.getSongs().slice(0, 5) ?? [];
  const { theme } = useTheme();

  // Group songs by album
  const groupedByArtist = songs.reduce<Record<string, typeof songs>>(
    (acc, song) => {
      const artist = song.metadata?.album;
      if (artist) {
        if (!acc[artist]) {
          acc[artist] = [];
        }
        acc[artist].push(song);
      }
      return acc;
    },
    {}
  );

  // Convert to array for FlashList
  const artistArray = Object.entries(groupedByArtist).map(
    ([artist, songs]) => ({
      artist,
      songs,
    })
  );

  return (
    <View className="w-full h-auto">
      <View className="flex flex-row justify-between items-center px-4 py-1">
        <Text className="text-lg font-semibold dark:text-white">
          Artists Played
        </Text>
        <Text className="text-sm dark:text-blue-600">View All</Text>
      </View>
      <View className="w-full h-60">
        <FlashList
          data={artistArray}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          ListEmptyComponent={
            <View className="flex flex-row gap-4 w-full justify-center items-center h-60 px-10">
              <AntDesign
                name="exclamationcircle"
                size={24}
                color={theme.theme === "dark" ? "white" : "black"}
              />
              <Text className="text-white">No Artists Played Songs Found</Text>
            </View>
          }
          showsHorizontalScrollIndicator={true}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          estimatedItemSize={148}
          renderItem={({ item }) => <ArtistCard song={item.songs[0]} />}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>
    </View>
  );
}

export default Artists;
