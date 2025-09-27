import { shortenText } from "@/lib/shortenText";
import { music } from "@/types/music";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import type { musicDelta } from "@ohene/flow-player";
import { router } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { Image, View, Text, Pressable } from "react-native";
import { useTheme } from "@/utils/contexts/ThemeContext";

function QueueSong({ song }: { song: musicDelta }) {
  const [imageError, setImageError] = useState(false);
  const { theme } = useTheme();

  return (
    <Pressable
      className="flex flex-row justify-between items-center w-full rounded"
      onPress={() => router.navigate(`/playMedia/${song?.id as number}`)}
    >
      <View className="flex flex-row gap-2">
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
              className="h-20 w-16 aspect-square rounded object-cover"
            />
          )
        ) : (
          <View className="flex flex-row justify-center items-center w-16 h-14 rounded bg-gray-500/40">
            <FontAwesome name="music" size={20} color="gray" />
          </View>
        )}
        <View className="flex flex-col justify-center gap-1">
          <Text
            className="font-semibold dark:text-white "
            style={{
              color: song.isPlaying
                ? "blue"
                : theme.theme === "dark"
                  ? "white"
                  : "black",
            }}
          >
            {shortenText(song.metadata?.name || "", 40) ||
              shortenText((song.file_name as string) || "", 30)}
          </Text>
          <Text className="text-xs text-gray-500">
            {shortenText(
              `${song.metadata?.artist || "Unknown Artist"} . ${song.metadata?.album || "Unknown Album"}`,
              30
            )}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
export default memo(QueueSong);
