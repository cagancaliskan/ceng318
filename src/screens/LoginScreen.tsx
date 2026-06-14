import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { useUI } from '../theme/ui';
import { Txt } from '../components/Txt';
import { Field } from '../components/Field';
import { LinearGrad } from '../components/Gradient';
import { Mail, Lock, ArrowRight } from '../icons';
import { useAuth, authErr } from '../state/auth';
import type { RootStackParamList } from '../navigation/types';

const ERR = '#ffb3bf';

// 02 · Login — bordo gradient with VESTEL + EggChef wordmarks (Figma).
export function LoginScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { C, L } = useUI();
  const { logIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const r = logIn(email, password);
    if (r.ok) {
      setError(null);
      nav.reset({ index: 0, routes: [{ name: 'PairDevice' }] });
    } else {
      setError(authErr(r.error, L));
    }
  };

  return (
    <LinearGrad
      deg={180}
      colors={['#581321', '#8e2238', '#c0485f']}
      locations={[0, 0.55, 1]}
      style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: ds(37) }}
    >
      <StatusBar style="light" />

      {/* VESTEL + EggChef wordmarks */}
      <View style={{ alignItems: 'center', marginTop: ds(76) }}>
        <Txt size={24} weight={700} color="#ffffff" ls={2}>
          VESTEL
        </Txt>
        <Txt size={42} weight={300} color="#ffffff" style={{ marginTop: ds(14) }}>
          EggChef
        </Txt>
      </View>

      {/* fields */}
      <View style={{ marginTop: ds(56), gap: ds(28) }}>
        <Field icon={<Mail size={24} color={C.bordo} />} placeholder={L('E-posta', 'Email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field icon={<Lock size={24} color={C.bordo} />} placeholder={L('Şifre', 'Password')} value={password} onChangeText={setPassword} secure />
      </View>

      {/* forgot / register */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: ds(24), paddingHorizontal: ds(2) }}>
        <Pressable onPress={() => nav.navigate('ForgotPassword')}>
          <Txt size={14} weight={300} color="rgba(255,255,255,0.9)">
            {L('Şifremi Unuttum', 'Forgot Password')}
          </Txt>
        </Pressable>
        <Pressable onPress={() => nav.navigate('Register')} style={{ flexDirection: 'row', alignItems: 'center', gap: ds(4) }}>
          <Txt size={13} weight={400} color="#ffffff">
            {L('Kayıt Ol', 'Sign Up')}
          </Txt>
          <ArrowRight size={18} color="#ffffff" sw={2} />
        </Pressable>
      </View>

      {/* error */}
      {error && (
        <Txt size={13} weight={400} color={ERR} style={{ marginTop: ds(18) }}>
          {error}
        </Txt>
      )}

      {/* submit — translucent button over the gradient */}
      <Pressable
        onPress={submit}
        style={{
          marginTop: error ? ds(16) : ds(40),
          height: ds(60),
          borderRadius: ds(16),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(74,15,24,0.45)',
          boxShadow: bs('inset 0 1px 0 0 rgba(255,255,255,0.18), 0 8px 18px -6px rgba(0,0,0,0.35)'),
        }}
      >
        <Txt size={20} weight={300} color="#ffffff">
          {L('Giriş Yap', 'Log In')}
        </Txt>
      </Pressable>
    </LinearGrad>
  );
}
