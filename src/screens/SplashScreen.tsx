import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { manrope } from '../theme/fonts';
import { RadialBg } from '../components/Gradient';
import type { RootStackParamList } from '../navigation/types';

// 01 · Splash — VESTEL wordmark, faded vertical "EggChef" motif, loader dots.
// Auto-advances to Login (the design is static; advancing is behavior, not design).
export function SplashScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    const t = setTimeout(() => nav.replace('Login'), 2200);
    return () => clearTimeout(t);
  }, [nav]);

  const stack = [0.08, 0.14, 0.24, 0.42, 0.95];
  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <StatusBar style="light" />
      <RadialBg
        stops={[
          { offset: 0, color: C.primaryDeep },
          { offset: 0.6, color: C.primary },
          { offset: 1, color: '#6a8590' },
        ]}
        cx="50%"
        cy="0%"
        r="100%"
      />

      {/* decorative blurred orbs */}
      <View style={{ position: 'absolute', width: ds(320), height: ds(320), borderRadius: ds(160), backgroundColor: 'rgba(255,255,255,0.08)', top: -ds(100), left: -ds(100) }} />
      <View style={{ position: 'absolute', width: ds(260), height: ds(260), borderRadius: ds(130), backgroundColor: 'rgba(255,255,255,0.05)', bottom: -ds(80), right: -ds(80) }} />

      {/* wordmark */}
      <View style={{ position: 'absolute', top: ds(130), left: 0, right: 0, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontFamily: manrope(800), fontSize: ds(36), letterSpacing: ds(6) }}>VESTEL</Text>
        <Text style={{ marginTop: ds(6), color: 'rgba(255,255,255,0.55)', fontSize: ds(8.5), letterSpacing: ds(5), fontFamily: manrope(400) }}>
          LOGO PLACEHOLDER
        </Text>
      </View>

      {/* faded vertical EggChef stack (writing-mode approximated via rotation) */}
      <View style={{ position: 'absolute', right: ds(26), top: ds(230), bottom: ds(80), alignItems: 'flex-end', justifyContent: 'flex-end' }}>
        {stack.map((o, i) => (
          <Text
            key={i}
            style={{
              transform: [{ rotate: '-90deg' }],
              fontFamily: manrope(300),
              fontSize: ds(56),
              color: `rgba(255,255,255,${o})`,
              letterSpacing: -ds(2),
              marginVertical: ds(8),
            }}
          >
            EggChef
          </Text>
        ))}
      </View>

      {/* loader dots (static — matches the artboard) */}
      <View style={{ position: 'absolute', bottom: ds(36), left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: ds(6) }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ width: ds(6), height: ds(6), borderRadius: ds(3), backgroundColor: i === 1 ? '#fff' : 'rgba(255,255,255,0.4)' }} />
        ))}
      </View>
    </View>
  );
}
