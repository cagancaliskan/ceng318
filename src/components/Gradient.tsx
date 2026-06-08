import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient as SvgRadial, Stop, Rect } from 'react-native-svg';

/** CSS gradient angle (deg, clockwise from "to top") → expo-linear-gradient start/end. */
export function angleToPoints(deg: number) {
  const rad = (deg * Math.PI) / 180;
  const sx = Math.sin(rad);
  const cy = Math.cos(rad);
  return {
    start: { x: 0.5 - sx / 2, y: 0.5 + cy / 2 },
    end: { x: 0.5 + sx / 2, y: 0.5 - cy / 2 },
  };
}

type LinProps = {
  colors: readonly [string, string, ...string[]];
  /** CSS angle in degrees (e.g. 135). Default 180 = top→bottom. */
  deg?: number;
  locations?: readonly [number, number, ...number[]];
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
};

/** Linear gradient that maps a CSS angle to expo-linear-gradient. */
export function LinearGrad({ colors, deg = 180, locations, style, children, pointerEvents }: LinProps) {
  const { start, end } = angleToPoints(deg);
  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      start={start}
      end={end}
      style={style}
      pointerEvents={pointerEvents}
    >
      {children}
    </LinearGradient>
  );
}

let RID = 0;
type Stp = { offset: number | string; color: string };
type RadialProps = {
  stops: Stp[];
  cx?: number | string;
  cy?: number | string;
  r?: number | string;
  /** e.g. "scale(1 0.66)" to make the radial elliptical (CSS radial size). */
  gradientTransform?: string;
  style?: StyleProp<ViewStyle>;
};

/** Absolutely fills its parent with a CSS-radial-gradient analogue (via SVG). */
export function RadialBg({ stops, cx = '50%', cy = '50%', r = '75%', gradientTransform, style }: RadialProps) {
  const id = React.useMemo(() => `rg${RID++}`, []);
  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <SvgRadial id={id} cx={cx} cy={cy} r={r} gradientTransform={gradientTransform}>
            {stops.map((s, i) => (
              <Stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </SvgRadial>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
