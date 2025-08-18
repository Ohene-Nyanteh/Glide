import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "@/global.css";
import ThemeContextProvider, { useTheme } from "@/utils/contexts/ThemeContext";
import { colorScheme } from "nativewind";
import PlayerContextProvider from "@/utils/contexts/PlayerContext";
import Header from "@/components/General/Header";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme, View } from "react-native";
import LoadingScreen from "@/components/General/LoadingScreen";
import DatabaseContextProvider from "@/utils/contexts/DatabaseContext";
import { useSQLiteContext } from "expo-sqlite";
import UserContextProvider, { useUser } from "@/utils/contexts/UserContext";
import "react-native-get-random-values";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <DatabaseContextProvider>
      <PlayerContextProvider>
        <RootWrapper />
      </PlayerContextProvider>
    </DatabaseContextProvider>
  );
}

function RootLayoutNav() {
  return (
    <View className="w-full h-full relative bg-white dark:bg-black">
      <SafeAreaProvider>
        <Stack
          screenOptions={{
           headerShown: false,
          }}
        >
          <Stack.Screen name="(media-tabs)" />
          <Stack.Screen name="playlist" />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </SafeAreaProvider>
    </View>
  );
}

function RootWrapper() {
  const [initialLoad, setInitialLoad] = useState(true);
  const db = useSQLiteContext();
  useEffect(() => {
    if (!initialLoad) {
      SplashScreen.hideAsync();
    }
  }, [initialLoad]);

  if (initialLoad) {
    return (
      <ThemeContextProvider>
        <LoadingScreen
          db={db}
          setInitialLoad={setInitialLoad}
          initialLoad={initialLoad}
        />
      </ThemeContextProvider>
    );
  }

  return (
    <ThemeContextProvider>
      <UserContextProvider>
        <View className={`w-full h-full relative`}>
          <RootLayoutNav />
        </View>
      </UserContextProvider>
    </ThemeContextProvider>
  );
}
