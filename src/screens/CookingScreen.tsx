import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, Animated, Easing, Platform } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinear, Stop, Circle, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { useUI } from '../theme/ui';
import { Txt } from '../components/Txt';
import { LinearGrad } from '../components/Gradient';
import { AppHeader } from '../components/AppHeader';
import { Screen } from '../components/Screen';
import { BottomNav } from '../components/BottomNav';
import { useSession } from '../state/session';
import { tabRoute } from '../navigation/helpers';
import type { RootStackParamList } from '../navigation/types';

const fmt = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
const STAGES = ['Su Alıyor', 'Isınıyor', 'Haşlanıyor'];
const STAGES_EN = ['Filling Water', 'Heating', 'Boiling'];
const DONE_EN: Record<string, string> = { Rafadan: 'Soft', Kayısı: 'Medium', Katı: 'Hard' };
// per-stage accent colors (water = blue, heat = amber, boil = bordo)
const STAGE_COLORS = ['#2f7ad1', '#e0a52a', C.bordoBright];

function StageIcon({ id, color, size = 26 }: { id: number; color: string; size?: number }) {
  if (id === 0)
    return (
      <Svg width={ds(size)} height={ds(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round">
        <Path d="M12 3.5c-3.5 4.2-6 7.2-6 10.5a6 6 0 0012 0c0-3.3-2.5-6.3-6-10.5z" />
      </Svg>
    );
  if (id === 1)
    return (
      <Svg width={ds(size)} height={ds(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
        <Path d="M14 4.5v8.2a4 4 0 11-4 0V4.5a2 2 0 014 0z" />
      </Svg>
    );
  return (
    <Svg width={ds(size)} height={ds(size)} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
      <Path d="M7 9c1.3-1.6 1.3-2.8 0-4.4M12 9c1.3-1.6 1.3-2.8 0-4.4M17 9c1.3-1.6 1.3-2.8 0-4.4" />
      <Path d="M5 13c0-1 1-2 7-2s7 1 7 2c0 4-2 7-7 7s-7-3-7-7z" />
    </Svg>
  );
}

// Expanding ring that pulses around the CURRENT stage's icon, so it's clear the
// progress has reached that icon.
function Pulse({ color }: { color: string }) {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(p, { toValue: 1, duration: 1300, easing: Easing.out(Easing.ease), useNativeDriver: Platform.OS !== 'web' }));
    loop.start();
    return () => loop.stop();
  }, [p]);
  const scale = p.interpolate({ inputRange: [0, 1], outputRange: [1, 1.85] });
  const opacity = p.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] });
  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: 'absolute', width: ds(46), height: ds(46), borderRadius: ds(23), borderWidth: 2, borderColor: color, opacity, transform: [{ scale }] }}
    />
  );
}

