import { View, Text, Pressable, Image, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import Slider from "@react-native-community/slider";
import { router, useLocalSearchParams } from "expo-router";
import { theme, useTheme } from "@/utils/contexts/ThemeContext";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { musicDelta } from "@ohene/flow-player";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { settings, songs } from "@/types/db";
import { shortenText } from "@/lib/shortenText";
import { formatTime } from "@/lib/formatTime";
import Toast from "@amitsolanki1409/react-native-toast-message";

export default function PlaySongPage() {
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const [song, setSong] = useState<musicDelta | null>(null);
  const [imageError, setImageError] = useState(false);
  const [durationPercentage, setDurationPercentage] = useState(20);
  const [durationObject, setDurationObject] = useState<{
    currentDuration: number;
    totalDuration: number;
  }>({
    currentDuration: 0,
    totalDuration: 0,
  });

// Toast.show({
//   message: "Custom styled toast",
//   title: "Notice",
//   type: "info",
//   titleStyle: { fontSize: 20, fontWeight: "bold" },
//   messageStyle: { color: "#333" },
//   containerStyle: { borderWidth: 2, borderColor: "#000" },
//   alertColor: "#0af", // overrides icon background color
// });
  const fetchSongInfo = async () => {
    try {
      const songInfo: songs | null = await db.getFirstAsync(
        "SELECT * FROM songs WHERE id = ?",
        [id as string]
      );

      if (songInfo) {
        setSong({
          id: songInfo.id,
          music_path: songInfo.music_path,
          metadata: {
            name: songInfo.name,
            album: songInfo.album,
            artist: songInfo.artist,
            dateModified: songInfo.dateModified,
            genre: songInfo.genre,
            duration: songInfo.duration,
            image: songInfo.image,
          },
        });
      }
    } catch (error) {
      console.error("Error");
    }
  };

  const setDurationInfo = () => {
    if (song?.metadata?.duration) {
      setDurationObject({
        currentDuration: 0,
        totalDuration: song.metadata.duration,
      });
    }
  };

  useEffect(() => {
    fetchSongInfo();
    setDurationInfo();
  }, [id]);

  return (
    <View className="w-full h-full dark:bg-black p-4">
      <View className="flex flex-row justify-between items-center">
        <Pressable onPress={() => router.back()}>
          <AntDesign
            name="arrowleft"
            size={20}
            color={theme.theme === "dark" ? "white" : "black"}
          />
        </Pressable>
        <View>
          <Text className="text-gray-400 text-xs text-center">Now Playing</Text>
          <Text className="dark:text- text-center text-sm">
            {shortenText(song?.metadata?.name ?? "Unknown Song", 20)}
          </Text>
        </View>

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
      <View className="w-full h-full">
        {song ? (
          <View className="w-full h-full">
            <View className="w-full flex items-center justify-center py-8">
              <View className="rounded-full overflow-hidden w-[340px] h-[340px] border-8 border-blue-600">
                {song.metadata?.image ? (
                  imageError ? (
                    <View className="flex flex-row justify-center items-center w-16 h-14 rounded bg-gray-500/40">
                      <FontAwesome name="music" size={20} color="gray" />
                    </View>
                  ) : (
                    <Image
                      source={{ uri: song.metadata?.image }}
                      style={{
                        width: "100%",
                        height: "100%",
                        transform: [{ scale: 1.7 }],
                      }}
                      onError={() => setImageError(true)}
                      resizeMode="cover"
                      className="w-full h-full"
                    />
                  )
                ) : (
                  <View className="flex flex-row justify-center items-center w-full h-full rounded bg-gray-500/40">
                    <FontAwesome name="music" size={20} color="gray" />
                  </View>
                )}
              </View>
            </View>
            <View className="flex flex-col gap-6">
              <View className="w-full flex flex-col gap-4 items-center">
                <Text className="dark:text-white font-semibold uppercase text-lg">
                  {shortenText(song.metadata?.name || "Unknown Song", 45)}
                </Text>
                <Text className="dark:text-gray-600 text-gray-400">
                  {song.metadata?.artist}
                </Text>
              </View>
              <View className="w-full h-2 relative">
                <View className="w-full h-2 rounded bg-gray">
                  <Slider
                    style={{ width: "100%", height: 8, backgroundColor: "gray" }}
                    minimumValue={0}
                    tapToSeek
                    maximumValue={1}
                    minimumTrackTintColor="blue"
                    maximumTrackTintColor="gray"
                  />
                </View>
              </View>
              <View className="w-full h-4 flex flex-row justify-between">
                <Text className="text-sm dark:text-gray-200">
                  {formatTime(durationObject.currentDuration)}
                </Text>
                <Text className="text-sm dark:text-gray-200">
                  {formatTime(durationObject.totalDuration)}
                </Text>
              </View>
              <View className="flex w-full flex-row justify-between px-6 items-center">
                <ShuffleButton themeProvider={theme} db={db} />
                <Pressable>
                  <AntDesign
                    name="stepbackward"
                    size={30}
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                </Pressable>
                <Pressable>
                  <AntDesign
                    name="play"
                    size={60}
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                </Pressable>
                <Pressable>
                  <AntDesign
                    name="stepforward"
                    size={30}
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                </Pressable>
                <RepeatButton db={db} themeProvider={theme} />
              </View>
              <View className="w-full h-auto flex flex-row justify-between py-3 px-16">
                <View>
                  <MaterialIcons
                    name="favorite-outline"
                    size={25}
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                </View>
                <View className="flex gap-1 flex-row items-center">
                  <MaterialCommunityIcons
                    name="comment-text-outline"
                    size={25}
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                  <Text className="text-sm dark:text-white">Lyrics</Text>
                </View>
                <View>
                  <MaterialIcons
                    name="queue-music"
                    size={25}
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
}

const RepeatButton = ({
  themeProvider,
  db,
}: {
  themeProvider: { theme: theme };
  db: SQLiteDatabase;
}) => {
  const [repeat, setRepeat] = useState<settings["repeat"]>("none");
  const getRepeatInfo = async () => {
    const res: { repeat: settings["repeat"] } | null = await db.getFirstAsync(
      "SELECT repeat FROM settings"
    );
    if (res) {
      setRepeat(res.repeat);
    }
  };

  useEffect(() => {
    getRepeatInfo();
  }, []);

  if (repeat == "none") {
    return (
      <Pressable onPress={() => setRepeat("all")}>
        <MaterialIcons
          name="repeat"
          size={25}
          color={themeProvider.theme === "dark" ? "white" : "black"}
        />
      </Pressable>
    );
  }

  if (repeat == "all") {
    return (
      <Pressable onPress={() => setRepeat("single")}>
        <MaterialIcons name="repeat" size={25} color={"blue"} />
      </Pressable>
    );
  }

  if (repeat === "single") {
    return (
      <Pressable onPress={() => setRepeat("repeatBy")}>
        <MaterialIcons name="repeat-one" size={25} color={"blue"} />
      </Pressable>
    );
  }

  if (repeat === "repeatBy") {
    return (
      <>
        <Pressable
          onPressOut={() => setRepeat("none")}
          delayLongPress={3000}
          className="flex flex-row items-center gap-1"
        >
          <MaterialIcons name="repeat-one" size={25} color={"blue"} />
          <AntDesign name="caretdown" size={12} color={"blue"} />
        </Pressable>
      </>
    );
  }

  return (
    <Pressable>
      <MaterialIcons
        name="repeat"
        size={25}
        color={themeProvider.theme === "dark" ? "white" : "black"}
      />
    </Pressable>
  );
};

const ShuffleButton = ({
  themeProvider,
  db,
}: {
  themeProvider: { theme: theme };
  db: SQLiteDatabase;
}) => {
  const [shuffle, setshuffle] = useState<boolean>(false);
  const getShuffleInfoFromDB = async () => {
    const res: { shuffled: settings["shuffle"] } | null =
      await db.getFirstAsync("SELECT shuffle FROM settings");
    if (res) {
      setshuffle(res.shuffled);
    }
  };

  useEffect(() => {
    getShuffleInfoFromDB();
  }, []);

  return (
    <Pressable onPress={() => setshuffle(!shuffle)}>
      <MaterialIcons
        name="shuffle"
        size={25}
        color={
          shuffle ? "blue" : themeProvider.theme === "dark" ? "white" : "black"
        }
      />
    </Pressable>
  );
};
