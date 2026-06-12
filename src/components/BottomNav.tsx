import React, { useEffect } from 'react';
import { View, Pressable, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { useUI } from '../theme/ui';
import { Txt } from './Txt';
import { NavMenu, NavCooking, NavProfile } from '../icons';

export type Tab = 'menu' | 'cooking' | 'profile';

const TABS: { id: Tab; tr: string; en: string }[] = [
  { id: 'menu', tr: 'Menü', en: 'Menu' },
  { id: 'cooking', tr: 'Pişirme', en: 'Cooking' },
  { id: 'profile', tr: 'Profil', en: 'Profile' },
];

function icon(id: Tab, color: string, size: number) {
  if (id === 'menu') return <NavMenu size={size} color={color} />;
  if (id === 'cooking') return <NavCooking size={size} color={color} />;
  return <NavProfile size={size} color={color} />;
}

// Shared across screens so the elevated bubble SLIDES from the previous tab to
// the new one when you switch (the screens themselves no longer animate).
const slide = new Animated.Value(0);

// Bottom dock: 3 tabs where the ACTIVE tab is shown as an elevated white circle.
export function BottomNav({ active = 'menu', onNavigate }: { active?: Tab; onNavigate?: (t: Tab) => void }) {
  const insets = useSafeAreaInsets();
  const { C, L } = useUI();
  const activeIdx = TABS.findIndex((t) => t.id === active);

  useEffect(() => {
    Animated.timing(slide, { toValue: activeIdx, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [activeIdx]);

  const bubbleLeft = slide.interpolate({ inputRange: [0, 1, 2], outputRange: ['16.6667%', '50%', '83.3333%'] });

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
                  {L(t.tr, t.en)}
                </Txt>
              </>
            )}
          </Pressable>
        ))}
      </View>

      {/* elevated active circle — slides between tab slots */}
      <Animated.View
        style={{
          position: 'absolute',
          left: bubbleLeft,
          top: -ds(22),
          marginLeft: -ds(36),
          width: ds(72),
          height: ds(72),
          borderRadius: ds(36),
          backgroundColor: C.white,
          boxShadow: bs('0 6px 16px -4px rgba(90,21,32,0.22), 0 0 0 5px #faf9f9'),
        }}
      >
        <Pressable onPress={() => onNavigate?.(active)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {icon(active, C.bordo, 30)}
        </Pressable>
      </Animated.View>
    </View>
  );
}
