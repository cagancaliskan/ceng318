// Manrope is the design's primary face (FONT = 'Manrope, Inter, ...'), Inter the
// fallback. React Native does NOT synthesize weights for custom fonts, so we map
// each design `fontWeight` to the exact bundled family file.
import {
  Manrope_200ExtraLight,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

// Passed to useFonts() at app start.
export const fontsToLoad = {
  Manrope_200ExtraLight,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
};

/** design fontWeight (200–900) → bundled Manrope family name */
export function manrope(weight: number = 400): string {
  if (weight <= 200) return 'Manrope_200ExtraLight';
  if (weight <= 300) return 'Manrope_300Light';
  if (weight <= 400) return 'Manrope_400Regular';
  if (weight <= 500) return 'Manrope_500Medium';
  if (weight <= 600) return 'Manrope_600SemiBold';
  if (weight <= 700) return 'Manrope_700Bold';
  return 'Manrope_800ExtraBold'; // covers 800 & 900 (Manrope tops out at 800)
}

/** Inter equivalent, used where the design explicitly falls back to Inter. */
export function inter(weight: number = 400): string {
  if (weight <= 400) return 'Inter_400Regular';
  if (weight <= 500) return 'Inter_500Medium';
  if (weight <= 600) return 'Inter_600SemiBold';
  if (weight <= 700) return 'Inter_700Bold';
  return 'Inter_800ExtraBold';
}
