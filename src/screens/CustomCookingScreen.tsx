import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable, Animated, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { useUI } from '../theme/ui';
import { Txt } from '../components/Txt';
import { LinearGrad } from '../components/Gradient';
import { useSession } from '../state/session';
import type { RootStackParamList } from '../navigation/types';

const fill = { position: 'absolute' as const, left: 0, right: 0, top: 0, bottom: 0 };
const f2 = (n: number) => String(n).padStart(2, '0');
const ERR = '#e0556a';

// A scroll wheel: drag up/down to pick a value; it snaps to the centered row.
const ITEM = ds(46); // row height
const VISIBLE = 3; // rows shown (one above, the selected one, one below)

function Wheel({ value, count, onChange }: { value: number; count: number; onChange: (v: number) => void }) {
  const { C } = useUI();
  const scrollY = useRef(new Animated.Value(value * ITEM)).current;
  const ref = useRef<any>(null);
  const last = useRef(value);
  const settleTimer = useRef<any>(null);

  useEffect(() => {
    // land on the initial value once laid out
    const r = requestAnimationFrame(() => ref.current?.scrollTo({ y: value * ITEM, animated: false }));
    return () => cancelAnimationFrame(r);
  }, []);

  useEffect(() => {
    // external change (e.g. a preset chip) -> glide the wheel there
    if (value !== last.current) {
      last.current = value;
      ref.current?.scrollTo({ y: value * ITEM, animated: true });
    }
  }, [value]);

  const settle = (y: number) => {
    const idx = Math.max(0, Math.min(count - 1, Math.round(y / ITEM)));
    if (idx !== last.current) {
      last.current = idx;
      onChange(idx);
    }
    // web has no momentum snap — nudge the wheel to the centered row ourselves
    if (Platform.OS === 'web') ref.current?.scrollTo({ y: idx * ITEM, animated: true });
  };

  return (
    <View style={{ height: ITEM * VISIBLE, width: ds(74), overflow: 'hidden' }}>
      <Animated.ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          // native driver isn't supported for scroll on web; using the JS driver
          // there keeps the fade/scale interpolation working.
          useNativeDriver: Platform.OS !== 'web',
          // web: momentum/drag-end events are unreliable, so commit the value once
          // scrolling has stopped for a moment.
          listener: (e: any) => {
            if (Platform.OS !== 'web') return;
            const y = e.nativeEvent.contentOffset.y;
            if (settleTimer.current) clearTimeout(settleTimer.current);
            settleTimer.current = setTimeout(() => settle(y), 120);
          },
        })}
        onMomentumScrollEnd={(e) => settle(e.nativeEvent.contentOffset.y)}
        onScrollEndDrag={(e) => settle(e.nativeEvent.contentOffset.y)}
        contentContainerStyle={{ paddingVertical: ITEM }} // pad so first/last can center
      >
        {Array.from({ length: count }).map((_, i) => {
          const inputRange = [(i - 1) * ITEM, i * ITEM, (i + 1) * ITEM];
          const opacity = scrollY.interpolate({ inputRange, outputRange: [0.26, 1, 0.26], extrapolate: 'clamp' });
          const scale = scrollY.interpolate({ inputRange, outputRange: [0.6, 1, 0.6], extrapolate: 'clamp' });
          return (
            <Animated.View key={i} style={{ height: ITEM, alignItems: 'center', justifyContent: 'center', opacity, transform: [{ scale }] }}>
              <Txt size={40} weight={300} color={C.bordo}>{f2(i)}</Txt>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

// 10 · Özel pop up (Custom Cooking) — transparent modal over the Menu.
export function CustomCookingScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = useSession();
  const { C, L } = useUI();
  const [minutes, setMinutes] = useState(s.customMin);
  const [seconds, setSeconds] = useState(s.customSec);
  const [error, setError] = useState<string | null>(null);
  const chips = [5, 10, 15];

  // clear the warning whenever the picked time changes
  useEffect(() => setError(null), [minutes, seconds]);

  const apply = () => {
    const total = minutes * 60 + seconds;
    const waterSec = s.count * 5; // water-drawing: 5s per egg (the first part of the total)
    // total must exceed the water time, otherwise there's no room to heat & boil
    if (total <= waterSec) {
      setError(L(`${s.count} yumurta için ${waterSec} sn'den uzun seçin (su ${waterSec} sn sürer).`, `Pick more than ${waterSec}s for ${s.count} eggs (water takes ${waterSec}s).`));
      return;
    }
    setError(null);
    s.setCustom(minutes, seconds);
    s.startCook(total);
    nav.navigate('Cooking');
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable style={[fill, { backgroundColor: 'rgba(40,10,16,0.32)' }]} onPress={() => nav.goBack()} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: ds(33) }} pointerEvents="box-none">
        <View style={{ width: '100%', maxWidth: ds(340), backgroundColor: C.white, borderRadius: ds(28), paddingVertical: ds(24), paddingHorizontal: ds(20), boxShadow: bs('0 24px 48px -16px rgba(40,10,16,0.5)') }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: ds(76) }}>
            <Txt size={16} weight={300} color={C.gray}>
              {L('Dakika', 'Minutes')}
            </Txt>
            <Txt size={16} weight={300} color={C.gray}>
              {L('Saniye', 'Seconds')}
            </Txt>
          </View>

          <View style={{ marginTop: ds(6) }}>
            {/* centered selection band */}
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: ITEM, height: ITEM, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(90,21,32,0.12)' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: ds(8) }}>
              <Wheel value={minutes} count={31} onChange={setMinutes} />
              <Txt size={40} weight={300} color={C.bordo} style={{ marginHorizontal: ds(2) }}>
                :
              </Txt>
              <Wheel value={seconds} count={60} onChange={setSeconds} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: ds(10), marginTop: ds(10) }}>
            {chips.map((c) => {
              const active = minutes === c && seconds === 0;
              return (
                <Pressable
                  key={c}
                  onPress={() => {
                    setMinutes(c);
                    setSeconds(0);
                  }}
                  style={{ paddingVertical: ds(8), paddingHorizontal: ds(16), borderRadius: ds(12), backgroundColor: active ? C.bordo : C.panelTint }}
                >
                  <Txt size={14} weight={300} color={active ? '#ffffff' : C.bordoMid}>
                    {c} {L('dk', 'min')}
                  </Txt>
                </Pressable>
              );
            })}
          </View>

          {error && (
            <Txt center size={13} weight={400} color={ERR} style={{ marginTop: ds(12) }}>
              {error}
            </Txt>
          )}

          <Pressable onPress={apply} style={{ marginTop: error ? ds(12) : ds(16) }}>
            <LinearGrad deg={90} colors={['#ad283e', '#8a2032']} style={{ height: ds(50), borderRadius: ds(14), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 8px 16px -5px rgba(138,32,50,0.5)') }}>
              <Txt size={18} weight={300} color="#ffffff">
                {L('Uygula', 'Apply')}
              </Txt>
            </LinearGrad>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
