import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { useCallback, useEffect, useState } from "react";
import type { songs } from "@/types/db";
import { Slider } from "@miblanchard/react-native-slider";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/utils/contexts/ThemeContext";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { shortenText } from "@/lib/shortenText";
import { formatTime } from "@/lib/formatTime";
import { toast } from "@backpackapp-io/react-native-toast";
import ShuffleButton from "@/components/ui/playMedia/ShuffleButton";
import RepeatButton from "@/components/ui/playMedia/RepeatButton";
import PlayButton from "@/components/ui/playMedia/PlayButtons";
import { useSettings } from "@/utils/contexts/SettingsContext";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import FavouriteButton from "@/components/ui/playMedia/FavouriteButton";
import QueueModal from "@/components/General/QueueModal";
import { useAudioPlayerContext } from "@/utils/contexts/AudioContext";
import { useMediaAudio } from "@/utils/contexts/AudioPlayerContext";

export default function PlaySongPage() {
  const { id } = useLocalSearchParams();
  const [showQueue, setShowQueue] = useState(false);
  const { player } = useMediaAudio();
  const { song, setSong, setDurationObject, durationObject } =
    useAudioPlayerContext();
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const playerContext = usePlayer();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);
  const settingsContext = useSettings();

  const fetchSongInfo = useCallback(async () => {
    try {
      const songInfo: songs | null = await db.getFirstAsync(
        "SELECT * FROM songs WHERE id = ?",
        [id as string]
      );

      if (!songInfo) {
        toast.error("Song not found");
        return;
      }

      // Update song info
      setSong({
        music_path: songInfo.music_path,
        id: songInfo.id,
        metadata: {
          name: songInfo.name,
          artist: songInfo.artist,
          image: songInfo.image,
          duration: songInfo.duration,
          album: songInfo.album,
          genre: songInfo.genre,
          dateModified: songInfo.dateModified,
        },
      });

      // Update player context
      playerContext?.queue.setCurrentPlayingSong(songInfo.id);
      playerContext?.player.setCurrentPlayingSong(songInfo.id);

      // Check if this is a new song
      const isNewSong =
        settingsContext?.settings.currentPlayingID !== songInfo.id;

      if (isNewSong) {
        // New song - reset duration and load
        setDurationObject({
          currentDuration: 0,
          totalDuration: songInfo.duration ?? 0,
        });

        await player?.replace(songInfo.music_path);
        await player?.play();

        settingsContext?.insertSettings({
          id: settingsContext.settings.id,
          shuffle: settingsContext.settings.shuffle,
          repeat: settingsContext.settings.repeat,
          currentPlayingID: songInfo.id,
        });

        setIsPlaying(true);
      } else {
        // Same song - just resume if not playing
        const playing = player?.playing;
        if (!playing) {
          player?.play();
          setIsPlaying(true);
        } else {
          setIsPlaying(playing);
        }
      }
    } catch (error) {
      toast.error("Error: Couldn't fetch song");
    }
  }, [id]);

  const seekToPlay = (value: number[]) => {
    setDurationObject((prev) => ({
      ...prev,
      currentDuration: value[0],
    }));
    player?.seekTo(value[0]);
  };

  useEffect(() => {
    fetchSongInfo();
  }, [fetchSongInfo]);

  return (
    <View className="w-full h-full dark:bg-black p-4">

      <View className="w-full h-full">
        {song ? (
          <View className="w-full h-full">
            <View className="w-full flex items-center justify-center py-8">
              <View className="rounded-full overflow-hidden w-[330px] h-[330px] border-8 border-blue-600">
                {song.metadata?.image ? (
                  imageError ? (
                    <View className="flex flex-row justify-center items-center w-full h-full rounded bg-gray-500/40">
                      <FontAwesome name="music" size={50} color="gray" />
                    </View>
                  ) : (
                    <Image
                      source={{ uri: song.metadata?.image }}
                      style={{
                        width: "100%",
                        height: "100%",
                        transform: [{ scale: 1.7 }],
                      }}
                      onError={() => setImageError(true)}
                      resizeMode="cover"
                      className="w-full h-full"
                    />
                  )
                ) : (
                  <View className="flex flex-row justify-center items-center w-full h-full rounded bg-gray-500/40">
                    <FontAwesome name="music" size={50} color="gray" />
                  </View>
                )}
              </View>
            </View>
            <View className="flex flex-col gap-4">
              <View className="w-full flex flex-col gap-2 items-center">
                <Text className="dark:text-white font-semibold uppercase text-lg">
                  {shortenText(song.metadata?.name || "Unknown Song", 30)}
                </Text>
                <Text className="dark:text-gray-600 text-gray-400 text-sm">
                  {song.metadata?.artist}
                </Text>
              </View>
              <View className="flex flex-col gap-10">
                <View className="w-full h-2 relative">
                  <View className="w-full h-3 rounded bg-gray">
                    <Slider
                      value={durationObject.currentDuration}
                      onValueChange={(value) => seekToPlay(value)}
                      minimumValue={0}
                      trackStyle={{ height: 8, borderRadius: 999 }}
                      maximumValue={durationObject.totalDuration}
                      minimumTrackTintColor="blue"
                      thumbTintColor="blue"
                      maximumTrackTintColor="gray"
                    />
                  </View>
                </View>
                <View className="w-full h-4 flex flex-row justify-between">
                  <Text className="text-sm dark:text-gray-200">
                    {formatTime(durationObject.currentDuration)}
                  </Text>
                  <Text className="text-sm dark:text-gray-200">
                    {formatTime(song.metadata?.duration || 0)}
                  </Text>
                </View>
              </View>
              <View className="flex w-full flex-row justify-between px-6 items-center">
                <ShuffleButton themeProvider={theme} db={db} />
                <PlayButton
                  playing={isPlaying}
                  themeProvider={theme}
                  setIsPlaying={setIsPlaying}
                  setSong={setSong}
                  currentPosition={durationObject.currentDuration}
                  song={song}
                />
                <RepeatButton db={db} themeProvider={theme} />
              </View>
              <View className="w-full h-auto flex flex-row justify-between py-3 px-16">
                <FavouriteButton themeProvider={theme} />
                <Pressable
                  className="flex gap-1 flex-row items-center p-2 rounded"
                  onPress={() =>
                    router.navigate(`/playMedia/${id as string}/lyrics`)
                  }
                >
                  <MaterialCommunityIcons
                    name="comment-text-outline"
                    size={25}
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                  <Text className="text-sm dark:text-white">Lyrics</Text>
                </Pressable>
                <Pressable onPress={() => setShowQueue(true)}>
                  <MaterialIcons
                    name="queue-music"
                    size={25}
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <ActivityIndicator size={"small"} />
          </View>
        )}
      </View>
      {showQueue && <QueueModal setShow={setShowQueue} />}
    </View>
  );
}
