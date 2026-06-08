import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinear, Stop, Circle, Path } from 'react-native-svg';
import { useNavigation, useRoute, useIsFocused, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { manrope } from '../theme/fonts';
import { bs } from '../theme/shadow';
import { LinearGrad } from '../components/Gradient';
import { AppHeader } from '../components/AppHeader';
import { Screen } from '../components/Screen';
import { Pause } from '../icons';
import { BottomNav } from '../components/BottomNav';
import { useSession } from '../state/session';
import { tabRoute } from '../navigation/helpers';
import type { RootStackParamList } from '../navigation/types';

const fmt = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

function StageIcon({ id, color }: { id: number; color: string }) {
  if (id === 0)
    return (
      <Svg width={ds(16)} height={ds(16)} viewBox="0 0 24 24" fill={color}>
        <Path d="M12 2c-4 5-6 8-6 12a6 6 0 0012 0c0-4-2-7-6-12z" />
      </Svg>
    );
  if (id === 1)
    return (
      <Svg width={ds(16)} height={ds(16)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
        <Path d="M14 4v9a4 4 0 11-4 0V4a2 2 0 014 0z" />
      </Svg>
    );
  return (
    <Svg width={ds(16)} height={ds(16)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M7 14c0-4 2-6 5-6s5 2 5 6" />
      <Path d="M5 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2" />
    </Svg>
  );
}

// 05 / 06 · Cooking — live countdown drives the ring, stage tracker, and the
// auto-transition into the completion popup.
export function CookingScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Cooking'>>();
  const s = useSession();
  const focused = useIsFocused();

  const total = useRef<number>(
    route.params?.minutes != null
      ? route.params.minutes * 60 + (route.params.seconds ?? 0)
      : parseInt(String(s.time).match(/\d+/)?.[0] ?? '8', 10) * 60,
  ).current;
  const [remaining, setRemaining] = useState(total);

  useEffect(() => {
    if (!focused) return;
    if (remaining <= 0) {
      const t = setTimeout(() => nav.navigate('CookingComplete', { count: s.count, doneness: s.doneness, time: fmt(total) }), 500);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => setRemaining((r: number) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(iv);
  }, [focused, remaining, nav, s.count, s.doneness, total]);

  const progress = total > 0 ? 1 - remaining / total : 0;
  const stage = progress >= 0.66 ? 2 : progress >= 0.33 ? 1 : 0;

  const R = ds(78);
  const circ = 2 * Math.PI * R;
  const dash = circ * progress;

  const stages = [
    { label: 'Su Alınıyor' },
    { label: 'Isınıyor' },
    { label: 'Haşlanıyor' },
  ];

  return (
    <Screen bg={C.bg}>
      <AppHeader />
      <View style={{ flex: 1, paddingHorizontal: ds(18), paddingTop: ds(10), paddingBottom: ds(110) }}>
        {/* lid pill */}
        <View style={{ alignSelf: 'center', backgroundColor: '#fff', paddingVertical: ds(7), paddingHorizontal: ds(18), borderRadius: ds(20), flexDirection: 'row', alignItems: 'center', gap: ds(6), boxShadow: bs('0 2px 8px -4px rgba(60,70,75,0.1), inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
          <View style={{ width: ds(6), height: ds(6), borderRadius: ds(3), backgroundColor: C.primary }} />
          <Text style={{ color: C.dark, fontSize: ds(11.5), fontFamily: manrope(700), letterSpacing: -ds(0.2) }}>Kapak Kapalı</Text>
        </View>

        {/* progress ring */}
        <View style={{ marginTop: ds(18), alignItems: 'center' }}>
          <View style={{ width: ds(190), height: ds(190) }}>
            <Svg width={ds(190)} height={ds(190)} style={{ transform: [{ rotate: '-90deg' }] }}>
              <Defs>
                <SvgLinear id="prog" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor={C.primary} />
                  <Stop offset="100%" stopColor={C.primaryDeep} />
                </SvgLinear>
              </Defs>
              <Circle cx={ds(95)} cy={ds(95)} r={R} fill="#fff" stroke={C.panel} strokeWidth={ds(8)} />
              {progress > 0 && (
                <Circle cx={ds(95)} cy={ds(95)} r={R} fill="none" stroke="url(#prog)" strokeWidth={ds(9)} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
              )}
            </Svg>
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: ds(11), color: C.med, letterSpacing: ds(1.5), fontFamily: manrope(700), marginBottom: ds(2), textTransform: 'uppercase' }}>Kalan Süre</Text>
              <Text style={{ fontSize: ds(40), fontFamily: manrope(800), color: C.dark, letterSpacing: -ds(1.5) }}>{fmt(remaining)}</Text>
            </View>
          </View>
        </View>

        {/* stage tracker */}
        <View style={{ marginTop: ds(26), flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: ds(4) }}>
          {stages.map((st, i) => {
            const active = i <= stage;
            return (
              <React.Fragment key={i}>
                <View style={{ alignItems: 'center', gap: ds(6), width: ds(64) }}>
                  {active ? (
                    <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ width: ds(36), height: ds(36), borderRadius: ds(12), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 6px 14px -4px rgba(118,145,155,0.45)') }}>
                      <StageIcon id={i} color="#fff" />
                    </LinearGrad>
                  ) : (
                    <View style={{ width: ds(36), height: ds(36), borderRadius: ds(12), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', boxShadow: bs(`inset 0 0 0 1px ${C.panelStrong}`) }}>
                      <StageIcon id={i} color={C.med} />
                    </View>
                  )}
                  <Text style={{ fontSize: ds(9.5), color: active ? C.dark : C.med, fontFamily: manrope(active ? 700 : 500), textAlign: 'center' }}>{st.label}</Text>
                </View>
                {i < stages.length - 1 && <View style={{ flex: 1, height: ds(3), borderRadius: ds(2), backgroundColor: i < stage ? C.primary : C.panel, marginTop: ds(16) }} />}
              </React.Fragment>
            );
          })}
        </View>

        {/* stop */}
        <View style={{ marginTop: 'auto', alignItems: 'center' }}>
          <Pressable onPress={() => nav.navigate('Menu')}>
            <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ borderRadius: ds(26), paddingVertical: ds(13), paddingHorizontal: ds(38), flexDirection: 'row', alignItems: 'center', gap: ds(10), boxShadow: bs('0 12px 26px -8px rgba(118,145,155,0.55)') }}>
              <Pause size={13} color="#fff" />
              <Text style={{ color: '#fff', fontFamily: manrope(700), fontSize: ds(15), letterSpacing: -ds(0.2) }}>Durdur</Text>
            </LinearGrad>
          </Pressable>
        </View>
      </View>
      <BottomNav active="cooking" onNavigate={(t) => nav.navigate(tabRoute(t))} />
    </Screen>
  );
}
