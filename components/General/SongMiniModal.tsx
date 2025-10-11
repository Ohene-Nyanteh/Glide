import {
  View,
  Text,
  Image,
  Pressable,
  GestureResponderEvent,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSettings } from "@/utils/contexts/SettingsContext";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import { Delta, MobilePlayer, musicDelta } from "@ohene/flow-player";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { shortenText } from "@/lib/shortenText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/utils/contexts/ThemeContext";
import { songs } from "@/types/db";
import { useSQLiteContext } from "expo-sqlite";
import { useMediaAudio } from "@/utils/contexts/AudioPlayerContext";

export default function SongMiniModal() {
  const settingsContext = useSettings();
  const playerContext = usePlayer();
  const db = useSQLiteContext();
  const { player } = useMediaAudio();
  const [song, setSong] = useState<musicDelta>();
  const [imageError, setImageError] = useState(false);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const currentPlayingID = settingsContext?.settings.currentPlayingID;
  const currentPlayingSong = playerContext?.queue.findSongWithId(
    currentPlayingID as number
  );

  const handlePlayPause = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (currentPlayingID) {
      player?.pause();
    } else {
      player?.play();
    }
  };

  useEffect(() => {
    if (currentPlayingID) {
      setSong(currentPlayingSong as musicDelta);
    }
  }, [currentPlayingID]);

  return (
    <View
      className="fixed h-24 w-full bottom-0 left-0 p-4 z-40 mb-6"
      style={{ marginBottom: insets.bottom }}
    >
      {song ? (
        <Pressable
          onPress={() => router.navigate(`/playMedia/${song?.id}`)}
          className="w-full h-full bg-gray-300 dark:bg-zinc-900 rounded flex flex-row gap-4 items-center justify-between px-2"
        >
          <View className="flex flex-row gap-4">
            {song.metadata?.image ? (
              imageError ? (
                <View className="flex flex-row justify-center items-center w-16 h-14 rounded bg-gray-500/40">
                  <FontAwesome name="music" size={20} color="gray" />
                </View>
              ) : (
                <Image
                  source={{ uri: song.metadata?.image as string }}
                  height={20}
                  onError={() => setImageError(true)}
                  width={20}
                  className="h-12 w-12 aspect-square rounded object-cover"
                />
              )
            ) : (
              <View className="flex flex-row justify-center items-center w-16 h-14 bg-gray-100 rounded-md dark:bg-gray-500/40">
                <FontAwesome name="music" size={20} color="gray" />
              </View>
            )}
            <View className="flex flex-col justify-center gap-1">
              <Text className="font-semibold dark:text-white ">
                {shortenText(song.metadata?.name || "Unknown Song", 30)}
              </Text>
              <Text className="text-xs text-gray-500">
                {shortenText(
                  `${song.metadata?.artist || "Unknown Artist"} . ${song.metadata?.album || "Unknown Album"}`,
                  40
                )}
              </Text>
            </View>
          </View>
          <Pressable className="px-4" onPress={handlePlayPause}>
            {song.isPlaying ? (
              <AntDesign
                name="pause"
                size={20}
                color={theme.theme === "dark" ? "white" : "dark"}
              />
            ) : (
              <FontAwesome
                name="play"
                size={20}
                color={theme.theme === "dark" ? "white" : "dark"}
              />
            )}
          </Pressable>
        </Pressable>
      ) : (
        <View className="w-full h-full shadow dark:bg-zinc-900 bg-gray-400 rounded flex flex-row gap-4 items-center justify-between px-2">
          <View className="flex flex-row gap-4">
            <View className="flex flex-row justify-center items-center w-12 h-12 bg-gray-100 rounded-md dark:bg-gray-500/40">
              <FontAwesome name="music" size={20} color="gray" />
            </View>
            <View className="flex flex-col justify-center gap-1">
              <Text className="font-semibold dark:text-white ">
                {shortenText("Unknown Song", 40)}
              </Text>
              <Text className="text-xs dark:text-gray-500 text-gray-700">
                {shortenText("Unknown Artist . Unknown Album", 40)}
              </Text>
            </View>
          </View>
          <Pressable className="px-4">
            <FontAwesome
              name="play"
              size={20}
              color={theme.theme === "dark" ? "white" : "black"}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}
