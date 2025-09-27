import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { songs } from "@/types/db";
import axios from "axios";
import { shortenText } from "@/lib/shortenText";
import { toast } from "@backpackapp-io/react-native-toast";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@/utils/contexts/ThemeContext";
import { textToLines } from "@/lib/textToLine";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import UpdateLyrics from "@/components/ui/playMedia/UpdateLyrics";

export default function Lyrics() {
  const { id } = useLocalSearchParams();
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [textchange, setTextChange] = useState<string>(
    lyrics.length > 0 ? lyrics.join("\n") : ""
  );
  const [song, setSong] = useState<songs | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [retry, setRetry] = useState<boolean>(false);
  const [updateLyrics, setupdateLyrics] = useState<boolean>(false);
  const db = useSQLiteContext();
  const { theme } = useTheme();

  const swipeDown = Gesture.Fling()
    .runOnJS(true)
    .direction(Directions.DOWN)
    .onEnd(() => {
      router.back();
    });



  const getSongInfo = async () => {
    const songFromDb: songs | null = await db.getFirstAsync(
      "SELECT artist, name, lyrics FROM songs WHERE id = ?",
      [id as string]
    );
    if (songFromDb) {
      setSong(songFromDb);
      if (songFromDb.lyrics && songFromDb.lyrics.length >= 0) {
        setLyrics(textToLines(songFromDb.lyrics));
        setLoading(false);
      } else {
        fetchLyrics(songFromDb.name, songFromDb.artist);
      }
    }
  };

  const fetchLyrics = async (artist: string, name: string) => {
    const lyrics_link = `https://api.lyrics.ovh/v1/${artist}/${name}`;
    try {
      const res = await axios.get(lyrics_link.replace(" ", "%20"), {
        timeout: 10000,
      });
      if (res.data.lyrics) {
        setLyrics(res.data.lyrics);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      setError(true);
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Couldn't fetch lyrics"
      );
    }
  };

  useEffect(() => {
    getSongInfo();
  }, [id, retry]);

  return (
    <View className="w-full h-full flex flex-col justify-end bg-black/40">
      {updateLyrics && (
        <UpdateLyrics
          db={db}
          id={id}
          lyrics={lyrics}
          setupdateLyrics={setupdateLyrics}
          setLyrics={setLyrics}
          setError={setError}
          setLoading={setLoading}
          retry={retry}
          setRetry={setRetry}
          themeProvider={theme}
        />
      )}
      <Pressable
        className=" dark:bg-zinc-950 bg-white w-full h-[85%] rounded-t-xl "
        onPress={(e) => e.stopPropagation()}
      >
        <GestureDetector gesture={swipeDown}>
          <View className="w-full p-4 rounded-t-xl flex flex-col gap-4 items-center border-b border-b-gray-100 dark:border-b-zinc-600">
            <View className="w-10 h-1 rounded-full bg-gray-400" />
            <View className="flex flex-row gap-4 justify-between items-center">
              <Text className="text-blue-600 text-center">
                {shortenText(`${song?.name ?? "Song"}`, 30)} Lyrics
              </Text>
              <Pressable
                className="p-1 rounded"
                onPress={() => setupdateLyrics(true)}
              >
                <AntDesign
                  name="edit"
                  size={15}
                  color={theme.theme === "dark" ? "white" : "black"}
                />
              </Pressable>
            </View>
          </View>
        </GestureDetector>

        {loading ? (
          <View className="w-full h-full flex flex-col gap-2 justify-center items-center">
            <ActivityIndicator animating color={"blue"} size={"large"} />
          </View>
        ) : error ? (
          <View className="w-full h-full flex flex-row gap-2 justify-center items-center">
            <Pressable
              onPress={() => setRetry(!retry)}
              className="px-4 py-2 rounded-full border-2 border-blue-600"
            >
              <Text className="dark:text-white">Retry</Text>
            </Pressable>
            <Pressable
              onPress={() => setupdateLyrics(true)}
              className="px-4 py-2 rounded-full border-2 border-blue-600 flex items-center flex-row gap-2"
            >
              <AntDesign
                name="plus"
                size={20}
                color={theme.theme === "dark" ? "white" : "black"}
              />
              <Text className="dark:text-white">Add Lyrics</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            className="w-full h-full"
            contentContainerStyle={{
              paddingBottom: 100,
              paddingTop: 20,
              marginBottom: 20,
            }}
          >
            <View className="dark:text-white text-center flex flex-col gap-2">
              {lyrics.map((lyric, index) => (
                <Text
                  key={index}
                  className="text-black dark:text-white text-center leading-4"
                >
                  {lyric}
                </Text>
              ))}
            </View>
          </ScrollView>
        )}
      </Pressable>
    </View>
  );
}
