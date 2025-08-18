import { shortenText } from "@/lib/shortenText";
import { music } from "@/types/music";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import type { musicDelta } from "@ohene/flow-player";
import { memo, useCallback, useEffect, useState } from "react";
import { Image, View, Text } from "react-native";

function SongRow({ song }: { song: musicDelta }) {
  const [imageError, setImageError] = useState(false);
  const [metadata, setMetadata] = useState<musicDelta["metadata"] | music>({
    name: "",
    album: "",
    artist: "",
    dateModified: "",
    duration: 0,
    genre: "",
    image: "",
  });

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
    <View className="flex flex-row justify-between items-center">
      <View className="flex flex-row gap-2">
        {metadata?.image ? (
          imageError ? (
            <View className="flex flex-row justify-center items-center w-16 h-14 rounded bg-gray-500/40">
              <FontAwesome name="music" size={20} color="gray" />
            </View>
          ) : (
            <Image
              source={{ uri: metadata?.image as string }}
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
          <Text className="font-semibold dark:text-white">
            {shortenText(metadata?.name || "", 40) ||
              shortenText((song.file_name as string) || "", 30)}
          </Text>
          <Text className="text-sm text-gray-500">
            {shortenText(
              `${metadata?.artist || "Unknown Artist"} . ${metadata?.album || "Unknown Album"}`,
              30
            )}
          </Text>
        </View>
      </View>
      <Entypo name="dots-three-vertical" size={20} color="gray" />
    </View>
  );
}
export default memo(SongRow);
