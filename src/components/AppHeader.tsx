import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { ds } from '../theme/scale';
import { bs } from '../theme/shadow';
import { Txt } from './Txt';

// White top bar that sits behind the OS status bar: "EggChef" (bordo) + greeting.
export function AppHeader({ greeting = true }: { greeting?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: C.white,
        paddingTop: insets.top + ds(8),
        paddingBottom: ds(14),
        paddingHorizontal: ds(14),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: bs('0 4px 11.2px -3px rgba(0,0,0,0.25)'),
        zIndex: 20,
      }}
    >
      <Txt size={18} weight={300} color={C.bordoMid}>EggChef</Txt>
      {greeting && (
        <Txt size={16} weight={100} color={C.black}>
          Merhaba, Ahmet!
        </Txt>
      )}
    </View>
  );
}
