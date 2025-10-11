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
import LyricsPlayer, {
  LyricsPlayerProps,
} from "@/components/ui/lyrics/LyricsPlayer";
import { parseLyricsFile } from "@/lib/parseLyrics";

export default function Lyrics() {
  const { id } = useLocalSearchParams();
  const [lyrics, setLyrics] = useState<LyricsPlayerProps["lyrics"] | null>(
    null
  );
  const [song, setSong] = useState<songs | null>();
  const [loading, setLoading] = useState<boolean>(false);
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

  const saveLyrics = async (parsedLyrics: string) => {
    try {
      const added = await db.runAsync(
        "UPDATE songs SET lyrics = ? WHERE id = ?",
        [parsedLyrics, id as string]
      );

      if (added) {
        setupdateLyrics(false);
        setLoading(true);
        setRetry(!retry);
      }
    } catch (error) {
      toast.error("Couldn't Add Lyrics");
    }
  };

  const getSongInfo = async () => {
    const songFromDb: songs | null = await db.getFirstAsync(
      "SELECT * FROM songs WHERE id = ?",
      [id as string]
    );
    if (songFromDb) {
      setSong(songFromDb);
      if (songFromDb.lyrics && songFromDb.lyrics.length >= 0) {
        setLyrics(JSON.parse(songFromDb.lyrics));
        setLoading(false);
      } else {
        setLyrics(null);
      }
    }
  };

  function sanitizeField(value: string | undefined): string {
    if (!value) return "";
    return value
      .replace(/- Topic$/i, "")
      .replace(/VEVO$/i, "")
      .replace(/[^\w\s()&:'",.-]/g, "") 
      .trim();
  }

  const fetchLyrics = async () => {
    if (!song) return;

    setLoading(true);

    try {
      // Clean up fields
      const artist = sanitizeField(song.artist);
      const track = sanitizeField(song.name);
      const album = sanitizeField(song.album);
      const duration = song.duration || 0;

      const query = new URLSearchParams({
        artist_name: artist,
        track_name: track,
        album_name: album,
        duration: duration.toString(),
      });

      const url = `https://lrclib.net/api/get?${query.toString()}`;

      const res = await axios.get(url, { timeout: 10000 });

      if (res.data?.syncedLyrics) {
        const parsed = parseLyricsFile(res.data.syncedLyrics);
        await saveLyrics(JSON.stringify(parsed));
        await getSongInfo();
        setLoading(false);
      } else {
        setLoading(false);
        toast.error("Lyrics not found or not synced");
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
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
    <View className="w-full h-full flex flex-col justify-end dark:bg-black">
      {updateLyrics && (
        <UpdateLyrics
          db={db}
          id={id}
          lyrics={lyrics}
          setupdateLyrics={setupdateLyrics}
          setLyrics={setLyrics}
          setLoading={setLoading}
          retry={retry}
          setRetry={setRetry}
          themeProvider={theme}
        />
      )}

      <GestureDetector gesture={swipeDown}>
        <View className="w-full p-4 rounded-t-xl flex flex-col gap-4 items-center">
          <View className="flex w-full flex-row gap-4 justify-end items-center">
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
      {lyrics ? (
        <LyricsPlayer lyrics={lyrics} />
      ) : loading ? (
        <View className="w-full h-full flex flex-col gap-2 justify-center items-center">
          <ActivityIndicator animating color={"blue"} size={"large"} />
        </View>
      ) : (
        <View className="w-full h-full flex flex-row gap-2 justify-center items-center">
          <Pressable
            onPress={() => fetchLyrics()}
            className="px-4 py-2 rounded-full border-2 border-blue-600"
          >
            <Text className="dark:text-white">Fetch Lyrics Online</Text>
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
      )}
    </View>
  );
}
