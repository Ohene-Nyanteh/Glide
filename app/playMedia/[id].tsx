import { View, Text, Pressable, Image } from "react-native";
import React, { use, useCallback, useEffect, useState } from "react";
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
import { Delta, MobilePlayer, musicDelta } from "@ohene/flow-player";
import { useSQLiteContext } from "expo-sqlite";
import { songs } from "@/types/db";
import { AudioStatus, useAudioPlayer } from "expo-audio";
import { shortenText } from "@/lib/shortenText";
import { formatTime } from "@/lib/formatTime";
import { toast } from "@backpackapp-io/react-native-toast";
import ShuffleButton from "@/components/ui/playMedia/ShuffleButton";
import RepeatButton from "@/components/ui/playMedia/RepeatButton";
import PlayButton from "@/components/ui/playMedia/PlayButtons";
import { useSettings } from "@/utils/contexts/SettingsContext";
import { useAudioPlayerContext } from "@/utils/contexts/AudioContext";
import { usePlayer } from "@/utils/contexts/PlayerContext";

export default function PlaySongPage() {
  const { id } = useLocalSearchParams();
  const audioPlayerContext = useAudioPlayerContext();
  const player = audioPlayerContext?.player;
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const playerContext = usePlayer();
  const songs = playerContext?.queue?.getSongs();
  const [song, setSong] = useState<musicDelta | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);
  const settingsContext = useSettings();
  const [durationObject, setDurationObject] = useState<{
    currentDuration: number;
    totalDuration: number;
  }>({
    currentDuration: 0,
    totalDuration: 0,
  });

  const fetchSongInfo = async () => {
    try {
      const songInfo: songs | null = await db.getFirstAsync(
        "SELECT * FROM songs WHERE id = ?",
        [id as string]
      );

      if (songInfo) {
        setSong({
          id: songInfo.id,
          music_path: songInfo.music_path,
          metadata: {
            name: songInfo.name,
            album: songInfo.album,
            artist: songInfo.artist,
            dateModified: songInfo.dateModified,
            genre: songInfo.genre,
            duration: songInfo.duration,
            image: songInfo.image,
          },
          isPlaying: true,
        });

        if (songs) {
          playerContext?.setQueue(
            new Delta(
              songs?.map((p_song) => {
                if (p_song.id === songInfo.id) {
                  return { ...p_song, isPlaying: true };
                }
                return { ...p_song, isPlaying: false };
              })
            )
          );
          playerContext?.setPlayer(
            new MobilePlayer(
               playerContext.player.getSongs()?.map((p_song) => {
                if (p_song.id === songInfo.id) {
                  return { ...p_song, isPlaying: true };
                }
                return { ...p_song, isPlaying: false };
              })
            )
          );
        }

        if (settingsContext?.settings.currentPlayingID !== songInfo.id) {
          player?.replace(songInfo.music_path);
          settingsContext?.insertSettings({
            id: settingsContext.settings.id,
            shuffle: settingsContext.settings.shuffle,
            repeat: settingsContext.settings.repeat,
            currentPlayingID: songInfo.id,
          });
        }
        setIsPlaying(true);
        setDurationObject({
          currentDuration: 0,
          totalDuration: songInfo.duration ?? 0,
        });
      }
    } catch (error) {
      toast.error("Error: Couldn't fetch song");
    }
  };

  const seekToPlay = (value: number[]) => {
    setDurationObject((prev) => ({
      ...prev,
      currentDuration: value[0],
    }));
    player?.seekTo(value[0]);
  };

  const handlePlaybackStatusUpdate = useCallback(
    (status: AudioStatus) => {
      if (status.didJustFinish) {
        if (songs) {
          switch (settingsContext?.settings.repeat) {
            case "single":
              player?.seekTo(0);
              setDurationObject({
                currentDuration: 0,
                totalDuration: status.duration ? status.duration : 0,
              });
              playerContext?.setQueue(
                new Delta(
                  songs.map((p_song) => {
                    if (p_song.id === song?.id) {
                      return { ...p_song, isPlaying: true };
                    }

                    return { ...p_song, isPlaying: false };
                  })
                )
              );
              playerContext?.setPlayer(
                new MobilePlayer(
                   playerContext.player.getSongs()?.map((p_song) => {
                    if (p_song.id === song?.id) {
                      return { ...p_song, isPlaying: true };
                    }

                    return { ...p_song, isPlaying: false };
                  })
                )
              );
              player?.play();
              break;

            case "none":
              if (!(song?.id !== songs?.length - 1)) {
                const song_id = song?.id ?? 0;
                playerContext?.setQueue(
                  new Delta(
                    songs.map((p_song) => {
                      if (p_song.id === song_id + 1) {
                        return { ...p_song, isPlaying: true };
                      } else {
                        return { ...p_song, isPlaying: false };
                      }
                    })
                  )
                );
                playerContext?.setPlayer(
                  new MobilePlayer(
                     playerContext.player.getSongs()?.map((p_song) => {
                      if (p_song.id === song_id + 1) {
                        return { ...p_song, isPlaying: true };
                      }

                      return { ...p_song, isPlaying: false };
                    })
                  )
                );

                router.setParams({ id: songs[song_id + 1].id });
              } else {
                player?.pause();
                setDurationObject({
                  currentDuration: 0,
                  totalDuration: status.duration ? status.duration : 0,
                });
                setIsPlaying(false);
              }
              break;

            default:
              if (song?.id !== songs?.length - 1) {
                const song_id = song?.id ?? 0;
                playerContext?.setQueue(
                  new Delta(
                    songs.map((p_song) => {
                      if (p_song.id === song_id + 1) {
                        return { ...p_song, isPlaying: true };
                      } else {
                        return { ...p_song, isPlaying: false };
                      }
                    })
                  )
                );
                playerContext?.setPlayer(
                  new MobilePlayer(
                     playerContext.player.getSongs()?.map((p_song) => {
                      if (p_song.id === song_id + 1) {
                        return { ...p_song, isPlaying: true };
                      }

                      return { ...p_song, isPlaying: false };
                    })
                  )
                );
                router.setParams({ id: songs[song_id + 1].id });
              } else {
                playerContext?.setQueue(
                  new Delta(
                    songs.map((p_song) => {
                      if (p_song.id === 0) {
                        return { ...p_song, isPlaying: true };
                      } else {
                        return { ...p_song, isPlaying: false };
                      }
                    })
                  )
                );
                router.setParams({ id: songs[0].id });
              }
          }
        }
      }

      if (status.isLoaded) {
        setDurationObject({
          currentDuration: status.currentTime,
          totalDuration: status.duration ? status.duration : 0,
        });
        setIsPlaying(status.playing);
      }
    },
    [settingsContext?.settings.repeat]
  );

  useEffect(() => {
    fetchSongInfo();
  }, [id]);

  useEffect(() => {
    const subscription = player?.addListener(
      "playbackStatusUpdate",
      handlePlaybackStatusUpdate
    );

    return () => subscription?.remove();
  }, [handlePlaybackStatusUpdate]);

  return (
    <View className="w-full h-full dark:bg-black p-4">
      <View className="flex flex-row justify-between items-center">
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <AntDesign
            name="arrowleft"
            size={20}
            color={theme.theme === "dark" ? "white" : "black"}
          />
        </Pressable>
        <View>
          <Text className="text-gray-400 text-xs text-center">Now Playing</Text>
          <Text className="dark:text-white text-center text-sm">
            {shortenText(song?.metadata?.name ?? "Unknown Song", 40)}
          </Text>
        </View>

        <View className="flex flex-row gap-2 items-center">
          <Pressable>
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={theme.theme === "dark" ? "white" : "black"}
            />
          </Pressable>
        </View>
      </View>
      <View className="w-full h-full">
        {song ? (
          <View className="w-full h-full">
            <View className="w-full flex items-center justify-center py-8">
              <View className="rounded-full overflow-hidden w-[340px] h-[340px] border-8 border-blue-600">
                {song.metadata?.image ? (
                  imageError ? (
                    <View className="flex flex-row justify-center items-center w-16 h-14 rounded bg-gray-500/40">
                      <FontAwesome name="music" size={20} color="gray" />
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
                    <FontAwesome name="music" size={20} color="gray" />
                  </View>
                )}
              </View>
            </View>
            <View className="flex flex-col gap-6">
              <View className="w-full flex flex-col gap-4 items-center">
                <Text className="dark:text-white font-semibold uppercase text-lg">
                  {shortenText(song.metadata?.name || "Unknown Song", 45)}
                </Text>
                <Text className="dark:text-gray-600 text-gray-400">
                  {song.metadata?.artist}
                </Text>
              </View>
              <View className="w-full h-2 relative">
                <View className="w-full h-2 rounded bg-gray">
                  <Slider
                    value={durationObject.currentDuration}
                    onValueChange={(value) => seekToPlay(value)}
                    minimumValue={0}
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
              <View className="flex w-full flex-row justify-between px-6 items-center">
                <ShuffleButton themeProvider={theme} db={db} />
                <PlayButton
                  playing={isPlaying}
                  player={player}
                  themeProvider={theme}
                  setIsPlaying={setIsPlaying}
                  setSong={setSong}
                  song={song}
                />
                <RepeatButton db={db} themeProvider={theme} />
              </View>
              <View className="w-full h-auto flex flex-row justify-between py-3 px-16">
                <View>
                  <MaterialIcons
                    name="favorite-outline"
                    size={25}
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                </View>
                <View className="flex gap-1 flex-row items-center">
                  <MaterialCommunityIcons
                    name="comment-text-outline"
                    size={25}
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                  <Text className="text-sm dark:text-white">Lyrics</Text>
                </View>
                <View>
                  <MaterialIcons
                    name="queue-music"
                    size={25}
                    color={theme.theme === "dark" ? "white" : "black"}
                  />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
}