// 05 · Cooking (su alıyor / ısınıyor / haşlanıyor). Counts down only while a cook
// is active; the tab shows an idle "Başlat" state otherwise.
export function CookingScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = useSession();
  const { C, L } = useUI();
  const [, force] = useState(0);

  // Tick once a second WHILE a cook is active. Driven off cook state only (not
  // useIsFocused, which is unreliable on web and froze the counter there). The
  // remaining time is derived from cookStartedAt, so it stays correct across
  // unmount/remount when switching tabs.
  useEffect(() => {
    if (!s.cookActive) return;
    const iv = setInterval(() => force((x) => (x + 1) % 1000000), 1000);
    return () => clearInterval(iv);
  }, [s.cookActive]);

  const elapsed = s.cookActive ? Math.floor((Date.now() - s.cookStartedAt) / 1000) : 0;
  const total = s.cookActive ? s.cookTotal : s.durationSec;
  const remaining = Math.max(0, total - elapsed);
  const lowTime = s.cookActive && remaining <= 15; // last 15s: highlight the timer (any scenario)

  // timing: water-drawing takes 5s per egg; heating + boiling split the rest evenly.
  const waterSec = s.count * 5;
  const heatDur = Math.max(0, (total - waterSec) / 2);
  const stage = !s.cookActive ? 0 : elapsed < waterSec ? 0 : elapsed < waterSec + heatDur ? 1 : 2;

  // Icons stay fixed at 0°/60°/120° (= 0, 1/6, 1/3 of the ring). The bar fills so its
  // head reaches each icon exactly when that stage begins — water→heat over `waterSec`
  // (egg count × 5s), heat→boil over `heatDur`, then boil→full over the rest.
  const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t));
  let progress = 0;
  if (s.cookActive && total > 0) {
    if (total <= waterSec) progress = elapsed / total; // all-water edge: fill linearly
    else if (elapsed <= waterSec) progress = lerp(0, 1 / 6, elapsed / waterSec);
    else if (elapsed <= waterSec + heatDur) progress = lerp(1 / 6, 1 / 3, (elapsed - waterSec) / heatDur);
    else progress = lerp(1 / 3, 1, (elapsed - waterSec - heatDur) / heatDur);
  }

  useEffect(() => {
    if (s.cookActive && remaining === 0) {
      const t = setTimeout(() => nav.navigate('CookingComplete'), 300);
      return () => clearTimeout(t);
    }
  }, [s.cookActive, remaining, nav]);

  // ring geometry. Progress sweeps CLOCKWISE from the top; the stage bubbles sit on
  // the RIGHT arc (same direction) so the sweep passes them in order: water → heat → boil.
  const cx = ds(150);
  const cy = ds(150);
  const Rr = ds(132);
  const pt = (phi: number) => ({ x: cx + Rr * Math.sin(phi), y: cy - Rr * Math.cos(phi) });
  const sweep = Math.min(progress, 0.9999) * Math.PI * 2;
  const p0 = { x: cx, y: cy - Rr };
  const pe = { x: cx + Rr * Math.sin(sweep), y: cy - Rr * Math.cos(sweep) };
  const largeArc = sweep > Math.PI ? 1 : 0;
  const dPath = `M ${p0.x} ${p0.y} A ${Rr} ${Rr} 0 ${largeArc} 1 ${pe.x} ${pe.y}`;

  // 3 stage icons fixed, leaning right: water top (0°), heat upper-right (60°), boil
  // lower-right (120°). The bar (above) is timed to reach each one as its stage starts.
  const bubbles = [
    { id: 0, color: '#2f7ad1', phi: 0 },
    { id: 1, color: '#e0a52a', phi: Math.PI / 3 },
    { id: 2, color: C.bordoBright, phi: (2 * Math.PI) / 3 },
  ];

  const onButton = () => {
    if (s.cookActive) {
      s.stopCook();
      nav.navigate('Menu');
    } else if (s.lowWater) {
      nav.navigate('WaterWarning');
    } else {
      s.startCook(s.durationSec);
    }
  };

  return (
    <Screen bg={C.bg} padTop={false}>
      <AppHeader />
      <View style={{ flex: 1, paddingHorizontal: ds(33), paddingBottom: ds(96), alignItems: 'center' }}>
        {/* progress ring */}
        <View style={{ marginTop: ds(44), width: ds(300), height: ds(300) }}>
          <Svg width={ds(300)} height={ds(300)}>
            <Defs>
              <SvgLinear id="cook" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#ad283e" />
                <Stop offset="100%" stopColor={C.bordo} />
              </SvgLinear>
            </Defs>
            <Circle cx={cx} cy={cy} r={Rr} fill="none" stroke="rgba(90,21,32,0.08)" strokeWidth={ds(12)} />
            {progress > 0 && <Path d={dPath} fill="none" stroke="url(#cook)" strokeWidth={ds(12)} strokeLinecap="round" />}
          </Svg>

          {/* 3 stage bubbles sitting on the ring */}
          {bubbles.map((b) => {
            const c = pt(b.phi);
            return (
              <View
                key={b.id}
                style={{
                  position: 'absolute',
                  left: c.x - ds(23),
                  top: c.y - ds(23),
                  width: ds(46),
                  height: ds(46),
                  borderRadius: ds(23),
                  backgroundColor: C.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: bs('0 4px 10px -3px rgba(0,0,0,0.18)'),
                }}
              >
                {s.cookActive && stage === b.id && <Pulse color={b.color} />}
                <StageIcon id={b.id} color={b.color} size={22} />
              </View>
            );
          })}

          {/* center readout */}
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
            {/* both turn bordo (prominent) in the last 15 seconds, in any scenario */}
            <Txt size={64} weight={100} color={lowTime ? C.bordo : C.gray} style={{ lineHeight: ds(70) }}>
              {fmt(remaining)}
            </Txt>
            <Txt size={20} weight={300} color={lowTime ? C.bordo : C.gray} style={{ marginTop: ds(2) }}>
              {s.cookActive ? L('kaldı', 'left') : L('hazır', 'ready')}
            </Txt>
          </View>
        </View>

        {/* current stage / prompt */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(10), marginTop: ds(40) }}>
          <StageIcon id={stage} color={STAGE_COLORS[stage]} />
          <Txt size={22} weight={300} color={C.bordoMid}>
            {s.cookActive ? L(STAGES[stage], STAGES_EN[stage]) : `${L(s.doneness, DONE_EN[s.doneness])} · ${s.count} ${L('adet', 'eggs')}`}
          </Txt>
        </View>

        {/* start / stop */}
        <Pressable onPress={onButton} style={{ marginTop: 'auto', width: '100%' }}>
          <LinearGrad deg={90} colors={['#ad283e', '#8a2032']} style={{ height: ds(53), borderRadius: ds(16), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 8px 16px -5px rgba(138,32,50,0.5)') }}>
            <Txt size={22} weight={300} color="#ffffff">
              {s.cookActive ? L('Durdur', 'Stop') : L('Başlat', 'Start')}
            </Txt>
          </LinearGrad>
        </Pressable>
      </View>

      <BottomNav active="cooking" onNavigate={(t) => nav.navigate(tabRoute(t))} />
    </Screen>
  );
}
