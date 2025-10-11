import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  TouchableNativeFeedback,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/utils/contexts/ThemeContext";
import { useSQLiteContext } from "expo-sqlite";
import { musicDelta } from "@ohene/flow-player";
import { musicDB } from "@/types/music";
import SongRow from "@/components/General/SongRow";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

export default function Search() {
  const { theme } = useTheme();
  const db = useSQLiteContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [information, setInformation] = useState<musicDelta[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    const results: musicDB[] | undefined = await db.getAllAsync(
      "SELECT * FROM songs WHERE name LIKE ? OR artist LIKE ? OR album LIKE ? OR genre LIKE ?",
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
    );

    if (results) {
      const newResults: musicDelta[] = results.map((item) => {
        return {
          music_path: item.music_path,
          file_name: item.file_name,
          duration: item.duration,
          id: item.id,
          name: item.name,
          metadata: {
            album: item.album,
            artist: item.artist,
            genre: item.genre,
            duration: item.duration,
            image: item.image,
            name: item.name,
            dateModified: item.dateModified,
          },
        };
      });
      setInformation(newResults || []);
    }

    setLoading(false);
  };

  return (
    <View className="w-full flex h-full bg-gray-100 dark:bg-black">
      <View className="flex gap-4 p-4 flex-row items-center">
        <TouchableNativeFeedback onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={theme.theme === "dark" ? "white" : "black"}
          />
        </TouchableNativeFeedback>
        <Text className="text-4xl font-bold dark:text-white">Search</Text>
      </View>
      <View className="p-2">
        <View className="w-full h-auto flex flex-row dark:bg-zinc-900 rounded-full items-center p-1 px-4">
          <TextInput
            className="flex-1"
            placeholder="Search for Songs, Albums, Artists...."
            onChangeText={(text) => setSearch(text)}
            onSubmitEditing={() => handleSearch()}
          />
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color={theme.theme === "dark" ? "white" : "black"}
          />
        </View>
      </View>

      <View className="p-2">
        {loading ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <View className="flex flex-col gap-3">
            {information.length === 0 && (
              <Text className="text-center text-xl font-bold dark:text-white">
                No results found
              </Text>
            )}
            {information.map((item, index) => (
              <SongRow song={item} key={index} />
            ))}
            <FlashList
              data={information}
              keyExtractor={(_, index) => index.toString()}
              ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
              renderItem={({ item }) => <SongRow song={item} />}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 20,
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}
