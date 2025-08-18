import { Text, View } from "react-native";
import PlaylistTabs from "@/components/ui/playlists/PlaylistTabs";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@/utils/contexts/ThemeContext";
import PlaylistsList from "@/components/ui/playlists/PlaylistsList";
import { Link } from "expo-router";

export default function Playlist() {
  const { theme } = useTheme();
  return (
    <View className="flex flex-col gap-4 p-4 dark:bg-black w-full h-full">
      <View className="w-full">
        <PlaylistTabs />
      </View>
      <Link href={"/playlist/:/index"}>
            <View className="w-full">
        <View className="w-full flex flex-row justify-between items-center">
          <Text className="text-xl font-semibold dark:text-white">
            Playlists
          </Text>
          <Link href={"/playlist/addPlaylist"}>
            <View className="p-2 bg-blue-600 rounded-md">
              <AntDesign
                name="plus"
                size={20}
                color={theme.theme === "dark" ? "white" : "black"}
              />
            </View>
          </Link>
        </View>
        <View className="w-full h-auto">
          <PlaylistsList />
        </View>
      </View>
      </Link>
    </View>
  );
}
