import { shortenText } from "@/lib/shortenText";
import { music, musicDB } from "@/types/music";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import type { musicDelta } from "@ohene/flow-player";
import { router } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import { Image, View, Text, Pressable } from "react-native";
import { useTheme } from "@/utils/contexts/ThemeContext";
import SongMenu from "./SongMenu";
import { useSettings } from "@/utils/contexts/SettingsContext";

function SongRow({ song }: { song: musicDelta }) {
  const [imageError, setImageError] = useState(false);
  const { theme } = useTheme();
  const [metadata, setMetadata] = useState<musicDelta["metadata"] | musicDB>({
    name: "",
    album: "",
    artist: "",
    dateModified: "",
    duration: 0,
    genre: "",
    image: "",
  });

  const settingsContext = useSettings();

  useEffect(() => {
    setMetadata({
      name: song.metadata?.name ?? song.file_name ?? "Unknown Name",
      album: song.metadata?.album ?? "Unknown Album",
      artist: song.metadata?.artist ?? "Unknown Artist",
      dateModified: song.metadata?.dateModified ?? "Unknown Date Modified",
      duration: song.metadata?.duration ?? 0,
      genre: song.metadata?.genre ?? "",
      image: song.metadata?.image ?? "",
    });
  }, [song.id]);

  return (
    <Pressable
      className="flex flex-row justify-between items-center w-full rounded"
      onPress={() => router.navigate(`/playMedia/${song?.id as number}`)}
    >
      <View className="flex flex-row gap-2">
        {metadata?.image ? (
          imageError ? (
            <View className="flex flex-row justify-center items-center w-16 h-12 rounded bg-gray-500/40">
              <FontAwesome name="music" size={20} color="gray" />
            </View>
          ) : (
            <Image
              source={{ uri: metadata?.image as string }}
              onError={() => {
                setImageError(true);
              }}
              width={20}
              className="h-12 w-16  rounded object-cover"
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
              color: song.id === settingsContext?.settings.currentPlayingID
                ? "blue"
                : theme.theme === "dark"
                  ? "white"
                  : "black",
            }}
          >
            {shortenText(metadata?.name || "", 35) ||
              shortenText((song.file_name as string) || "", 30)}
          </Text>
          <Text className="text-xs text-gray-500">
            {shortenText(
              `${metadata?.artist || "Unknown Artist"} . ${metadata?.album || "Unknown Album"}`,
              40
            )}
          </Text>
        </View>
      </View>
      <SongMenu theme={theme.theme} song={song} song_id={song.id} />
    </Pressable>
  );
}
export default memo(SongRow);
