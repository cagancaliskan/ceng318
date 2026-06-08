import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as ExpoSplash from 'expo-splash-screen';
import { fontsToLoad } from './src/theme/fonts';
import { SessionProvider } from './src/state/session';
import { RootNavigator } from './src/navigation/RootNavigator';

ExpoSplash.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [loaded] = useFonts(fontsToLoad);
  const onReady = useCallback(() => {
    if (loaded) ExpoSplash.hideAsync().catch(() => {});
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <NavigationContainer onReady={onReady}>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
