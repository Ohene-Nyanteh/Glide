import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/utils/contexts/ThemeContext";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "expo-router";

export default function addPlaylist() {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    thumbnail: "",
  });
  const form_mock = [
    {
      name: "thumbnail",
      title: "Thumbnail",
    },
    {
      name: "name",
      title: "Playlist Name",
    },
    {
      name: "about",
      title: "Playlist Description",
    },
  ];

  const pickImage = async () => {
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
      setFormData((prev) => ({
        ...prev,
        thumbnail: result.assets[0].uri,
      }));
    }
  };

  const createPlaylist = async () => {
    try {
      const id = uuidv4();
      const insert = await db.runAsync(
        "INSERT INTO playlists (id, name, about, length) VALUES (?, ?, ?, ?)",
        [id, formData.name, formData.about, 0]
      );
      if (insert) {
        const insertThumbnail = await db.runAsync(
          "INSERT INTO thumbnails (playlist_id, image_data) VALUES (?, ?)",
          [id, formData.thumbnail]
        );
        if (insertThumbnail) {
          router.navigate("/(media-tabs)/playlist");
        }
      }
      Alert.alert("Playlist Created", "Playlist Created Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="w-full h-full dark:bg-black p-4">
      <View className="flex flex-row items-center justify-between">
        <Pressable onPress={()=> router.back()}>
          <AntDesign
            name="arrowleft"
            size={20}
            color={theme.theme === "dark" ? "white" : "black"}
          />
        </Pressable>
        <Text className="dark:text-white">CREATE PLAYLIST</Text>
        <Pressable onPress={createPlaylist}>
          <MaterialIcons
            name="done"
            size={20}
            color={theme.theme === "dark" ? "white" : "black"}
          />
        </Pressable>
      </View>
      <View className="w-full flex flex-col gap-4 py-10">
        {form_mock.map((mock, index) =>
          mock.name === "thumbnail" ? (
            <View
              className="w-full h-32 flex flex-col justify-center items-center gap-2"
              key={index}
            >
              <TouchableOpacity
                className="aspect-square h-full border-2 border-blue-600 rounded-full shadow flex items-center justify-center"
                onPress={pickImage}
                key={index}
              >
                {formData.thumbnail ? (
                  <Image
                    source={{ uri: formData.thumbnail }}
                    borderRadius={999}
                    className="h-full aspect-square w-full rounded-full"
                  />
                ) : (
                  <AntDesign
                    name="plus"
                    size={40}
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="w-full" key={index}>
              <Text className="dark:text-white">{mock.title}</Text>
              <TextInput
                placeholder={mock.title}
                style={{
                  color: theme.theme === "dark" ? "white" : "black",
                  borderBottomWidth: 1,
                  borderColor: "#1C6EA4",
                }}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, [mock.name]: text }))
                }
              />
            </View>
          )
        )}
      </View>
    </View>
  );
}
