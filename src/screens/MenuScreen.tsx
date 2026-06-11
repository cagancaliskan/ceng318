import React from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { Txt } from '../components/Txt';
import { LinearGrad } from '../components/Gradient';
import { AppHeader } from '../components/AppHeader';
import { EggDial } from '../components/EggDial';
import { Screen } from '../components/Screen';
import { BottomNav } from '../components/BottomNav';
import { Hamburger, WaterDrop, Clock, RafadanIcon, KayisiIcon, KatiIcon } from '../icons';
import { useSession, Doneness } from '../state/session';
import { tabRoute } from '../navigation/helpers';
import type { RootStackParamList } from '../navigation/types';

const PRESETS: { label: Doneness; icon: (c: string) => React.ReactNode }[] = [
  { label: 'Rafadan', icon: (c) => <RafadanIcon size={34} color={c} sw={1.7} /> },
  { label: 'Kayısı', icon: (c) => <KayisiIcon size={32} color={c} sw={1.7} /> },
  { label: 'Katı', icon: (c) => <KatiIcon size={34} color={c} sw={1.7} /> },
];

// 03/04 · Menu (ANA EKRN). Başlat → water warning (if low) → Cooking. Özel → popup.
export function MenuScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = useSession();
  const onStart = () => {
    if (s.lowWater) {
      nav.navigate('WaterWarning');
      return;
    }
    s.startCook(s.durationSec);
    nav.navigate('Cooking');
  };

  return (
    <Screen bg={C.bg} padTop={false}>
      <AppHeader />
      <View style={{ flex: 1, paddingHorizontal: ds(33), paddingBottom: ds(96) }}>
        {/* egg dial */}
        <View style={{ marginTop: ds(40), alignItems: 'center' }}>
          <EggDial count={s.count} size={268} />
        </View>

        {/* options header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: ds(22), marginBottom: ds(12) }}>
          <Txt size={16} weight={100} color={C.black}>
            Pişirme Seçenekleri
          </Txt>
          <Pressable
            onPress={() => nav.navigate('CustomCooking')}
            style={{ backgroundColor: C.white, borderRadius: ds(8), paddingVertical: ds(6), paddingHorizontal: ds(10), flexDirection: 'row', alignItems: 'center', gap: ds(6), boxShadow: bs('0 4px 4px 0 rgba(0,0,0,0.10)') }}
          >
            <Hamburger size={16} color={C.bordo} sw={2} />
            <Txt size={14} weight={100} color={C.black}>
              Özel
            </Txt>
          </Pressable>
        </View>

        {/* doneness presets */}
        <View style={{ flexDirection: 'row', gap: ds(18) }}>
          {PRESETS.map((p) => {
            const active = s.doneness === p.label;
            return (
              <Pressable
                key={p.label}
                onPress={() => s.setDoneness(p.label)}
                style={{
                  flex: 1,
                  height: ds(86),
                  borderRadius: ds(16),
                  backgroundColor: active ? C.panelTint : C.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: ds(7),
                  borderWidth: active ? 1.5 : 0,
                  borderColor: active ? C.bordo : 'transparent',
                  boxShadow: bs('0 4px 4px 0 rgba(0,0,0,0.10)'),
                }}
              >
                {p.icon(C.bordo)}
                <Txt size={15} weight={300} color={C.black}>
                  {p.label}
                </Txt>
              </Pressable>
            );
          })}
        </View>

        {/* water + time card */}
        <View style={{ marginTop: ds(14), backgroundColor: C.white, borderRadius: ds(16), paddingVertical: ds(12), paddingHorizontal: ds(14), boxShadow: bs('0 4px 4px 0 rgba(0,0,0,0.08), inset 0 0 0 1px rgba(90,21,32,0.05)') }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(12) }}>
            <WaterDrop size={26} color={C.bordo} sw={1.7} />
            <Txt size={12} weight={400} color={C.black} style={{ flex: 1 }}>
              Haznedeki Su Miktarı: <Txt size={12} weight={500} color={C.bordo}>{s.water}</Txt> (Otomatik Eklenecek)
            </Txt>
          </View>
          <View style={{ height: 1, backgroundColor: 'rgba(90,21,32,0.10)', marginVertical: ds(10) }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(12) }}>
            <Clock size={24} color={C.bordo} sw={1.7} />
            <Txt size={12} weight={400} color={C.black} style={{ flex: 1 }}>
              Tahmini Pişirme Süresi: <Txt size={12} weight={500} color={C.bordo}>{s.timeLabel}</Txt>
            </Txt>
          </View>
        </View>

        {/* start */}
        <Pressable onPress={onStart} style={{ marginTop: 'auto' }}>
          <LinearGrad deg={90} colors={['#ad283e', '#8a2032']} style={{ height: ds(53), borderRadius: ds(16), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 8px 16px -5px rgba(138,32,50,0.5)') }}>
            <Txt size={22} weight={300} color="#ffffff">
              Başlat
            </Txt>
          </LinearGrad>
        </Pressable>
      </View>

      <BottomNav active="menu" onNavigate={(t) => nav.navigate(tabRoute(t))} />
    </Screen>
  );
}
