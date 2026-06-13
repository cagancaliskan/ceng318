import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
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
import { useSession, Doneness } from '../state/session';
import type { RootStackParamList } from '../navigation/types';

type Done = 'rafadan' | 'kayisi' | 'kati';

// seed rows (kept underneath the user's real cooks)
const entries: { day: string; dayEn: string; count: number; done: Done; label: string; labelEn: string; time: string }[] = [
  { day: 'Cumartesi', dayEn: 'Saturday', count: 6, done: 'kati', label: 'katı', labelEn: 'hard', time: '15:05' },
  { day: 'Çarşamba', dayEn: 'Wednesday', count: 4, done: 'kayisi', label: 'kayısı', labelEn: 'medium', time: '07:45' },
  { day: 'Pazartesi', dayEn: 'Monday', count: 3, done: 'rafadan', label: 'rafadan', labelEn: 'soft', time: '10:37' },
];

// map a started cook's doneness to the history row's icon + localized label
const DONE_MAP: Record<Doneness, { done: Done; tr: string; en: string }> = {
  Rafadan: { done: 'rafadan', tr: 'rafadan', en: 'soft' },
  Kayısı: { done: 'kayisi', tr: 'kayısı', en: 'medium' },
  Katı: { done: 'kati', tr: 'katı', en: 'hard' },
};
const DAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const pad = (n: number) => String(n).padStart(2, '0');

const ico = (d: Done, color: string) =>
  d === 'rafadan' ? <RafadanIcon size={28} color={color} sw={1.7} /> : d === 'kayisi' ? <KayisiIcon size={26} color={color} sw={1.7} /> : <KatiIcon size={28} color={color} sw={1.7} />;

// 08 · Pişirme geçmişi — real cooks (newest first) above the seed rows.
export function HistoryScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { C, L } = useUI();
  const { history } = useSession();

  const rows = [
    ...history.map((e, i) => {
      const m = DONE_MAP[e.doneness];
      const d = new Date(e.at);
      return { key: `h${e.at}-${i}`, day: L(DAYS_TR[d.getDay()], DAYS_EN[d.getDay()]), done: m.done, label: L(m.tr, m.en), count: e.count, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
    }),
    ...entries.map((e, i) => ({ key: `s${i}`, day: L(e.day, e.dayEn), done: e.done, label: L(e.label, e.labelEn), count: e.count, time: e.time })),
  ];

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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: ds(30), paddingTop: ds(16), paddingBottom: ds(110) }} showsVerticalScrollIndicator={false}>
        {rows.map((r) => (
          <View key={r.key}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: ds(18) }}>
              <Txt size={16} weight={300} color={C.black} style={{ width: ds(84) }}>
                {r.day}
              </Txt>
              <View style={{ width: ds(46), height: ds(46), borderRadius: ds(14), backgroundColor: C.panelTint, alignItems: 'center', justifyContent: 'center' }}>
                {ico(r.done, C.bordo)}
              </View>
              <Txt size={15} weight={300} color={C.black} style={{ marginLeft: ds(14), flex: 1 }}>
                {r.count} {L('adet', 'eggs')} {r.label} · {r.time}
              </Txt>
            </View>
            <View style={{ height: 1, backgroundColor: 'rgba(90,21,32,0.10)' }} />
          </View>
        ))}
      </ScrollView>

      <BottomNav active="profile" onNavigate={(t) => nav.navigate(tabRoute(t))} />
    </Screen>
  );
}
