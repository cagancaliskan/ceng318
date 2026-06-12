import React from 'react';
import { View, Pressable, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { useUI } from '../theme/ui';
import { Txt } from '../components/Txt';
import { AppHeader } from '../components/AppHeader';
import { BottomNav } from '../components/BottomNav';
import { Screen } from '../components/Screen';
import { NavProfile, Edit, History as HistoryIcon, Phone, ArrowRight } from '../icons';
import { tabRoute } from '../navigation/helpers';
import { useSession } from '../state/session';
import type { RootStackParamList } from '../navigation/types';

const SUPPORT_TEL = '+905396638256'; // +90 539 663 82 56

// 09 · Profile (profil)
export function ProfileScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { C, L } = useUI();
  const s = useSession();

  const card = { backgroundColor: C.white, boxShadow: bs('0 4px 4px 0 rgba(0,0,0,0.08), inset 0 0 0 1px rgba(90,21,32,0.05)') };
  const callSupport = () => Linking.openURL(`tel:${SUPPORT_TEL}`).catch(() => {});

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
          {L('Tercihler', 'Preferences')}
        </Txt>

        {/* preference cards — both tappable */}
        <View style={{ flexDirection: 'row', gap: ds(10) }}>
          {/* language: switch toggles TR <-> EN (off = TR, on = EN) */}
          <Pressable onPress={s.toggleLang} style={{ ...card, flex: 1, borderRadius: ds(18), paddingVertical: ds(14), paddingHorizontal: ds(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: ds(8) }}>
              <Txt size={14} weight={300} color={C.gray}>
                {L('Dil', 'Language')}
              </Txt>
              <Txt size={16} weight={300} color={C.black}>
                {s.lang === 'en' ? '🇬🇧 English' : '🇹🇷 Türkçe'}
              </Txt>
            </View>
            <View style={{ width: ds(48), height: ds(27), borderRadius: ds(14), backgroundColor: s.lang === 'en' ? C.bordo : C.grayLight, justifyContent: 'center' }}>
              <View style={{ position: 'absolute', width: ds(21), height: ds(21), borderRadius: ds(11), backgroundColor: '#fff', boxShadow: bs('0 1px 3px rgba(0,0,0,0.25)'), ...(s.lang === 'en' ? { right: ds(3) } : { left: ds(3) }) }} />
            </View>
          </Pressable>

          {/* theme: tap to switch light <-> dark */}
          <Pressable onPress={s.toggleTheme} style={{ ...card, flex: 1, borderRadius: ds(18), paddingVertical: ds(14), paddingHorizontal: ds(16), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: ds(8) }}>
              <Txt size={14} weight={300} color={C.gray}>
                {L('Tema', 'Theme')}
              </Txt>
              <Txt size={16} weight={300} color={C.black}>
                {s.theme === 'dark' ? L('Koyu', 'Dark') : L('Açık', 'Light')}
              </Txt>
            </View>
            <View style={{ width: ds(48), height: ds(27), borderRadius: ds(14), backgroundColor: s.theme === 'dark' ? C.bordo : C.grayLight, justifyContent: 'center' }}>
              <View style={{ position: 'absolute', width: ds(21), height: ds(21), borderRadius: ds(11), backgroundColor: '#fff', boxShadow: bs('0 1px 3px rgba(0,0,0,0.25)'), ...(s.theme === 'dark' ? { right: ds(3) } : { left: ds(3) }) }} />
            </View>
          </Pressable>
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
            {L('Pişirme Geçmişi', 'Cooking History')}
          </Txt>
          <View style={{ marginLeft: 'auto' }}>
            <ArrowRight size={22} color={C.gray} sw={1.8} />
          </View>
        </Pressable>

        {/* support + device id — tap to call */}
        <Pressable onPress={callSupport} style={{ ...card, marginTop: 'auto', borderRadius: ds(14), paddingVertical: ds(13), paddingHorizontal: ds(16), flexDirection: 'row', alignItems: 'center', gap: ds(12) }}>
          <Phone size={22} color={C.bordo} sw={1.8} />
          <Txt size={16} weight={300} color={C.black}>
            {L('Müşteri Hizmetleri', 'Customer Service')}
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
