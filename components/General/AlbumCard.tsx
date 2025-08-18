
import { shortenText } from "@/lib/shortenText";
import { music } from "@/types/music";
import { FontAwesome } from "@expo/vector-icons";
import { musicDelta } from "@ohene/flow-player";
import { useCallback, useEffect, useState } from "react";
import { Text, View, Image } from "react-native";

function AlbumCard({ song }: { song: musicDelta }) {
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
    setMetadata(song.metadata)
  }, [song.id]);

  return (
    <View className="w-52 h-full flex flex-col gap-2 rounded">
      <View
        style={{
          width: "100%",
          height: 160,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {metadata?.image ? (
          imageError ? (
            <View className="flex flex-row justify-center items-center w-full h-40 rounded bg-gray-500/40">
              <FontAwesome name="music" size={20} color="gray" />
            </View>
          ) : (
            <Image
              source={{ uri: metadata?.image as string }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                transform: [{ scale: 1.5 }],
              }}
              resizeMode="cover"
              resizeMethod="scale"
              onError={() => setImageError(true)}
            />
          )
        ) : (
          <View className="flex flex-row justify-center items-center w-full h-40 rounded bg-gray-500/40">
            <FontAwesome name="music" size={20} color="gray" />
          </View>
        )}
      </View>
      <View className="w-full flex flex-row gap-2">
        <View className="h-9 w-2 bg-blue-500 rounded"></View>
        <View>
          <Text className="font-semibold dark:text-white">
            {shortenText(metadata?.album || "Unknown Album", 20)}
          </Text>
          <Text className="dark:text-gray-300 text-gray-500 text-xs">
            {metadata?.artist || "Unknown Artist"}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default AlbumCard;
