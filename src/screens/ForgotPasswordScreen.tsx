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
import { Mail, Lock, Egg, Back, Check } from '../icons';
import { useAuth, authErr } from '../state/auth';
import type { RootStackParamList } from '../navigation/types';

const ERR = '#e0556a';
const OK = '#3aa657';

// Şifremi Unuttum — no email link; enter email + new password twice to reset.
export function ForgotPasswordScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { C, L, theme } = useUI();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = () => {
    if (pw1 !== pw2) {
      setError(authErr('mismatch', L));
      return;
    }
    const r = resetPassword(email, pw1);
    if (r.ok) {
      setError(null);
      setDone(true);
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
        <Txt center size={15} weight={300} color={C.gray} lh={21} style={{ marginTop: ds(6) }}>
          {L('E-postanı ve yeni şifreni gir', 'Enter your email and a new password')}
        </Txt>
      </View>

      {done ? (
        <View style={{ alignItems: 'center', marginTop: ds(56) }}>
          <View style={{ width: ds(80), height: ds(80), borderRadius: ds(40), backgroundColor: C.bordo, alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 10px 20px -6px rgba(90,21,32,0.5)') }}>
            <Check size={40} color="#fff" sw={3} />
          </View>
          <Txt center size={18} weight={400} color={OK} lh={24} style={{ marginTop: ds(18) }}>
            {L('Şifren güncellendi.', 'Your password has been updated.')}
          </Txt>
          <Pressable onPress={() => nav.goBack()} style={{ marginTop: ds(28), width: '100%' }}>
            <LinearGrad deg={90} colors={['#ad283e', '#8a2032']} style={{ height: ds(60), borderRadius: ds(16), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 6px 14px -4px rgba(138,32,50,0.5)') }}>
              <Txt size={20} weight={300} color="#ffffff">
                {L('Giriş Yap', 'Log In')}
              </Txt>
            </LinearGrad>
          </Pressable>
        </View>
      ) : (
        <>
          {/* fields */}
          <View style={{ marginTop: ds(36), gap: ds(20) }}>
            <Field icon={<Mail size={24} color={C.bordo} />} placeholder={L('E-posta', 'Email')} value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Field icon={<Lock size={24} color={C.bordo} />} placeholder={L('Yeni Şifre', 'New Password')} value={pw1} onChangeText={setPw1} secure />
            <Field icon={<Lock size={24} color={C.bordo} />} placeholder={L('Yeni Şifre (Tekrar)', 'Confirm New Password')} value={pw2} onChangeText={setPw2} secure />
          </View>

          {error && (
            <Txt size={13} weight={400} color={ERR} style={{ marginTop: ds(16) }}>
              {error}
            </Txt>
          )}

          <Pressable onPress={submit} style={{ marginTop: error ? ds(14) : ds(36) }}>
            <LinearGrad deg={90} colors={['#ad283e', '#8a2032']} style={{ height: ds(60), borderRadius: ds(16), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 6px 14px -4px rgba(138,32,50,0.5)') }}>
              <Txt size={20} weight={300} color="#ffffff">
                {L('Şifreyi Sıfırla', 'Reset Password')}
              </Txt>
            </LinearGrad>
          </Pressable>
        </>
      )}
    </View>
  );
}
