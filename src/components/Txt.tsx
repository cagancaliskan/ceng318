import React from 'react';
import { Text, TextProps } from 'react-native';
import { hn } from '../theme/fonts';
import { ds } from '../theme/scale';
import { C } from '../theme/colors';

type Props = TextProps & {
  /** design font size in px (auto-scaled to the device) */
  size?: number;
  /** design weight: 100=Thin, 300=Light, 400=Regular, 500=Medium */
  weight?: number;
  color?: string;
  /** letterSpacing in design px */
  ls?: number;
  /** lineHeight in design px (absolute) */
  lh?: number;
  center?: boolean;
};

/** Text with the design's Helvetica Neue face per weight and sizes scaled to the device. */
export function Txt({ size = 14, weight = 400, color = C.black, ls, lh, center, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[
        { fontFamily: hn(weight), fontSize: ds(size), color },
        ls != null && { letterSpacing: ds(ls) },
        lh != null && { lineHeight: ds(lh) },
        center && { textAlign: 'center' },
        style,
      ]}
    />
  );
}
