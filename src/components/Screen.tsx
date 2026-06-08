import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Full-bleed screen container. Adds the device's top safe-area inset so the live
 * OS status bar sits above the content (replacing the design's drawn "9:41").
 * Pass `padTop={false}` for gradient screens that draw under the status bar and
 * apply the inset to their own inner content.
 */
export function Screen({
  children,
  bg,
  padTop = true,
  style,
}: {
  children: React.ReactNode;
  bg?: string;
  padTop?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  return <View style={[{ flex: 1, backgroundColor: bg, paddingTop: padTop ? insets.top : 0 }, style]}>{children}</View>;
}
