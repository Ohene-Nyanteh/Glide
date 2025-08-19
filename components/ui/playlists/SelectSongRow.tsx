import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { musicDelta } from "@ohene/flow-player";
import { music } from "@/types/music";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { shortenText } from "@/lib/shortenText";

export default function SelectedSongRow({
  song,
  added,
  onAdd,
  onRemove,
}: {
  song: musicDelta;
  added: boolean;
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const [songAdded, setSongAdded] =  useState(added)
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

  const addSongToPlaylist = () => {
    onAdd(song.id as number)
    setSongAdded(true)
  }

  const RemoveSongsFromPlaylist = () => {
    onRemove(song.id as number)
    setSongAdded(false)
  }

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
      <View className="flex flex-row gap-2">
        {songAdded ? (
          <Pressable onPress={RemoveSongsFromPlaylist}>
            <Feather name="x" size={20} color={"red"} />
          </Pressable>
        ) : (
          <Pressable onPress={addSongToPlaylist}>
            <Entypo name="plus" size={20} color={"green"} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
