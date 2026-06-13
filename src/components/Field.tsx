import React, { useState } from 'react';
import { View, TextInput, Pressable, KeyboardTypeOptions } from 'react-native';
import { ds } from '../theme/scale';
import { hn } from '../theme/fonts';
import { bs } from '../theme/shadow';
import { useUI } from '../theme/ui';
import { Eye, EyeOff } from '../icons';

// Shared rounded input row used by Login / Register / ForgotPassword. Controlled.
// `secure` fields get an eye toggle to reveal/hide the password.
export function Field({
  icon,
  placeholder,
  value,
  onChangeText,
  secure,
  keyboardType,
  autoCapitalize = 'none',
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  const { C } = useUI();
  const [hidden, setHidden] = useState(true);

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
        secureTextEntry={secure ? hidden : false}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        style={{ flex: 1, fontFamily: hn(400), fontSize: ds(16), color: C.black, padding: 0 }}
      />
      {secure && (
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} style={{ paddingLeft: ds(4) }}>
          {hidden ? <Eye size={22} color={C.gray} /> : <EyeOff size={22} color={C.bordo} />}
        </Pressable>
      )}
    </View>
  );
}
