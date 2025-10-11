import { createContext, useContext, useEffect, useState } from "react";
import * as MediaControls from "react-native-media-notification";
import { musicDelta } from "@ohene/flow-player";

import { usePlayer } from "./PlayerContext";
import { useSettings } from "./SettingsContext";
import { AppState } from "react-native";
import { useMediaAudio } from "./AudioPlayerContext";

const NotificationContext = createContext<{
  runNotification: ({
    song,
    currentPosition,
  }: {
    song?: musicDelta;
    currentPosition?: number;
  }) => void;
} | null>(null);

export const useNotificationContext = (): {
  runNotification: ({
    song,
    currentPosition,
  }: {
    song?: musicDelta;
    currentPosition?: number;
  }) => void;
} | null => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationContextProvider"
    );
  }
  return context;
};

function NotificationContextProvider({ children }: any) {
  const { player } = useMediaAudio();
  const playManagerContext = usePlayer();
  const songs = playManagerContext?.queue.getSongs();
  const settingsContext = useSettings();
  const currentSongId = settingsContext?.settings.currentPlayingID;

  const handlePlayPause = () => {
    if (player?.playing) {
      player?.pause();
    } else {
      player?.play();
    }
  };

  const handleNext = () => {
    if (!songs || !currentSongId) return;

    const currentSongIndex = songs.findIndex(
      (song) => song.id === currentSongId
    );

    const isRepeatSingle = settingsContext?.settings.repeat === "single";
    const nextIndex = songs.length - 1 ? 0 : currentSongIndex + 1;
    const nextSong = songs[nextIndex];

    if (isRepeatSingle) {
      // Repeat current song
      player?.seekTo(0);
      playManagerContext?.queue.setCurrentPlayingSong(currentSongId);
      playManagerContext?.player.setCurrentPlayingSong(currentSongId);
      settingsContext?.insertSettings({
        currentPlayingID: currentSongId,
        id: settingsContext.settings.id,
        repeat: settingsContext.settings.repeat,
        shuffle: settingsContext.settings.shuffle,
      });
      player?.play();
    } else {
      if (!nextSong.id) return;

      playManagerContext?.queue.setCurrentPlayingSong(nextSong.id);
      playManagerContext?.player.setCurrentPlayingSong(nextSong.id);

      settingsContext?.insertSettings({
        currentPlayingID: nextSong.id,
        id: settingsContext.settings.id,
        repeat: settingsContext.settings.repeat,
        shuffle: settingsContext.settings.shuffle,
      });

      if (AppState.currentState === "background") {
        player?.replace(nextSong.music_path);
        player?.play();
        runNotification({
          song: nextSong,
        });
      }
      // Only navigate when app is active
      if (AppState.currentState === "active") {
        player?.replace(nextSong.music_path);
        player?.play();
        runNotification({
          song: nextSong,
        });
      }
    }
  };

  const handlePrevious = () => {
    if (!songs || !currentSongId) return;

    const currentSongIndex = songs.findIndex(
      (song) => song.id === currentSongId
    );

    const isRepeatSingle = settingsContext?.settings.repeat === "single";
    const nextIndex = 0 ? songs.length - 1 : currentSongIndex - 1;
    const nextSong = songs[nextIndex];

    if (isRepeatSingle) {
      // Repeat current song
      player?.seekTo(0);
      playManagerContext?.queue.setCurrentPlayingSong(currentSongId);
      playManagerContext?.player.setCurrentPlayingSong(currentSongId);
      settingsContext?.insertSettings({
        currentPlayingID: currentSongId,
        id: settingsContext.settings.id,
        repeat: settingsContext.settings.repeat,
        shuffle: settingsContext.settings.shuffle,
      });
      player?.play();
    } else {
      if (!nextSong.id) return;

      playManagerContext?.queue.setCurrentPlayingSong(nextSong.id);
      playManagerContext?.player.setCurrentPlayingSong(nextSong.id);

      settingsContext?.insertSettings({
        currentPlayingID: nextSong.id,
        id: settingsContext.settings.id,
        repeat: settingsContext.settings.repeat,
        shuffle: settingsContext.settings.shuffle,
      });

      if (AppState.currentState === "background") {
        player?.replace(nextSong.music_path);
        player?.play();
        runNotification({
          song: nextSong,
        });
      }
      // Only navigate when app is active
      if (AppState.currentState === "active") {
        player?.replace(nextSong.music_path);
        player?.play();
        runNotification({
          song: nextSong,
        });
      }
    }
  };

  const handleNotificationMediaControls = () => {
    MediaControls.addEventListener("play", () => {
      handlePlayPause();
    });
    MediaControls.addEventListener("pause", () => {
      handlePlayPause();
    });
    MediaControls.addEventListener("stop", () => {
      player?.pause();
    });

    // Navigation
    MediaControls.addEventListener("skipToNext", () => {
      handleNext();
    });
    MediaControls.addEventListener("skipToPrevious", () => {
      handlePrevious();
    });
  };

  const runNotification = async ({
    song,
    currentPosition,
  }: {
    song?: musicDelta;
    currentPosition?: number;
  }) => {
    try {
      MediaControls.enableBackgroundMode(true);

      await MediaControls.updateMetadata({
        title: song?.metadata?.name || "Unknown Music",
        artist: song?.metadata?.artist || "Unknown Artist",
        album: song?.metadata?.album || "Unknown Album",
        duration: song?.metadata?.duration || 100, // in seconds
        position: currentPosition,
        isPlaying: true,
        artwork:
          song?.metadata?.image || require("../../assets/images/black.jpg"),
        shuffle: false,
      });

      MediaControls.setControlEnabled("play", true);
      MediaControls.setControlEnabled("skipToNext", true);
      MediaControls.setControlEnabled("stop", true);

      MediaControls.setControlEnabled("skipToPrevious", true);
    } catch (e) {
      console.log(e);
    }
  };

  // Cleanup
  useEffect(() => {
    runNotification({ currentPosition: 0 });
    handleNotificationMediaControls();
    return () => MediaControls.removeAllListeners();
  }, []);

  return (
    <NotificationContext.Provider value={{ runNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContextProvider;
