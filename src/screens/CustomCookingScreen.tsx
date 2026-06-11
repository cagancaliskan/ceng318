import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { Txt } from '../components/Txt';
import { LinearGrad } from '../components/Gradient';
import { useSession } from '../state/session';
import type { RootStackParamList } from '../navigation/types';

const fill = { position: 'absolute' as const, left: 0, right: 0, top: 0, bottom: 0 };
const f2 = (n: number) => String(n).padStart(2, '0');

function Col({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <View style={{ alignItems: 'center', width: ds(74) }}>
      <Pressable onPress={() => value > min && onChange(value - 1)} hitSlop={8}>
        <Txt size={22} weight={300} color="rgba(90,21,32,0.28)">
          {value > min ? f2(value - 1) : ' '}
        </Txt>
      </Pressable>
      <Txt size={44} weight={300} color={C.bordo} style={{ marginVertical: ds(4) }}>
        {f2(value)}
      </Txt>
      <Pressable onPress={() => value < max && onChange(value + 1)} hitSlop={8}>
        <Txt size={22} weight={300} color="rgba(90,21,32,0.28)">
          {value < max ? f2(value + 1) : ' '}
        </Txt>
      </Pressable>
    </View>
  );
}

// 10 · Özel pop up (Custom Cooking) — transparent modal over the Menu.
export function CustomCookingScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = useSession();
  const [minutes, setMinutes] = useState(s.customMin);
  const [seconds, setSeconds] = useState(s.customSec);
  const chips = [5, 10, 15];

  const apply = () => {
    s.setCustom(minutes, seconds);
    s.startCook(minutes * 60 + seconds);
    nav.navigate('Cooking');
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable style={[fill, { backgroundColor: 'rgba(40,10,16,0.32)' }]} onPress={() => nav.goBack()} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: ds(33) }} pointerEvents="box-none">
        <View style={{ width: '100%', maxWidth: ds(340), backgroundColor: C.white, borderRadius: ds(28), paddingVertical: ds(24), paddingHorizontal: ds(20), boxShadow: bs('0 24px 48px -16px rgba(40,10,16,0.5)') }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: ds(76) }}>
            <Txt size={16} weight={300} color={C.gray}>
              Dakika
            </Txt>
            <Txt size={16} weight={300} color={C.gray}>
              Saniye
            </Txt>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: ds(16), marginTop: ds(6) }}>
            <Col value={minutes} min={0} max={30} onChange={setMinutes} />
            <Txt size={40} weight={300} color={C.bordo} style={{ marginBottom: ds(2) }}>
              :
            </Txt>
            <Col value={seconds} min={0} max={59} onChange={setSeconds} />
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
                    {c} dk
                  </Txt>
                </Pressable>
              );
            })}
          </View>

          <Pressable onPress={apply} style={{ marginTop: ds(16) }}>
            <LinearGrad deg={90} colors={['#ad283e', '#8a2032']} style={{ height: ds(50), borderRadius: ds(14), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 8px 16px -5px rgba(138,32,50,0.5)') }}>
              <Txt size={18} weight={300} color="#ffffff">
                Uygula
              </Txt>
            </LinearGrad>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
