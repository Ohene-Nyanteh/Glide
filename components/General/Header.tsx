import { Pressable, Text, TouchableHighlight, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "@/utils/contexts/UserContext";
import { useTheme } from "@/utils/contexts/ThemeContext";
import MenuModal from "./MenuModal";
import { router } from "expo-router";

function Header() {
  const { theme } = useTheme();
  const { user } = useUser();

  return (
    <View className={`w-full`}>
      <View className="flex dark:text-black flex-row justify-between w-full p-5 dark:bg-black">
        <MenuModal />
        <View className="flex gap-2 items-center flex-row text-white">
          <Text className="dark:text-gray-300 text-gray-500">Hello</Text>
          <Text className="dark:text-white font-semibold text-xl">
            {user?.name}
          </Text>
        </View>

        <Pressable onPress={() => router.navigate("/search")}>
          <Feather
            name="search"
            size={20}
            color={theme.theme == "dark" ? "white" : "black"}
            className="px-2 py-1 rounded-full"
          />
        </Pressable>
      </View>
    </View>
  );
}

export default Header;
