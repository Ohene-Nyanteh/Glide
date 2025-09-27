import { View, Text, TextInput, Modal, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "@/utils/contexts/ThemeContext";
import { SQLiteDatabase } from "expo-sqlite";
import { toast } from "@backpackapp-io/react-native-toast";
import { textToLines } from "@/lib/textToLine";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";

export default function UpdateLyrics({
  lyrics,
  themeProvider,
  setLyrics,
  setError,
  setLoading,
  retry,
  setRetry,
  id,
  db,
  setupdateLyrics,
}: {
  lyrics: string[];
  id: string | string[];
  themeProvider: { theme: theme };
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  retry: boolean;
  setRetry: React.Dispatch<React.SetStateAction<boolean>>;
  db: SQLiteDatabase;
  setupdateLyrics: React.Dispatch<React.SetStateAction<boolean>>;
  setLyrics: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [textchange, setTextChange] = useState<string>("");

  const handleUpdateLyrics = async () => {
    try {
      const added = await db.runAsync(
        "UPDATE songs SET lyrics = ? WHERE id = ?",
        [textchange, id as string]
      );

      if (added) {
        toast.success("Lyrics Added");
        setupdateLyrics(false);
        setError(false);
        setLoading(true);
        setRetry(!retry);
        setLyrics(textToLines(textchange));
      }
    } catch (error) {
      toast.error("Couldn't Add Lyrics");
    }
  };

  const swipeDownOnupdateLyrics = Gesture.Fling()
    .runOnJS(true)
    .direction(Directions.DOWN)
    .onEnd(() => {
      setupdateLyrics(false);
    });

  useEffect(() => {
    setTextChange(lyrics.join("\n"));
  }, [lyrics]);

  return (
    <Modal className="w-full h-full" transparent animationType="slide">
      <Pressable
        className="w-full h-full flex flex-row justify-center items-end bg-black/50"
        onPress={() => setupdateLyrics(false)}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full h-[80%] bg-white dark:bg-zinc-900 rounded-t-xl py-2 px-6 flex flex-col gap-5"
        >
          <GestureDetector gesture={swipeDownOnupdateLyrics}>
            <View className="flex flex-col  w-full justify-between items-center p-2">
              <View className="w-10 h-1 rounded-full bg-gray-400" />
              <Text className="dark:text-white text-center">Update Lyrics</Text>
            </View>
          </GestureDetector>

          <TextInput
            multiline={true}
            value={textchange}
            className="w-full h-[80%] bg-gray-100 dark:bg-zinc-800 dark:text-white"
            textAlignVertical={"top"}
            onChangeText={(text) => setTextChange(text)}
            placeholderTextColor={
              themeProvider.theme === "dark" ? "white" : "black"
            }
            placeholder="Paste Or Enter Lyrics"
          />
          <View className="flex flex-row justify-between items-center">
            <Pressable
              className="px-4 py-2 rounded-full bg-white dark:bg-zinc-700 border-gray-200 dark:border-none"
              onPress={() => {
                setupdateLyrics(false);
              }}
            >
              <Text className="dark:text-white text-center">Cancel</Text>
            </Pressable>
            <Pressable
              className="px-4 py-2 rounded-full bg-blue-600"
              onPress={handleUpdateLyrics}
            >
              <Text className="text-white text-center">Save</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
