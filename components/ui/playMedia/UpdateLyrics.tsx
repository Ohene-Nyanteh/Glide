import { View, Text, TextInput, Modal, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "@/utils/contexts/ThemeContext";
import { SQLiteDatabase } from "expo-sqlite";
import { toast } from "@backpackapp-io/react-native-toast";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { parseLyricsFile } from "@/lib/parseLyrics";


export default function UpdateLyrics({
  lyrics,
  themeProvider,
  setLyrics,
  setLoading,
  retry,
  setRetry,
  id,
  db,
  setupdateLyrics,
}: {
  lyrics: { time: number | null; text: string }[] | null; // now parsed lyrics
  id: string | string[];
  themeProvider: { theme: theme };
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  retry: boolean;
  setRetry: React.Dispatch<React.SetStateAction<boolean>>;
  db: SQLiteDatabase;
  setupdateLyrics: React.Dispatch<React.SetStateAction<boolean>>;
  setLyrics: React.Dispatch<
    React.SetStateAction<{ time: number | null; text: string }[] | null>
  >;
}) {
  const [textchange, setTextChange] = useState<string>("");


  useEffect(() => {
    if (lyrics && lyrics.length > 0) {
      const joined = lyrics.map((l) => l.text).join("\n");
      setTextChange(joined);
    }
  }, [lyrics]);


  const handleUpdateLyrics = async () => {
    try {

      const parsedLyrics = parseLyricsFile(textchange);
      await db.runAsync("UPDATE songs SET lyrics = ? WHERE id = ?", [
        JSON.stringify(parsedLyrics),
        id as string,
      ]);

      toast.success("Lyrics updated successfully!");

      // Update local states
      setupdateLyrics(false);
      setLoading(true);
      setRetry(!retry);
      setLyrics(parsedLyrics);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't update lyrics");
    }
  };

  /** 👇 Swipe down gesture to close modal */
  const swipeDownOnupdateLyrics = Gesture.Fling()
    .runOnJS(true)
    .direction(Directions.DOWN)
    .onEnd(() => {
      setupdateLyrics(false);
    });

  return (
    <Modal transparent animationType="slide">
      <Pressable
        className="w-full h-full flex flex-row justify-center items-end bg-black/50"
        onPress={() => setupdateLyrics(false)}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="w-full h-[80%] bg-white dark:bg-zinc-900 rounded-t-xl py-2 px-6 flex flex-col gap-5"
        >
          <GestureDetector gesture={swipeDownOnupdateLyrics}>
            <View className="flex flex-col w-full justify-between items-center p-2">
              <View className="w-10 h-1 rounded-full bg-gray-400" />
              <Text className="dark:text-white text-center text-base font-semibold">
                Update Lyrics
              </Text>
            </View>
          </GestureDetector>

          <TextInput
            multiline
            value={textchange}
            className="w-full h-[80%] bg-gray-100 dark:bg-zinc-800 dark:text-white rounded-lg p-2"
            textAlignVertical="top"
            onChangeText={(text) => setTextChange(text)}
            placeholderTextColor={
              themeProvider.theme === "dark" ? "#ccc" : "#333"
            }
            placeholder="Paste or enter lyrics here"
          />

          <View className="flex flex-row justify-between items-center">
            <Pressable
              className="px-4 py-2 rounded-full bg-white dark:bg-zinc-700 border border-gray-200 dark:border-none"
              onPress={() => setupdateLyrics(false)}
            >
              <Text className="dark:text-white text-center">Cancel</Text>
            </Pressable>

            <Pressable
              className="px-4 py-2 rounded-full bg-blue-600"
              onPress={handleUpdateLyrics}
            >
              <Text className="text-white text-center font-semibold">Save</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
