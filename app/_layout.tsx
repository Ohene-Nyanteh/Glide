import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";
import "@/global.css";
import ThemeContextProvider, { useTheme } from "@/utils/contexts/ThemeContext";
import PlayerContextProvider from "@/utils/contexts/PlayerContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import LoadingScreen from "@/components/General/LoadingScreen";
import { StyleSheet, Platform, StatusBar } from "react-native";
import DatabaseContextProvider from "@/utils/contexts/DatabaseContext";
import { useSQLiteContext } from "expo-sqlite";
import UserContextProvider from "@/utils/contexts/UserContext";
import "react-native-get-random-values";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toasts } from "@backpackapp-io/react-native-toast";
import SettingsContextProvider from "@/utils/contexts/SettingsContext";
import AudioPlayerWrapper from "@/utils/contexts/AudioContext";
import NotificationContextProvider from "@/utils/contexts/NotificationContext";
import MediaAudioPlayerProvider from "@/utils/contexts/AudioPlayerContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <DatabaseContextProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PlayerContextProvider>
          <RootWrapper />
        </PlayerContextProvider>
      </GestureHandlerRootView>
    </DatabaseContextProvider>
  );
}

function RootLayoutNav() {
  const { theme } = useTheme();
  if (theme.theme === "dark") {
    StatusBar.setBarStyle("light-content");
  } else {
    StatusBar.setBarStyle("dark-content");
  }
  const style = StyleSheet.create({
    AndroidSafeArea: {
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
  });

  return (
    <View
      className="w-full h-full relative bg-white dark:bg-black"
      style={style.AndroidSafeArea}
    >
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(media-tabs)" />
          <Stack.Screen name="playlist" />
          <Stack.Screen name="artists" />
          <Stack.Screen name="albums" />
          <Stack.Screen name="playMedia" />
          <Stack.Screen name="search"/>
        </Stack>
      </SafeAreaProvider>
    </View>
  );
}

function RootWrapper() {
  const [initialLoad, setInitialLoad] = useState(true);
  const db = useSQLiteContext();

  useEffect(() => {
    SplashScreen.hideAsync();
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
        <SettingsContextProvider>
          <MediaAudioPlayerProvider>
            <NotificationContextProvider>
              <AudioPlayerWrapper>
                <View className={`w-full h-full relative`}>
                  <RootLayoutNav />
                </View>
              </AudioPlayerWrapper>
            </NotificationContextProvider>
          </MediaAudioPlayerProvider>
        </SettingsContextProvider>
      </UserContextProvider>
      <Toasts />
    </ThemeContextProvider>
  );
}
