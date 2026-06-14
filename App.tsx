import React from 'react';
import { View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { SessionProvider } from './src/state/session';
import { AuthProvider } from './src/state/auth';
import { useUI } from './src/theme/ui';
import { DESIGN_W, ds } from './src/theme/scale';
import { RootNavigator } from './src/navigation/RootNavigator';

// Status bar follows the active theme (light icons on the dark theme). Lives inside
// SessionProvider so it can read the theme; screens may still override it.
function ThemedStatusBar() {
  const { theme } = useUI();
  return <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />;
}

// The web build has no real device notch, so safe-area insets come back as 0 and
// every header/nav jams against the top/bottom. Inject the 402×874 design device's
// insets (iPhone 16 Pro: top 59, bottom 34), scaled to the column, so the layout
// matches native exactly.
const WEB_INSETS = { top: ds(59), bottom: ds(34), left: 0, right: 0 };

// On the WEB build, render the whole app as a centered, phone-width (402px) column
// on a dark backdrop — so a desktop browser shows it like a phone rather than
// stretching every screen across the full window. On native this is a no-op.
function WebFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#16100f' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: DESIGN_W, overflow: 'hidden', backgroundColor: '#faf9f9' }}>
        <SafeAreaInsetsContext.Provider value={WEB_INSETS}>{children}</SafeAreaInsetsContext.Provider>
      </View>
    </View>
  );
}

// Helvetica Neue is a native iOS system font, so there's nothing to preload.
export default function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <AuthProvider>
          <NavigationContainer>
            <ThemedStatusBar />
            <WebFrame>
              <RootNavigator />
            </WebFrame>
          </NavigationContainer>
        </AuthProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
