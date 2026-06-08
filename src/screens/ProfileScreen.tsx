import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { manrope } from '../theme/fonts';
import { bs } from '../theme/shadow';
import { LinearGrad } from '../components/Gradient';
import { AppHeader } from '../components/AppHeader';
import { BottomNav } from '../components/BottomNav';
import { Screen } from '../components/Screen';
import { tabRoute } from '../navigation/helpers';
import type { RootStackParamList } from '../navigation/types';

const UP = { textTransform: 'uppercase' as const };

// 09 · Profile (a tab — bottom nav comes from the tab bar).
export function ProfileScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen bg={C.bg}>
      <AppHeader greeting={false} />
      <View style={{ flex: 1, paddingHorizontal: ds(18), paddingTop: ds(8), paddingBottom: ds(100) }}>
        {/* profile card */}
        <View style={{ backgroundColor: '#fff', borderRadius: ds(20), padding: ds(14), flexDirection: 'row', alignItems: 'center', gap: ds(14), boxShadow: bs('0 4px 14px -6px rgba(60,70,75,0.12), inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
          <View>
            <LinearGrad deg={135} colors={[C.panel, C.medSoft]} style={{ width: ds(64), height: ds(64), borderRadius: ds(20), alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden', boxShadow: bs('inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
              <Svg width={ds(46)} height={ds(50)} viewBox="0 0 24 26" fill={C.darkSoft}>
                <Circle cx={12} cy={9} r={5} />
                <Path d="M3 24c0-5 4-9 9-9s9 4 9 9" />
              </Svg>
            </LinearGrad>
            <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ position: 'absolute', bottom: -ds(4), right: -ds(4), width: ds(22), height: ds(22), borderRadius: ds(8), borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 4px 8px -2px rgba(118,145,155,0.5)') }}>
              <Svg width={ds(10)} height={ds(10)} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round">
                <Path d="M4 20l4-1L20 7l-3-3L5 16l-1 4z" />
              </Svg>
            </LinearGrad>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: manrope(800), color: C.dark, fontSize: ds(18), letterSpacing: -ds(0.3) }}>Ahmet</Text>
            <Text style={{ fontSize: ds(11), color: C.med, marginTop: ds(2), fontFamily: manrope(400) }}>ahm******gmail.com</Text>
          </View>
        </View>

        <Text style={{ fontSize: ds(10), color: C.med, marginTop: ds(18), marginBottom: ds(8), letterSpacing: ds(1.2), fontFamily: manrope(700), paddingHorizontal: ds(4), ...UP }}>Tercihler</Text>

        <View style={{ flexDirection: 'row', gap: ds(8) }}>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: ds(14), paddingVertical: ds(10), paddingHorizontal: ds(12), gap: ds(4), boxShadow: bs('0 2px 8px -4px rgba(60,70,75,0.1), inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
            <Text style={{ fontSize: ds(9), color: C.med, letterSpacing: ds(0.5), fontFamily: manrope(600), ...UP }}>Dil</Text>
            <Text style={{ fontSize: ds(12), color: C.dark, fontFamily: manrope(700) }}>🇹🇷 Türkçe</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: ds(14), paddingVertical: ds(10), paddingHorizontal: ds(12), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', boxShadow: bs('0 2px 8px -4px rgba(60,70,75,0.1), inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
            <View>
              <Text style={{ fontSize: ds(9), color: C.med, letterSpacing: ds(0.5), fontFamily: manrope(600), ...UP }}>Tema</Text>
              <Text style={{ fontSize: ds(12), color: C.dark, fontFamily: manrope(700), marginTop: ds(2) }}>Açık</Text>
            </View>
            <View style={{ width: ds(32), height: ds(18), borderRadius: ds(10), backgroundColor: C.panelStrong }}>
              <View style={{ position: 'absolute', top: ds(2), left: ds(2), width: ds(14), height: ds(14), borderRadius: ds(7), backgroundColor: '#fff', boxShadow: bs('0 1px 3px rgba(0,0,0,0.18)') }} />
            </View>
          </View>
        </View>

        <Pressable onPress={() => nav.navigate('History')} style={{ marginTop: ds(14), backgroundColor: '#fff', borderRadius: ds(16), paddingVertical: ds(12), paddingHorizontal: ds(14), flexDirection: 'row', alignItems: 'center', gap: ds(12), boxShadow: bs('0 2px 8px -4px rgba(60,70,75,0.1), inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
          <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ width: ds(32), height: ds(32), borderRadius: ds(10), alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={ds(14)} height={ds(14)} viewBox="0 0 24 24" fill="#fff">
              <Path d="M6 11h12l-1 8H7zM8 11c0-3 2-5 4-5s4 2 4 5" />
            </Svg>
          </LinearGrad>
          <Text style={{ color: C.dark, fontFamily: manrope(700), fontSize: ds(13), letterSpacing: -ds(0.2) }}>Pişirme Geçmişi</Text>
          <Text style={{ marginLeft: 'auto', color: C.med, fontSize: ds(13) }}>→</Text>
        </Pressable>

        <View style={{ marginTop: ds(20), gap: ds(8) }}>
          <Pressable style={{ backgroundColor: '#fff', borderRadius: ds(16), paddingVertical: ds(11), paddingHorizontal: ds(14), flexDirection: 'row', alignItems: 'center', gap: ds(12), boxShadow: bs('0 2px 8px -4px rgba(60,70,75,0.1), inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
            <View style={{ width: ds(28), height: ds(28), borderRadius: ds(9), backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={ds(14)} height={ds(14)} viewBox="0 0 24 24" fill={C.primary}>
                <Path d="M20 15.5c-1.2 0-2.4-.2-3.5-.6-.4-.1-.8 0-1 .2l-2 2c-3-1.5-5.5-4-7-7l2-2c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5C8 3 7.5 2.5 7 2.5H4C3.5 2.5 3 3 3 3.5 3 13 11 21 20.5 21c.5 0 1-.5 1-1v-3c0-.5-.5-1-1-1z" />
              </Svg>
            </View>
            <Text style={{ color: C.dark, fontSize: ds(12.5), fontFamily: manrope(600) }}>Müşteri Hizmetleri</Text>
            <Text style={{ marginLeft: 'auto', color: C.med, fontSize: ds(13) }}>→</Text>
          </Pressable>
          <View style={{ backgroundColor: C.panel, borderRadius: ds(16), paddingVertical: ds(11), paddingHorizontal: ds(14), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ds(8) }}>
            <View style={{ width: ds(6), height: ds(6), borderRadius: ds(3), backgroundColor: C.primary }} />
            <Text style={{ color: C.darkSoft, fontSize: ds(11), fontFamily: manrope(600) }}>Cihaz · A98S77AFG</Text>
          </View>
        </View>
      </View>
      <BottomNav active="profile" onNavigate={(t) => nav.navigate(tabRoute(t))} />
    </Screen>
  );
}
