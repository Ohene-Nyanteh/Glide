import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { settings, songs } from "@/types/db";
import { useSQLiteContext } from "expo-sqlite";
import Songs from "@/app/(media-tabs)";
import { toast } from "@backpackapp-io/react-native-toast";

const SettingsContext = createContext<{
  settings: settings;
  insertSettings: (settings: settings) => Promise<void>;
} | null>(null);

export function useSettings(): {
  settings: settings;
  insertSettings: (settings: settings) => Promise<void>;
} | null {
  return useContext(SettingsContext);
}

function SettingsContextProvider({ children }: any) {
  const db = useSQLiteContext();
  const [settings, setSettings] = useState<settings>({
    id: 0,
    currentPlayingID: null,
    repeat: "none",
    shuffle: "no-shuffle",
  });

  const fetchSettings = async () => {
    try {
      const res: settings | null = await db.getFirstAsync(
        "SELECT * FROM settings"
      );
      if (res) {
        setSettings(res);
      }
    } catch (e) {
      toast.error("Error: Couldnt fetch Settings")
    }
  };

  const insertSettings = async (settings: settings) => {
    try {
      const run = await db.runAsync(
        "UPDATE settings SET repeat = ?, shuffle = ?, currentPlayingID = ? WHERE id = ?",
        [
          settings.repeat,
          settings.shuffle,
          settings.currentPlayingID,
          settings.id,
        ]
      );

      if (run) {
        setSettings(settings);
      }
    } catch (e) {
     toast.error("Error: Couln't Update Settings")
    }
  };



  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, insertSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
export default SettingsContextProvider;
