import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import Svg, { Path, Rect, Line, Ellipse } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { manrope } from '../theme/fonts';
import { bs } from '../theme/shadow';
import { LinearGrad, RadialBg } from '../components/Gradient';
import { Search } from '../icons';
import type { RootStackParamList } from '../navigation/types';

function AppIcon({ colors, glyph, badge }: { colors: readonly [string, string, ...string[]]; glyph: React.ReactNode; badge?: string }) {
  return (
    <View style={{ alignItems: 'center', gap: ds(4) }}>
      <LinearGrad deg={155} colors={colors} style={{ width: ds(50), height: ds(50), borderRadius: ds(14), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 4px 10px -4px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)') }}>
        {glyph}
      </LinearGrad>
      {badge && (
        <View style={{ position: 'absolute', top: -ds(4), right: -ds(4), minWidth: ds(18), height: ds(18), borderRadius: ds(9), backgroundColor: '#ff3b30', alignItems: 'center', justifyContent: 'center', paddingHorizontal: ds(5), borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', boxShadow: bs('0 2px 6px rgba(255,59,48,0.5)') }}>
          <Text style={{ color: '#fff', fontSize: ds(10), fontFamily: manrope(800) }}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

// 12 · Home / Notification — the phone lockscreen (a demo of the OS surface, not
// an in-app screen). Tapping the banner opens the app.
export function HomeNotificationScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={{ flex: 1, backgroundColor: '#0e1316', overflow: 'hidden' }}>
      <StatusBar style="light" />
      {/* iOS-style wallpaper (layered radial gradients) */}
      <RadialBg stops={[{ offset: 0, color: '#2a3338' }, { offset: 0.6, color: '#1a2025' }, { offset: 1, color: '#0e1316' }]} cx="50%" cy="100%" r="120%" />
      <RadialBg stops={[{ offset: 0, color: 'rgba(118,145,155,0.55)' }, { offset: 0.55, color: 'rgba(118,145,155,0)' }]} cx="20%" cy="15%" r="90%" />
      <RadialBg stops={[{ offset: 0, color: 'rgba(255,200,150,0.35)' }, { offset: 0.5, color: 'rgba(255,200,150,0)' }]} cx="85%" cy="30%" r="80%" />

      {/* drawn status bar (this screen depicts the OS, so it keeps its own) */}
      <View style={{ height: ds(38), paddingTop: ds(14), paddingHorizontal: ds(22), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text style={{ fontSize: ds(11), fontFamily: manrope(600), color: '#fff', letterSpacing: ds(0.2) }}>9:41</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(4), opacity: 0.85 }}>
          <Svg width={ds(14)} height={ds(9)} viewBox="0 0 14 9" fill="#fff">
            <Rect x={0} y={6} width={2} height={3} rx={0.5} />
            <Rect x={3} y={4} width={2} height={5} rx={0.5} />
            <Rect x={6} y={2} width={2} height={7} rx={0.5} />
            <Rect x={9} y={0} width={2} height={9} rx={0.5} />
          </Svg>
          <Svg width={ds(14)} height={ds(10)} viewBox="0 0 14 10" fill="none" stroke="#fff" strokeWidth={1.2}>
            <Rect x={0.5} y={2} width={11} height={6} rx={1.3} />
            <Rect x={1.8} y={3.3} width={8.4} height={3.4} rx={0.5} fill="#fff" />
            <Rect x={12.2} y={3.8} width={1.3} height={2.4} rx={0.5} fill="#fff" />
          </Svg>
        </View>
      </View>

      {/* lockscreen clock */}
      <View style={{ alignItems: 'center', marginTop: ds(6) }}>
        <Text style={{ fontSize: ds(11), fontFamily: manrope(600), color: '#fff', opacity: 0.85, letterSpacing: ds(0.3) }}>Pazartesi, 18 Mayıs</Text>
        <Text style={{ fontSize: ds(78), fontFamily: manrope(200), color: '#fff', letterSpacing: -ds(3), marginTop: ds(2) }}>9:41</Text>
      </View>

      {/* notification banner */}
      <View style={{ paddingHorizontal: ds(12), paddingTop: ds(14) }}>
        <Pressable onPress={() => nav.navigate('Main', { screen: 'Menu' })}>
          <BlurView tint="light" intensity={40} style={{ borderRadius: ds(18), paddingVertical: ds(10), paddingHorizontal: ds(12), flexDirection: 'row', alignItems: 'flex-start', gap: ds(10), backgroundColor: 'rgba(255,255,255,0.72)', overflow: 'hidden', boxShadow: bs('0 20px 40px -10px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.4)') }}>
            <View style={{ position: 'absolute', top: ds(4), left: '50%', marginLeft: -ds(18), width: ds(36), height: ds(3), borderRadius: ds(2), backgroundColor: 'rgba(60,70,75,0.18)' }} />
            <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ width: ds(36), height: ds(36), borderRadius: ds(10), alignItems: 'center', justifyContent: 'center', marginTop: ds(2), boxShadow: bs('0 4px 10px -2px rgba(118,145,155,0.5)') }}>
              <Svg width={ds(18)} height={ds(18)} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <Ellipse cx={12} cy={13} rx={6} ry={8} />
                <Path d="M9 13l2 2 4-4" strokeWidth={2.4} />
              </Svg>
            </LinearGrad>
            <View style={{ flex: 1, paddingTop: ds(2) }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: ds(8) }}>
                <Text style={{ fontSize: ds(10.5), fontFamily: manrope(800), color: C.dark, letterSpacing: -ds(0.1), textTransform: 'uppercase' }}>EggChef</Text>
                <Text style={{ fontSize: ds(9.5), color: C.darkSoft, fontFamily: manrope(600) }}>şimdi</Text>
              </View>
              <Text style={{ fontSize: ds(12), fontFamily: manrope(800), color: C.dark, marginTop: ds(2), letterSpacing: -ds(0.2) }}>Pişirme tamamlandı 🎉</Text>
              <Text style={{ fontSize: ds(10.5), color: C.darkSoft, marginTop: ds(2), lineHeight: ds(14.2), fontFamily: manrope(400) }}>3 adet rafadan yumurtanız hazır. Cihazı dikkatlice açabilirsiniz.</Text>
            </View>
          </BlurView>
        </Pressable>

        {/* grouped older notifications */}
        <View style={{ marginTop: -ds(6), marginHorizontal: ds(14), height: ds(22), borderRadius: ds(16), backgroundColor: 'rgba(255,255,255,0.5)', boxShadow: bs('0 8px 20px -10px rgba(0,0,0,0.35)') }} />
        <View style={{ marginTop: -ds(4), marginHorizontal: ds(24), height: ds(16), borderRadius: ds(14), backgroundColor: 'rgba(255,255,255,0.32)', boxShadow: bs('0 6px 14px -8px rgba(0,0,0,0.3)') }} />
      </View>

      {/* search pill */}
      <View style={{ position: 'absolute', bottom: ds(132), alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: ds(6) }}>
        <BlurView tint="dark" intensity={20} style={{ flexDirection: 'row', alignItems: 'center', gap: ds(6), paddingVertical: ds(7), paddingHorizontal: ds(16), borderRadius: ds(18), backgroundColor: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
          <Search size={11} color="#fff" sw={2.4} />
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: ds(11), fontFamily: manrope(600) }}>Ara</Text>
        </BlurView>
      </View>

      {/* dock */}
      <View style={{ position: 'absolute', bottom: ds(36), left: ds(14), right: ds(14) }}>
        <BlurView tint="dark" intensity={28} style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: ds(12), paddingHorizontal: ds(14), borderRadius: ds(26), backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden', boxShadow: bs('inset 0 0 0 1px rgba(255,255,255,0.18)') }}>
          <AppIcon
            colors={[C.primary, C.primaryDeep]}
            badge="1"
            glyph={
              <Svg width={ds(26)} height={ds(26)} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                <Ellipse cx={12} cy={13} rx={6} ry={8} />
              </Svg>
            }
          />
          <AppIcon
            colors={['#34c759', '#248a3d']}
            glyph={
              <Svg width={ds(24)} height={ds(24)} viewBox="0 0 24 24" fill="#fff">
                <Path d="M20.5 15.5c-1.2 0-2.4-.2-3.5-.6-.4-.1-.8 0-1 .2l-2 2c-3-1.5-5.5-4-7-7l2-2c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5C8.6 3 8 2.5 7.5 2.5h-3C4 2.5 3.5 3 3.5 3.5 3.5 13 11 20.5 20.5 20.5c.5 0 1-.5 1-1v-3c0-.5-.5-1-1-1z" />
              </Svg>
            }
          />
          <AppIcon
            colors={['#5e9eff', '#0a84ff']}
            glyph={
              <Svg width={ds(24)} height={ds(24)} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M21 11.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z" />
                <Path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
              </Svg>
            }
          />
          <AppIcon
            colors={['#ff9f0a', '#ff7a00']}
            glyph={
              <Svg width={ds(22)} height={ds(22)} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Rect x={4} y={3} width={16} height={18} rx={2} />
                <Line x1={8} y1={7} x2={16} y2={7} />
                <Line x1={8} y1={11} x2={16} y2={11} />
                <Line x1={8} y1={15} x2={13} y2={15} />
              </Svg>
            }
          />
        </BlurView>
      </View>

      {/* home indicator */}
      <View style={{ position: 'absolute', bottom: ds(8), alignSelf: 'center', width: ds(110), height: ds(5), borderRadius: ds(3), backgroundColor: 'rgba(255,255,255,0.85)' }} />
    </View>
  );
}
