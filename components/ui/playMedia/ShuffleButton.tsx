import { settings } from "@/types/db";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import { useSettings } from "@/utils/contexts/SettingsContext";
import { theme } from "@/utils/contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Delta, MobilePlayer } from "@ohene/flow-player";
import { SQLiteDatabase } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";

export default function ShuffleButton({
  themeProvider,
  db,
}: {
  themeProvider: { theme: theme };
  db: SQLiteDatabase;
}) {
  const [shuffle, setshuffle] = useState<boolean>(false);
  const playerContext = usePlayer();
  const settingsContext = useSettings();
  const shuffleSettings = settingsContext?.settings.shuffle;

  const handleShuffleChange = async (shuffle_: boolean) => {
    await settingsContext?.insertSettings({
      id: settingsContext.settings.id,
      shuffle: shuffle_,
      repeat: settingsContext.settings.repeat,
      currentPlayingID: settingsContext.settings.currentPlayingID,
    });

    setshuffle(shuffle_);
  };

  useEffect(() => {
    if (shuffleSettings) {
      playerContext?.setQueue(new Delta(playerContext.queue.shuffleSongs()));
      setshuffle(shuffleSettings);
    } else {
      playerContext?.setQueue(
        new Delta(
          playerContext.queue.getSongs().sort((a, b) => {
            const dateA = a.metadata?.dateModified;
            const dateB = b.metadata?.dateModified;

            // Handle undefined cases - put undefined dates at the end
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;

            // Convert string timestamps to numbers for comparison
            const timeA = parseInt(dateA);
            const timeB = parseInt(dateB);

            // Sort in descending order (newest first)
            return timeB - timeA;
          })
        )
      );
    }
  }, [shuffleSettings, shuffle]);
  return (
    <Pressable onPress={() => handleShuffleChange(!shuffle)}>
      <MaterialIcons
        name="shuffle"
        size={25}
        color={
          shuffle ? "blue" : themeProvider.theme === "dark" ? "white" : "black"
        }
      />
    </Pressable>
  );
}
