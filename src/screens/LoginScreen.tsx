import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Rect, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { manrope } from '../theme/fonts';
import { bs } from '../theme/shadow';
import { LinearGrad } from '../components/Gradient';
import type { RootStackParamList } from '../navigation/types';

const Mail = () => (
  <Svg width={ds(14)} height={ds(14)} viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth={2}>
    <Rect x={3} y={5} width={18} height={14} rx={2.5} />
    <Path d="M3 7l9 6 9-6" />
  </Svg>
);
const Lock = () => (
  <Svg width={ds(14)} height={ds(14)} viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth={2}>
    <Rect x={4} y={11} width={16} height={10} rx={2.5} />
    <Path d="M8 11V7a4 4 0 018 0v4" />
  </Svg>
);

function Field({ icon, placeholder, secure }: { icon: React.ReactNode; placeholder: string; secure?: boolean }) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: ds(16),
        paddingVertical: ds(14),
        paddingHorizontal: ds(16),
        flexDirection: 'row',
        alignItems: 'center',
        gap: ds(12),
        boxShadow: bs('0 6px 16px -6px rgba(60,70,75,0.18), 0 0 0 1px rgba(255,255,255,0.4)'),
      }}
    >
      <View style={{ width: ds(28), height: ds(28), borderRadius: ds(8), backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </View>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={C.med}
        secureTextEntry={secure}
        style={{ flex: 1, color: C.dark, fontSize: ds(13), fontFamily: manrope(500), padding: 0 }}
      />
    </View>
  );
}

// 02 · Login
export function LoginScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <LinearGrad deg={170} colors={[C.primaryDeep, C.primary, '#6a8590']} locations={[0, 0.5, 1]} style={{ flex: 1, paddingHorizontal: ds(28), paddingTop: ds(90) }}>
      <StatusBar style="light" />
      <View style={{ position: 'absolute', width: ds(260), height: ds(260), borderRadius: ds(130), backgroundColor: 'rgba(255,255,255,0.06)', top: -ds(80), right: -ds(100) }} />

      <View style={{ alignItems: 'center', marginBottom: ds(50) }}>
        <Text style={{ color: '#fff', fontFamily: manrope(800), fontSize: ds(32), letterSpacing: ds(4) }}>VESTEL</Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: ds(11), marginTop: ds(8), letterSpacing: ds(0.3), fontFamily: manrope(400) }}>
          Hoş geldin, devam etmek için giriş yap
        </Text>
      </View>

      <View style={{ gap: ds(10) }}>
        <Field icon={<Mail />} placeholder="E-posta" />
        <Field icon={<Lock />} placeholder="Şifre" secure />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: ds(14), paddingHorizontal: ds(4) }}>
        <Text style={{ fontSize: ds(11), color: 'rgba(255,255,255,0.85)', fontFamily: manrope(500) }}>Şifremi Unuttum</Text>
        <Text style={{ fontSize: ds(11), color: 'rgba(255,255,255,0.85)', fontFamily: manrope(700) }}>Kayıt ol →</Text>
      </View>

      <Pressable
        onPress={() => nav.navigate('PairDevice')}
        style={{
          marginTop: ds(32),
          borderRadius: ds(18),
          backgroundColor: '#fff',
          paddingVertical: ds(15),
          alignItems: 'center',
          boxShadow: bs('0 12px 28px -8px rgba(0,0,0,0.25), inset 0 -2px 0 rgba(0,0,0,0.04)'),
        }}
      >
        <Text style={{ color: C.primaryDeep, fontFamily: manrope(700), fontSize: ds(15), letterSpacing: -ds(0.2) }}>Giriş Yap</Text>
      </Pressable>
    </LinearGrad>
  );
}
