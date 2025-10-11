import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AudioModule,
  AudioPlayer,
  AudioStatus,
  useAudioPlayer,
} from "expo-audio";
import { usePlayer } from "./PlayerContext";
import { AppState } from "react-native";
import { useSettings } from "./SettingsContext";
import { musicDelta } from "@ohene/flow-player";
import { useMediaAudio } from "./AudioPlayerContext";

const AudioContext = createContext<{
  player: AudioPlayer | null;
  setSong: (song: musicDelta) => void;
  song: musicDelta | null;
  durationObject: { currentDuration: number; totalDuration: number };
  setDurationObject: React.Dispatch<
    React.SetStateAction<{
      currentDuration: number;
      totalDuration: number;
    }>
  >;
}>({
  player: null,
  song: null,
  setSong: () => {},
  durationObject: {
    currentDuration: 0,
    totalDuration: 0,
  },
  setDurationObject: () => {},
});

export function useAudioPlayerContext(): {
  setSong: (song: musicDelta) => void;
  song: musicDelta | null;
  durationObject: { currentDuration: number; totalDuration: number };
  setDurationObject: React.Dispatch<
    React.SetStateAction<{
      currentDuration: number;
      totalDuration: number;
    }>
  >;
} {
  return useContext(AudioContext);
}

function AudioContextProvider({ children }: any) {
  const {player} = useMediaAudio();
  const playerContext = usePlayer();
  const songs = playerContext?.queue?.getSongs();
  const [song, setSong] = useState<musicDelta | null>(null);
  const [durationObject, setDurationObject] = useState<{
    currentDuration: number;
    totalDuration: number;
  }>({
    currentDuration: 0,
    totalDuration: 0,
  });
  const settingsContext = useSettings();

  const handlePlaybackStatusUpdate = useCallback(
    (status: AudioStatus) => {
      if (!status) return;

      // Always update duration during playback
      setDurationObject({
        currentDuration: status.currentTime,
        totalDuration: status.duration || 0,
      });

      // Handle song finishing
      if (status.didJustFinish) {
        if (!songs || !song?.id) return;
        if (
          AppState.currentState !== "active" &&
          AppState.currentState !== "background"
        )
          return;

        const currentIndex = songs.findIndex((s) => s.id === song.id);
        if (currentIndex === -1) return;

        const isRepeatSingle = settingsContext?.settings.repeat === "single";
        const nextIndex =
          currentIndex === songs.length - 1 ? 0 : currentIndex + 1;
        const nextSong = songs[nextIndex];

        if (isRepeatSingle) {
          // Repeat current song
          player?.seekTo(0);
          setDurationObject({
            currentDuration: 0,
            totalDuration: status.duration || 0,
          });

          playerContext?.queue.setCurrentPlayingSong(song.id);
          playerContext?.player.setCurrentPlayingSong(song.id);
          settingsContext?.insertSettings({
            currentPlayingID: song.id,
            id: settingsContext.settings.id,
            repeat: settingsContext.settings.repeat,
            shuffle: settingsContext.settings.shuffle,
          });
          player?.play();
        } else {
          // Play next song
          if (!nextSong?.id) return;

          setDurationObject({
            currentDuration: 0,
            totalDuration: 0, // Will update when new song loads
          });
          playerContext?.queue.setCurrentPlayingSong(nextSong.id);
          playerContext?.player.setCurrentPlayingSong(nextSong.id);

          settingsContext?.insertSettings({
            currentPlayingID: nextSong.id,
            id: settingsContext.settings.id,
            repeat: settingsContext.settings.repeat,
            shuffle: settingsContext.settings.shuffle,
          });

          if (AppState.currentState === "background") {
            player?.replace(nextSong.music_path);
            player?.play();
            setSong(nextSong);
            //update notification
          }
          // Only navigate when app is active
          if (AppState.currentState === "active") {
            player?.replace(nextSong.music_path);
            player?.play();
            setSong(nextSong);
          }
        }
      }
    },
    [songs, song]
  );

  useEffect(() => {
    const configureAudio = async () => {
      await AudioModule.setAudioModeAsync({
        shouldPlayInBackground: true,
        interruptionMode: "doNotMix",
        interruptionModeAndroid: "doNotMix",
        playsInSilentMode: true,
      });
    };

    configureAudio();
  }, []);

  useEffect(() => {
    const subscription = player?.addListener(
      "playbackStatusUpdate",
      handlePlaybackStatusUpdate
    );

    return () => subscription?.remove();
  }, [handlePlaybackStatusUpdate]);

  return (
    <AudioContext.Provider
      value={{ player, durationObject, setDurationObject, song, setSong }}
    >
      {children}
    </AudioContext.Provider>
  );
}
export default AudioContextProvider;
