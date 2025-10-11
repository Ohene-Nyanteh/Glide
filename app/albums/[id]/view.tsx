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
import { musicDelta } from "@ohene/flow-player";
import { shortenText } from "@/lib/shortenText";
import { FlashList } from "@shopify/flash-list";
import SongRow from "@/components/General/SongRow";
import { music, musicDB } from "@/types/music";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "@backpackapp-io/react-native-toast";

export default function AlbumPage() {
  const router = useRouter();
  const [album, setAlbum] = useState<{
    name: string;
    number_of_songs: number;
    songs: musicDelta[];
  } | null>(null);

  const db = useSQLiteContext();
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const fetchAlbum = async () => {
    try {
      const data: musicDB[] | null = await db.getAllAsync(
        "SELECT * FROM songs WHERE album = ?",
        [id as string]
      );

      if (data) {
        const songs: musicDelta[] = data.map((song) => {
          return {
            id: song.id,
            music_path: song.music_path,
            metadata: {
              image: song.image,
              artist: song.artist,
              album: song.album,
              dateModified: song.dateModified,
              duration: song.duration,
              genre: song.genre,
              name: song.name,
            },
          };
        });
        setAlbum({
          name: data[0].album,
          number_of_songs: data.length,
          songs: songs,
        });
      }
    } catch (e) {
      toast.error("Error: Couldnt Fetch Album");
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  return (
    <View className="w-full h-full p-4 dark:bg-black flex flex-col gap-0">
      <View className="flex flex-row justify-between items-center">
        <Pressable onPress={() => router.navigate("/albums")}>
          <AntDesign
            name="arrow-left"
            size={20}
            color={theme.theme === "dark" ? "white" : "black"}
          />
        </Pressable>
        <Text className="dark:text-white">Album</Text>
        <View className="flex flex-row gap-2 items-center">
          <Pressable>
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={theme.theme === "dark" ? "white" : "black"}
            />
          </Pressable>
        </View>
      </View>
      {album ? (
        <View className="w-full h-full">
          <View className="py-6 flex flex-row gap-4 h-auto">
            <View className="w-[20%] h-auto">
              {album.songs[0].metadata?.image ? (
                <Image
                  source={{
                    uri: `${album.songs[0].metadata?.image}`,
                  }}
                  resizeMode="cover"
                  height={50}
                  className="rounded w-full"
                />
              ) : (
                <View className="flex flex-row justify-center h-[50px] items-center w-full rounded bg-gray-500/40">
                  <FontAwesome name="music" size={30} color="gray" />
                </View>
              )}
            </View>
            <View className="w-[78%] h-auto flex flex-col gap-2">
              <Text className="dark:text-white text-xl text-black">
                {shortenText(album.name, 19)}
              </Text>
              <Text className="text-gray-600 dark:text-gray-700 text-xs">
                Number of Songs: {album.number_of_songs}
              </Text>
            </View>
          </View>

          <View className="flex flex-row flex-nowrap gap-4 w-full">
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
          <View className="w-full h-full flex-1">
            <FlashList
              data={album.songs}
              keyExtractor={(_, index) => index.toString()}
              ItemSeparatorComponent={() => <View style={{ height: 3 }} />}
              renderItem={({ item }) => <SongRow song={item} />}
              contentContainerStyle={{
                paddingBottom: insets.bottom,
                paddingTop: 20,
              }}
            />
          </View>
        </View>
      ) : (
        <Text>Playlist Not Found</Text>
      )}
    </View>
  );
}
