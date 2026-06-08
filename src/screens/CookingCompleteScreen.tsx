import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { manrope } from '../theme/fonts';
import { bs } from '../theme/shadow';
import { LinearGrad } from '../components/Gradient';
import { Check } from '../icons';
import type { RootStackParamList } from '../navigation/types';

const confetti = [
  { x: 30, y: 90, c: C.primary, s: 4 },
  { x: 230, y: 110, c: C.primaryDeep, s: 5 },
  { x: 60, y: 160, c: C.primary, s: 3 },
  { x: 250, y: 200, c: C.primary, s: 4 },
  { x: 40, y: 260, c: C.primaryDeep, s: 3 },
  { x: 245, y: 300, c: C.primary, s: 4 },
  { x: 80, y: 510, c: C.primary, s: 4 },
  { x: 220, y: 470, c: C.primaryDeep, s: 3 },
];

// 11 · Pişirme Tamamlandı — transparent modal over a blurred Cooking screen.
export function CookingCompleteScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CookingComplete'>>();
  const count = route.params?.count ?? 3;
  const doneness = route.params?.doneness ?? 'Rafadan';
  const time = route.params?.time ?? '08:30';

  const Stat = ({ label, value }: { label: string; value: string }) => (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={{ fontSize: ds(7.5), color: C.med, letterSpacing: ds(1), fontFamily: manrope(700), textTransform: 'uppercase' }}>{label}</Text>
      <Text style={{ fontSize: ds(11.5), color: C.dark, fontFamily: manrope(800), marginTop: ds(2), letterSpacing: -ds(0.2) }}>{value}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <BlurView tint="light" intensity={16} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(20,30,35,0.22)' }} />

      {confetti.map((d, i) => (
        <View key={i} style={{ position: 'absolute', left: ds(d.x), top: ds(d.y), width: ds(d.s), height: ds(d.s), borderRadius: ds(d.s / 2), backgroundColor: d.c, opacity: 0.6 }} />
      ))}

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: ds(256), backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: ds(26), paddingTop: ds(26), paddingBottom: ds(20), paddingHorizontal: ds(22), alignItems: 'center', gap: ds(14), boxShadow: bs('0 30px 60px -15px rgba(20,30,35,0.4), inset 0 0 0 1px rgba(255,255,255,0.5)') }}>
          <LinearGrad deg={135} colors={[C.primarySoft, 'rgba(118,145,155,0.18)']} style={{ width: ds(68), height: ds(68), borderRadius: ds(22), alignItems: 'center', justifyContent: 'center' }}>
            <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ width: ds(46), height: ds(46), borderRadius: ds(14), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 8px 16px -4px rgba(118,145,155,0.55)') }}>
              <Check size={22} color="#fff" sw={3} />
            </LinearGrad>
          </LinearGrad>

          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: ds(9.5), color: C.primaryDeep, letterSpacing: ds(2), fontFamily: manrope(800), textTransform: 'uppercase' }}>Afiyet Olsun</Text>
            <Text style={{ color: C.dark, fontSize: ds(18), lineHeight: ds(22.5), fontFamily: manrope(800), letterSpacing: -ds(0.3), marginTop: ds(4), textAlign: 'center' }}>Pişirme Tamamlandı</Text>
            <Text style={{ color: C.darkSoft, fontSize: ds(11), lineHeight: ds(15.4), marginTop: ds(4), fontFamily: manrope(400), textAlign: 'center' }}>Yumurtalarınız hazır. Cihazın kapağını dikkatlice açabilirsiniz.</Text>
          </View>

          <View style={{ width: '100%', backgroundColor: C.bgTint, borderRadius: ds(14), paddingVertical: ds(10), paddingHorizontal: ds(12), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', boxShadow: bs('inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
            <Stat label="Tür" value={doneness} />
            <View style={{ width: 1, height: ds(22), backgroundColor: C.panelStrong }} />
            <Stat label="Adet" value={String(count)} />
            <View style={{ width: 1, height: ds(22), backgroundColor: C.panelStrong }} />
            <Stat label="Süre" value={time} />
          </View>

          <Pressable style={{ width: '100%' }} onPress={() => nav.navigate('Menu')}>
            <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ width: '100%', borderRadius: ds(16), paddingVertical: ds(11), alignItems: 'center', boxShadow: bs('0 8px 18px -6px rgba(118,145,155,0.55)') }}>
              <Text style={{ color: '#fff', fontFamily: manrope(700), fontSize: ds(13), letterSpacing: -ds(0.2) }}>Tamam</Text>
            </LinearGrad>
          </Pressable>
          <Pressable onPress={() => nav.navigate('History')} style={{ marginTop: -ds(6) }}>
            <Text style={{ color: C.darkSoft, fontSize: ds(10.5), fontFamily: manrope(700), letterSpacing: ds(0.2) }}>Geçmişe Kaydet</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
