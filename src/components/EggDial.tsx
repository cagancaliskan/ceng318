import React from 'react';
import { View } from 'react-native';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { LinearGrad, RadialBg } from './Gradient';
import { Txt } from './Txt';

// 1:1 port of the design's EggDial2 — a light-grey tray with 6 egg sockets that
// fill based on `count`, and a floating center readout disc.
export function EggDial({ count = 3, size = 170 }: { count?: number; size?: number }) {
  const eggs = 6;
  const filled = Math.min(count, eggs);
  const r = size * 0.27;
  const D = ds(size);

  return (
    <View style={{ width: D, height: D, position: 'relative', alignSelf: 'center' }}>
      {/* outer tray */}
      <LinearGrad
        deg={155}
        colors={[C.panelStrong, C.panel, '#E4E5E1']}
        locations={[0, 0.6, 1]}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          borderRadius: D / 2,
          boxShadow: bs(
            '0 8px 22px -8px rgba(60,70,75,0.18), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(60,70,75,0.08)',
          ),
        }}
      />
      {/* rim */}
      <View
        style={{
          position: 'absolute',
          left: ds(8),
          top: ds(8),
          right: ds(8),
          bottom: ds(8),
          borderRadius: (D - ds(16)) / 2,
          boxShadow: bs('inset 0 0 0 1px rgba(155,155,155,0.25), inset 0 2px 4px rgba(60,70,75,0.06)'),
        }}
      />
      {/* inner well */}
      <View
        style={{
          position: 'absolute',
          left: ds(16),
          top: ds(16),
          right: ds(16),
          bottom: ds(16),
          borderRadius: (D - ds(32)) / 2,
          overflow: 'hidden',
          boxShadow: bs('inset 0 3px 6px rgba(60,70,75,0.1), inset 0 -2px 4px rgba(255,255,255,0.6)'),
        }}
      >
        <RadialBg stops={[{ offset: 0, color: C.bgTint }, { offset: 1, color: C.panel }]} cx="50%" cy="50%" r="50%" />
      </View>

      {/* sockets + eggs */}
      {Array.from({ length: eggs }).map((_, i) => {
        const a = (i / eggs) * Math.PI * 2 - Math.PI / 2;
        const cx = size / 2 + Math.cos(a) * r;
        const cy = size / 2 + Math.sin(a) * r;
        const isFilled = i < filled;
        return (
          <React.Fragment key={i}>
            {/* socket — dark dimple */}
            <View
              style={{
                position: 'absolute',
                left: ds(cx - 12),
                top: ds(cy - 12),
                width: ds(24),
                height: ds(24),
                borderRadius: ds(12),
                backgroundColor: 'rgba(60,70,75,0.04)',
                boxShadow: bs('inset 0 1.5px 3px rgba(60,70,75,0.12)'),
              }}
            />
            {/* egg */}
            <LinearGrad
              deg={155}
              colors={isFilled ? [C.primary, C.primaryDeep] : ['#ffffff', '#F6F7F4']}
              style={{
                position: 'absolute',
                left: ds(cx - 8),
                top: ds(cy - 11),
                width: ds(16),
                height: ds(22),
                borderRadius: ds(8),
                borderBottomLeftRadius: ds(7),
                borderBottomRightRadius: ds(7),
                boxShadow: isFilled
                  ? bs('0 4px 8px -2px rgba(118,145,155,0.5), inset 0 1.5px 2px rgba(255,255,255,0.35), inset 0 -1px 1px rgba(0,0,0,0.08)')
                  : bs('0 2px 4px -1px rgba(60,70,75,0.18), inset 0 1.5px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(60,70,75,0.06)'),
              }}
            />
          </React.Fragment>
        );
      })}

      {/* center readout disc */}
      <LinearGrad
        deg={155}
        colors={['#ffffff', C.bgTint]}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: ds(56),
          height: ds(56),
          borderRadius: ds(28),
          marginLeft: -ds(28),
          marginTop: -ds(28),
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: bs('0 6px 14px -4px rgba(60,70,75,0.18), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(60,70,75,0.04)'),
        }}
      >
        <Txt size={24} weight={800} color={C.dark} style={{ lineHeight: ds(24), letterSpacing: -ds(1.2) }}>
          {count}
        </Txt>
        <Txt size={7} weight={700} color={C.med} ls={1.2} style={{ marginTop: ds(2) }}>
          ADET
        </Txt>
      </LinearGrad>
    </View>
  );
}
