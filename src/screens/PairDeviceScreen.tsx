import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { manrope } from '../theme/fonts';
import { bs } from '../theme/shadow';
import { LinearGrad } from '../components/Gradient';
import { Back, Bluetooth, EggOutline } from '../icons';
import type { RootStackParamList } from '../navigation/types';

// Replaces the design's @keyframes pairPulse (scale 0.5→1.3, fade out) with Animated.
function Ring({ size, opacity, delay }: { size: number; opacity: number; delay: number }) {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(p, {
        toValue: 1,
        duration: 2400,
        delay: delay * 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [p, delay]);
  const scale = p.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.3] });
  const op = p.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] });
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
        borderColor: `rgba(255,255,255,${opacity})`,
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
  const glass = {
    width: ds(30),
    height: ds(30),
    borderRadius: ds(10),
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    boxShadow: bs('inset 0 0 0 1px rgba(255,255,255,0.18)'),
  };

  return (
    <LinearGrad deg={165} colors={[C.primaryDeep, C.primary, '#6a8590']} locations={[0, 0.55, 1]} style={{ flex: 1, paddingTop: insets.top }}>
      <StatusBar style="light" />
      <View style={{ position: 'absolute', width: ds(280), height: ds(280), borderRadius: ds(140), backgroundColor: 'rgba(255,255,255,0.08)', top: -ds(120), right: -ds(100) }} />
      <View style={{ position: 'absolute', width: ds(220), height: ds(220), borderRadius: ds(110), backgroundColor: 'rgba(255,255,255,0.05)', bottom: -ds(60), left: -ds(80) }} />

      {/* top bar */}
      <View style={{ paddingHorizontal: ds(18), paddingTop: ds(8), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable onPress={() => nav.goBack()} style={glass}>
          <Back size={12} color="#fff" />
        </Pressable>
        <View style={glass}>
          <Text style={{ fontFamily: manrope(800), fontSize: ds(12), color: '#fff' }}>?</Text>
        </View>
      </View>

      {/* title */}
      <View style={{ paddingHorizontal: ds(28), paddingTop: ds(18) }}>
        <Text style={{ fontSize: ds(10), letterSpacing: ds(2), color: 'rgba(255,255,255,0.65)', fontFamily: manrope(700) }}>CİHAZ BAĞLANTISI</Text>
        <Text style={{ fontFamily: manrope(800), fontSize: ds(24), letterSpacing: -ds(0.6), lineHeight: ds(27.6), color: '#fff', marginTop: ds(6) }}>
          EggChef cihazınızı{'\n'}uygulamaya bağlayın
        </Text>
        <Text style={{ fontSize: ds(11), color: 'rgba(255,255,255,0.7)', marginTop: ds(8), lineHeight: ds(16.5), fontFamily: manrope(500) }}>
          Cihazı açın ve telefonunuzu yakına getirin.{'\n'}Otomatik olarak algılanacaktır.
        </Text>
      </View>

      {/* pulsing device illustration */}
      <View style={{ flex: 1, position: 'relative', marginTop: ds(6) }}>
        <Ring size={240} opacity={0.18} delay={0} />
        <Ring size={240} opacity={0.22} delay={0.8} />
        <Ring size={240} opacity={0.28} delay={1.6} />

        <LinearGrad
          deg={155}
          colors={['#ffffff', '#e9ecea']}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: ds(110),
            height: ds(110),
            borderRadius: ds(28),
            marginLeft: -ds(55),
            marginTop: -ds(55),
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: bs('0 20px 40px -10px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -2px 6px rgba(60,70,75,0.08)'),
          }}
        >
          <LinearGrad
            deg={155}
            colors={[C.primary, C.primaryDeep]}
            style={{
              width: ds(36),
              height: ds(48),
              borderRadius: ds(18),
              borderBottomLeftRadius: ds(16),
              borderBottomRightRadius: ds(16),
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: bs('inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.12)'),
            }}
          >
            <Bluetooth size={20} color="#fff" sw={2.2} />
          </LinearGrad>
          <Text style={{ position: 'absolute', bottom: ds(10), fontSize: ds(7), color: C.med, letterSpacing: ds(1.5), fontFamily: manrope(700) }}>EGGCHEF</Text>
          <View style={{ position: 'absolute', top: ds(12), right: ds(12), width: ds(6), height: ds(6), borderRadius: ds(3), backgroundColor: '#34c759', boxShadow: bs('0 0 8px rgba(52,199,89,0.8)') }} />
        </LinearGrad>
      </View>

      {/* found-device card */}
      <View style={{ paddingHorizontal: ds(14), paddingBottom: Math.max(insets.bottom, ds(14)) }}>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: ds(22), padding: ds(14), boxShadow: bs('0 20px 40px -10px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.5)') }}>
          <Text style={{ fontSize: ds(8.5), letterSpacing: ds(1.2), color: C.med, fontFamily: manrope(700) }}>BULUNAN CİHAZ</Text>
          <View style={{ marginTop: ds(8), flexDirection: 'row', alignItems: 'center', gap: ds(10) }}>
            <LinearGrad deg={135} colors={[C.primarySoft, 'rgba(118,145,155,0.18)']} style={{ width: ds(38), height: ds(38), borderRadius: ds(12), alignItems: 'center', justifyContent: 'center', boxShadow: bs('inset 0 0 0 1px rgba(118,145,155,0.18)') }}>
              <EggOutline size={20} color={C.primaryDeep} sw={1.9} />
            </LinearGrad>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: ds(13), fontFamily: manrope(800), color: C.dark, letterSpacing: -ds(0.3) }}>EggChef · A98S77AFG</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(5), marginTop: ds(2) }}>
                <View style={{ width: ds(6), height: ds(6), borderRadius: ds(3), backgroundColor: '#34c759', boxShadow: bs('0 0 6px rgba(52,199,89,0.7)') }} />
                <Text style={{ fontSize: ds(10), color: C.darkSoft, fontFamily: manrope(600) }}>Yakında · Sinyal güçlü</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: ds(2), height: ds(16) }}>
              {[5, 9, 13, 16].map((h, i) => (
                <View key={i} style={{ width: ds(3), height: ds(h), borderRadius: ds(1), backgroundColor: i < 3 ? C.primaryDeep : C.medSoft }} />
              ))}
            </View>
          </View>

          <Pressable onPress={() => nav.navigate('Menu')} style={{ marginTop: ds(10) }}>
            <LinearGrad deg={135} colors={[C.primary, C.primaryDeep]} style={{ borderRadius: ds(16), paddingVertical: ds(12), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: ds(8), boxShadow: bs('0 10px 22px -6px rgba(118,145,155,0.6)') }}>
              <Bluetooth size={13} color="#fff" sw={2.5} />
              <Text style={{ color: '#fff', fontFamily: manrope(700), fontSize: ds(13.5), letterSpacing: -ds(0.2) }}>Bağlan</Text>
            </LinearGrad>
          </Pressable>

          <Text style={{ marginTop: ds(8), textAlign: 'center', fontSize: ds(10.5), color: C.darkSoft, fontFamily: manrope(600) }}>
            Cihaz görünmüyor mu? <Text style={{ color: C.primaryDeep, fontFamily: manrope(800) }}>Manuel ekle</Text>
          </Text>
        </View>
      </View>
    </LinearGrad>
  );
}
