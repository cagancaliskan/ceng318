import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinear, Stop, Circle, Line, G } from 'react-native-svg';
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
import { Back, Plus, Minus, Play, EggOutline } from '../icons';
import { useSession } from '../state/session';
import { tabRoute } from '../navigation/helpers';
import type { RootStackParamList } from '../navigation/types';

const DIAL = 160;
const RAD = 65;
const CIRC = 2 * Math.PI * RAD;

function Stepper({ kind, onPress }: { kind: 'minus' | 'plus'; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: ds(44), height: ds(44), borderRadius: ds(16), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 6px 14px -6px rgba(60,70,75,0.18), inset 0 0 0 1px rgba(0,0,0,0.04)') }}
    >
      {kind === 'minus' ? <Minus size={18} color={C.primaryDeep} sw={2.6} /> : <Plus size={18} color={C.primaryDeep} sw={2.6} />}
    </Pressable>
  );
}

// 10 · Özel Pişirme (Custom Cooking) — live steppers, presets, egg count.
export function CustomCookingScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = useSession();
  const [minutes, setMinutes] = useState(s.customMin);
  const [seconds, setSeconds] = useState(s.customSec);
  const [unit, setUnit] = useState<'dk' | 'sn'>('dk');

  const totalSec = minutes * 60 + seconds;
  const frac = Math.min(totalSec / (30 * 60), 1);
  const dash = CIRC * frac;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  const step = (dir: 1 | -1) => {
    if (unit === 'dk') setMinutes((m) => Math.max(0, Math.min(30, m + dir)));
    else setSeconds((sec) => Math.max(0, Math.min(59, sec + dir)));
  };
  const presets = [3, 6, 8, 12, 15];

  const start = () => {
    s.setCustom(minutes, seconds);
    nav.navigate('Cooking', { minutes, seconds, count: s.count });
  };

  // handle position on the ring
  const a = -Math.PI / 2 + frac * Math.PI * 2;
  const hx = DIAL / 2 + Math.cos(a) * RAD;
  const hy = DIAL / 2 + Math.sin(a) * RAD;

  return (
    <Screen bg={C.bg}>
      <AppHeader />

      <View style={{ paddingHorizontal: ds(18), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: ds(4) }}>
        <Pressable onPress={() => nav.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: ds(6) }}>
          <Back size={12} color={C.primary} sw={2.5} />
          <Text style={{ color: C.primary, fontSize: ds(12), fontFamily: manrope(700) }}>Geri</Text>
        </Pressable>
        <View style={{ backgroundColor: '#fff', borderRadius: ds(10), paddingVertical: ds(4), paddingHorizontal: ds(9), boxShadow: bs('inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
          <Text style={{ fontSize: ds(9.5), fontFamily: manrope(700), color: C.primaryDeep, letterSpacing: ds(0.4), textTransform: 'uppercase' }}>Özel Mod</Text>
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: ds(18), paddingTop: ds(4), paddingBottom: ds(110) }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: ds(16), fontFamily: manrope(800), color: C.dark, letterSpacing: -ds(0.4) }}>Özel Pişirme</Text>
          <Text style={{ fontSize: ds(10), color: C.darkSoft, marginTop: ds(1), fontFamily: manrope(500) }}>Süreyi kendin ayarla</Text>
        </View>

        {/* dial + steppers */}
        <View style={{ marginTop: ds(8), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: ds(6) }}>
          <Stepper kind="minus" onPress={() => step(-1)} />
          <View style={{ width: ds(DIAL), height: ds(DIAL) }}>
            <Svg width={ds(DIAL)} height={ds(DIAL)} viewBox={`0 0 ${DIAL} ${DIAL}`} style={{ transform: [{ rotate: '-90deg' }] }}>
              <Defs>
                <SvgLinear id="customProg" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor={C.primary} />
                  <Stop offset="100%" stopColor={C.primaryDeep} />
                </SvgLinear>
              </Defs>
              <Circle cx={DIAL / 2} cy={DIAL / 2} r={RAD} fill="#fff" stroke={C.panel} strokeWidth={7} />
              <Circle cx={DIAL / 2} cy={DIAL / 2} r={RAD} fill="none" stroke="url(#customProg)" strokeWidth={8} strokeDasharray={`${dash} ${CIRC}`} strokeLinecap="round" />
              <G transform={`rotate(90 ${hx} ${hy})`}>
                <Circle cx={hx} cy={hy} r={7.5} fill="#fff" stroke={C.primaryDeep} strokeWidth={2.2} />
                <Circle cx={hx} cy={hy} r={2.8} fill={C.primaryDeep} />
              </G>
              {Array.from({ length: 12 }).map((_, i) => {
                const ta = -Math.PI / 2 + (i / 12) * Math.PI * 2;
                const r1 = RAD + 7;
                const r2 = RAD + (i % 3 === 0 ? 12 : 10);
                const x1 = DIAL / 2 + Math.cos(ta) * r1;
                const y1 = DIAL / 2 + Math.sin(ta) * r1;
                const x2 = DIAL / 2 + Math.cos(ta) * r2;
                const y2 = DIAL / 2 + Math.sin(ta) * r2;
                return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.medSoft} strokeWidth={i % 3 === 0 ? 1.8 : 1} strokeLinecap="round" transform={`rotate(90 ${DIAL / 2} ${DIAL / 2})`} />;
              })}
            </Svg>
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: ds(9), color: C.med, letterSpacing: ds(1.4), fontFamily: manrope(700), marginBottom: ds(2), textTransform: 'uppercase' }}>Süre</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: ds(3) }}>
                <Text style={{ fontSize: ds(32), fontFamily: manrope(800), color: C.dark, letterSpacing: -ds(1.5) }}>{mm}</Text>
                <Text style={{ fontSize: ds(18), fontFamily: manrope(600), color: C.med }}>:</Text>
                <Text style={{ fontSize: ds(32), fontFamily: manrope(800), color: C.dark, letterSpacing: -ds(1.5) }}>{ss}</Text>
              </View>
              <View style={{ marginTop: ds(4), flexDirection: 'row', gap: ds(14) }}>
                <Text style={{ fontSize: ds(7.5), color: C.med, letterSpacing: ds(1.2), fontFamily: manrope(700), textTransform: 'uppercase' }}>dakika</Text>
                <Text style={{ fontSize: ds(7.5), color: C.med, letterSpacing: ds(1.2), fontFamily: manrope(700), textTransform: 'uppercase' }}>saniye</Text>
              </View>
            </View>
          </View>
          <Stepper kind="plus" onPress={() => step(1)} />
        </View>

        {/* unit toggle */}
        <View style={{ marginTop: ds(8), alignSelf: 'center', flexDirection: 'row', backgroundColor: C.panel, borderRadius: ds(10), padding: ds(2.5), boxShadow: bs('inset 0 0 0 1px rgba(0,0,0,0.03)') }}>
          <Pressable onPress={() => setUnit('dk')} style={unit === 'dk' ? { paddingVertical: ds(4), paddingHorizontal: ds(14), borderRadius: ds(8), backgroundColor: '#fff', boxShadow: bs('0 2px 6px -3px rgba(60,70,75,0.15)') } : { paddingVertical: ds(4), paddingHorizontal: ds(14), borderRadius: ds(8) }}>
            <Text style={{ color: unit === 'dk' ? C.dark : C.med, fontSize: ds(10), fontFamily: manrope(unit === 'dk' ? 700 : 600), letterSpacing: -ds(0.1) }}>Dakika</Text>
          </Pressable>
          <Pressable onPress={() => setUnit('sn')} style={unit === 'sn' ? { paddingVertical: ds(4), paddingHorizontal: ds(14), borderRadius: ds(8), backgroundColor: '#fff', boxShadow: bs('0 2px 6px -3px rgba(60,70,75,0.15)') } : { paddingVertical: ds(4), paddingHorizontal: ds(14), borderRadius: ds(8) }}>
            <Text style={{ color: unit === 'sn' ? C.dark : C.med, fontSize: ds(10), fontFamily: manrope(unit === 'sn' ? 700 : 600), letterSpacing: -ds(0.1) }}>Saniye</Text>
          </Pressable>
        </View>

        {/* presets */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: ds(5), marginTop: ds(8) }}>
          {presets.map((p) => {
            const active = minutes === p && seconds === 0;
            return (
              <Pressable key={p} onPress={() => { setMinutes(p); setSeconds(0); }}>
                {active ? (
                  <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ paddingVertical: ds(7), paddingHorizontal: ds(12), borderRadius: ds(12), boxShadow: bs('0 6px 14px -6px rgba(118,145,155,0.5)') }}>
                    <Text style={{ fontSize: ds(10.5), fontFamily: manrope(700), color: '#fff', letterSpacing: -ds(0.1) }}>{p} dk</Text>
                  </LinearGrad>
                ) : (
                  <View style={{ paddingVertical: ds(7), paddingHorizontal: ds(12), borderRadius: ds(12), backgroundColor: '#fff', boxShadow: bs('0 2px 6px -3px rgba(60,70,75,0.08), inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
                    <Text style={{ fontSize: ds(10.5), fontFamily: manrope(700), color: C.darkSoft, letterSpacing: -ds(0.1) }}>{p} dk</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* egg count + water row */}
        <View style={{ marginTop: ds(10), backgroundColor: '#fff', borderRadius: ds(14), paddingVertical: ds(8), paddingHorizontal: ds(10), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', boxShadow: bs('0 4px 12px -6px rgba(60,70,75,0.1), inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(9) }}>
            <View style={{ width: ds(28), height: ds(28), borderRadius: ds(9), backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <EggOutline size={14} color={C.primary} sw={1.8} />
            </View>
            <View>
              <Text style={{ fontSize: ds(8), color: C.med, letterSpacing: ds(0.8), fontFamily: manrope(700), textTransform: 'uppercase' }}>Yumurta</Text>
              <Text style={{ fontSize: ds(12.5), fontFamily: manrope(800), color: C.dark, letterSpacing: -ds(0.3) }}>{s.count} adet</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(8) }}>
            <Pressable onPress={() => s.setCount(Math.max(1, s.count - 1))} style={{ width: ds(26), height: ds(26), borderRadius: ds(9), backgroundColor: C.panel, alignItems: 'center', justifyContent: 'center' }}>
              <Minus size={11} color={C.darkSoft} sw={3} />
            </Pressable>
            <Text style={{ fontSize: ds(14), fontFamily: manrope(800), color: C.dark, minWidth: ds(14), textAlign: 'center' }}>{s.count}</Text>
            <Pressable onPress={() => s.setCount(Math.min(6, s.count + 1))}>
              <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ width: ds(26), height: ds(26), borderRadius: ds(9), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 4px 8px -3px rgba(118,145,155,0.45)') }}>
                <Plus size={11} color="#fff" sw={3} />
              </LinearGrad>
            </Pressable>
          </View>
        </View>

        {/* start */}
        <View style={{ marginTop: 'auto', alignItems: 'center', paddingTop: ds(8) }}>
          <Pressable onPress={start}>
            <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ borderRadius: ds(22), paddingVertical: ds(11), paddingHorizontal: ds(32), flexDirection: 'row', alignItems: 'center', gap: ds(8), boxShadow: bs('0 10px 22px -8px rgba(118,145,155,0.55)') }}>
              <Play size={12} color="#fff" />
              <Text style={{ color: '#fff', fontFamily: manrope(700), fontSize: ds(13.5), letterSpacing: -ds(0.2) }}>Başlat</Text>
            </LinearGrad>
          </Pressable>
        </View>
      </View>

      <BottomNav active="menu" onNavigate={(t) => nav.navigate(tabRoute(t))} />
    </Screen>
  );
}
