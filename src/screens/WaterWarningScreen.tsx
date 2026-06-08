import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Rect, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { manrope } from '../theme/fonts';
import { bs } from '../theme/shadow';
import { LinearGrad } from '../components/Gradient';
import { useSession } from '../state/session';
import type { RootStackParamList } from '../navigation/types';

// 07 · Su Uyarısı — transparent modal over a blurred Menu.
export function WaterWarningScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = useSession();
  const dismiss = () => {
    s.refillWater();
    nav.goBack();
  };
  return (
    <View style={{ flex: 1 }}>
      <BlurView tint="light" intensity={18} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(20,30,35,0.18)' }} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: ds(240), backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: ds(24), paddingTop: ds(26), paddingBottom: ds(22), paddingHorizontal: ds(22), alignItems: 'center', gap: ds(14), boxShadow: bs('0 30px 60px -15px rgba(20,30,35,0.35), inset 0 0 0 1px rgba(255,255,255,0.5)') }}>
          <LinearGrad deg={135} colors={[C.primarySoft, 'rgba(118,145,155,0.18)']} style={{ width: ds(56), height: ds(56), borderRadius: ds(18), alignItems: 'center', justifyContent: 'center' }}>
            <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ width: ds(36), height: ds(36), borderRadius: ds(12), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 6px 12px -4px rgba(118,145,155,0.5)') }}>
              <Svg width={ds(14)} height={ds(20)} viewBox="0 0 14 20" fill="#fff">
                <Rect x={5.5} y={3} width={3} height={10} rx={1.5} />
                <Circle cx={7} cy={16} r={1.8} />
              </Svg>
            </LinearGrad>
          </LinearGrad>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: C.dark, fontSize: ds(15), lineHeight: ds(19.5), fontFamily: manrope(700), letterSpacing: -ds(0.2), textAlign: 'center' }}>Su seviyesi yetersiz</Text>
            <Text style={{ color: C.darkSoft, fontSize: ds(12), lineHeight: ds(16.8), marginTop: ds(4), fontFamily: manrope(400), textAlign: 'center' }}>Lütfen su haznesini doldurunuz.</Text>
          </View>
          <Pressable onPress={dismiss}>
            <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ borderRadius: ds(16), paddingVertical: ds(10), paddingHorizontal: ds(30), boxShadow: bs('0 8px 18px -6px rgba(118,145,155,0.55)') }}>
              <Text style={{ color: '#fff', fontFamily: manrope(700), fontSize: ds(13), letterSpacing: -ds(0.2) }}>Tamam</Text>
            </LinearGrad>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
