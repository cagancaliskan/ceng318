import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { hn } from '../theme/fonts';
import { bs } from '../theme/shadow';
import { Txt } from '../components/Txt';
import { LinearGrad } from '../components/Gradient';
import { Mail, Lock, ArrowRight, Egg } from '../icons';
import type { RootStackParamList } from '../navigation/types';

function Field({ icon, placeholder, secure }: { icon: React.ReactNode; placeholder: string; secure?: boolean }) {
  return (
    <View
      style={{
        height: ds(60),
        backgroundColor: C.white,
        borderRadius: ds(16),
        paddingHorizontal: ds(16),
        flexDirection: 'row',
        alignItems: 'center',
        gap: ds(12),
        boxShadow: bs('0 4px 4px 0 rgba(0,0,0,0.06), inset 0 0 0 1px rgba(90,21,32,0.12)'),
      }}
    >
      {icon}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={C.gray}
        secureTextEntry={secure}
        style={{ flex: 1, fontFamily: hn(400), fontSize: ds(16), color: C.black, padding: 0 }}
      />
    </View>
  );
}

// 02 · Login (kullanıcı girişi)
export function LoginScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top, paddingHorizontal: ds(37) }}>
      <StatusBar style="dark" />

      {/* logo + wordmark */}
      <View style={{ alignItems: 'center', marginTop: ds(96) }}>
        <Egg size={30} fill="none" stroke={C.bordoMid} sw={2} />
        <Txt size={42} weight={300} color={C.bordoMid} style={{ marginTop: ds(10) }}>
          EggChef
        </Txt>
      </View>

      {/* fields */}
      <View style={{ marginTop: ds(58), gap: ds(32) }}>
        <Field icon={<Mail size={24} color={C.bordo} />} placeholder="E-posta" />
        <Field icon={<Lock size={24} color={C.bordo} />} placeholder="Şifre" secure />
      </View>

      {/* forgot / register */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: ds(26), paddingHorizontal: ds(2) }}>
        <Txt size={14} weight={300} color={C.black}>
          Şifremi Unuttum
        </Txt>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: ds(4) }}>
          <Txt size={13} weight={400} color={C.bordoMid}>
            Kayıt Ol
          </Txt>
          <ArrowRight size={18} color={C.bordoMid} sw={2} />
        </Pressable>
      </View>

      {/* submit */}
      <Pressable onPress={() => nav.navigate('PairDevice')} style={{ marginTop: ds(46) }}>
        <LinearGrad deg={90} colors={['#ad283e', '#8a2032']} style={{ height: ds(60), borderRadius: ds(16), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 6px 14px -4px rgba(138,32,50,0.5)') }}>
          <Txt size={20} weight={300} color="#ffffff">
            Giriş Yap
          </Txt>
        </LinearGrad>
      </Pressable>
    </View>
  );
}
