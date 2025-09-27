import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { shortenText } from "@/lib/shortenText";
import { router } from "expo-router";

export default function AlbumTile({
  album,
  image,
}: {
  album: string;
  image: string | null;
}) {
  return (
    <Pressable onPress={()=> router.navigate(`/albums/${album}/view`)}>
      <View className="w-full h-[150px] flex flex-col gap-2  rounded-md p-2">
        <View className="w-full h-[120px] overflow-hidden  flex justify-center items-center">
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                transform: [{ scale: 2.0 }],
              }}
              resizeMode="cover"
              resizeMethod="scale"
              className="w-full h-full aspect-square object-fill"
            />
          ) : (
            <View className="flex flex-row justify-center items-center w-full h-full rounded bg-gray-500/40">
              <FontAwesome name="music" size={30} color="gray" />
            </View>
          )}
        </View>
        <Text className="dark:text-gray-50 w-full">
          {shortenText(album || "Unknown Album", 20)}
        </Text>
      </View>
    </Pressable>
  );
}
