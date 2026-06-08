import React from 'react';
import { Text, TextProps } from 'react-native';
import { manrope } from '../theme/fonts';
import { ds } from '../theme/scale';
import { C } from '../theme/colors';

type Props = TextProps & {
  /** design font size in px (auto-scaled to the device) */
  size?: number;
  /** design fontWeight 200–900 (mapped to the exact Manrope file) */
  weight?: number;
  color?: string;
  /** letterSpacing in design px */
  ls?: number;
  /** lineHeight in design px (absolute) */
  lh?: number;
  center?: boolean;
};

/**
 * Text with the design's Manrope face applied per weight and sizes scaled to the
 * device. Mirrors the design's inline `fontSize` / `fontWeight` / `letterSpacing`.
 */
export function Txt({
  size = 12,
  weight = 400,
  color = C.text,
  ls,
  lh,
  center,
  style,
  ...rest
}: Props) {
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: manrope(weight),
          fontSize: ds(size),
          color,
        },
        ls != null && { letterSpacing: ds(ls) },
        lh != null && { lineHeight: ds(lh) },
        center && { textAlign: 'center' },
        style,
      ]}
    />
  );
}
