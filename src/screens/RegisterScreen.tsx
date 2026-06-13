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
import { Mail, Lock, Egg, Back, NavProfile } from '../icons';
import { useAuth, authErr } from '../state/auth';
import type { RootStackParamList } from '../navigation/types';

const ERR = '#e0556a';

// Kayıt Ol — name + email + password.
export function RegisterScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { C, L, theme } = useUI();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const r = signUp(name, email, password);
    if (r.ok) {
      setError(null);
      nav.reset({ index: 0, routes: [{ name: 'PairDevice' }] });
    } else {
      setError(authErr(r.error, L));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top, paddingHorizontal: ds(37) }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <Pressable onPress={() => nav.goBack()} style={{ width: ds(40), height: ds(40), alignItems: 'center', justifyContent: 'center', marginTop: ds(4), marginLeft: -ds(8) }}>
        <Back size={24} color={C.bordo} />
      </Pressable>

      {/* logo + wordmark */}
      <View style={{ alignItems: 'center', marginTop: ds(20) }}>
        <Egg size={28} fill="none" stroke={C.bordoMid} sw={2} />
        <Txt size={38} weight={300} color={C.bordoMid} style={{ marginTop: ds(8) }}>
          EggChef
        </Txt>
        <Txt size={15} weight={300} color={C.gray} style={{ marginTop: ds(6) }}>
          {L('Hesap oluştur', 'Create your account')}
        </Txt>
      </View>

      {/* fields */}
      <View style={{ marginTop: ds(36), gap: ds(20) }}>
        <Field icon={<NavProfile size={24} color={C.bordo} sw={1.9} />} placeholder={L('İsim', 'Name')} value={name} onChangeText={setName} autoCapitalize="words" />
        <Field icon={<Mail size={24} color={C.bordo} />} placeholder={L('E-posta', 'Email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field icon={<Lock size={24} color={C.bordo} />} placeholder={L('Şifre', 'Password')} value={password} onChangeText={setPassword} secure />
      </View>

      {error && (
        <Txt size={13} weight={400} color={ERR} style={{ marginTop: ds(16) }}>
          {error}
        </Txt>
      )}

      <Pressable onPress={submit} style={{ marginTop: error ? ds(14) : ds(36) }}>
        <LinearGrad deg={90} colors={['#ad283e', '#8a2032']} style={{ height: ds(60), borderRadius: ds(16), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 6px 14px -4px rgba(138,32,50,0.5)') }}>
          <Txt size={20} weight={300} color="#ffffff">
            {L('Kayıt Ol', 'Sign Up')}
          </Txt>
        </LinearGrad>
      </Pressable>

      <Pressable onPress={() => nav.goBack()} style={{ marginTop: ds(20), alignItems: 'center' }}>
        <Txt size={14} weight={300} color={C.gray}>
          {L('Zaten hesabın var mı? ', 'Already have an account? ')}
          <Txt size={14} weight={400} color={C.bordoMid}>
            {L('Giriş Yap', 'Log In')}
          </Txt>
        </Txt>
      </Pressable>
    </View>
  );
}
