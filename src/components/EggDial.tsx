import React from 'react';
import { View, Pressable } from 'react-native';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { useUI } from '../theme/ui';
import { Txt } from './Txt';
import { Egg } from '../icons';

// New design: a light circle with 6 eggs around it and a big bordo "N adet" center.
// Each egg slot is independently on/off — tapping one toggles just that slot, so the
// count goes up/down by one and the specific positions matter.
export const EggDial = React.memo(function EggDial({ selected, size = 276, onToggle }: { selected: boolean[]; size?: number; onToggle?: (i: number) => void }) {
  const { C, L } = useUI();
  const D = ds(size);
  const r = size * 0.345; // egg-ring radius (design px)
  const eggW = 49;
  const eggH = 64;
  const count = selected.filter(Boolean).length;

  return (
    <View style={{ width: D, height: D, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
      {/* dial circle */}
      <View
        style={{
          position: 'absolute',
          width: D,
          height: D,
          borderRadius: D / 2,
          backgroundColor: C.white,
          boxShadow: bs('0 12px 30px -14px rgba(90,21,32,0.16), inset 0 0 0 1px rgba(90,21,32,0.07)'),
        }}
      />

      {/* eggs — first `count` are selected (filled); tap to change the count */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * 60 * Math.PI) / 180;
        const cx = size / 2 + Math.cos(a) * r;
        const cy = size / 2 + Math.sin(a) * r;
        const isSel = selected[i];
        return (
          <Pressable
            key={i}
            onPress={() => onToggle?.(i)}
            hitSlop={6}
            style={{
              position: 'absolute',
              left: ds(cx - eggW / 2),
              top: ds(cy - eggH / 2),
              width: ds(eggW),
              height: ds(eggH),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* selected eggs are filled gray; empty slots are transparent (Figma) */}
            <Egg
              size={eggW}
              fill={isSel ? '#d6d3d4' : 'transparent'}
              stroke={isSel ? '#c2bfc0' : C.grayLight}
              sw={1.4}
              shade={isSel ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.04)'}
            />
          </Pressable>
        );
      })}

      {/* center readout */}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Txt size={96} weight={100} color={C.bordo} style={{ lineHeight: ds(100), includeFontPadding: false } as any}>
          {count}
        </Txt>
        <Txt size={24} weight={100} color={C.bordo} style={{ marginTop: -ds(14) }}>
          {L('adet', 'eggs')}
        </Txt>
      </View>
    </View>
  );
});
