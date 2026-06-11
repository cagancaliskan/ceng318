import React from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { Txt } from '../components/Txt';
import { AppHeader } from '../components/AppHeader';
import { BottomNav } from '../components/BottomNav';
import { Screen } from '../components/Screen';
import { Back, RafadanIcon, KayisiIcon, KatiIcon } from '../icons';
import { tabRoute } from '../navigation/helpers';
import type { RootStackParamList } from '../navigation/types';

type Done = 'rafadan' | 'kayisi' | 'kati';
const entries: { day: string; count: number; done: Done; label: string; time: string }[] = [
  { day: 'Cumartesi', count: 6, done: 'kati', label: 'katı', time: '15:05' },
  { day: 'Çarşamba', count: 4, done: 'kayisi', label: 'kayısı', time: '07:45' },
  { day: 'Pazartesi', count: 3, done: 'rafadan', label: 'rafadan', time: '10:37' },
];
const ico = (d: Done) =>
  d === 'rafadan' ? <RafadanIcon size={28} color={C.bordo} sw={1.7} /> : d === 'kayisi' ? <KayisiIcon size={26} color={C.bordo} sw={1.7} /> : <KatiIcon size={28} color={C.bordo} sw={1.7} />;

// 08 · Pişirme geçmişi — a simple list (no chart).
export function HistoryScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Screen bg={C.bg} padTop={false}>
      <AppHeader />

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: ds(18), paddingTop: ds(14) }}>
        <Pressable onPress={() => nav.goBack()} style={{ width: ds(40), height: ds(40), alignItems: 'center', justifyContent: 'center' }}>
          <Back size={24} color={C.bordo} />
        </Pressable>
        <Txt size={20} weight={300} color={C.black} style={{ marginLeft: ds(6) }}>
          Pişirme Geçmişi
        </Txt>
      </View>

      <View style={{ flex: 1, paddingHorizontal: ds(30), paddingTop: ds(16) }}>
        {entries.map((e, i) => (
          <View key={i}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: ds(18) }}>
              <Txt size={16} weight={300} color={C.black} style={{ width: ds(84) }}>
                {e.day}
              </Txt>
              <View style={{ width: ds(46), height: ds(46), borderRadius: ds(14), backgroundColor: C.panelTint, alignItems: 'center', justifyContent: 'center' }}>
                {ico(e.done)}
              </View>
              <Txt size={15} weight={300} color={C.black} style={{ marginLeft: ds(14), flex: 1 }}>
                {e.count} adet {e.label} · {e.time}
              </Txt>
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(90,21,32,0.10)' }} />
          </View>
        ))}
      </View>

      <BottomNav active="profile" onNavigate={(t) => nav.navigate(tabRoute(t))} />
    </Screen>
  );
}
