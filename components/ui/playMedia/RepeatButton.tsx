import { settings } from "@/types/db";
import { useSettings } from "@/utils/contexts/SettingsContext";
import { theme } from "@/utils/contexts/ThemeContext";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SQLiteDatabase } from "expo-sqlite";
import { use, useEffect, useState } from "react";
import { Pressable } from "react-native";

export default function RepeatButton({
  themeProvider,
  db,
}: {
  themeProvider: { theme: theme };
  db: SQLiteDatabase;
}) {
  const [repeat, setRepeat] = useState<settings["repeat"]>("none");
  const settingsContext = useSettings();

  useEffect(() => {
    setRepeat(settingsContext?.settings.repeat || "none");
  }, []);

  const handleRepeat = async () => {
    if (repeat === "none") {
      await settingsContext?.insertSettings({
        ...settingsContext?.settings,
        repeat: "all",
      });
      setRepeat("all");
    } else if (repeat === "all") {
      await settingsContext?.insertSettings({
        ...settingsContext?.settings,
        repeat: "single",
      });
      setRepeat("single");
    } else if (repeat === "single") {
      await settingsContext?.insertSettings({
        ...settingsContext?.settings,
        repeat: "none",
      });
      setRepeat("none");
    }
  };

  if (repeat == "none") {
    return (
      <Pressable onPress={handleRepeat}>
        <MaterialIcons
          name="repeat"
          size={25}
          color={themeProvider.theme === "dark" ? "white" : "black"}
        />
      </Pressable>
    );
  }

  if (repeat == "all") {
    return (
      <Pressable onPress={handleRepeat}>
        <MaterialIcons name="repeat" size={25} color={"blue"} />
      </Pressable>
    );
  }

  if (repeat === "single") {
    return (
      <Pressable onPress={handleRepeat}>
        <MaterialIcons name="repeat-one" size={25} color={"blue"} />
      </Pressable>
    );
  }

  return (
    <Pressable>
      <MaterialIcons
        name="repeat"
        size={25}
        color={themeProvider.theme === "dark" ? "white" : "black"}
      />
    </Pressable>
  );
}
