import React from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { Txt } from '../components/Txt';
import { AppHeader } from '../components/AppHeader';
import { BottomNav } from '../components/BottomNav';
import { Screen } from '../components/Screen';
import { NavProfile, Edit, History as HistoryIcon, Phone, ArrowRight } from '../icons';
import { tabRoute } from '../navigation/helpers';
import type { RootStackParamList } from '../navigation/types';

// 09 · Profile (profil)
export function ProfileScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const card = { backgroundColor: C.white, boxShadow: bs('0 4px 4px 0 rgba(0,0,0,0.08), inset 0 0 0 1px rgba(90,21,32,0.05)') };

  return (
    <Screen bg={C.bg} padTop={false}>
      <AppHeader />
      <View style={{ flex: 1, paddingHorizontal: ds(24), paddingTop: ds(31), paddingBottom: ds(96) }}>
        {/* profile card */}
        <View style={{ ...card, borderRadius: ds(20), padding: ds(16), flexDirection: 'row', alignItems: 'center', gap: ds(16) }}>
          <View>
            <View style={{ width: ds(74), height: ds(74), borderRadius: ds(37), backgroundColor: C.panelTint, alignItems: 'center', justifyContent: 'center' }}>
              <NavProfile size={40} color={C.bordo} sw={1.8} />
            </View>
            <View style={{ position: 'absolute', bottom: -ds(2), right: -ds(2), width: ds(29), height: ds(29), borderRadius: ds(15), backgroundColor: C.bordo, borderWidth: 2.5, borderColor: C.white, alignItems: 'center', justifyContent: 'center' }}>
              <Edit size={14} color="#fff" sw={2.2} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Txt size={24} weight={300} color={C.black}>
              Ahmet
            </Txt>
            <Txt size={14} weight={300} color={C.gray} style={{ marginTop: ds(3) }}>
              ahm****@gmail.com
            </Txt>
          </View>
        </View>

        <Txt size={20} weight={300} color={C.black} style={{ marginTop: ds(24), marginBottom: ds(12) }}>
          Tercihler
        </Txt>

        {/* preference cards */}
        <View style={{ flexDirection: 'row', gap: ds(10) }}>
          <View style={{ ...card, flex: 1, borderRadius: ds(18), paddingVertical: ds(14), paddingHorizontal: ds(16), gap: ds(8) }}>
            <Txt size={14} weight={300} color={C.gray}>
              Dil
            </Txt>
            <Txt size={16} weight={300} color={C.black}>
              🇹🇷 Türkçe (Tr)
            </Txt>
          </View>
          <View style={{ ...card, flex: 1, borderRadius: ds(18), paddingVertical: ds(14), paddingHorizontal: ds(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: ds(8) }}>
              <Txt size={14} weight={300} color={C.gray}>
                Tema
              </Txt>
              <Txt size={16} weight={300} color={C.black}>
                Açık
              </Txt>
            </View>
            <View style={{ width: ds(48), height: ds(27), borderRadius: ds(14), backgroundColor: C.bordo, justifyContent: 'center' }}>
              <View style={{ position: 'absolute', right: ds(3), width: ds(21), height: ds(21), borderRadius: ds(11), backgroundColor: '#fff', boxShadow: bs('0 1px 3px rgba(0,0,0,0.25)') }} />
            </View>
          </View>
        </View>

        {/* history link */}
        <Pressable
          onPress={() => nav.navigate('History')}
          style={{ ...card, marginTop: ds(16), borderRadius: ds(18), paddingVertical: ds(16), paddingHorizontal: ds(16), flexDirection: 'row', alignItems: 'center', gap: ds(14) }}
        >
          <View style={{ width: ds(38), height: ds(38), borderRadius: ds(12), backgroundColor: C.panelTint, alignItems: 'center', justifyContent: 'center' }}>
            <HistoryIcon size={22} color={C.bordo} sw={1.8} />
          </View>
          <Txt size={18} weight={300} color={C.black}>
            Pişirme Geçmişi
          </Txt>
          <View style={{ marginLeft: 'auto' }}>
            <ArrowRight size={22} color={C.gray} sw={1.8} />
          </View>
        </Pressable>

        {/* support + device id */}
        <Pressable style={{ ...card, marginTop: 'auto', borderRadius: ds(14), paddingVertical: ds(13), paddingHorizontal: ds(16), flexDirection: 'row', alignItems: 'center', gap: ds(12) }}>
          <Phone size={22} color={C.bordo} sw={1.8} />
          <Txt size={16} weight={300} color={C.black}>
            Müşteri Hizmetleri
          </Txt>
          <View style={{ marginLeft: 'auto' }}>
            <ArrowRight size={20} color={C.gray} sw={1.8} />
          </View>
        </Pressable>
        <Txt center size={13} weight={300} color={C.gray} style={{ marginTop: ds(14) }}>
          EggChef/A98S77AFG
        </Txt>
      </View>

      <BottomNav active="profile" onNavigate={(t) => nav.navigate(tabRoute(t))} />
    </Screen>
  );
}
