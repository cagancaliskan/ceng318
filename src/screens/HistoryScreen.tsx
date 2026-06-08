import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
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
import { Back, EggOutline, EggKati, ClockSmall } from '../icons';
import { tabRoute } from '../navigation/helpers';
import type { RootStackParamList } from '../navigation/types';

const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Pzr'];
const vals = [380, 540, 420, 660, 80, 240, 470];
const MAX = 720;
const history = [
  { day: 'Pazartesi · 14:58', count: '4 adet', icon: 'settings' },
  { day: 'Salı · 09:46', count: '8 adet', icon: 'rafadan' },
  { day: 'Salı · 07:35', count: '2 adet', icon: 'kati' },
  { day: 'Cumartesi · 11:21', count: '5 adet', icon: 'kati' },
];
const ico = (k: string) =>
  k === 'rafadan' ? <EggOutline size={14} color={C.primary} sw={2} /> : k === 'kati' ? <EggKati size={14} color={C.primary} sw={2} /> : <ClockSmall size={14} color={C.primary} sw={2} />;

// 08 · Tracking & History
export function HistoryScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Screen bg={C.bg}>
      <AppHeader />
      <Pressable onPress={() => nav.goBack()} style={{ paddingHorizontal: ds(18), flexDirection: 'row', alignItems: 'center', gap: ds(6) }}>
        <Back size={12} color={C.primary} sw={2.5} />
        <Text style={{ color: C.primary, fontSize: ds(12), fontFamily: manrope(700) }}>Geri</Text>
      </Pressable>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: ds(18), paddingTop: ds(10), paddingBottom: ds(100) }} showsVerticalScrollIndicator={false}>
        {/* calorie chart */}
        <View style={{ backgroundColor: '#fff', borderRadius: ds(20), paddingTop: ds(14), paddingHorizontal: ds(14), paddingBottom: ds(10), boxShadow: bs('0 4px 14px -6px rgba(60,70,75,0.12), inset 0 0 0 1px rgba(0,0,0,0.04)') }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: ds(10) }}>
            <Text style={{ fontSize: ds(12), fontFamily: manrope(800), color: C.dark, letterSpacing: -ds(0.2) }}>Kalori Takibi</Text>
            <Text style={{ fontSize: ds(9), color: C.med, letterSpacing: ds(0.5), fontFamily: manrope(600), textTransform: 'uppercase' }}>Bu Hafta</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: ds(7), height: ds(90), paddingLeft: ds(14) }}>
            <View style={{ position: 'absolute', left: 0, top: 0, bottom: ds(16), width: ds(12), justifyContent: 'space-between' }}>
              {[720, 480, 240, 0].map((v) => (
                <Text key={v} style={{ fontSize: ds(7), color: C.med, textAlign: 'right', fontFamily: manrope(400) }}>{v}</Text>
              ))}
            </View>
            {vals.map((v, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <View style={{ width: '100%', height: ds(74), backgroundColor: C.panel, borderRadius: ds(5), overflow: 'hidden', justifyContent: 'flex-end' }}>
                  <LinearGrad deg={180} colors={[C.primary, C.primaryDeep]} style={{ height: `${(v / MAX) * 100}%`, borderRadius: ds(5) }} />
                </View>
                <Text style={{ fontSize: ds(8.5), color: C.darkSoft, marginTop: ds(4), fontFamily: manrope(600) }}>{days[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: ds(16), marginBottom: ds(8), paddingHorizontal: ds(2) }}>
          <Text style={{ fontFamily: manrope(800), color: C.dark, fontSize: ds(13), letterSpacing: -ds(0.2) }}>Pişirme Geçmişi</Text>
          <Text style={{ fontSize: ds(10), color: C.primary, fontFamily: manrope(700) }}>Tümü →</Text>
        </View>

        <View style={{ gap: ds(6) }}>
          {history.map((h, i) => (
            <View key={i} style={{ backgroundColor: '#fff', borderRadius: ds(12), paddingVertical: ds(10), paddingHorizontal: ds(12), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', boxShadow: bs('0 2px 6px -3px rgba(60,70,75,0.08), inset 0 0 0 1px rgba(0,0,0,0.03)') }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(10) }}>
                <View style={{ width: ds(28), height: ds(28), borderRadius: ds(9), backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}>{ico(h.icon)}</View>
                <Text style={{ fontSize: ds(11), color: C.darkSoft, fontFamily: manrope(500) }}>{h.day}</Text>
              </View>
              <Text style={{ fontSize: ds(11), color: C.dark, fontFamily: manrope(700), backgroundColor: C.panel, paddingVertical: ds(4), paddingHorizontal: ds(10), borderRadius: ds(10), overflow: 'hidden' }}>{h.count}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNav active="profile" onNavigate={(t) => nav.navigate(tabRoute(t))} />
    </Screen>
  );
}
