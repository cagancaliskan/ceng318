import React from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ds } from '../theme/scale';
import { useUI } from '../theme/ui';
import { Txt } from '../components/Txt';
import { AppHeader } from '../components/AppHeader';
import { BottomNav } from '../components/BottomNav';
import { Screen } from '../components/Screen';
import { Back, RafadanIcon, KayisiIcon, KatiIcon } from '../icons';
import { tabRoute } from '../navigation/helpers';
import type { RootStackParamList } from '../navigation/types';

type Done = 'rafadan' | 'kayisi' | 'kati';
const entries: { day: string; dayEn: string; count: number; done: Done; label: string; labelEn: string; time: string }[] = [
  { day: 'Cumartesi', dayEn: 'Saturday', count: 6, done: 'kati', label: 'katı', labelEn: 'hard', time: '15:05' },
  { day: 'Çarşamba', dayEn: 'Wednesday', count: 4, done: 'kayisi', label: 'kayısı', labelEn: 'medium', time: '07:45' },
  { day: 'Pazartesi', dayEn: 'Monday', count: 3, done: 'rafadan', label: 'rafadan', labelEn: 'soft', time: '10:37' },
];
const ico = (d: Done, color: string) =>
  d === 'rafadan' ? <RafadanIcon size={28} color={color} sw={1.7} /> : d === 'kayisi' ? <KayisiIcon size={26} color={color} sw={1.7} /> : <KatiIcon size={28} color={color} sw={1.7} />;

// 08 · Pişirme geçmişi — a simple list (no chart).
export function HistoryScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { C, L } = useUI();
  return (
    <Screen bg={C.bg} padTop={false}>
      <AppHeader />

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: ds(18), paddingTop: ds(14) }}>
        <Pressable onPress={() => nav.goBack()} style={{ width: ds(40), height: ds(40), alignItems: 'center', justifyContent: 'center' }}>
          <Back size={24} color={C.bordo} />
        </Pressable>
        <Txt size={20} weight={300} color={C.black} style={{ marginLeft: ds(6) }}>
          {L('Pişirme Geçmişi', 'Cooking History')}
        </Txt>
      </View>

      <View style={{ flex: 1, paddingHorizontal: ds(30), paddingTop: ds(16) }}>
        {entries.map((e, i) => (
          <View key={i}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: ds(18) }}>
              <Txt size={16} weight={300} color={C.black} style={{ width: ds(84) }}>
                {L(e.day, e.dayEn)}
              </Txt>
              <View style={{ width: ds(46), height: ds(46), borderRadius: ds(14), backgroundColor: C.panelTint, alignItems: 'center', justifyContent: 'center' }}>
                {ico(e.done, C.bordo)}
              </View>
              <Txt size={15} weight={300} color={C.black} style={{ marginLeft: ds(14), flex: 1 }}>
                {e.count} {L('adet', 'eggs')} {L(e.label, e.labelEn)} · {e.time}
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
