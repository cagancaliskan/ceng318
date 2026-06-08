import React from 'react';
import { View, Text, Pressable, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, Cx } from '../theme/colors';
import { ds } from '../theme/scale';
import { manrope } from '../theme/fonts';
import { bs } from '../theme/shadow';
import { LinearGrad } from '../components/Gradient';
import { AppHeader } from '../components/AppHeader';
import { EggDial } from '../components/EggDial';
import { Screen } from '../components/Screen';
import { Hamburger, WaterDrop, ClockMenu, Play, EggOutline, EggKayisi, EggKati } from '../icons';
import { BottomNav } from '../components/BottomNav';
import { useSession, Doneness } from '../state/session';
import { tabRoute } from '../navigation/helpers';
import type { RootStackParamList } from '../navigation/types';

const UPPER = { textTransform: 'uppercase' as const };

// 03 / 04 / 07(trigger) · Menu. The BottomNav comes from the tab navigator's
// custom tab bar; this screen renders the body only.
export function MenuScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = useSession();

  const presets: { label: Doneness; icon: (c: string) => React.ReactNode }[] = [
    { label: 'Rafadan', icon: (c) => <EggOutline size={22} color={c} sw={1.8} /> },
    { label: 'Kayısı', icon: (c) => <EggKayisi size={22} color={c} sw={1.8} /> },
    { label: 'Katı', icon: (c) => <EggKati size={22} color={c} sw={1.8} /> },
  ];

  const onStart = () => (s.lowWater ? nav.navigate('WaterWarning') : nav.navigate('Cooking', { count: s.count }));

  const presetBox: ViewStyle = { paddingTop: ds(14), paddingBottom: ds(12), paddingHorizontal: ds(6), borderRadius: ds(18), alignItems: 'center', gap: ds(6) };

  return (
    <Screen bg={C.bg}>
      <AppHeader />
      <View style={{ flex: 1, paddingHorizontal: ds(18), paddingTop: ds(8), paddingBottom: ds(90) }}>
        <EggDial count={s.count} size={160} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: ds(16), marginBottom: ds(10) }}>
          <Text style={{ fontFamily: manrope(800), color: C.dark, fontSize: ds(13.5), letterSpacing: -ds(0.2) }}>Hızlı Pişirme</Text>
          <Pressable
            onPress={() => nav.navigate('CustomCooking')}
            style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.panel, borderRadius: ds(10), paddingVertical: ds(5), paddingHorizontal: ds(10), flexDirection: 'row', alignItems: 'center', gap: ds(5) }}
          >
            <Hamburger size={10} color={C.darkSoft} sw={2.5} />
            <Text style={{ fontSize: ds(10.5), color: C.darkSoft, fontFamily: manrope(600) }}>Özel</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', gap: ds(8) }}>
          {presets.map((p) => {
            const active = s.doneness === p.label;
            return (
              <Pressable key={p.label} onPress={() => s.setDoneness(p.label)} style={{ flex: 1 }}>
                {active ? (
                  <LinearGrad deg={155} colors={[C.primary, C.primaryDeep]} style={{ ...presetBox, boxShadow: bs('0 10px 22px -8px rgba(118,145,155,0.55)') }}>
                    <View style={{ width: ds(26), height: ds(26) }}>{p.icon('#fff')}</View>
                    <Text style={{ fontSize: ds(10.5), fontFamily: manrope(700), color: '#fff', letterSpacing: -ds(0.1) }}>{p.label}</Text>
                  </LinearGrad>
                ) : (
                  <View style={{ ...presetBox, backgroundColor: '#fff', boxShadow: bs('0 4px 12px -6px rgba(60,70,75,0.12), inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
                    <View style={{ width: ds(26), height: ds(26) }}>{p.icon(C.primary)}</View>
                    <Text style={{ fontSize: ds(10.5), fontFamily: manrope(700), color: C.dark, letterSpacing: -ds(0.1) }}>{p.label}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* water + time */}
        <View
          style={{
            marginTop: ds(10),
            backgroundColor: s.lowWater ? Cx.warnBg : '#fff',
            borderRadius: ds(14),
            paddingVertical: ds(8),
            paddingHorizontal: ds(12),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: s.lowWater
              ? bs('0 4px 12px -6px rgba(255,159,10,0.18), inset 0 0 0 1px rgba(255,159,10,0.28)')
              : bs('0 4px 12px -6px rgba(60,70,75,0.1), inset 0 0 0 1px rgba(0,0,0,0.04)'),
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(9), flexShrink: 1 }}>
            <View style={{ width: ds(28), height: ds(28), borderRadius: ds(9), backgroundColor: s.lowWater ? 'rgba(255,159,10,0.14)' : C.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <WaterDrop size={14} color={s.lowWater ? Cx.warn : C.primary} />
              {s.lowWater && (
                <View style={{ position: 'absolute', top: -ds(3), right: -ds(3), width: ds(12), height: ds(12), borderRadius: ds(6), backgroundColor: Cx.warn, borderWidth: 1.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 2px 4px rgba(255,159,10,0.5)') }}>
                  <Text style={{ color: '#fff', fontSize: ds(7), fontFamily: manrope(800), lineHeight: ds(8) }}>!</Text>
                </View>
              )}
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text style={{ fontSize: ds(8), color: s.lowWater ? Cx.warnText : C.med, letterSpacing: ds(0.8), fontFamily: manrope(700), ...UPPER }}>
                {s.lowWater ? 'Önerilen Su · Düşük' : 'Önerilen Su'}
              </Text>
              <Text style={{ fontSize: ds(13), fontFamily: manrope(800), color: s.lowWater ? Cx.warnTextDeep : C.dark, letterSpacing: -ds(0.3) }}>{s.water}</Text>
              {s.lowWater && (
                <Text style={{ fontSize: ds(8), color: Cx.warnTextDeep, marginTop: ds(1), lineHeight: ds(10.4), fontFamily: manrope(600), maxWidth: ds(130) }}>
                  Pişirmeyi tamamlamak için su haznesine su ekleyiniz.
                </Text>
              )}
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(9) }}>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: ds(8), color: C.med, letterSpacing: ds(0.8), fontFamily: manrope(600), ...UPPER }}>Süre</Text>
              <Text style={{ fontSize: ds(13), fontFamily: manrope(800), color: C.dark, letterSpacing: -ds(0.3) }}>{s.time}</Text>
            </View>
            <View style={{ width: ds(28), height: ds(28), borderRadius: ds(9), backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <ClockMenu size={14} color={C.primary} />
            </View>
          </View>
        </View>

        {/* start */}
        <View style={{ marginTop: 'auto', alignItems: 'center', paddingTop: ds(12) }}>
          <Pressable onPress={onStart}>
            <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ borderRadius: ds(26), paddingVertical: ds(13), paddingHorizontal: ds(38), flexDirection: 'row', alignItems: 'center', gap: ds(10), boxShadow: bs('0 12px 26px -8px rgba(118,145,155,0.55)') }}>
              <Play size={13} color="#fff" />
              <Text style={{ color: '#fff', fontFamily: manrope(700), fontSize: ds(15), letterSpacing: -ds(0.2) }}>Başlat</Text>
            </LinearGrad>
          </Pressable>
        </View>
      </View>
      <BottomNav active="menu" onNavigate={(t) => nav.navigate(tabRoute(t))} />
    </Screen>
  );
}
