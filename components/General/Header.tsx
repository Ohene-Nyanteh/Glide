import {
  Text,
  View,
  StatusBar,
  Platform,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  Pressable,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "@/utils/contexts/UserContext";
import { useTheme } from "@/utils/contexts/ThemeContext";
import ThemeChanger from "./ThemeChanger";

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();

  return (
    <View style={style.AndroidSafeArea} className={`w-full`}>
      <View className="flex dark:text-black flex-row justify-between w-full p-5 dark:bg-black">
        <Feather
          name="menu"
          size={24}
          color={theme.theme == "dark" ? "white" : "black"}
        />
        <View className="flex gap-2 items-center flex-row text-white">
          <Text className="dark:text-gray-300 text-gray-500">Hello</Text>
          <Text className="dark:text-white font-semibold text-xl">{user?.name}</Text>
          <MaterialCommunityIcons name="star-three-points" size={24} color="gold" />
        </View>
        <ThemeChanger />

        <Feather
          name="search"
          size={20}
          color={theme.theme == "dark" ? "white" : "black"}
          className="px-2 py-1 rounded-full"
        />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
export default Header;
