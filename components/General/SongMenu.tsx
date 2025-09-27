import {
  View,
  Text,
  Pressable,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { theme } from "@/utils/contexts/ThemeContext";
import React, { useState } from "react";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { shortenText } from "@/lib/shortenText";
import { router } from "expo-router";

export default function SongMenu({
  theme,
  song_name,
  song_image,
  song_artist,
  song_album,
}: {
  theme: theme;
  song_id: number | undefined;
  song_name: string | undefined;
  song_image: string | undefined;
  song_artist: string | undefined;
  song_album: string | undefined;
  playlists_id?: string;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const swipeDown = Gesture.Fling()
    .runOnJS(true)
    .direction(Directions.DOWN)
    .onEnd(() => {
      setShowMenu(false);
    });

  const menus = [
    {
      name: "Album",
      press: () => router.navigate(`/albums/${song_album}/view`),
      icon: (
        <Ionicons
          name="albums-outline"
          size={20}
          color={theme === "dark" ? "white" : "black"}
        />
      ),
    },
    {
      name: "Artist",
      icon: (
        <SimpleLineIcons
          name="microphone"
          size={20}
          color={theme === "dark" ? "white" : "black"}
        />
      ),
    },
    {
      name: "Change Cover",
      icon: (
        <Entypo
          name="image"
          size={20}
          color={theme === "dark" ? "white" : "black"}
        />
      ),
    },
    {
      name: "Add To Queue",
      icon: (
        <MaterialIcons
          name="playlist-add"
          size={20}
          color={theme === "dark" ? "white" : "black"}
        />
      ),
    },
    {
      name: "Add To Favourites",
      icon: (
        <AntDesign
          name="heart"
          size={18}
          color={theme === "dark" ? "white" : "black"}
        />
      ),
    },
    {
      name: "Delete From Device",
      icon: (
        <EvilIcons
          name="trash"
          size={24}
          color={theme === "dark" ? "white" : "black"}
        />
      ),
    },
  ];

  return (
    <View>
      <Pressable onPress={() => setShowMenu(true)}>
        <Entypo
          name="dots-three-vertical"
          size={20}
          color={theme === "dark" ? "white" : "black"}
        />
      </Pressable>
      {showMenu && (
        <Modal className="w-full h-full" transparent animationType="slide">
          <Pressable
            onPress={() => setShowMenu(false)}
            className="w-full h-full flex flex-col justify-end bg-black/40"
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className="w-full h-[55%] bg-gray-500 dark:bg-zinc-900 rounded-t-2xl"
            >
              <GestureDetector gesture={swipeDown}>
                <View className="w-full p-3 flex flex-col gap-2 items-center">
                  <View className="w-16 h-1 bg-gray-400 rounded-full" />
                  <Text className="dark:text-white text-sm">Song Menu</Text>
                </View>
              </GestureDetector>

              <View className="flex flex-col gap-4 w-full h-full p-2">
                <View className="w-full flex flex-row gap-2 justify-between items-center p-2 rounded dark:bg-zinc-800">
                  <View className="w-auto h-auto flex flex-row gap-3 items-center">
                    {!song_image || imageError ? (
                      <View className="flex flex-row justify-center items-center w-12 h-12 rounded bg-gray-500/40">
                        <FontAwesome name="music" size={20} color="gray" />
                      </View>
                    ) : (
                      <Image
                        source={{ uri: song_image }}
                        height={20}
                        onError={() => setImageError(true)}
                        width={20}
                        className="h-12 w-12 aspect-square rounded object-cover"
                        resizeMode="cover"
                      />
                    )}
                    <View className="flex flex-col">
                      <Text className="dark:text-white text-sm">
                        {shortenText(song_name || "", 30)}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {shortenText(song_artist || "", 30)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex flex-row gap-3 items-center">
                    <Pressable>
                      <AntDesign
                        name="info-circle"
                        size={20}
                        color={theme === "dark" ? "white" : "black"}
                      />
                    </Pressable>
                    <Pressable>
                      <Feather
                        name="external-link"
                        size={20}
                        color={theme === "dark" ? "white" : "black"}
                      />
                    </Pressable>
                  </View>
                </View>
                <Text className="dark:text-white">Additional Menu</Text>
                <View className="w-full flex flex-row flex-wrap gap-2">
                  {menus.map((menu, index) => (
                    <View
                      key={index}
                      className={
                        index === 4 || index === 5
                          ? "w-full  overflow-hidden flex flex-row justify-center rounded-xl  dark:bg-zinc-800"
                          : "w-[48.9%] overflow-hidden rounded-xl dark:bg-zinc-800"
                      }
                    >
                      <Pressable
                        onPress={menu.press}
                        className={
                          index === 4 || index === 5
                            ? "w-full p-4 flex flex-row justify-center gap-4 items-center"
                            : "w-full p-4 flex flex-row gap-4"
                        }
                        android_ripple={{
                          color: theme === "dark" ? "#4C4C4C" : "#ccc",
                          borderless: true,
                        }}
                      >
                        <View>{menu.icon}</View>
                        <Text className="dark:text-white text-sm">
                          {menu.name}
                        </Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}
