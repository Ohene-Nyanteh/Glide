import {
  View,
  Text,
  Pressable,
  Modal,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { File } from "expo-file-system";
import { theme } from "@/utils/contexts/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome6,
  Fontisto,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { shortenText } from "@/lib/shortenText";
import { router } from "expo-router";
import { musicDelta } from "@ohene/flow-player";
import { musicDB } from "@/types/music";
import { formatTime } from "@/lib/formatTime";
import { formatDateFromMs } from "@/lib/formatDate";
import { useSettings } from "@/utils/contexts/SettingsContext";
import { useSQLiteContext } from "expo-sqlite";
import { toast } from "@backpackapp-io/react-native-toast";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import { songs } from "@/types/db";

export default function SongMenu({
  theme,
  song,
  song_id,
}: {
  theme: theme;
  song_id: string | number | undefined;
  song: musicDelta;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const playerContext = usePlayer();
  const [favourite, setFavourite] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);
  const db = useSQLiteContext();
  const [refreshing, setRefreshing] = useState(false);
  const swipeDown = Gesture.Fling()
    .runOnJS(true)
    .direction(Directions.DOWN)
    .onEnd(() => {
      setShowMenu(false);
    });

  const changeCover = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Camera roll permission is required to upload images."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      //upload image path to db
      const insert = await db.runAsync(
        "UPDATE songs SET image = ? WHERE id = ?",
        [result.assets[0].uri, song_id as string]
      );
      if (insert) {
        toast.success("Image Changed Successfully");
      } else {
        toast.error("Error: Couldn't change image");
      }
    }
  };

  const addToQueue = async () => {
    playerContext?.queue.addSongs([song]);
    toast.success("Added to Queue Successfully");
  };

  const handleFavourite = async () => {
    const changedValue = favourite === true ? 0 : 1;
    const song = await db.runAsync(
      "UPDATE songs SET favourite = ? WHERE id = ?",
      [changedValue, song_id as string]
    );
    if (song) {
      setFavourite(changedValue === 1 ? true : false);
      setRefreshing(!refreshing);
    }

    if (!song) {
      toast.error("An Error Occured");
    }
  };

  const getFavourite = async () => {
    const song: { favourite: songs["favourite"] } | null =
      await db.getFirstAsync("SELECT favourite FROM songs WHERE id = ?", [
        song_id as string,
      ]);
    setFavourite(Number(song?.favourite) === 1 ? true : false);
  };

  const deleteSong = async () => {
    const deleteSong = await db.runAsync("DELETE FROM songs WHERE id = ?", [
      song_id as string,
    ]);
    if (deleteSong) {
      toast.success("Song Deleted Successfully");
    } else {
      toast.error("An Error Occured");
    }
  };

  const menus = [
    {
      name: "Album",
      press: () => router.navigate(`/albums/${song.metadata?.album}/view`),
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
      press: () => router.navigate(`/artists/${song.metadata?.artist}/view`),
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
      press: () => changeCover(),
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
      press: () => addToQueue(),
      icon: (
        <MaterialIcons
          name="playlist-add"
          size={20}
          color={theme === "dark" ? "white" : "black"}
        />
      ),
    },
    {
      name: favourite ? "Added to Favourites" : "Add To Favourites",
      press: () => !favourite && handleFavourite(),
      icon: (
        <AntDesign
          name="heart"
          size={18}
          color={favourite ? "red" : theme === "dark" ? "white" : "black"}
        />
      ),
    },
    {
      name: "Delete From Device",
      press: () => deleteSong(),
      icon: (
        <EvilIcons
          name="trash"
          size={24}
          color={theme === "dark" ? "white" : "black"}
        />
      ),
    },
  ];

  useEffect(() => {
    getFavourite();
  }, [song_id, refreshing]);

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
              className="w-full h-[60%] bg-gray-100 dark:bg-zinc-900 rounded-t-2xl"
            >
              <GestureDetector gesture={swipeDown}>
                <View className="w-full p-3 flex flex-col gap-2 items-center">
                  <View className="w-16 h-1 bg-gray-400 rounded-full" />
                  <Text className="dark:text-white text-sm">Song Menu</Text>
                </View>
              </GestureDetector>

              <View className="flex flex-col gap-4 w-full h-full p-2">
                <View className="w-full flex flex-row gap-2 justify-between items-center p-2 rounded-md bg-zinc-300 dark:bg-zinc-800">
                  <View className="w-auto h-auto flex flex-row gap-3 items-center">
                    {!song.metadata?.image || imageError ? (
                      <View className="flex flex-row justify-center items-center w-12 h-12 rounded bg-gray-500/40">
                        <FontAwesome name="music" size={20} color="gray" />
                      </View>
                    ) : (
                      <Image
                        source={{ uri: song.metadata?.image }}
                        height={20}
                        onError={() => setImageError(true)}
                        width={20}
                        className="h-12 w-12 aspect-square rounded object-cover"
                        resizeMode="cover"
                      />
                    )}
                    <View className="flex flex-col">
                      <Text className="dark:text-white text-sm">
                        {shortenText(song.metadata?.name || "", 30)}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {shortenText(song.metadata?.artist || "", 30)}
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
                <View className="w-full flex flex-row gap-2 justify-between items-center p-2 rounded-md bg-zinc-300 dark:bg-zinc-800">
                  <Text className="text-sm dark:text-white">Song Info: </Text>
                  <View className="flex flex-row gap-2">
                    <View className="w-fit rounded-lg p-[0.5px] px-2 first-line:flex flex-row gap-1 items-center bg-red-500">
                      <Ionicons
                        name="time-outline"
                        size={20}
                        color={theme === "dark" ? "white" : "black"}
                      />
                      <Text className="dark:text-white text-sm">
                        {formatTime(song.metadata?.duration || 0)}
                      </Text>
                    </View>
                    <View className="w-fit rounded-lg p-[0.5px] px-2 first-line:flex flex-row gap-2 items-center bg-blue-500">
                      <FontAwesome6
                        name="music"
                        size={15}
                        color={theme === "dark" ? "white" : "black"}
                      />
                      <Text className="dark:text-white text-sm">
                        {shortenText(song?.metadata?.genre || " ", 10)}
                      </Text>
                    </View>
                    <View className="w-fit rounded-lg p-[0.5px] px-2 first-line:flex flex-row gap-1 items-center bg-green-500">
                      <Fontisto
                        name="date"
                        size={15}
                        color={theme === "dark" ? "white" : "black"}
                      />
                      <Text className="dark:text-white text-sm">
                        {formatDateFromMs(
                          Number(song.metadata?.dateModified) || 0
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="dark:text-white">Additional Menu</Text>
                <View className="w-full flex flex-row flex-wrap gap-2">
                  {menus.map((menu, index) => (
                    <View
                      key={index}
                      className={
                        index === 4 || index === 5
                          ? `w-full  overflow-hidden flex flex-row justify-center rounded-xl ${index == 5 ? "bg-red-700" : " bg-zinc-300  dark:bg-zinc-800"}`
                          : "w-[48.9%] overflow-hidden rounded-xl  bg-zinc-300  dark:bg-zinc-800"
                      }
                    >
                      <Pressable
                        onPress={menu.press}
                        className={
                          index === 4 || index === 5
                            ? "w-full p-4 flex flex-row justify-center gap-4 items-center"
                            : "w-full p-4 flex flex-row gap-4 items-center"
                        }
                        android_ripple={{
                          color: theme === "dark" ? "#4C4C4C" : "#ccc",
                          borderless: true,
                        }}
                      >
                        <View>{menu.icon}</View>
                        <Text className="dark:text-white">{menu.name}</Text>
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
