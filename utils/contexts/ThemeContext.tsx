import { createContext, useContext, useEffect } from "react";
import { View } from "react-native";
import { usePersistedState } from "../hooks/usePersistedState";
import { colorScheme } from "nativewind";

export type theme = "dark" | "light";
const ThemeContext = createContext<{
  theme: {theme: theme};
  toggleTheme: () => void;
}>({ theme: {theme: "dark"}, toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

function ThemeContextProvider({ children }: any) {
  const [theme, setTheme] = usePersistedState<{theme: theme}>("theme", {theme: "dark"});
  const toggleTheme = () => {
    const newTheme = theme.theme === "dark" ? "light" : "dark";
    setTheme({theme: newTheme});
    colorScheme.set(newTheme);
  };


  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <View className={`${theme.theme}`}>{children}</View>
    </ThemeContext.Provider>
  );
}
export default ThemeContextProvider;
