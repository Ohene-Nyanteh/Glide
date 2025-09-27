import { useAudioPlayerContext } from "@/utils/contexts/AudioContext";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import { useSettings } from "@/utils/contexts/SettingsContext";
import { theme } from "@/utils/contexts/ThemeContext";
import { AntDesign } from "@expo/vector-icons";
import {  musicDelta } from "@ohene/flow-player";
import { AudioPlayer } from "expo-audio";
import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable } from "react-native";

export default function PlayButton({
  themeProvider,
  setIsPlaying,
  playing,
  setSong,
  song,
}: {
  themeProvider: { theme: theme };
  setSong: (song: musicDelta) => void;
  setIsPlaying: (playing: boolean) => void;
  playing: boolean;
  song: musicDelta;
}) {
  const settingsContext = useSettings();
  const playerContext = usePlayer();
  const songs = playerContext?.queue?.getSongs();
  const {player} = useAudioPlayerContext()

  const handleNext = () => {
    if (songs) {
      const currentSong = songs?.findIndex(
        (indexSong) => indexSong.id === song.id
      );
      switch (settingsContext?.settings.repeat) {
        case "none":
          // check is its not the last song
          if (!(currentSong === songs?.length - 1)) {
            router.setParams({ id: songs[currentSong + 1].id });
          } else {
            player?.pause();
          }
          break;
        case "all":
          if (currentSong === songs?.length - 1) {
            router.setParams({ id: songs[0].id });
          } else {
            router.setParams({ id: songs[currentSong + 1].id });
          }
          break;

        default:
          if (!(currentSong === songs?.length - 1)) {
            router.setParams({ id: songs[currentSong + 1].id });
          } else {
            player?.pause();
          }
      }
    }
  };

  const handlePrevious = () => {
    if (songs) {
      const currentSongID = songs?.findIndex(
        (indexSong) => indexSong.id === song.id
      );

      if (!(currentSongID === 0)) {
        router.setParams({ id: songs[currentSongID - 1].id });
      } else {
        router.setParams({ id: songs.length - 1 });
      }
    }
  };

  const handlePlaying = () => {
    if (playing) {
      player?.pause();
      setSong({ ...song, isPlaying: false });
      setIsPlaying(false);
    } else {
      player?.play();
      setIsPlaying(true);
      setSong({ ...song, isPlaying: true });
    }
  };

  useEffect(() => {
    player?.play();
  }, []);

  return (
    <>
      <Pressable onPress={handlePrevious}>
        <AntDesign
          name="step-backward"
          size={30}
          color={themeProvider.theme === "dark" ? "white" : "black"}
        />
      </Pressable>
      <Pressable
        onPress={handlePlaying}
        className="rounded-full bg-blue-600 flex flex-row justify-center items-center"
      >
        {playing ? (
          <AntDesign
            name="pause-circle"
            size={60}
            color={themeProvider.theme === "dark" ? "white" : "black"}
          />
        ) : (
          <AntDesign
            name="play-circle" 
            size={60}
            color={themeProvider.theme === "dark" ? "white" : "black"}
          />
        )}
      </Pressable>
      <Pressable onPress={handleNext}>
        <AntDesign
          name="step-forward"
          size={30}
          color={themeProvider.theme === "dark" ? "white" : "black"}
        />
      </Pressable>
    </>
  );
}
