import { useTheme } from "@/utils/contexts/ThemeContext";
import useLoadSongs from "@/utils/hooks/useLoadSongs";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { MobilePlayer, musicDelta } from "@ohene/flow-player";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { usePlayer } from "@/utils/contexts/PlayerContext";
import { useFonts } from "expo-font";
import { SQLiteDatabase } from "expo-sqlite";

export default function LoadingScreen({
  setInitialLoad,
  db,
  initialLoad,
}: {
  setInitialLoad: (initialLoad: boolean) => void;
  db: SQLiteDatabase;
  initialLoad: boolean;
}) {
  const { theme } = useTheme();
  const [currentCount, setCurrentCount] = useState(0);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const PlayerObject = usePlayer();
  const [_, fontError] = useFonts({
    SpaceMono: require("../../assets/fonts/SFPRODISPLAYREGULAR.otf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    const loading = async () => {
      const player = new MobilePlayer([]);
      const songs = await useLoadSongs(player, db, setCurrentCount, setTotalCount);
      if (songs) {
        const newPlayer = new MobilePlayer(songs.content);
        PlayerObject?.setPlayer(newPlayer);
        PlayerObject?.setIsloading(false);
        setInitialLoad(false);
      } else {
        setError("Something Happened");
      }
    };

    loading();

    if (fontError) {
      setError("Couldn't Load Font");
    }
  }, [initialLoad]);

  return (
    <View
      className={`${theme.theme === "dark" ? " dark:bg-gray-950 text-white" : " bg-white"} w-full h-full flex flex-col justify-center items-center gap-4`}
    >
      <Feather
        name="music"
        size={60}
        color={`${theme.theme === "dark" ? "white" : "black"}`}
      />
      <Text
        className={`${theme.theme === "dark" ? " text-white" : " text-black"} text-center`}
      >
        {currentCount}/{totalCount} Completed
      </Text>
    </View>
  );
}
