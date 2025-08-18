import { useTheme } from "@/utils/contexts/ThemeContext";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Text, View, Pressable } from "react-native";

function ThemeChanger() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Pressable onPress={toggleTheme}>
      <View className="flex items-center gap-2 border-white">
        {theme.theme === "dark" ? (
          <FontAwesome
            name="sun-o"
            size={20}
            color={"blue"}
          />
        ) : (
          <Entypo
            name="moon"
            size={20}
            color={"blue"}
          />
        )}
      </View>
    </Pressable>
  );
}

export default ThemeChanger;
