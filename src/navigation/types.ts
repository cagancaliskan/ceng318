// Route map for the whole app. Onboarding + secondary screens live on the root
// native-stack; Menu/Cooking/Profile are the bottom-tab routes inside "Main".
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  PairDevice: undefined;
  Menu: undefined;
  Cooking: { minutes?: number; seconds?: number; count?: number } | undefined;
  Profile: undefined;
  CustomCooking: undefined;
  History: undefined;
  WaterWarning: undefined;
  CookingComplete: { count?: number; doneness?: string; time?: string } | undefined;
  Lockscreen: undefined;
};
