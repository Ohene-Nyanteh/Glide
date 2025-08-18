import { View, Text, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/utils/contexts/ThemeContext";
import { useSQLiteContext } from "expo-sqlite";
import { musicDelta, PlaylistDelta } from "@ohene/flow-player";
import { playlists } from "@/types/db";
import { shortenText } from "@/lib/shortenText";
import Sort from "@/components/General/Sort";

interface PlaylistContext {
  playlist: playlists;
  songs?: musicDelta[];
  thumbnail: string | null | undefined;
}

export default function PlaylistPage() {
  const router = useRouter();
  const [playlist, setPlaylist] = useState<PlaylistContext | null>(null);
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();

  const fetchPlaylistInfo = async () => {
    try {
      const data: {
        id: string;
        length: number;
        about: string;
        name: string;
        image_data: string;
      } | null = await db.getFirstAsync(
        "SELECT * FROM playlists INNER JOIN thumbnails ON playlists.id = thumbnails.playlist_id WHERE playlists.id = ?",
        [id as string]
      );

      if (data) {
        const formattedData: playlists = {
          name: data.name,
          about: data.about,
          length: data.length,
          id: data.id,
        };
        setPlaylist({ playlist: formattedData, thumbnail: data.image_data });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPlaylistInfo();
  }, [id]);

  return (
    <View className="w-full h-full p-4 dark:bg-black">
      <View className="flex flex-row justify-between items-center py-4">
        <Pressable onPress={() => router.back()}>
          <AntDesign
            name="arrowleft"
            size={20}
            color={theme.theme === "dark" ? "white" : "black"}
          />
        </Pressable>
        <Text className="dark:text-white">PLAYLIST</Text>
        <View className="flex flex-row gap-2 items-center">
          <Pressable onPress={() => router.push("/(media-tabs)/albums")}>
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={theme.theme === "dark" ? "white" : "black"}
            />
          </Pressable>
        </View>
      </View>
      {playlist ? (
        <View className="w-full h-auto">
          <View className="py-6 flex flex-row gap-4 h-auto">
            <View className="w-[48%] h-auto">
              {playlist.thumbnail ? (
                <Image
                  source={{
                    uri: `${playlist.thumbnail}`,
                  }}
                  resizeMode="cover"
                  height={150}
                  className="rounded w-full"
                />
              ) : (
                <View className="flex flex-row justify-center items-center w-16 h-14 rounded bg-gray-500/40">
                  <FontAwesome name="music" size={20} color="gray" />
                </View>
              )}
            </View>
            <View className="w-[48%] h-auto flex flex-col gap-2">
              <Text className="dark:text-white text-xl text-black">
                {shortenText(playlist.playlist.name, 19)}
              </Text>
              <Text className="text-gray-600 dark:text-gray-700">
                {shortenText(playlist.playlist.about, 100)}
              </Text>
            </View>
          </View>
          <View className="flex flex-row w-full justify-between py-2 items-center">
            <Text className="text-sm dark:text-white">
              {playlist.playlist.length} Songs
            </Text>
            <View className="flex gap-2 flex-row">
              <Pressable  className="p-2 rounded-full hover:bg-gray-100/50">
                <MaterialIcons name="playlist-add" size={25} color={theme.theme === "dark" ? "white" : "dark"}/>
              </Pressable>
            </View>
          </View>
          <View className="flex flex-row flex-nowrap  gap-4 w-full">
            <Pressable
              android_ripple={{ color: "gray" }}
              className="w-[48%] px-4 py-2 rounded flex flex-row items-center gap-4  bg-gray-200 dark:bg-slate-900"
            >
              <MaterialIcons
                name="shuffle"
                size={24}
                color={theme.theme === "dark" ? "blue" : "gray"}
              />
              <Text className="dark:text-white text-sm">Shuffle</Text>
            </Pressable>
            <Pressable
              android_ripple={{ color: "blue" }}
              className="w-[48%] px-4 py-2 rounded flex flex-row items-center gap-4 bg-gray-200 dark:bg-slate-800"
            >
              <FontAwesome5 name="play-circle" size={24} color={"blue"} />
              <Text className="dark:text-white text-sm">Play</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text>Playlist Not Found</Text>
      )}
    </View>
  );
}


