import { View, Text, Pressable, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { MobilePlayer, musicDelta } from "@ohene/flow-player";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import SelectedSongRow from "@/components/ui/playlists/SelectSongRow";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/utils/contexts/ThemeContext";
import { useSQLiteContext } from "expo-sqlite";
import { playlist_songs } from "@/types/db";
import { music } from "@/types/music";

export default function AddSongs() {
  const PlayerContext = usePlayer();
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const player = new MobilePlayer(PlayerContext?.player.getSongs() || []);
  const [addedSongs, setAddedSongs] = useState<number[]>([]);
  const [displayedSongs, setDisplayedSongs] = useState<musicDelta[]>([]);

  const getPlaylistsSongsId = async () => {
    try {
      const res: playlist_songs[] = await db.getAllAsync(
        "SELECT * FROM playlist_songs",
        [id as string]
      );
      const songs_id = res.map((songs) => songs.song_id);
      setAddedSongs(songs_id);
      setDisplayedSongs(player.getSongs());
    } catch (e) {
      console.error(e);
    }
  };

  const submitSongs = () => {
    try {
      addedSongs.forEach(async (song, index) => {
        try {
          await db.runAsync(
            "INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES (?, ?, ?)",
            [id as string, song, index]
          );
        } catch (e) {
          console.error(e);
        }
      });

      router.push(`/playlist/${id as string}/view`);
    } catch (e) {
      console.error(e);
    }
  };
  const handleSearch = (text: string) => {
    if (text === "") {
      setDisplayedSongs(player.getSongs());
    } else {
      setDisplayedSongs((prev) =>
        prev.filter((song) => {
          const name = song.metadata?.name.toLocaleLowerCase();
          if (name?.includes(text.toLocaleLowerCase())) {
            return true;
          } else return false;
        })
      );
    }
  };

  const add = (id: number) => {
    setAddedSongs((prev) => [...prev, id]);
  };

  const remove = (id: number) => {
    setAddedSongs((prev) => prev.filter((song_id) => song_id != id));
  };

  useEffect(() => {
    getPlaylistsSongsId();
  }, [id]);

  return (
    <View className="w-full dark:bg-black h-full overflow-y-auto p-4 flex flex-col gap-4">
      <View className="flex flex-row items-center justify-between">
        <Pressable onPress={() => router.back()}>
          <AntDesign
            name="arrowleft"
            size={20}
            color={theme.theme === "dark" ? "white" : "black"}
          />
        </Pressable>
        <Text className="dark:text-white">Add Songs</Text>
        <Pressable onPress={submitSongs}>
          <MaterialIcons
            name="done"
            size={20}
            color={theme.theme === "dark" ? "white" : "black"}
          />
        </Pressable>
      </View>
      <View className="w-full h-auto">
        <TextInput
          onChangeText={(text) => handleSearch(text)}
          className="border-b border-b-blue-600 dark:text-white"
          placeholder="Search..."
          placeholderTextColor={"gray"}
        />
      </View>
      <View className="w-full h-full">
        <FlashList
          data={displayedSongs}
          keyExtractor={(_, index) => index.toString()}
          // refreshControl={
          //   <RefreshControl refreshing={refresh} onRefresh={refreshData} />
          // }
          ItemSeparatorComponent={() => <View style={{ height: 3 }} />}
          renderItem={({ item }) => (
            <SelectedSongRow
              added={addedSongs.includes(item?.id as number)}
              song={item}
              onAdd={add}
              onRemove={remove}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 120,
          }}
          estimatedItemSize={58}
        />
      </View>
    </View>
  );
}
