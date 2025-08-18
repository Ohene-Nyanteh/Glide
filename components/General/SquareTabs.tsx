import { View, Text, ImageBackground, ImageSourcePropType } from "react-native";
import React from "react";

export default function SquareTabs({
  image_source,
  title,
  colour,
}: {
  image_source: ImageSourcePropType | undefined;
  title: string;
  colour?: string;
}) {
  return (
    <View className="w-full h-full relative ">
      <ImageBackground
        source={image_source}
        className="w-full h-full object-cover rounded-md"
        resizeMode="cover"
        borderRadius={10}
        blurRadius={0.5}
      >
        <View
          className="w-full h-full flex justify-end items-end p-1 rounded-lg"
          style={{ backgroundColor: `${colour}`, opacity: 0.8}}
        >
          <Text className="text-white font-semibold text-xl">{title}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}
