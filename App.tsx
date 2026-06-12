import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from './src/state/session';
import { useUI } from './src/theme/ui';
import { RootNavigator } from './src/navigation/RootNavigator';

// Status bar follows the active theme (light icons on the dark theme). Lives inside
// SessionProvider so it can read the theme; screens may still override it.
function ThemedStatusBar() {
  const { theme } = useUI();
  return <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />;
}

// Helvetica Neue is a native iOS system font, so there's nothing to preload.
export default function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <NavigationContainer>
          <ThemedStatusBar />
          <RootNavigator />
        </NavigationContainer>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
