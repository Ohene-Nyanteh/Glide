import {
  View,
  Text,
  Modal,
  Pressable,
  DrawerLayoutAndroid,
  StatusBar,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  Entypo,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { theme, useTheme } from "@/utils/contexts/ThemeContext";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "@/utils/contexts/UserContext";
import { Avatar } from "@kolking/react-native-avatar";

export default function MenuModal() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const themes = [
    {
      title: "light",
      icon: (
        <FontAwesome
          name="sun-o"
          size={20}
          color={theme.theme == "dark" ? "white" : "black"}
        />
      ),
    },
    {
      title: "dark",
      icon: (
        <Entypo
          name="moon"
          size={20}
          color={theme.theme == "dark" ? "white" : "black"}
        />
      ),
    },
  ];

  const swipeDown = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      setIsOpen(!isOpen);
    });

  return (
    <>
      <Pressable onPress={() => setIsOpen(!isOpen)}>
        <Feather
          name="menu"
          size={24}
          color={theme.theme == "dark" ? "white" : "black"}
        />
      </Pressable>

      <Modal
        transparent={true}
        visible={isOpen}
        animationType="fade"
        style={{ marginTop: insets.top, marginBottom: insets.bottom }}
      >
        <GestureDetector gesture={swipeDown}>
          <Pressable
            style={{ marginTop: insets.top, marginBottom: insets.bottom }}
            className="w-full h-full bg-black/50 dark:bg-black/50 flex flex-col gap-2 "
            onPress={() => setIsOpen(false)}
          >
            <View
              style={{
                marginTop: StatusBar.currentHeight ?? 0,
                marginBottom: insets.bottom,
              }}
              className="flex w-[80%] h-full bg-white dark:bg-black py-6u flex-1 p-4 flex-col gap-4 border-r border-r-gray-700"
            >
              <View className="w-full flex flex-row justify-between">
                <Text className="dark:text-white text-2xl">Profile</Text>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={24}
                  color="black"
                />
              </View>
              <View className="dark:bg-zinc-800 bg-gray-200 p-4 w-full flex flex-row items-center gap-4 rounded">
                <Avatar
                  size={45}
                  name={user?.name}
                  colorize={true}
                  radius={999}
                />
                <View className="w-full flex flex-col">
                  <Text className="dark:text-white">{user?.name}</Text>
                  <Text className="text-gray-500 text-sm">{user?.email}</Text>
                </View>
              </View>
              <View className="w-full flex flex-col gap-3">
                <Text className="dark:text-white text-2xl">Settings</Text>
                <View className="border rounded border-gray-200 dark:border-zinc-900 flex flex-row p-1">
                  {themes.map((theme_, index) => (
                    <Pressable
                      key={index}
                      className={`w-1/2 flex flex-row gap-3 items-center p-3 rounded ${theme_.title === theme.theme ? "bg-gray-200 dark:bg-zinc-900" : ""}`}
                      onPress={() => !(theme_.title === theme.theme) && toggleTheme()}
                    >
                      {theme_.icon}
                      <Text className="dark:text-white capitalize">
                        {theme_.title}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </Pressable>
        </GestureDetector>
      </Modal>
    </>
  );
}
