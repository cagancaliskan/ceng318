import React from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { useUI } from '../theme/ui';
import { Txt } from '../components/Txt';
import { LinearGrad } from '../components/Gradient';
import { Check } from '../icons';
import { useSession } from '../state/session';
import type { RootStackParamList } from '../navigation/types';

const fill = { position: 'absolute' as const, left: 0, right: 0, top: 0, bottom: 0 };

// 11 · Pişirme tamamlandı — transparent modal over the Cooking screen.
export function CookingCompleteScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = useSession();
  const { C, L } = useUI();
  const done = () => {
    s.stopCook();
    nav.navigate('Menu');
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={[fill, { backgroundColor: 'rgba(40,10,16,0.34)' }]} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: ds(33) }}>
        <View style={{ width: '100%', maxWidth: ds(340), backgroundColor: C.white, borderRadius: ds(28), paddingVertical: ds(30), paddingHorizontal: ds(24), alignItems: 'center', boxShadow: bs('0 24px 48px -16px rgba(40,10,16,0.5)') }}>
          <View style={{ width: ds(90), height: ds(90), borderRadius: ds(45), backgroundColor: C.bordo, alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 10px 20px -6px rgba(90,21,32,0.5)') }}>
            <Check size={46} color="#ffffff" sw={3} />
          </View>
          <Txt center size={22} weight={400} color={C.bordoMid} lh={30} style={{ marginTop: ds(20) }}>
            {L('Pişirme tamamlandı', 'Cooking complete')}
          </Txt>
          <Txt center size={15} weight={300} color={C.gray} lh={21} style={{ marginTop: ds(8) }}>
            {L('Yumurtalar pişti Chef! Tam da istediğin kıvamda.', 'Your eggs are ready, Chef! Exactly how you like them.')}
          </Txt>
          <Pressable onPress={done} style={{ width: '100%', marginTop: ds(24) }}>
            <LinearGrad deg={90} colors={['#ad283e', '#8a2032']} style={{ height: ds(53), borderRadius: ds(16), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 8px 16px -5px rgba(138,32,50,0.5)') }}>
              <Txt size={20} weight={300} color="#ffffff">
                {L('Tamam', 'OK')}
              </Txt>
            </LinearGrad>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
