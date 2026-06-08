import React from 'react';
import { View, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { LinearGrad } from './Gradient';
import { Txt } from './Txt';
import { NavMenu, NavCooking, NavProfile } from '../icons';

export type Tab = 'menu' | 'cooking' | 'profile';

// Port of BottomNav2 — a frosted floating dock with an elevated center FAB.
// `onNavigate` makes it a real tab switcher (the design version was static).
export function BottomNav({ active = 'menu', onNavigate }: { active?: Tab; onNavigate?: (t: Tab) => void }) {
  const Item = ({ id, label, icon }: { id: Tab; label: string; icon: (color: string) => React.ReactNode }) => {
    const isA = active === id;
    return (
      <Pressable
        onPress={() => onNavigate?.(id)}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: ds(4), gap: ds(3) }}
      >
        {isA && (
          <View
            style={{
              position: 'absolute',
              top: -ds(5),
              width: ds(24),
              height: ds(3),
              borderBottomLeftRadius: ds(3),
              borderBottomRightRadius: ds(3),
              overflow: 'hidden',
            }}
          >
            <LinearGrad deg={90} colors={[C.primary, C.primaryDeep]} style={{ flex: 1 }} />
          </View>
        )}
        <View
          style={{
            width: ds(30),
            height: ds(30),
            borderRadius: ds(10),
            backgroundColor: isA ? C.primarySoft : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon(isA ? C.primaryDeep : C.med)}
        </View>
        <Txt size={8.5} weight={isA ? 800 : 600} color={isA ? C.primaryDeep : C.med} ls={isA ? 0 : 0.2}>
          {label}
        </Txt>
      </Pressable>
    );
  };

  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: ds(60) }}>
      <BlurView
        tint="light"
        intensity={24}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.78)',
          borderTopLeftRadius: ds(20),
          borderTopRightRadius: ds(20),
          overflow: 'hidden',
          boxShadow: bs('0 -8px 24px -10px rgba(60,70,75,0.15), inset 0 1px 0 rgba(255,255,255,0.9)'),
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.04)',
          flexDirection: 'row',
          alignItems: 'stretch',
          paddingTop: ds(5),
          paddingHorizontal: ds(4),
          paddingBottom: ds(8),
        }}
      >
        <Item id="menu" label="Menu" icon={(c) => <NavMenu size={18} color={c} />} />
        <View style={{ flex: 1 }} />
        <Item id="profile" label="Profile" icon={(c) => <NavProfile size={18} color={c} />} />
      </BlurView>

      {/* floating center FAB — Cooking */}
      <Pressable
        onPress={() => onNavigate?.('cooking')}
        style={{ position: 'absolute', left: '50%', top: -ds(22), marginLeft: -ds(28), alignItems: 'center', gap: ds(2) }}
      >
        <LinearGrad
          deg={155}
          colors={[C.primary, C.primaryDeep]}
          style={{
            width: ds(56),
            height: ds(56),
            borderRadius: ds(28),
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: bs(
              `0 10px 22px -6px rgba(118,145,155,0.7), 0 0 0 5px ${C.bg}, inset 0 1.5px 2px rgba(255,255,255,0.3), inset 0 -2px 3px rgba(0,0,0,0.12)`,
            ),
          }}
        >
          <NavCooking size={26} color="#fff" />
        </LinearGrad>
        <Txt size={8.5} weight={800} color={active === 'cooking' ? C.primaryDeep : C.darkSoft} style={{ marginTop: ds(4) }}>
          Cooking
        </Txt>
      </Pressable>
    </View>
  );
}
