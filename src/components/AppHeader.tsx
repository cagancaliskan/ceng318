import React from 'react';
import { View, Text } from 'react-native';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { manrope } from '../theme/fonts';
import { LinearGrad } from './Gradient';
import { HeaderUser } from '../icons';

// Port of AppHeader2's wordmark row. The design's drawn status bar is replaced by
// the device's real status bar (screens wrap in SafeArea), per the agreed
// "full-screen real app" decision.
export function AppHeader({ greeting = true, light = false }: { greeting?: boolean; light?: boolean }) {
  return (
    <View
      style={{
        paddingHorizontal: ds(18),
        paddingTop: ds(10),
        paddingBottom: ds(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontFamily: manrope(800), fontSize: ds(18), letterSpacing: -ds(0.4), color: light ? '#fff' : C.dark }}>
        Egg
        <Text style={{ color: light ? 'rgba(255,255,255,0.7)' : C.primary }}>Chef</Text>
      </Text>

      {greeting && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: ds(8) }}>
          <Text style={{ fontFamily: manrope(500), fontSize: ds(11.5), color: C.darkSoft }}>Merhaba, Ahmet</Text>
          <LinearGrad
            deg={135}
            colors={[C.primary, C.primaryDeep]}
            style={{
              width: ds(28),
              height: ds(28),
              borderRadius: ds(14),
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: bs('0 4px 10px -2px rgba(118,145,155,0.45)'),
            }}
          >
            <HeaderUser size={13} color="#fff" />
          </LinearGrad>
        </View>
      )}
    </View>
  );
}
