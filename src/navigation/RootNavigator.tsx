import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { PairDeviceScreen } from '../screens/PairDeviceScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { CookingScreen } from '../screens/CookingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CustomCookingScreen } from '../screens/CustomCookingScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { WaterWarningScreen } from '../screens/WaterWarningScreen';
import { CookingCompleteScreen } from '../screens/CookingCompleteScreen';
import { HomeNotificationScreen } from '../screens/HomeNotificationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// All screens on one native stack. Menu/Cooking/Profile each render their own
// floating BottomNav (as the design bakes it in); the two popups present as
// transparent modals so the screen behind them blurs through.
export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: '#FBFFF9' } }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="PairDevice" component={PairDeviceScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Cooking" component={CookingScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="CustomCooking" component={CustomCookingScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Lockscreen" component={HomeNotificationScreen} />
      <Stack.Group screenOptions={{ presentation: 'transparentModal', animation: 'fade' }}>
        <Stack.Screen name="WaterWarning" component={WaterWarningScreen} />
        <Stack.Screen name="CookingComplete" component={CookingCompleteScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
