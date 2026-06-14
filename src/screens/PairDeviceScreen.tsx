import React, { useEffect, useRef } from 'react';
import { View, Pressable, Animated, Easing, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { useUI } from '../theme/ui';
import { Txt } from '../components/Txt';
import { LinearGrad } from '../components/Gradient';
import { Bluetooth } from '../icons';
import type { RootStackParamList } from '../navigation/types';

function Ring({ size, delay }: { size: number; delay: number }) {
  const { C } = useUI();
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(p, { toValue: 1, duration: 2600, delay: delay * 1000, easing: Easing.out(Easing.ease), useNativeDriver: Platform.OS !== 'web' }),
    );
    loop.start();
    return () => loop.stop();
  }, [p, delay]);
  const scale = p.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.25] });
  const op = p.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0, 0.45, 0] });
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: ds(size),
        height: ds(size),
        marginLeft: -ds(size / 2),
        marginTop: -ds(size / 2),
        borderRadius: ds(size / 2),
        borderWidth: 1.5,
        borderColor: C.bordo,
        opacity: op,
        transform: [{ scale }],
      }}
    />
  );
}

// 13 · Cihaz Bağlama (Pair Device)
export function PairDeviceScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { C, L, theme } = useUI();
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <View style={{ paddingHorizontal: ds(24), marginTop: ds(24) }}>
        <Txt size={13} weight={400} color={C.gray} ls={1.5}>
          {L('CİHAZ BAĞLANTISI', 'DEVICE CONNECTION')}
        </Txt>
        <Txt size={24} weight={300} color={C.bordoMid} lh={32} style={{ marginTop: ds(6) }}>
          {L('EggChef cihazınızı uygulamaya bağlayın', 'Connect your EggChef device to the app')}
        </Txt>
        <Txt size={13} weight={400} color={C.gray} lh={18} style={{ marginTop: ds(10) }}>
          {L('Cihazınızı açın ve telefonunuzu yakına getirin. Cihaz otomatik olarak bağlanacaktır.', 'Turn on your device and bring your phone close. It will connect automatically.')}
        </Txt>
      </View>

      {/* pulse rings + device puck */}
      <View style={{ flex: 1, position: 'relative' }}>
        <Ring size={300} delay={0} />
        <Ring size={300} delay={0.9} />
        <Ring size={300} delay={1.8} />
        <View
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: ds(175),
            height: ds(175),
            marginLeft: -ds(87.5),
            marginTop: -ds(87.5),
            borderRadius: ds(40),
            backgroundColor: C.white,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: bs('0 16px 30px -10px rgba(90,21,32,0.22), inset 0 0 0 1px rgba(90,21,32,0.06)'),
          }}
        >
          <LinearGrad deg={135} colors={['#ad283e', C.bordo]} style={{ width: ds(72), height: ds(72), borderRadius: ds(22), alignItems: 'center', justifyContent: 'center', boxShadow: bs('0 8px 16px -4px rgba(138,32,50,0.5)') }}>
            <Bluetooth size={36} color="#fff" sw={2.2} />
          </LinearGrad>
          <Txt size={20} weight={300} color={C.bordoMid} style={{ marginTop: ds(12) }}>
            EggChef
          </Txt>
        </View>
      </View>

      {/* found-device card */}
      <View style={{ paddingHorizontal: ds(21), paddingBottom: Math.max(insets.bottom, ds(20)) }}>
        <View style={{ backgroundColor: C.white, borderRadius: ds(24), padding: ds(16), boxShadow: bs('0 10px 24px -8px rgba(90,21,32,0.18), inset 0 0 0 1px rgba(90,21,32,0.06)') }}>
          <Txt size={12} weight={400} color={C.gray} ls={1}>
            {L('Bulunan Cihaz', 'Found Device')}
          </Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(12), marginTop: ds(10) }}>
            <View style={{ width: ds(50), height: ds(50), borderRadius: ds(14), backgroundColor: C.panelTint, alignItems: 'center', justifyContent: 'center' }}>
              <Bluetooth size={24} color={C.bordo} sw={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Txt size={15} weight={400} color={C.black}>
                EggChef/A98S77AFG
              </Txt>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(6), marginTop: ds(3) }}>
                <View style={{ width: ds(8), height: ds(8), borderRadius: ds(4), backgroundColor: '#3aa657' }} />
                <Txt size={12} weight={400} color={C.gray}>
                  {L('Yakında- Sinyal Güçlü', 'Nearby — Strong Signal')}
                </Txt>
              </View>
            </View>
          </View>
          <Pressable onPress={() => nav.navigate('Menu')} style={{ marginTop: ds(14) }}>
            <LinearGrad deg={90} colors={['#ad283e', '#8a2032']} style={{ height: ds(50), borderRadius: ds(14), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ds(8), boxShadow: bs('0 6px 14px -4px rgba(138,32,50,0.5)') }}>
              <Bluetooth size={20} color="#fff" sw={2.4} />
              <Txt size={18} weight={300} color="#ffffff">
                {L('Bağlan', 'Connect')}
              </Txt>
            </LinearGrad>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
