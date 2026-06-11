import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ds } from '../theme/scale';
import { Txt } from '../components/Txt';
import { LinearGrad } from '../components/Gradient';
import type { RootStackParamList } from '../navigation/types';

// 01 · Splash — bordo gradient, layered "EggChef" wordmark, vertical VESTEL.
export function SplashScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    const t = setTimeout(() => nav.replace('Login'), 2200);
    return () => clearTimeout(t);
  }, [nav]);

  const layers = [
    { o: 0.16, dy: 0 },
    { o: 0.4, dy: 14 },
    { o: 1, dy: 28 },
  ];

  return (
    <LinearGrad deg={135} colors={['#7a1c2e', '#a82740', '#56131e']} locations={[0, 0.5, 1]} style={{ flex: 1, overflow: 'hidden' }}>
      <StatusBar style="light" />

      {/* layered EggChef wordmark */}
      <View style={{ position: 'absolute', top: ds(150), left: ds(28), right: ds(28), height: ds(120) }}>
        {layers.map((l, i) => (
          <Txt key={i} size={48} weight={300} color={`rgba(255,255,255,${l.o})`} style={{ position: 'absolute', top: ds(l.dy), left: 0 }}>
            EggChef
          </Txt>
        ))}
      </View>

      {/* VESTEL — vertical, lower-right */}
      <View style={{ position: 'absolute', right: -ds(108), top: '44%', transform: [{ rotate: '-90deg' }] }} pointerEvents="none">
        <Txt size={78} weight={700} color="#ffffff" ls={3}>
          VESTEL
        </Txt>
      </View>
    </LinearGrad>
  );
}
