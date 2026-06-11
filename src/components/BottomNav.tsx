import React from 'react';
import { View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { Txt } from './Txt';
import { NavMenu, NavCooking, NavProfile } from '../icons';

export type Tab = 'menu' | 'cooking' | 'profile';

const TABS: { id: Tab; label: string }[] = [
  { id: 'menu', label: 'Menu' },
  { id: 'cooking', label: 'Pişirme' },
  { id: 'profile', label: 'Profile' },
];

function icon(id: Tab, color: string, size: number) {
  if (id === 'menu') return <NavMenu size={size} color={color} />;
  if (id === 'cooking') return <NavCooking size={size} color={color} />;
  return <NavProfile size={size} color={color} />;
}

// Bottom dock: 3 tabs where the ACTIVE tab is shown as an elevated white circle.
export function BottomNav({ active = 'menu', onNavigate }: { active?: Tab; onNavigate?: (t: Tab) => void }) {
  const insets = useSafeAreaInsets();
  const activeIdx = TABS.findIndex((t) => t.id === active);

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }} pointerEvents="box-none">
      {/* dock bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          backgroundColor: C.white,
          height: ds(64),
          paddingTop: ds(12),
          paddingBottom: insets.bottom,
          borderTopLeftRadius: ds(34),
          borderTopRightRadius: ds(34),
          boxShadow: bs('0 -6px 20px -8px rgba(0,0,0,0.18)'),
        }}
      >
        {TABS.map((t, i) => (
          <Pressable key={t.id} onPress={() => onNavigate?.(t.id)} style={{ flex: 1, alignItems: 'center', gap: ds(3) }}>
            {i !== activeIdx && (
              <>
                {icon(t.id, C.gray, 24)}
                <Txt size={12} weight={300} color={C.black}>
                  {t.label}
                </Txt>
              </>
            )}
          </Pressable>
        ))}
      </View>

      {/* elevated active circle */}
      <Pressable
        onPress={() => onNavigate?.(active)}
        style={{
          position: 'absolute',
          left: `${((activeIdx + 0.5) / 3) * 100}%`,
          top: -ds(22),
          marginLeft: -ds(36),
          width: ds(72),
          height: ds(72),
          borderRadius: ds(36),
          backgroundColor: C.white,
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: bs('0 6px 16px -4px rgba(90,21,32,0.22), 0 0 0 5px #faf9f9'),
        }}
      >
        {icon(active, C.bordo, 30)}
      </Pressable>
    </View>
  );
}
