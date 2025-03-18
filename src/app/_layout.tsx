import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
} from "@ui-kitten/components";
import { default as theme } from "@/src/constants/theme.json";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import React from "react";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// // Set the animation options. This is optional.
// SplashScreen.setOptions({
//   duration: 5000,
//   fade: true,
// });

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loaded) {
        SplashScreen.hideAsync();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="patients" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="auth" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ApplicationProvider>
    </>
  );
}
