import SongCard from "@/components/General/SongCard";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { musicDelta } from "@ohene/flow-player";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@/utils/contexts/ThemeContext";
import AlbumCard from "@/components/General/AlbumCard";

function AlbumsSnippet() {
  const PlayerContext = usePlayer();
  const songs = PlayerContext?.player.getSongs() ?? [];
  const db = useSQLiteContext();
  const { theme } = useTheme();

  // Group songs by album
  const groupedByAlbum = songs.reduce<Record<string, typeof songs>>(
    (acc, song) => {
      const album = song.metadata?.album;
      if (album) {
        if (!acc[album]) {
          acc[album] = [];
        }
        acc[album].push(song);
      }
      return acc;
    },
    {}
  );

  // Convert to array for FlashList
  const albumsArray = Object.entries(groupedByAlbum).map(
    ([albumName, songs]) => ({
      albumName,
      songs,
    })
  );

  return (
    <View className="w-full h-auto">
      <View className="flex flex-row justify-between items-center px-4 py-1">
        <Text className="text-lg font-semibold dark:text-white">Albums</Text>
        <Text className="text-sm dark:text-blue-600">View All</Text>
      </View>
      <View className="w-full h-60">
        <FlashList
          data={albumsArray}
          keyExtractor={(item, index) => item.albumName + index}
          horizontal
          ListEmptyComponent={
            <View className="flex flex-row gap-4 w-full justify-center items-center h-60 px-10">
              <AntDesign
                name="exclamation-circle"
                size={24}
                color={theme.theme === "dark" ? "white" : "black"}
              />
              <Text className="text-white">No Recommended Songs Found</Text>
            </View>
          }
          showsHorizontalScrollIndicator={true}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          renderItem={({ item }) => (
            <AlbumCard
              song={item.songs[0]}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>
    </View>
  );
}

export default AlbumsSnippet;
