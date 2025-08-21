import { View, Text } from "react-native";
import React from "react";
import SquareTabs from "@/components/General/SquareTabs";

export default function PlaylistTabs() {
  const colours = ["#002433", "#330122", "#00290E", "#241F01"]
  const tabs = [
    {
      image_source: require("../../../assets/images/purple.jpg"),
      title: "Most Played",
      link: "/",
    },
    {
      image_source: require("../../../assets/images/cool.jpg"),
      title: "Favorites",
      link: "/",
    },
    {
      image_source: require("../../../assets/images/white.jpg"),
      title: "Artists",
      link: "/",
    },
    {
      image_source: require("../../../assets/images/black.jpg"),
      title: "Albums",
      link: "/",
    },
  ];

  return (
    <View className="w-full h-auto flex flex-row flex-wrap gap-3">
      {tabs.map((tab, index) => (
        <View key={index} className={`w-[48%] h-32 relative`}>

          <SquareTabs
            key={index}
            colour={colours[index]}
            image_source={tab.image_source}
            title={tab.title}
          />
        </View>
      ))}
    </View>
  );
}
