import React from 'react';
import { View } from 'react-native';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { Txt } from './Txt';
import { Egg } from '../icons';

// New design: a light circle with 6 eggs around it and a big bordo "N adet" center.
export const EggDial = React.memo(function EggDial({ count = 3, size = 276 }: { count?: number; size?: number }) {
  const D = ds(size);
  const r = size * 0.345; // egg-ring radius (design px)
  const eggW = 49;
  const eggH = 64;

  return (
    <View style={{ width: D, height: D, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
      {/* dial circle */}
      <View
        style={{
          position: 'absolute',
          width: D,
          height: D,
          borderRadius: D / 2,
          backgroundColor: '#fdfcfc',
          boxShadow: bs('0 12px 30px -14px rgba(90,21,32,0.16), inset 0 0 0 1px rgba(90,21,32,0.07)'),
        }}
      />

      {/* eggs */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * 60 * Math.PI) / 180;
        const cx = size / 2 + Math.cos(a) * r;
        const cy = size / 2 + Math.sin(a) * r;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: ds(cx - eggW / 2),
              top: ds(cy - eggH / 2),
              width: ds(eggW),
              height: ds(eggH),
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: bs('0 6px 9px -3px rgba(60,40,45,0.18)'),
            }}
          >
            <Egg size={eggW} fill={i % 2 === 0 ? '#ffffff' : '#f1eeef'} stroke="#ece7e8" sw={1} />
          </View>
        );
      })}

      {/* center readout */}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Txt size={96} weight={100} color={C.bordo} style={{ lineHeight: ds(100), includeFontPadding: false } as any}>
          {count}
        </Txt>
        <Txt size={24} weight={100} color={C.bordo} style={{ marginTop: -ds(14) }}>
          adet
        </Txt>
      </View>
    </View>
  );
});
