import { createContext, ReactNode, useContext } from "react";
import { usePersistedState } from "../hooks/usePersistedState";

const ThemeContext = createContext({});

export function useTheme(): any {
  return useContext(ThemeContext);
}

type themes = "dark" | "light";

function ThemeContextProvider({children}: any) {
  const [theme, setTheme] = usePersistedState<themes>("theme", "light");
  return <ThemeContext.Provider value={{theme, setTheme}}>{children}</ThemeContext.Provider>;
}
export default ThemeContextProvider;
