import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUI } from '../theme/ui';
import type { RootStackParamList } from './types';
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { PairDeviceScreen } from '../screens/PairDeviceScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { CookingScreen } from '../screens/CookingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CustomCookingScreen } from '../screens/CustomCookingScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { WaterWarningScreen } from '../screens/WaterWarningScreen';
import { CookingCompleteScreen } from '../screens/CookingCompleteScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// One native stack. Menu/Cooking/Profile each render their own floating BottomNav.
// Custom cooking, the water warning, and the completion screen present as
// transparent modals (popups over the screen behind them).
export function RootNavigator() {
  const { C } = useUI();
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: C.bg } }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="PairDevice" component={PairDeviceScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Cooking" component={CookingScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Group screenOptions={{ presentation: 'transparentModal', animation: 'fade' }}>
        <Stack.Screen name="CustomCooking" component={CustomCookingScreen} />
        <Stack.Screen name="WaterWarning" component={WaterWarningScreen} />
        <Stack.Screen name="CookingComplete" component={CookingCompleteScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
