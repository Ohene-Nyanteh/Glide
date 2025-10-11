import { View, Text, Pressable, TextInput, Modal } from "react-native";
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
import { toast } from "@backpackapp-io/react-native-toast";

export default function AddSongs() {
  const PlayerContext = usePlayer();
  const { id } = useLocalSearchParams();
  const [show, setShow] = useState(false);
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const player = new MobilePlayer(PlayerContext?.player.getSongs() || []);
  const [addedSongs, setAddedSongs] = useState<number[]>([]);
  const [displayedSongs, setDisplayedSongs] = useState<musicDelta[]>([]);

  const getPlaylistsSongsId = async () => {
    try {
      const res: playlist_songs[] = await db.getAllAsync(
        "SELECT * FROM playlist_songs WHERE playlist_id = ?",
        [id as string]
      );
      const songs_id = res.map((songs) => songs.song_id);
      setDisplayedSongs(
        player.getSongs().filter((song) => {
          if (!songs_id.includes(song.id as number)) {
            return song;
          }
        })
      );
    } catch (e) {
      toast.error("Error: Couldnt get Playlists Songs");
    }
  };

  const submitSongs = () => {
    try {
      addedSongs.forEach(async (song, index) => {
        try {
          //check if song already exists in db
          const exists: playlist_songs | null = await db.getFirstAsync(
            "SELECT playlist_id, song_id, position FROM playlist_songs WHERE playlist_id = ? AND song_id = ?",
            [id as string, song]
          );
          if (exists) {
            setShow(true);
          } else {
            // add song
            await db.runAsync(
              "INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES (?, ?, ?);",
              [id as string, song, index]
            );
          }
        } catch (e) {
          toast.error("Error: Couldnt Get Songs");
        }
      });

      router.navigate(`/playlist/${id as string}/view`);
    } catch (e) {
      toast.error("Error: Couldnt Add Songs");
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
      {show && (
        <Modal className="w-full" transparent>
          <View className="w-full h-screen bg-transparent flex flex-row items-center justify-center">
            <View className="p-4 rounded bg-gray-200 dark:bg-gray-800 flex flex-col gap-3 items-center w-48">
              <Text className="dark:text-white">Song Already Exists</Text>
              <Pressable onPress={() => setShow(false)}>
                <Text className="dark:text-white p-4 py-1 bg-blue-600 rounded">
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
      <View className="flex flex-row items-center justify-between">
        <Pressable onPress={() => router.back()}>
          <AntDesign
            name="arrow-left"
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
        {displayedSongs.length > 0 ? (
          <FlashList
            data={displayedSongs}
            keyExtractor={(_, index) => index.toString()}
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
          />
        ) : (
          <View>
            <Text className="dark:text-white text-center">
              No Songs Available
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
