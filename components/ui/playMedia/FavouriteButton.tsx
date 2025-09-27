import { Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { toast } from "@backpackapp-io/react-native-toast";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "@/utils/contexts/ThemeContext";
import { songs } from "@/types/db";
import { useLocalSearchParams } from "expo-router/build/hooks";

export default function FavouriteButton({
  themeProvider,
}: {
  themeProvider: { theme: theme };
}) {
  const [favourite, setFavourite] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams();

  const handleFavourite = async () => {
    const changedValue = favourite === true ? 0 : 1;
    const song = await db.runAsync(
      "UPDATE songs SET favourite = ? WHERE id = ?",
      [changedValue, id as string]
    );
    if (song) {
      setFavourite(changedValue === 1 ? true : false);
      setRefreshing(!refreshing);
    }

    if (!song) {
      toast.error("An Error Occured");
    }
  };

  const getFavourite = async () => {
    const song: { favourite: songs["favourite"] } | null =
      await db.getFirstAsync("SELECT favourite FROM songs WHERE id = ?", [
        id as string,
      ]);
    setFavourite(Number(song?.favourite) === 1 ? true : false);
  };

  useEffect(() => {
    getFavourite();
  }, [id, refreshing]);

  return (
    <Pressable onPress={handleFavourite}>
      {favourite ? (
        <MaterialIcons name="favorite" size={25} color={"blue"} />
      ) : (
        <MaterialIcons
          name={"favorite-outline"}
          size={25}
          color={themeProvider.theme === "dark" ? "white" : "black"}
        />
      )}
    </Pressable>
  );
}
